-- Add optional contactPhone and passengers columns to Booking
PRAGMA foreign_keys=OFF;

-- contactPhone (nullable)
ALTER TABLE "Booking" ADD COLUMN "contactPhone" TEXT;
-- passengers stored as JSON text (nullable)
ALTER TABLE "Booking" ADD COLUMN "passengers" TEXT;

PRAGMA foreign_keys=ON;
