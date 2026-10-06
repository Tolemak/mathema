
const RELATIONAL_OPERATORS = ['∈', '=', '<', '>', '≤', '≥', '∀', '∃', '⊂', '⊆'];
const ADJACENT_OPERATORS = ['^', '+', '-', '*', '/'];
const FUNCTION_NAMES = ['sin', 'cos', 'tan', 'tg', 'ctg', 'cot', 'sqrt', 'log', 'ln', 'exp', 'arcsin', 'arccos', 'arctan'];

/**
 * Many answers carry a trailing "(explanation)", e.g. "100 zł (108 / 1.08)", that is not meant to be typed,
 * so it is stripped. The parentheses are kept when they are the actual payload: the argument of a relation
 * ("x ∈ (-2, 2)"), of an operator ("n*x^(n-1)") or of a function call ("sin(x)", "6 * sqrt(2)"). The last two
 * are recognised by there being no whitespace before "(": a bare operator or a function name directly adjoining it.
 */
function stripTrailingExplanation(answer: string): string {
  const s = answer.trimEnd();
  if (!s.endsWith(')')) return s.trim();

  let depth = 0;
  let openIdx = -1;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ')') depth++;
    else if (s[i] === '(') {
      depth--;
      if (depth === 0) {
        openIdx = i;
        break;
      }
    }
  }
  if (openIdx <= 0) return s.trim();

  const beforeRaw = s.slice(0, openIdx);
  const immediatelyBefore = beforeRaw.slice(-1);
  const before = beforeRaw.trimEnd();
  if (!before) return s.trim();

  if (RELATIONAL_OPERATORS.includes(before.slice(-1))) return s.trim();
  if (immediatelyBefore && immediatelyBefore !== ' ') {
    if (ADJACENT_OPERATORS.includes(immediatelyBefore)) return s.trim();
    const wordMatch = before.match(/[\p{L}]+$/u);
    if (wordMatch && FUNCTION_NAMES.includes(wordMatch[0].toLowerCase())) return s.trim();
  }
  return before.trim();
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Numbers in order of appearance, with Polish comma-decimals normalized to periods. */
function extractNumbers(s: string): string[] {
  return (s.match(/\d+([.,]\d+)?/g) || []).map((n) => n.replace(',', '.'));
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * Grades free-text answers leniently: whitespace, case, unit differences and small typos in the wording are
 * forgiven, but every digit must still match exactly. Forgiving about how "100 zł" is written, never about
 * whether the number is 100.
 *
 * Every number of the correct answer must appear in the input, in order and exactly; a missing, extra or
 * different number is always wrong. Once the numbers match (or there are none), the remaining non-numeric
 * shape is compared with a Levenshtein tolerance, which is where typos and omitted units are forgiven.
 * Typing only the number(s) and leaving out any unit or wording is always accepted, e.g. "100" for "100 zł".
 */
export function isStringAnswerCorrect(userInput: string, correctAnswer: string): boolean {
  const correctCore = stripTrailingExplanation(correctAnswer);
  const normUser = normalize(userInput).replace(/\s+/g, '');
  const normCorrect = normalize(correctCore).replace(/\s+/g, '');

  if (normUser === normCorrect) return true;

  const userNums = extractNumbers(normUser);
  const correctNums = extractNumbers(normCorrect);

  if (correctNums.join('|') !== userNums.join('|')) return false;

  const userShape = normUser.replace(/\d+([.,]\d+)?/g, '#');
  const correctShape = normCorrect.replace(/\d+([.,]\d+)?/g, '#');

  if (/^#*$/.test(userShape)) return true;

  const distance = levenshtein(userShape, correctShape);
  const letterCount = correctShape.replace(/#/g, '').length;
  const tolerance = letterCount === 0 ? 0 : letterCount <= 8 ? 1 : 2;
  return distance <= tolerance;
}

/** Numeric answers compare exactly and accept Polish comma-decimals ("3,5") alongside periods. */
export function isAnswerCorrect(correctAnswer: string | number, userInput: string): boolean {
  if (typeof correctAnswer === 'number') {
    const value = parseFloat(userInput.trim().replace(',', '.'));
    return !isNaN(value) && value === correctAnswer;
  }
  return isStringAnswerCorrect(userInput, String(correctAnswer));
}
