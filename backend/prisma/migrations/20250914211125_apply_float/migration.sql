/*
  Warnings:

  - You are about to alter the column `weight` on the `Criteria` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `weight` on the `Criterion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Criteria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" REAL NOT NULL,
    "portionId" INTEGER NOT NULL,
    CONSTRAINT "Criteria_portionId_fkey" FOREIGN KEY ("portionId") REFERENCES "Portion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Criteria" ("description", "id", "name", "portionId", "weight") SELECT "description", "id", "name", "portionId", "weight" FROM "Criteria";
DROP TABLE "Criteria";
ALTER TABLE "new_Criteria" RENAME TO "Criteria";
CREATE TABLE "new_Criterion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" REAL NOT NULL,
    "criteriaId" INTEGER NOT NULL,
    CONSTRAINT "Criterion_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "Criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Criterion" ("criteriaId", "description", "id", "name", "weight") SELECT "criteriaId", "description", "id", "name", "weight" FROM "Criterion";
DROP TABLE "Criterion";
ALTER TABLE "new_Criterion" RENAME TO "Criterion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
