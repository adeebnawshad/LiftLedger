/**
 * Canonical exercises + Hevy-style aliases.
 *
 * - `name`: stable label in your app (not necessarily identical to Hevy).
 * - `aliases`: exact strings as they appear in Hevy exports (equipment in parentheses).
 *
 * Add rows here as you discover unmapped names during CSV import.
 * primaryMuscleGroup: volume counts toward this muscle only (v1 rule).
 */

/** @typedef {{ name: string, primaryMuscleGroup: string, exerciseType: string, aliases: string[] }} ExerciseSeed */

/** @type {ExerciseSeed[]} */
export const exerciseSeeds = [
  // —— Chest ——
  {
    name: "Bench Press",
    primaryMuscleGroup: "CHEST",
    exerciseType: "COMPOUND",
    aliases: [
      "Bench Press (Barbell)",
      "Bench Press (Smith Machine)",
      "Bench Press (Dumbbell)",
    ],
  },
  {
    name: "Incline Bench Press",
    primaryMuscleGroup: "CHEST",
    exerciseType: "COMPOUND",
    aliases: [
      "Incline Bench Press (Barbell)",
      "Incline Bench Press (Smith Machine)",
      "Incline Bench Press (Dumbbell)",
    ],
  },
  {
    name: "Chest Fly",
    primaryMuscleGroup: "CHEST",
    exerciseType: "ISOLATION",
    aliases: [
      "Chest Fly (Cable)",
      "Chest Fly (Dumbbell)",
      "Cable Fly Crossovers",
    ],
  },

  // —— Back ——
  {
    name: "Lat Pulldown",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: ["Lat Pulldown (Cable)", "Wide Grip Lat Pulldown (Cable)"],
  },
  {
    name: "Barbell Row",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Bent Over Row (Barbell)",
      "Bent Over Row (Dumbbell)",
      "Seated Row (Cable)",
    ],
  },
  {
    name: "Deadlift",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: ["Deadlift (Barbell)", "Sumo Deadlift (Barbell)"],
  },
  {
    name: "Pull-Up",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: ["Pull Up", "Pull Up (Assisted)", "Chin Up"],
  },

  // —— Traps ——
  {
    name: "Barbell Shrug",
    primaryMuscleGroup: "UPPER_TRAPS",
    exerciseType: "ISOLATION",
    aliases: ["Shrug (Barbell)", "Shrug (Dumbbell)", "Shrug (Smith Machine)"],
  },

  // —— Shoulders ——
  {
    name: "Overhead Press",
    primaryMuscleGroup: "SHOULDERS",
    exerciseType: "COMPOUND",
    aliases: [
      "Shoulder Press (Barbell)",
      "Shoulder Press (Dumbbell)",
      "Shoulder Press (Smith Machine)",
      "Military Press (Barbell)",
    ],
  },
  {
    name: "Lateral Raise",
    primaryMuscleGroup: "SHOULDERS",
    exerciseType: "ISOLATION",
    aliases: [
      "Lateral Raise (Dumbbell)",
      "Lateral Raise (Cable)",
      "Lateral Raise (Machine)",
    ],
  },

  // —— Biceps ——
  {
    name: "Barbell Curl",
    primaryMuscleGroup: "BICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Bicep Curl (Barbell)",
      "Bicep Curl (Dumbbell)",
      "Bicep Curl (Cable)",
    ],
  },
  {
    name: "Preacher Curl",
    primaryMuscleGroup: "BICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Preacher Curl (Barbell)",
      "Preacher Curl (Dumbbell)",
      "Preacher Curl (Machine)",
    ],
  },

  // —— Triceps ——
  {
    name: "Triceps Extension",
    primaryMuscleGroup: "TRICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Triceps Extension (Cable)",
      "Triceps Pushdown (Cable)",
      "Tricep Extension (Cable)",
      "Skullcrusher (Barbell)",
    ],
  },
  {
    name: "Close-Grip Bench Press",
    primaryMuscleGroup: "TRICEPS",
    exerciseType: "COMPOUND",
    aliases: ["Close Grip Bench Press (Barbell)", "Close Grip Bench Press (Smith Machine)"],
  },

  // —— Quads ——
  {
    name: "Squat",
    primaryMuscleGroup: "QUADS",
    exerciseType: "COMPOUND",
    aliases: [
      "Squat (Barbell)",
      "Front Squat (Barbell)",
      "Hack Squat (Machine)",
      "Leg Press",
      "Leg Press (Machine)",
    ],
  },
  {
    name: "Leg Extension",
    primaryMuscleGroup: "QUADS",
    exerciseType: "ISOLATION",
    aliases: ["Leg Extension (Machine)"],
  },

  // —— Hamstrings / glutes ——
  {
    name: "Romanian Deadlift",
    primaryMuscleGroup: "HAMSTRINGS",
    exerciseType: "COMPOUND",
    aliases: [
      "Romanian Deadlift (Barbell)",
      "Romanian Deadlift (Dumbbell)",
      "RDL (Barbell)",
    ],
  },
  {
    name: "Leg Curl",
    primaryMuscleGroup: "HAMSTRINGS",
    exerciseType: "ISOLATION",
    aliases: [
      "Leg Curl (Machine)",
      "Lying Leg Curl (Machine)",
      "Seated Leg Curl (Machine)",
    ],
  },
  {
    name: "Hip Thrust",
    primaryMuscleGroup: "GLUTES",
    exerciseType: "COMPOUND",
    aliases: [
      "Hip Thrust (Barbell)",
      "Hip Thrust (Machine)",
      "Glute Bridge (Barbell)",
    ],
  },

  // —— Calves ——
  {
    name: "Calf Raise",
    primaryMuscleGroup: "CALVES",
    exerciseType: "ISOLATION",
    aliases: [
      "Calf Raise (Machine)",
      "Standing Calf Raise (Machine)",
      "Seated Calf Raise (Machine)",
    ],
  },

  // —— Core ——
  {
    name: "Cable Crunch",
    primaryMuscleGroup: "CORE",
    exerciseType: "ISOLATION",
    aliases: ["Cable Crunch", "Crunch (Cable)", "Ab Crunch (Machine)"],
  },
];
