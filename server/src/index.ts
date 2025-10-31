import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import type { Prisma } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const HOST = process.env.HOST || '127.0.0.1';
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Ensure DB has expected columns when running in dev with SQLite
async function ensureSchema() {
  try {
    // Check if quantity column exists in Booking table
    const cols = (await prisma.$queryRawUnsafe(`PRAGMA table_info("Booking");`)) as any[];
    const hasQuantity = Array.isArray(cols) && cols.some((c: any) => c.name === 'quantity');
    const hasContactPhone = Array.isArray(cols) && cols.some((c: any) => c.name === 'contactPhone');
    const hasPassengers = Array.isArray(cols) && cols.some((c: any) => c.name === 'passengers');
    if (!hasQuantity) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Booking" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;`);
      // no need to backfill since default applies
    }
    if (!hasContactPhone) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Booking" ADD COLUMN "contactPhone" TEXT;`);
    }
    if (!hasPassengers) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Booking" ADD COLUMN "passengers" TEXT;`);
    }
  } catch (e) {
    console.warn('ensureSchema skipped:', e);
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// GET /experiences
app.get("/experiences", async (_req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { id: "asc" },
    });
    res.json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// GET /experiences/:id
app.get("/experiences/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { slots: { orderBy: { startTime: "asc" } } },
    });
    if (!experience) return res.status(404).json({ error: "Not found" });
    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// POST /promo/validate
app.post("/promo/validate", async (req, res) => {
  const codeRaw = (req.body?.code ?? "") as string;
  const code = codeRaw.trim().toUpperCase();
  if (!code) return res.status(400).json({ error: "Code required" });
  try {
    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (!promo || !promo.active) return res.json({ valid: false });
    res.json({
      valid: true,
      discount_type: promo.discountType,
      value: promo.value,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to validate code" });
  }
});

// Helper: normalize body keys
function pickBookingBody(body: any) {
  return {
    slotId: Number(body.slot_id ?? body.slotId),
    userName: String(body.user_name ?? body.userName ?? "").trim(),
    userEmail: String(body.user_email ?? body.userEmail ?? "").trim(),
    promoCode: (body.promo_code ?? body.promoCode ?? null) as string | null,
    contactPhone: body.contact_phone ? String(body.contact_phone) : (body.contactPhone ? String(body.contactPhone) : null),
    passengers: Array.isArray(body.passengers) ? body.passengers : null,
    quantity: Math.max(1, Number(body.quantity ?? body.people ?? body.persons ?? 0)),
  };
}

// POST /bookings
app.post("/bookings", async (req, res) => {
  const { slotId, userName, userEmail, promoCode, contactPhone, passengers, quantity } = pickBookingBody(req.body);
  if (!slotId || Number.isNaN(slotId)) return res.status(400).json({ error: "slot_id required" });
  if (!userName) return res.status(400).json({ error: "user_name required" });
  if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) return res.status(400).json({ error: "valid user_email required" });
  // Determine final quantity: prefer passengers length if provided
  const peopleCount = Array.isArray(passengers) ? passengers.length : quantity;
  if (!Number.isFinite(peopleCount) || peopleCount < 1) return res.status(400).json({ error: "At least 1 passenger required" });
  // Basic passenger validation if provided
  if (Array.isArray(passengers)) {
    for (const p of passengers) {
      const n = (p?.name ?? '').toString().trim();
      const a = Number(p?.age ?? NaN);
      const s = (p?.sex ?? '').toString().toUpperCase();
      if (!n) return res.status(400).json({ error: "Passenger name required" });
      if (!Number.isFinite(a) || a < 0 || a > 120) return res.status(400).json({ error: "Passenger age invalid" });
      if (!['M','F','O'].includes(s)) return res.status(400).json({ error: "Passenger sex must be M, F, or O" });
    }
  }

  try {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get slot and experience price
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { experience: true },
      });
      if (!slot) throw new Error("SLOT_NOT_FOUND");

      // Decrement availableSpots atomically only if > 0
      const updated = await tx.$queryRaw<{ availableSpots: number }[]>`
        UPDATE "Slot"
        SET "availableSpots" = "availableSpots" - ${peopleCount}
        WHERE "id" = ${slotId} AND "availableSpots" >= ${peopleCount}
        RETURNING "availableSpots";
      `;
      if (updated.length === 0) {
        throw new Error("SOLD_OUT");
      }

      // Apply promo if provided
      let finalPrice = slot.experience.pricePerPerson.times(peopleCount);
      let promoCodeUsed: string | null = null;
      if (promoCode) {
        const code = await tx.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
        if (code && code.active) {
          promoCodeUsed = code.code;
          if (code.discountType === "PERCENT") {
            finalPrice = finalPrice.minus(finalPrice.times(code.value).dividedBy(100));
          } else {
            finalPrice = finalPrice.minus(code.value);
          }
          if (finalPrice.lessThan(0)) finalPrice = new (finalPrice.constructor as any)(0);
        }
      }

      const booking = await tx.booking.create({
        data: {
          slotId,
          userName,
          userEmail,
          promoCodeUsed,
          quantity: peopleCount,
          contactPhone: contactPhone ?? null,
          passengers: passengers ?? null,
          finalPrice,
        },
      });

      return { bookingId: booking.id, slotId, userName, userEmail, contactPhone: contactPhone ?? null, promoCodeUsed, quantity: peopleCount, passengers: passengers ?? null, finalPrice };
    });

    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.message === "SOLD_OUT") return res.status(409).json({ error: "Slot is sold out" });
      if (err.message === "SLOT_NOT_FOUND") return res.status(404).json({ error: "Slot not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

ensureSchema().finally(() => {
  // Serve built client if available (production preview) from ../client/dist
  try {
    const clientDist = path.resolve(process.cwd(), "..", "client", "dist");
    app.use(express.static(clientDist));
    // SPA fallback: let client router handle non-API routes
    app.get(["/", "/experiences/:id", "/checkout", "/booking-result"], (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } catch (e) {
    // non-fatal if client build not present
  }

  app.listen(PORT, HOST as any, () => {
    console.log(`BookIt API running on http://${HOST}:${PORT}`);
  });
});
