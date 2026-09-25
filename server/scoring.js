export const DIFFICULTY_MULTIPLIERS = {
  latwe: 1,
  srednie: 1.5,
  trudne: 2,
  bardzo_trudne: 2.5,
};

export const SCHOOL_LEVEL_MULTIPLIERS = {
  podstawowa_4_6: 1,
  podstawowa_7_8: 1.2,
  liceum_podst: 1.5,
  liceum_rozsz: 2,
  studia_tech_1rok: 2.5,
};

const BASE_POINTS = 10;
const BONUS_WINDOW_SECONDS = 30;
const LATE_PENALTY_FACTOR = 0.5;
const MIN_POINTS_SHARE = 0.2;

/**
 * @param {{ difficulty: string, schoolLevel: string }} question
 * @param {number} seconds
 * @returns {number}
 */
export function pointsFor(question, seconds) {
  const base = BASE_POINTS
    * DIFFICULTY_MULTIPLIERS[question.difficulty]
    * SCHOOL_LEVEL_MULTIPLIERS[question.schoolLevel];
  const elapsed = Math.max(seconds, 0);
  const bonus = elapsed <= BONUS_WINDOW_SECONDS
    ? (BONUS_WINDOW_SECONDS - elapsed) / BONUS_WINDOW_SECONDS
    : -((elapsed - BONUS_WINDOW_SECONDS) * LATE_PENALTY_FACTOR) / BONUS_WINDOW_SECONDS;

  return Math.max(base + base * bonus, base * MIN_POINTS_SHARE);
}
