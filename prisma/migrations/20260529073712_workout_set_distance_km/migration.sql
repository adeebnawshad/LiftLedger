-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "distanceKm" DECIMAL(8,3),
ADD COLUMN     "durationSeconds" INTEGER,
ALTER COLUMN "reps" DROP NOT NULL;
