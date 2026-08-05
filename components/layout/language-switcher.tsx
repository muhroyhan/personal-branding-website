"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_HREFLANG,
  LOCALE_LABELS,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";

/**
 * Must render *inside* the Link (that's how `useLinkStatus` finds the
 * navigation it belongs to) — it can't be read from the parent, since both
 * locale links exist in the DOM at once but only the clicked one is pending.
 * `prefetch={false}` on the parent Link means this is the only signal a click
 * actually did something before the new page shows up.
 */
function LocaleLabel({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <span
        aria-hidden
        className={`h-2.5 w-2.5 animate-spin rounded-full border border-current border-t-transparent transition-opacity ${
          pending ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

/**
 * Switches locale without leaving the page. `usePathname` returns the URL as
 * the browser sees it (`/work`, `/id/work`) rather than the rewritten internal
 * path, which is exactly what `switchLocalePath` needs — so a reader halfway
 * through a case study stays in that case study.
 *
 * Rendered as real links, not a button with an onClick: a recruiter who
 * middle-clicks "ID" should get the Indonesian page in a new tab, and a
 * crawler should be able to follow it.
 */
export function LanguageSwitcher({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();

  // Set before the click's navigation fires, so the very next request already
  // carries the new choice. Without this, switching id → en would land on the
  // bare path while the cookie still said "id" — middleware's geo-persistence
  // check would read that stale cookie and bounce the visitor straight back
  // to /id, and the switcher would look broken.
  function persistChoice(target: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`;
  }

  return (
    <div
      className={`flex items-center gap-1.5 font-mono text-caption tracking-wide ${className}`}
    >
      {LOCALES.map((target, index) => {
        const isActive = target === locale;
        return (
          <span key={target} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden className="text-border-strong">
                /
              </span>
            ) : null}
            <Link
              href={switchLocalePath(pathname, target)}
              hrefLang={LOCALE_HREFLANG[target]}
              aria-current={isActive ? "true" : undefined}
              onClick={() => persistChoice(target)}
              // Next prefetches this link on mount, while the cookie still
              // reflects the *current* locale — middleware redirects that
              // prefetch straight back to the current page, and the router
              // caches the redirect. Without disabling prefetch, the click
              // above updates the cookie too late to matter: it reuses the
              // stale cached redirect instead of issuing a fresh request.
              prefetch={false}
              className={
                isActive
                  ? "text-accent"
                  : "text-muted-foreground transition-colors hover:text-fg"
              }
            >
              <LocaleLabel>{LOCALE_LABELS[target]}</LocaleLabel>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
