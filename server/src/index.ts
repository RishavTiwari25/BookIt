import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./db.js";
import { Experience } from "./models/Experience.js";
import { Slot } from "./models/Slot.js";
import { PromoCode } from "./models/PromoCode.js";
import { Booking } from "./models/Booking.js";
import { nextSequence } from "./models/Counter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const HOST = process.env.HOST || '127.0.0.1';
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Loosen Mongoose model typings to avoid generic overload incompatibilities in TS
const ExperienceModel: any = Experience as any;
const SlotModel: any = Slot as any;
const PromoCodeModel: any = PromoCode as any;
const BookingModel: any = Booking as any;

app.get("/health", (_req, res) => {
  const dbReady = (require("mongoose") as typeof import("mongoose")).connection.readyState === 1;
  res.json({ ok: true, dbConnected: dbReady, time: new Date().toISOString() });
});

// GET /experiences
app.get("/experiences", async (_req, res) => {
  try {
    const docs = await ExperienceModel.find({}).sort({ id: 1 }).lean();
    const experiences = docs.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description ?? "",
      location: d.location,
      pricePerPerson: d.pricePerPerson,
      imageUrl: d.imageUrl ?? "",
    }));
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
    const exp = await ExperienceModel.findOne({ id }).lean();
    if (!exp) return res.status(404).json({ error: "Not found" });
  const slots = await SlotModel.find({ experienceId: id }).sort({ startTime: 1 }).lean();
    const payload = {
      id: exp.id,
      title: exp.title,
      description: exp.description ?? "",
      location: exp.location,
      pricePerPerson: exp.pricePerPerson,
      imageUrl: exp.imageUrl ?? "",
      slots: slots.map((s: any) => ({
        id: s.id,
        experienceId: s.experienceId,
        startTime: s.startTime,
        endTime: s.endTime,
        totalSpots: s.totalSpots,
        availableSpots: s.availableSpots,
      })),
    };
    res.json(payload);
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
    const promo = await PromoCodeModel.findOne({ code }).lean();
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
    // Find the slot
  const slot = await SlotModel.findOne({ id: slotId }).lean();
    if (!slot) throw new Error("SLOT_NOT_FOUND");

    // Atomically decrement availableSpots if enough seats
  const updated = await SlotModel.findOneAndUpdate(
      { id: slotId, availableSpots: { $gte: peopleCount } },
      { $inc: { availableSpots: -peopleCount } },
      { new: true }
    ).lean();
    if (!updated) throw new Error("SOLD_OUT");

    // Load experience to compute price
  const exp = await ExperienceModel.findOne({ id: slot.experienceId }).lean();
    if (!exp) throw new Error("SLOT_NOT_FOUND");

    let finalPrice = exp.pricePerPerson * peopleCount;
    let promoCodeUsed: string | null = null;
    if (promoCode) {
  const code = await PromoCodeModel.findOne({ code: promoCode.toUpperCase() }).lean();
      if (code && code.active) {
        promoCodeUsed = code.code;
        if (code.discountType === 'PERCENT') {
          finalPrice = finalPrice - (finalPrice * code.value) / 100;
        } else {
          finalPrice = finalPrice - code.value;
        }
        if (finalPrice < 0) finalPrice = 0;
      }
    }

    const bookingId = await nextSequence('booking');
  await BookingModel.create({
      id: bookingId,
      slotId,
      userName,
      userEmail,
      promoCodeUsed,
      quantity: peopleCount,
      contactPhone: contactPhone ?? null,
      passengers: passengers ?? null,
      finalPrice,
    });

    const result = { bookingId, slotId, userName, userEmail, contactPhone: contactPhone ?? null, promoCodeUsed, quantity: peopleCount, passengers: passengers ?? null, finalPrice };
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

connectMongo().then(() => {
  // Serve built client if available (production preview) from ../client/dist
  try {
    const clientDist = path.resolve(process.cwd(), "..", "client", "dist");
    app.use(express.static(clientDist));
    // SPA fallback: let client router handle non-API routes (include legacy /details/:id)
    app.get(["/", "/experiences", "/experiences/:id", "/details/:id", "/checkout", "/booking-result"], (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } catch (e) {
    // non-fatal if client build not present
  }

  app.listen(PORT, HOST as any, () => {
    console.log(`BookIt API running on http://${HOST}:${PORT}`);
  });
}).catch((e) => {
  console.error('Failed to connect to MongoDB:', e);
  process.exit(1);
});
