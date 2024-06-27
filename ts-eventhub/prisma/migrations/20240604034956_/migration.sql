/*
  Warnings:

  - You are about to drop the `Configuation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Configuation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastRun" DATETIME NOT NULL,
    "accessToken" TEXT NOT NULL
);
