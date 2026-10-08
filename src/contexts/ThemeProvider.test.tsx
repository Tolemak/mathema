import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';

describe('ThemeProvider', () => {
    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    it('applies the stored theme', () => {
        localStorage.setItem('theme', 'dark');
        render(<ThemeProvider><p>app</p></ThemeProvider>);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('still renders when storage access throws', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new DOMException('blocked', 'SecurityError');
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new DOMException('blocked', 'SecurityError');
        });
        render(<ThemeProvider><p>app</p></ThemeProvider>);
        expect(screen.getByText('app')).toBeTruthy();
        expect(document.documentElement.getAttribute('data-theme')).toMatch(/light|dark/);
    });
});
