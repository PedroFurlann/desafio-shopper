/*
  Warnings:

  - Added the required column `origin` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "origin" TEXT NOT NULL;
