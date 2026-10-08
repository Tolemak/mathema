const ORIGIN = 'https://mathema.tolemak.pl';

export function canonicalUrl(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ORIGIN + path;
}
