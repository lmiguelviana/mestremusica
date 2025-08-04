/*
  Warnings:

  - Added the required column `student_email` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_name` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "lesson_type" TEXT NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "professor_notes" TEXT,
ADD COLUMN     "student_email" TEXT NOT NULL,
ADD COLUMN     "student_name" TEXT NOT NULL,
ADD COLUMN     "student_notes" TEXT,
ADD COLUMN     "student_phone" TEXT,
ALTER COLUMN "student_id" DROP NOT NULL;
