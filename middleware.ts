import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/lib/i18n/config";

const COOKIE_OPTS = { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE } as const;

function isKnownLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "id";
}

/**
 * Unconditionally prefixes, unlike `lib/i18n`'s `localePath` — that one skips
 * the prefix for the default locale because it builds *visible* hrefs, where
 * English intentionally owns the bare path. This one builds the *internal*
 * route Next.js has to match, which always lives under `app/[locale]/`, so
 * even English needs its `/en` segment here or the rewrite target is
 * identical to the incoming path and resolves to nothing.
 */
function withLocalePrefix(locale: Locale, pathname: string): string {
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

/** Vercel's edge network stamps this on every request; absent everywhere else (local dev, other hosts). */
function localeFromCountry(country: string | null): Locale {
  return country === "ID" ? "id" : "en";
}

/**
 * Two jobs:
 *
 * 1. Rewrite (never redirect) the un-prefixed paths onto the English segment,
 *    so `/work` keeps serving `app/[locale]/work` while the address bar still
 *    reads `/work`. Every URL that existed before Indonesian was added stays a
 *    200 with the same canonical — the whole reason English owns the bare path.
 *
 * 2. On a visitor's first request — no `NEXT_LOCALE` cookie yet — geolocate via
 *    Vercel's `x-vercel-ip-country` header and redirect once if that resolves
 *    to a non-default locale (Indonesia → `/id`). The decision is pinned to a
 *    cookie immediately after, so it survives VPNs and repeat visits without
 *    re-running the geo check, and so it never re-fires once a locale has been
 *    chosen — by geo or by hand.
 *
 *    `LanguageSwitcher` sets that same cookie client-side right before it
 *    navigates, which is what stops a manual switch back to English from
 *    being immediately overridden here: without it, an id→en click would land
 *    on the bare path with the old `id` cookie still attached and bounce
 *    straight back to `/id`.
 *
 *    Trade-off worth knowing: a bare link someone shares (`/work/...`) now
 *    redirects an Indonesia-located visitor to `/id/work/...` even if the
 *    sender meant the English write-up specifically. That's the intended
 *    behaviour here, not an oversight — Indonesian visitors defaulting to
 *    `/id` was the point.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Checked against every locale, not just "id": a request that already
  // spells out `/en/...` explicitly is a valid match for `app/[locale]/...`
  // as-is and must pass through untouched. Skipping "en" here would fall
  // through to the cookie-redirect branch below, which would prepend the
  // cookie's locale in front of the already-correct `/en` segment
  // (`/id/en/...`) and 404.
  const matchedLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (matchedLocale) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, matchedLocale, COOKIE_OPTS);
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const resolvedLocale = isKnownLocale(cookieLocale)
    ? cookieLocale
    : localeFromCountry(request.headers.get("x-vercel-ip-country"));

  if (resolvedLocale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix(resolvedLocale, pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, resolvedLocale, COOKIE_OPTS);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = withLocalePrefix(DEFAULT_LOCALE, pathname);
  const response = NextResponse.rewrite(url);
  // Only stamp the cookie the first time — a request that already carries an
  // explicit "en" cookie shouldn't have its expiry silently bumped on every
  // single page view.
  if (!isKnownLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, COOKIE_OPTS);
  }
  return response;
}

export const config = {
  // Anything with a file extension (`/royhan-resume.pdf`, `/icon.svg`,
  // `/sitemap.xml`) and the root-level metadata routes must reach their real
  // path, not `/en/...` — they are locale-independent.
  matcher: ["/((?!_next/|api/|apple-icon|icon|.*\\..*).*)"],
};
