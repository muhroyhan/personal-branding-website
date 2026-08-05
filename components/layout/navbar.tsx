"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logomark } from "@/components/icons/logomark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ACT_ANCHORS, RESUME_PATH } from "@/lib/constants";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: localePath(locale, `/#${ACT_ANCHORS.beginnings}`), label: dict.nav.story },
    { href: localePath(locale, "/#work"), label: dict.nav.work },
    { href: localePath(locale, "/writing"), label: dict.nav.writing },
    { href: localePath(locale, "/#stack"), label: dict.nav.stack },
    { href: localePath(locale, "/#contact"), label: dict.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-border bg-bg/90 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
        >
          <Logomark className="h-5 w-5 text-muted-foreground" />
          royhan<span className="text-accent">.</span>
        </Link>

        <ul className="hidden items-center gap-7 font-mono text-caption tracking-wide text-muted-foreground uppercase lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-fg">
                {link.label}
              </Link>
            </li>
          ))}
          {/* Kept out of `navLinks` on purpose: it leaves the site for a PDF,
              so it gets the accent treatment rather than reading as another
              in-page anchor. */}
          <li>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-accent/60 px-3 py-1.5 text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              {dict.nav.resume}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              aria-hidden
              className={`h-px w-5 bg-fg transition-transform duration-200 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              aria-hidden
              className={`h-px w-5 bg-fg transition-transform duration-200 ${menuOpen ? "translate-y-[-3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`grid border-t transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          menuOpen ? "grid-rows-[1fr] border-border" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        {/* The collapsing element carries overflow-hidden and no padding of its
            own — padding here would keep the closed menu ~32px tall and leave a
            link visible under the header. Spacing lives on the inner list. */}
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 px-6 py-4 font-mono text-caption tracking-wide text-muted-foreground uppercase">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-block rounded-md border border-accent/60 px-3 py-1.5 text-accent"
              >
                {dict.nav.resume}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
