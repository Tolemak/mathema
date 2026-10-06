const RELATIONAL_OPERATORS = ['∈', '=', '<', '>', '≤', '≥', '∀', '∃', '⊂', '⊆'];
const ADJACENT_OPERATORS = ['^', '+', '-', '*', '/'];
const FUNCTION_NAMES = ['sin', 'cos', 'tan', 'tg', 'ctg', 'cot', 'sqrt', 'log', 'ln', 'exp', 'arcsin', 'arccos', 'arctan'];

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

export function isAnswerCorrect(correctAnswer: string | number, userInput: string): boolean {
  if (typeof correctAnswer === 'number') {
    const value = parseFloat(userInput.trim().replace(',', '.'));
    return !isNaN(value) && value === correctAnswer;
  }
  return isStringAnswerCorrect(userInput, String(correctAnswer));
}
