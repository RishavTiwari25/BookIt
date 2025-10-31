# BookIt: Experiences & Slots

End-to-end demo app where users explore travel experiences, pick slots, and complete bookings.

## Live links

- Frontend: TBA (deploy on Vercel)
- Backend API: TBA (deploy on Render/Railway)

## Stack

- Frontend: React + TypeScript + Vite, TailwindCSS, React Router, Axios
- Backend: Node.js + Express (ESM), TypeScript, Prisma ORM, PostgreSQL

## Local setup

Prereqs: Node 18+, PostgreSQL 14+, pnpm or npm.

1. Clone and install

```powershell
# from repo root
cd server; npm install; cd ..
cd client; npm install; cd ..
```

2. Configure database

Create a Postgres database (local or cloud) and set the connection string in `server/.env`:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookit?schema=public"
```

3. Migrate and seed

```powershell
# from server/
npx prisma migrate dev --name init
npm run seed
```

4. Run both apps

```powershell
# terminal A
cd server; npm run dev
# terminal B
cd client; npm run dev
```

Open http://localhost:5173 and test the flow:

- Home → Details → Checkout → Result
- Try promo codes: `SAVE10`, `FLAT100`, `OFF5`
- Try to book a nearly sold-out slot twice to see the Sold Out error.

## API

- GET /experiences
- GET /experiences/:id (includes `slots`)
- POST /promo/validate { code }
- POST /bookings { slot_id, user_name, user_email, promo_code }

## Deployment

- Backend: Render or Railway (Node + Postgres). Set envs and run `prisma migrate deploy` then `npm run seed` once.
- Frontend: Vercel (Vite). Set `VITE_API_BASE_URL` to your backend URL.

## Notes

- Atomic sold-out check uses a conditional UPDATE … RETURNING to prevent double-booking.
- Prices are stored as Decimal in DB; frontend handles display to two decimals.
- The Tailwind theme is minimal; tune colors/fonts to match Figma exactly in `client/tailwind.config.js`.
