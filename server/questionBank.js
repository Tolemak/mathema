import { readFileSync } from 'node:fs';

export const categories = JSON.parse(readFileSync(new URL('./questions.json', import.meta.url), 'utf8'));

const categoriesById = new Map(
  categories.map((category) => [
    category.id,
    { ...category, questionsById: new Map(category.questions.map((question) => [question.id, question])) },
  ]),
);

export function findCategory(id) {
  return typeof id === 'string' ? categoriesById.get(id) ?? null : null;
}
