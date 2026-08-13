import { LOCALE_HREFLANG, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * Server Component, deliberately not a chat component in behavior — this is
 * the AEO/GEO surface for "Tanya tentang Royhan": the same Q&A pairs offered
 * as suggested prompts in the live widget, written once by hand and shipped
 * as static, crawlable HTML plus FAQPage JSON-LD. An answer engine that
 * never runs the chatbot can still cite these directly.
 *
 * Collapsed by default (native <details>, not JS state) so it adds zero
 * visual height until a reader opens one — the answers are still present in
 * the raw HTML for crawlers, this isn't display:none cloaking.
 */
export function FaqAccordion({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.askRoyhan.faq;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: LOCALE_HREFLANG[locale],
    mainEntity: t.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-label={t.heading} className="border-b border-border px-6 py-6">
      <div className="mx-auto max-w-2xl divide-y divide-border">
        {t.items.map((item) => (
          <details key={item.question} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body text-fg marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="mt-2 text-body text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
