import { describe, expect, it } from 'vitest';
import { isAnswerCorrect, isStringAnswerCorrect } from './answerCheck';

describe('isAnswerCorrect', () => {
    it('compares numeric answers exactly and accepts a decimal comma', () => {
        expect(isAnswerCorrect(3, ' 3 ')).toBe(true);
        expect(isAnswerCorrect(2.5, '2,5')).toBe(true);
        expect(isAnswerCorrect(3, '4')).toBe(false);
        expect(isAnswerCorrect(3, 'abc')).toBe(false);
    });

    it('ignores case and whitespace in text answers', () => {
        expect(isAnswerCorrect('4ab', ' 4 A b ')).toBe(true);
        expect(isAnswerCorrect('x > 3', 'x>3')).toBe(true);
        expect(isAnswerCorrect('4ab', '5ab')).toBe(false);
    });
});

describe('isStringAnswerCorrect', () => {
    it('drops a trailing explanation in parentheses', () => {
        expect(isStringAnswerCorrect('tak', 'tak (bo parzysta)')).toBe(true);
    });

    it('keeps parentheses that belong to the expression', () => {
        expect(isStringAnswerCorrect('(a+b)', '(a+b)')).toBe(true);
        expect(isStringAnswerCorrect('x = (a+b)', 'x=(a+b)')).toBe(true);
        expect(isStringAnswerCorrect('2*(a+b)', '2*(a+b)')).toBe(true);
        expect(isStringAnswerCorrect('sin(x)', 'sin(x)')).toBe(true);
        expect(isStringAnswerCorrect('sin(x)', 'cos(x)')).toBe(false);
    });

    it('tolerates a small typo only when the numbers agree', () => {
        expect(isStringAnswerCorrect('pierwiastek', 'pierwiastk')).toBe(true);
        expect(isStringAnswerCorrect('pierwiastek 4', 'pierwiastk 4')).toBe(true);
        expect(isStringAnswerCorrect('pierwiastek 4', 'pierwiastek 5')).toBe(false);
        expect(isStringAnswerCorrect('pierwiastek', 'zupelnie inaczej')).toBe(false);
        expect(isStringAnswerCorrect('dlugiejszaodpowiedz', 'dlugiejszaodpowidz')).toBe(true);
        expect(isStringAnswerCorrect('dlugiejszaodpowiedz', 'dlugiejszaodpwdz')).toBe(false);
    });

    it('accepts decimal commas inside text answers', () => {
        expect(isStringAnswerCorrect('x = 2,5', 'x=2.5')).toBe(true);
        expect(isStringAnswerCorrect('2', '2')).toBe(true);
    });
});
