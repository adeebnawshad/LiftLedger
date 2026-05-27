-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'UPPER_TRAPS', 'QUADS', 'HAMSTRINGS', 'GLUTES', 'CALVES', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'CORE', 'OTHER');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('COMPOUND', 'ISOLATION');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "SetKind" AS ENUM ('WARMUP', 'NORMAL', 'FAILURE', 'DROPSET');

-- CreateEnum
CREATE TYPE "CsvImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MeasurementSite" AS ENUM ('BODY_WEIGHT', 'NECK', 'CHEST', 'WAIST', 'HIPS', 'LEFT_ARM', 'RIGHT_ARM', 'LEFT_FOREARM', 'RIGHT_FOREARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'LEFT_CALF', 'RIGHT_CALF');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredWeightUnit" "WeightUnit" NOT NULL DEFAULT 'KG',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvImport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CsvImportStatus" NOT NULL DEFAULT 'PENDING',
    "errorDetails" JSONB,

    CONSTRAINT "CsvImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryMuscleGroup" "MuscleGroup" NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseAlias" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "ExerciseAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "csvImportId" TEXT,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "setKind" "SetKind" NOT NULL DEFAULT 'NORMAL',
    "reps" INTEGER NOT NULL,
    "weightAmount" DECIMAL(8,2),
    "weightUnit" "WeightUnit",
    "rir" DOUBLE PRECISION,
    "rpe" DOUBLE PRECISION,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyMeasurementEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "site" "MeasurementSite" NOT NULL,
    "value" DECIMAL(8,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BodyMeasurementEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CsvImport_userId_uploadedAt_idx" ON "CsvImport"("userId", "uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Exercise_primaryMuscleGroup_idx" ON "Exercise"("primaryMuscleGroup");

-- CreateIndex
CREATE INDEX "Exercise_exerciseType_idx" ON "Exercise"("exerciseType");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseAlias_alias_key" ON "ExerciseAlias"("alias");

-- CreateIndex
CREATE INDEX "ExerciseAlias_exerciseId_idx" ON "ExerciseAlias"("exerciseId");

-- CreateIndex
CREATE INDEX "Workout_userId_startedAt_idx" ON "Workout"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "Workout_csvImportId_idx" ON "Workout"("csvImportId");

-- CreateIndex
CREATE INDEX "WorkoutSet_workoutId_idx" ON "WorkoutSet"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutSet_exerciseId_idx" ON "WorkoutSet"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSet_workoutId_orderIndex_key" ON "WorkoutSet"("workoutId", "orderIndex");

-- CreateIndex
CREATE INDEX "BodyMeasurementEntry_userId_measuredAt_idx" ON "BodyMeasurementEntry"("userId", "measuredAt");

-- CreateIndex
CREATE INDEX "BodyMeasurementEntry_userId_site_measuredAt_idx" ON "BodyMeasurementEntry"("userId", "site", "measuredAt");

-- AddForeignKey
ALTER TABLE "CsvImport" ADD CONSTRAINT "CsvImport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAlias" ADD CONSTRAINT "ExerciseAlias_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_csvImportId_fkey" FOREIGN KEY ("csvImportId") REFERENCES "CsvImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMeasurementEntry" ADD CONSTRAINT "BodyMeasurementEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
