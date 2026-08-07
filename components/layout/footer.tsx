import Link from "next/link";
import { ACT_ANCHORS, CONTACT_LINKS, REPO_URL, RESUME_PATH } from "@/lib/constants";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { APP_VERSION } from "@/lib/version";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const footerLinks = [
    { href: localePath(locale, `/#${ACT_ANCHORS.beginnings}`), label: dict.nav.story },
    { href: localePath(locale, "/#work"), label: dict.nav.work },
    { href: localePath(locale, "/writing"), label: dict.nav.writing },
    { href: localePath(locale, "/#stack"), label: dict.nav.stack },
    { href: localePath(locale, "/#contact"), label: dict.nav.contact },
  ];

  const contactFooterLinks = [
    { href: `mailto:${CONTACT_LINKS.email}`, label: dict.footer.email },
    { href: CONTACT_LINKS.whatsapp, label: dict.footer.whatsapp },
    { href: CONTACT_LINKS.linkedin, label: dict.footer.linkedin },
    { href: CONTACT_LINKS.github, label: dict.footer.github },
    { href: RESUME_PATH, label: dict.footer.resume },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="flex items-center gap-3 font-mono text-caption text-muted-foreground">
            © {year} {dict.footer.rights}
            <span aria-hidden className="text-border-strong">
              ·
            </span>
            {/* Kept out of the main link row above and off the primary nav
                entirely — it's a disclosure, not something worth competing
                with Story/Work/Writing for a recruiter's attention. */}
            <Link href={localePath(locale, "/privacy")} className="transition-colors hover:text-fg">
              {dict.footer.privacy}
            </Link>
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-caption tracking-wide text-muted-foreground uppercase">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-caption tracking-wide text-muted-foreground uppercase sm:justify-start">
            {contactFooterLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.href.startsWith("http") || link.href === RESUME_PATH ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Second switcher down here for the reader who got all the way to the
              bottom in the wrong language and would otherwise have to scroll
              back up to the navbar to change it. */}
          <div className="flex items-center gap-4">
            <Link
              href={`${REPO_URL}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-caption tracking-wide text-muted-foreground transition-colors hover:text-fg"
            >
              v{APP_VERSION}
            </Link>
            <LanguageSwitcher locale={locale} className="uppercase" />
          </div>
        </div>
      </div>
    </footer>
  );
}
