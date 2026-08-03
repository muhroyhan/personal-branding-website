import Link from "next/link";
import { CONTACT_LINKS } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

const CONTACT_FOOTER_LINKS = [
  { href: `mailto:${CONTACT_LINKS.email}`, label: "Email" },
  { href: CONTACT_LINKS.whatsapp, label: "WhatsApp" },
  { href: CONTACT_LINKS.linkedin, label: "LinkedIn" },
  { href: CONTACT_LINKS.github, label: "GitHub" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-mono text-caption text-muted-foreground">
            © {year} Muhammad Royhan
          </p>
          <ul className="flex items-center gap-6 font-mono text-caption tracking-wide text-muted-foreground uppercase">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-caption tracking-wide text-muted-foreground uppercase sm:justify-start">
          {CONTACT_FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
