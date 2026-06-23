-- CreateEnum
CREATE TYPE "StrengthTracking" AS ENUM ('NONE', 'E1RM', 'MAX_REPS');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "strengthTracking" "StrengthTracking" NOT NULL DEFAULT 'NONE';
