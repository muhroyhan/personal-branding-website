"use client";

import { useState } from "react";
import { CONTACT_LINKS } from "@/lib/constants";

const LINK_CLASS =
  "inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 font-mono text-caption tracking-wide text-fg uppercase transition-all duration-150 hover:border-accent hover:text-accent active:scale-95";

export function ContactCta() {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (unsupported browser/context) — the
      // mailto/WhatsApp/LinkedIn links below still work as a fallback.
    }
  }

  return (
    <section
      id="contact"
      className="flex flex-col items-center gap-8 border-b border-border px-6 py-16 text-center sm:py-20 lg:py-24"
    >
      <h2 className="font-display text-h2 font-semibold text-fg">
        Want the next chapter written on your team?
      </h2>
      <p className="max-w-md text-body text-muted-foreground">
        Open to Tech Lead / Senior Software Engineer roles, remote-first. Reach out
        directly — no forms.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={handleCopyEmail} className={LINK_CLASS}>
          {copied ? "Copied!" : "Copy email"}
        </button>
        <a
          href={CONTACT_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          WhatsApp
        </a>
        <a
          href={CONTACT_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
