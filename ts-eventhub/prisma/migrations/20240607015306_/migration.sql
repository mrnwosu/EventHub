/*
  Warnings:

  - Added the required column `previousSelectedVenue` to the `Data` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastRun" DATETIME NOT NULL,
    "accessToken" TEXT NOT NULL,
    "previousSelectedVenue" TEXT NOT NULL
);
INSERT INTO "new_Data" ("accessToken", "id", "lastRun") SELECT "accessToken", "id", "lastRun" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
