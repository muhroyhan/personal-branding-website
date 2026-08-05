"use client";

import Link from "next/link";
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
              className={
                isActive
                  ? "text-accent"
                  : "text-muted-foreground transition-colors hover:text-fg"
              }
            >
              {LOCALE_LABELS[target]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
