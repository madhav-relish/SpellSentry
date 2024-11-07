/*
  Warnings:

  - Added the required column `type` to the `SpellingError` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpellingError" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;
