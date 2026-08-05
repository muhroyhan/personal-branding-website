export const LOCALES = ["en", "id"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * English serves from the bare path (`/`, `/work`) rather than `/en`, so every
 * URL that was already indexed before Indonesian existed keeps working without
 * a redirect. Indonesian is the only prefixed locale.
 */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  id: "ID",
};

/** BCP 47 tags for <html lang> and hreflang. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  id: "id-ID",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Remembers a visitor's locale — set once by the middleware's geo lookup, or
 * whenever the language switcher is clicked — so neither one keeps
 * overriding the other on the next request. Shared between `middleware.ts`
 * (reads and writes it) and `LanguageSwitcher` (writes it client-side right
 * before it navigates, so a manual switch always wins).
 */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Prefixes an app-relative path with the locale segment, except for the default
 * locale which owns the bare path.
 *
 * Anchor-only hrefs (`/#work`) must collapse rather than concatenate, or the
 * Indonesian nav would point at `/id/#work` — a different path than the `/id`
 * page the anchor lives on, which forces a full navigation before the scroll.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;

  const rest = path === "/" ? "" : path.startsWith("/#") ? path.slice(1) : path;
  return `/${locale}${rest}`;
}

/**
 * The same page in another locale. Used by the language switcher, which has to
 * keep the reader where they are instead of dropping them on the homepage.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const stripped = LOCALES.reduce(
    (acc, locale) =>
      locale === DEFAULT_LOCALE
        ? acc
        : acc === `/${locale}`
          ? "/"
          : acc.startsWith(`/${locale}/`)
            ? acc.slice(`/${locale}`.length)
            : acc,
    pathname,
  );

  return localePath(target, stripped);
}
