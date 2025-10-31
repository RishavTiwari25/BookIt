-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "promoCodeUsed" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "finalPrice" DECIMAL NOT NULL,
    "bookingTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingTime", "finalPrice", "id", "promoCodeUsed", "slotId", "userEmail", "userName") SELECT "bookingTime", "finalPrice", "id", "promoCodeUsed", "slotId", "userEmail", "userName" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_slotId_idx" ON "Booking"("slotId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
