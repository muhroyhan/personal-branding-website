"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logomark } from "@/components/icons/logomark";

const NAV_LINKS = [
  { href: "/#act-beginnings", label: "Story" },
  { href: "/#work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/#stack", label: "Stack" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
        >
          <Logomark className="h-5 w-5 text-muted-foreground" />
          royhan<span className="text-accent">.</span>
        </Link>

        <ul className="hidden items-center gap-8 font-mono text-caption tracking-wide text-muted-foreground uppercase sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-fg">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
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
      </nav>

      <div
        id="mobile-nav-menu"
        className={`grid border-t transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none sm:hidden ${
          menuOpen ? "grid-rows-[1fr] border-border" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        {/* The collapsing element carries overflow-hidden and no padding of its
            own — padding here would keep the closed menu ~32px tall and leave a
            link visible under the header. Spacing lives on the inner list. */}
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 px-6 py-4 font-mono text-caption tracking-wide text-muted-foreground uppercase">
            {NAV_LINKS.map((link) => (
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
          </ul>
        </div>
      </div>
    </header>
  );
}
