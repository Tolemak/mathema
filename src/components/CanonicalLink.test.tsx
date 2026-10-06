import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CanonicalLink from './CanonicalLink';
import { canonicalUrl } from '../utils/canonicalUrl';

describe('CanonicalLink', () => {
    beforeEach(() => {
        document.head.innerHTML =
            '<link rel="canonical" href="https://mathema.tolemak.pl/"><meta property="og:url" content="https://mathema.tolemak.pl/">';
    });
    afterEach(cleanup);

    it('points canonical and og:url at the current route', () => {
        render(
            <MemoryRouter initialEntries={['/practice/browse/algebra']}>
                <CanonicalLink />
            </MemoryRouter>,
        );
        const expected = 'https://mathema.tolemak.pl/practice/browse/algebra';
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(expected);
        expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(expected);
    });

    it('normalizes the root and trailing slashes', () => {
        expect(canonicalUrl('/')).toBe('https://mathema.tolemak.pl/');
        expect(canonicalUrl('/leaderboard/')).toBe('https://mathema.tolemak.pl/leaderboard');
    });
});
