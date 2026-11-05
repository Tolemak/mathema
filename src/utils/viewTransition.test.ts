import { afterEach, describe, expect, it, vi } from 'vitest';
import { radialViewTransition } from './viewTransition';

const defineTransition = (impl: (callback: () => void) => unknown) =>
    Object.defineProperty(document, 'startViewTransition', { value: vi.fn(impl), configurable: true });

describe('radialViewTransition', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        Reflect.deleteProperty(document, 'startViewTransition');
    });

    it('applies the change immediately without view transitions', () => {
        const apply = vi.fn();
        radialViewTransition(10, 10, apply);
        expect(apply).toHaveBeenCalledTimes(1);
    });

    it('applies the change immediately when motion is reduced', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        defineTransition(() => ({ ready: Promise.resolve() }));
        const apply = vi.fn();
        radialViewTransition(10, 10, apply);
        expect(apply).toHaveBeenCalledTimes(1);
        expect(document.startViewTransition).not.toHaveBeenCalled();
    });

    it('animates a growing circle from the click point', async () => {
        vi.stubGlobal('matchMedia', () => ({ matches: false }));
        const animate = vi.fn();
        document.documentElement.animate = animate;
        const apply = vi.fn();
        defineTransition((callback) => {
            callback();
            return { ready: Promise.resolve() };
        });

        radialViewTransition(5, 7, apply);
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(apply).toHaveBeenCalledTimes(1);
        expect(animate).toHaveBeenCalledTimes(1);
        expect(animate.mock.calls[0][0].clipPath[0]).toBe('circle(0px at 5px 7px)');
    });

    it('swallows a rejected transition', async () => {
        vi.stubGlobal('matchMedia', () => ({ matches: false }));
        defineTransition(() => ({ ready: Promise.reject(new Error('skipped')) }));
        radialViewTransition(1, 1, vi.fn());
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
});
