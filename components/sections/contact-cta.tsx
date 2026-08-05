"use client";

import { useState } from "react";
import { CONTACT_LINKS, RESUME_PATH } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { CarvedText } from "@/components/motion/carved-text";
import { MeanderRule } from "@/components/motifs/meander-rule";

const LINK_CLASS =
  "inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 font-mono text-caption tracking-wide text-fg uppercase transition-all duration-150 hover:border-accent hover:text-accent active:scale-95";

export function ContactCta({ dict }: { dict: Dictionary }) {
  const [copied, setCopied] = useState(false);
  const t = dict.contact;

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
      <CarvedText
        as="h2"
        text={t.heading}
        className="max-w-2xl font-display text-h2 font-semibold text-fg"
      />
      <MeanderRule className="max-w-32 text-border-strong" />
      <p className="max-w-md text-body text-muted-foreground">{t.intro}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={handleCopyEmail} className={LINK_CLASS}>
          {copied ? t.copied : t.copyEmail}
        </button>
        <a
          href={CONTACT_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {t.whatsapp}
        </a>
        <a
          href={CONTACT_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {t.linkedin}
        </a>
        {/* Repeated from the hero: this is where a reader who scrolled the whole
            story ends up, and asking them to scroll back for the PDF is the
            kind of friction that loses an application. */}
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {t.resume}
        </a>
      </div>
    </section>
  );
}
