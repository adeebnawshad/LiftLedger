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
      "Chest Press (Machine)",
      "Iso-Lateral Chest Press (Machine)",
      "Neutral thumbs up dumbbell bench press",
      "Floor press (dumbbell)",
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
      "Incline Chest Press (Machine)",
    ],
  },
  {
    name: "Chest Fly",
    primaryMuscleGroup: "CHEST",
    exerciseType: "ISOLATION",
    aliases: [
      "Chest Fly (Cable)",
      "Chest Fly (Dumbbell)",
      "Chest Fly (Machine)",
      "Cable Fly Crossovers",
      "Butterfly (Pec Deck)",
      "Incline Chest Fly (Dumbbell)",
    ],
  },
  {
    name: "Chest Dip",
    primaryMuscleGroup: "CHEST",
    exerciseType: "COMPOUND",
    aliases: [
      "Chest Dip",
      "Chest Dip (Weighted)",
      "Bench Dip",
    ],
  },

  // —— Back ——
  {
    name: "Lat Pulldown",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Lat Pulldown (Cable)",
      "Wide Grip Lat Pulldown (Cable)",
      "Lat Pulldown (Machine)",
      "Lat Pulldown - Close Grip (Cable)",
      "Reverse Grip Lat Pulldown (Cable)",
      "Straight Arm Lat Pulldown (Cable)",
      "Single Arm Lat Pulldown",
      "Half kneeling one arm lat pulldown",
    ],
  },
  {
    name: "Barbell Row",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Bent Over Row (Barbell)",
      "Bent Over Row (Dumbbell)",
      "Seated Row (Cable)",
      "Seated Cable Row - V Grip (Cable)",
      "Seated Cable Row - Bar Grip",
      "Seated Cable Row - Bar Wide Grip",
      "Pendlay Row (Barbell)",
      "T Bar Row",
      "Dumbbell Row",
      "One arm row (seated row cable)",
    ],
  },
  {
    name: "Machine Row",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Machine row",
      "Seated Row (Machine)",
      "Iso-Lateral Row (Machine)",
      "Iso-Lateral High Row (Machine)",
      "Chest Supported Incline Row (Dumbbell)",
      "Iso lateral low row (plate loaded) - single arm",
      "Single arm iso-lateral high row",
      "High row (plate loaded)",
      "Lat row (on Machine Row, Neutral Grip, Small ROM)",
    ],
  },
  {
    name: "Deadlift",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Deadlift (Barbell)",
      "Sumo Deadlift (Barbell)",
      "Deadlift (Smith Machine)",
      "Deadlift (Trap bar)",
      "Straight Leg Deadlift",
    ],
  },
  {
    name: "Rack Pull",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: ["Rack Pull", "Rack Pull (Barbell)"],
  },
  {
    name: "Pull-Up",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: [
      "Pull Up",
      "Pull Up (Assisted)",
      "Pull Up (Weighted)",
      "Wide Pull Up",
      "Wide pullup",
      "Chin Up",
      "Chin Up (Weighted)",
      "Chinup",
    ],
  },
  {
    name: "Face Pull",
    primaryMuscleGroup: "BACK",
    exerciseType: "ISOLATION",
    aliases: ["Face Pull", "Cable rear delt fly"],
  },
  {
    name: "Back Extension",
    primaryMuscleGroup: "BACK",
    exerciseType: "ISOLATION",
    aliases: [
      "Back Extension (Weighted Hyperextension)",
      "Reverse hyperextensions",
    ],
  },

  // —— Traps ——
  {
    name: "Barbell Shrug",
    primaryMuscleGroup: "UPPER_TRAPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Shrug (Barbell)",
      "Shrug (Dumbbell)",
      "Shrug (Smith Machine)",
      "Shrug (Machine)",
      "Upright Row (Barbell)",
      "Upright Row (Dumbbell)",
      "Upright Row (Cable)",
      "Dumbbell high pull",
    ],
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
      "Overhead Press (Barbell)",
      "Overhead Press (Dumbbell)",
      "Overhead Press (Smith Machine)",
      "Shoulder Press (Machine Plates)",
      "Seated Shoulder Press (Machine)",
      "Overhead press (machine)",
      "Seated Overhead Press (Dumbbell)",
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
      "Seated Lateral Raise (Dumbbell)",
      "Seated dumbbell lateral raise",
      "Front Raise (Dumbbell)",
      "Cable y raise",
    ],
  },
  {
    name: "Rear Delt Fly",
    primaryMuscleGroup: "SHOULDERS",
    exerciseType: "ISOLATION",
    aliases: [
      "Rear Delt Reverse Fly (Machine)",
      "Reverse pec deck",
      "Rear delt fly",
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
      "Bicep Curl (Machine)",
      "EZ Bar Curl",
      "EZ Bar Biceps Curl",
      "Bayesian cable curl",
      "Behind the Back Curl (Cable)",
    ],
  },
  {
    name: "Hammer Curl",
    primaryMuscleGroup: "BICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Hammer Curl (Dumbbell)",
      "Hammer Curl (Cable)",
      "Cross Body Hammer Curl",
      "Preacher hammer curl",
      "Alternating cheat cross body hammer curl",
      "Cross body hammer curl",
    ],
  },
  {
    name: "Incline Curl",
    primaryMuscleGroup: "BICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Seated Incline Curl (Dumbbell)",
      "Seated dumbbell curl",
      "Spider Curl (Barbell)",
      "Spider curl",
      "Reverse Preacher Curl (EZ Bar)",
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
  {
    name: "Reverse Curl",
    primaryMuscleGroup: "BICEPS",
    exerciseType: "ISOLATION",
    aliases: [
      "Reverse Curl (Barbell)",
      "Reverse Curl (Cable)",
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
      "Triceps Pushdown",
      "Triceps Extension (Barbell)",
      "Skullcrusher (Dumbbell)",
      "Triceps Extension (Dumbbell)",
      "Overhead Triceps Extension (Cable)",
      "Triceps Rope Pushdown",
      "Rope pushdown",
      "Triceps Kickback (Cable)",
      "Triceps Kickback (Dumbbell)",
      "Single arm cable triceps extension",
      "Dual cable cross body tricep pushdown",
      "Kneeling triceps pushdown (rope)",
    ],
  },
  {
    name: "Close-Grip Bench Press",
    primaryMuscleGroup: "TRICEPS",
    exerciseType: "COMPOUND",
    aliases: [
      "Close Grip Bench Press (Barbell)",
      "Close Grip Bench Press (Smith Machine)",
      "Bench Press - Close Grip (Barbell)",
      "Smith JM press",
    ],
  },
  {
    name: "Triceps Dip",
    primaryMuscleGroup: "TRICEPS",
    exerciseType: "COMPOUND",
    aliases: [
      "Triceps Dip",
      "Triceps Dip (Weighted)",
      "Seated Dip Machine",
      "Seated dip",
    ],
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
      "Leg Press Horizontal (Machine)",
      "Squat (Smith Machine)",
      "Sissy Squat (Weighted)",
    ],
  },
  {
    name: "Leg Extension",
    primaryMuscleGroup: "QUADS",
    exerciseType: "ISOLATION",
    aliases: ["Leg Extension (Machine)"],
  },
  {
    name: "Walking Lunge",
    primaryMuscleGroup: "QUADS",
    exerciseType: "COMPOUND",
    aliases: [
      "Walking Lunge",
      "Walking Lunge (Dumbbell)",
      "Walking Lunge (Barbell)",
    ],
  },
  {
    name: "Bulgarian Split Squat",
    primaryMuscleGroup: "QUADS",
    exerciseType: "COMPOUND",
    aliases: [
      "Bulgarian Split Squat",
      "Split Squat (Dumbbell)",
      "Step up",
      "1.5 Bulgarian split squat",
    ],
  },
  {
    name: "Hip Adduction",
    primaryMuscleGroup: "QUADS",
    exerciseType: "ISOLATION",
    aliases: ["Hip Adduction (Machine)"],
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
      "Single leg curl",
    ],
  },
  {
    name: "Nordic Curl",
    primaryMuscleGroup: "HAMSTRINGS",
    exerciseType: "COMPOUND",
    aliases: [
      "Nordic Hamstrings Curls",
      "Nordic curl",
      "Glute Ham Raise",
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
      "Cable Kickback",
    ],
  },
  {
    name: "Pullover",
    primaryMuscleGroup: "BACK",
    exerciseType: "COMPOUND",
    aliases: ["Pullover (Dumbbell)"],
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
      "Standing Calf Raise (Dumbbell)",
      "Standing Calf Raise",
      "Seated Calf Raise",
      "Calf Press (Machine)",
      "Calf Extension (Machine)",
      "Calf extension",
      "Calf Press on Seated Leg Press",
      "Single leg standing calf raise",
    ],
  },

  // —— Core ——
  {
    name: "Cable Crunch",
    primaryMuscleGroup: "CORE",
    exerciseType: "ISOLATION",
    aliases: [
      "Cable Crunch",
      "Crunch (Cable)",
      "Ab Crunch (Machine)",
      "Decline Crunch (Weighted)",
    ],
  },
  {
    name: "Hanging Leg Raise",
    primaryMuscleGroup: "CORE",
    exerciseType: "ISOLATION",
    aliases: [
      "Hanging Leg Raise",
      "Hanging Knee Raise",
      "Leg Raise Parallel Bars",
      "Knee Raise Parallel Bars",
      "Leg raise (captain's chair)",
      "Roman chair knee raise",
    ],
  },

  // —— Forearms ——
  {
    name: "Dead Hang",
    primaryMuscleGroup: "FOREARMS",
    exerciseType: "ISOLATION",
    aliases: ["Dead Hang", "Two arm hang", "One Arm hang"],
  },
  {
    name: "Wrist Curl",
    primaryMuscleGroup: "FOREARMS",
    exerciseType: "ISOLATION",
    aliases: [
      "Seated Palms Up Wrist Curl",
      "Wrist curl",
      "Behind the Back Bicep Wrist Curl (Barbell)",
      "Cable wrist curl",
      "Cable single arm wrist curl",
      "Standing Wrist extension",
      "Seated Wrist Extension (Barbell)",
      "Reverse wrist curl",
      "Barbell wrist extensions",
      "Barbell extensor rolls",
    ],
  },
];
