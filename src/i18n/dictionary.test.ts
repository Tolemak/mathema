import { describe, expect, it } from 'vitest';
import categories from '../../server/questions.json';
import { en, lookup, pl, translate } from './dictionary';

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

describe('dictionary', () => {
    it('has an English entry for every Polish key and vice versa', () => {
        expect(Object.keys(en).sort()).toEqual(Object.keys(pl).sort());
    });

    it('has no empty messages', () => {
        for (const dictionary of [pl, en]) {
            for (const value of Object.values(dictionary)) expect(value.trim()).not.toBe('');
        }
    });

    it('uses the same placeholders in both languages', () => {
        for (const key of Object.keys(pl) as (keyof typeof pl)[]) {
            expect(placeholders(en[key])).toEqual(placeholders(pl[key]));
        }
    });

    it('translates every category of the question bank', () => {
        for (const category of categories) {
            expect(pl[`category.${category.id}` as keyof typeof pl]).toBe(category.name);
            expect(lookup('en', 'category', category.id, '')).not.toBe('');
        }
    });

    it('covers every school level and difficulty used by the questions', () => {
        const questions = categories.flatMap((category) => category.questions);
        for (const question of questions) {
            expect(`level.${question.schoolLevel}` in pl).toBe(true);
            expect(`difficulty.${question.difficulty}` in pl).toBe(true);
        }
    });

    it('fills placeholders and falls back for unknown dynamic keys', () => {
        expect(translate('en', 'question.number', { n: 3 })).toBe('Task 3.');
        expect(translate('pl', 'question.number', { n: 3 })).toBe('Zadanie 3.');
        expect(lookup('en', 'category', 'unknown', 'Raw')).toBe('Raw');
    });
});
