/**
 * Classify a canonical exercise name (from Hevy CSV) for seeding.
 *
 * @param {string} name
 * @returns {{ primaryMuscleGroup: string, exerciseType: string, strengthTracking: string }}
 */
export function classifyExercise(name) {
  const n = name.toLowerCase();

  return {
    primaryMuscleGroup: classifyMuscle(name, n),
    exerciseType: classifyType(name, n),
    strengthTracking: classifyStrength(name, n),
  };
}

/** @type {Record<string, string>} */
const MUSCLE_OVERRIDES = {
  "Face Pull": "SHOULDERS",
  "Cable rear delt fly": "SHOULDERS",
  "Ring face pulls": "SHOULDERS",
  "Face pull overhead presses": "SHOULDERS",
  "Rear delt fly": "SHOULDERS",
  "Rear Delt Reverse Fly (Machine)": "SHOULDERS",
  "Reverse pec deck": "SHOULDERS",
  "Ring rear delt row": "SHOULDERS",
  "Lu lateral raise": "SHOULDERS",
  "Cable behind the back lateral raise": "SHOULDERS",
  "Goldring behind the back lateral raise": "SHOULDERS",
  "Ring cross body lateral raise": "SHOULDERS",
  "Cable y raise": "SHOULDERS",
  "Goldring y raise": "SHOULDERS",
  "Ring front raise": "SHOULDERS",
  "Ring lateral raise": "SHOULDERS",
  "Front Raise (Dumbbell)": "SHOULDERS",
  "Cable up lean forward triceps extension": "TRICEPS",
  "Bench Press - Close Grip (Barbell)": "TRICEPS",
  "Smith JM press": "TRICEPS",
  "Close grip bodyweight curl": "BICEPS",
  "Pullover (Dumbbell)": "BACK",
  "BW PJR pullover": "BACK",
  "Bodyweight pullover": "BACK",
  "Straight Leg Deadlift": "HAMSTRINGS",
  "Hip Thrust": "GLUTES",
  "Walking lunge": "QUADS",
  "Inverted row": "BACK",
  "Machine row": "BACK",
  "Hip Adduction (Machine)": "QUADS",
  "Neck Curl": "OTHER",
  "Neck extension": "OTHER",
  "Lying Neck Curls (Weighted)": "OTHER",
  "Lying Neck Extension (Weighted)": "OTHER",
};

function classifyMuscle(name, n) {
  if (MUSCLE_OVERRIDES[name]) return MUSCLE_OVERRIDES[name];

  if (/shrug|upright row/.test(n)) return "UPPER_TRAPS";
  if (/calf|seated calf|horizontal calf/.test(n)) return "CALVES";
  if (/wrist|forearm|hang|plate pinch/.test(n)) return "FOREARMS";
  if (
    /crunch|leg raise|knee raise|rollout|roman chair|captain's chair|hyper y|wall slide|neck/.test(
      n,
    )
  )
    return "CORE";

  if (
    /bench press|chest press|chest fly|pec deck|butterfly|floor press|push up|pushup|push-up|ring push|diamond|dip|fly/.test(
      n,
    ) &&
    !/triceps|face pull|ring dip|bulgarian dip|seated dip/.test(n)
  )
    return "CHEST";

  if (
    /pull up|pullup|chin up|chinup|row|pulldown|deadlift|rack pull|lat |inverted|straight arm lat|archer bodyweight row|l-row|l sit pullup|false grip|neutral grip pull|mantle chin|rocking pulldown|lat prayer/.test(
      n,
    )
  )
    return "BACK";

  if (
    /squat|leg press|leg extension|lunge|split squat|bulgarian|pistol|sissy|step up|adductor|box pistol|bw leg extension/.test(
      n,
    )
  )
    return "QUADS";

  if (/rdl|romanian|leg curl|nordic|hamstring|sliding hamstring/.test(n))
    return "HAMSTRINGS";

  if (/hip thrust|glute|kickback|single leg hip/.test(n)) return "GLUTES";

  if (
    /shoulder press|overhead press|military|lateral raise|pike push|handstand|face pull|rear delt/.test(
      n,
    )
  )
    return "SHOULDERS";

  if (/curl|bayesian|spider|preacher|hammer|chin curl|lip buster|waiter curl|pelican/.test(n))
    return "BICEPS";

  if (
    /triceps|tricep|skullcrusher|pushdown|kickback|rope push|dip/.test(n)
  )
    return "TRICEPS";

  return "OTHER";
}

function classifyType(name, n) {
  if (
    /curl|raise|fly|extension|kickback|crunch|shrug|wrist|rollout|neck|lateral partial|face pull|pec deck|butterfly|leg extension|leg curl|calf|adduction|y raise|rear delt/.test(
      n,
    ) &&
    !/press|row|pulldown|deadlift|squat|thrust|lunge|dip|pull up|chin up|push up/.test(n)
  )
    return "ISOLATION";

  return "COMPOUND";
}

const MAX_REPS_NAMES = new Set([
  "Pull Up",
  "Wide Pull Up",
  "Wide pullup",
  "Chin Up",
  "Chinup",
  "Mantle chinup",
  "Ring Dips",
  "Ring dip (triceps focus)",
  "Ring Push Up",
]);

function classifyStrength(name, n) {
  if (/\(weighted\)/i.test(name)) return "E1RM";

  if (MAX_REPS_NAMES.has(name)) return "MAX_REPS";

  if (
    /push up|pushup|push-up|pike|handstand|crow|wall slide|planche|pelican|archer push|diamond|decline push|twisting push|med ball push|shoulder tap|box pistol|pistol|carry|muscle|transition|hyper y|side lying hip|single leg deadlift|bodyweight triceps extension chair|bw triceps|explosive pull|negative chin|one arm push|bulgarian push|divebomber|pancake push|cobra push|ring rollout|inverted row|archer bodyweight|waiter curl|lip buster|cheat lateral|sliding lateral|horizontal calf|bw seated calf|plate pinch|hyper y|lat prayer|rocking pulldown/.test(
      n,
    )
  )
    return "NONE";

  if (
    /\(barbell\)|\(dumbbell\)|\(smith machine\)|\(machine\)|\(cable\)|\(trap bar\)|t bar|leg press|hack squat|hip thrust \(/.test(
      n,
    )
  )
    return "E1RM";

  if (
    /bench press|squat|deadlift|overhead press|shoulder press|row|pulldown|rack pull|romanian|skullcrusher|preacher|hammer curl|bicep curl|triceps extension|leg curl|leg extension|calf|shrug|upright row|face pull|hip thrust|walking lunge|bulgarian split|split squat|close grip bench|jm press/.test(
      n,
    )
  )
    return "E1RM";

  return "NONE";
}
