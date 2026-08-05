import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTACT_LINKS } from "@/lib/constants";
import {
  LOCALES,
  LOCALE_HREFLANG,
  fill,
  getDictionary,
  isLocale,
  localePath,
} from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: dict.meta.privacyTitle,
    description: dict.meta.privacyDescription,
    alternates: {
      canonical: localePath(locale, "/privacy"),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, "/privacy")]),
      ),
    },
  };
}

/**
 * Deliberately plain, hand-written JSX rather than the MDX pipeline `/work`
 * and `/writing` use: this content has no frontmatter, no date-sorted list,
 * and one fixed shape, so the machinery buys nothing and just adds a second
 * place a locale key could go missing.
 */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const t = dict.privacy;

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {t.lastUpdated}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-fg sm:text-h1">
          {t.pageHeading}
        </h1>
        <p className="mt-4 text-body text-muted-foreground">{t.intro}</p>
      </header>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="mb-2 font-display text-h4 font-semibold text-fg">
            {t.collectHeading}
          </h2>
          <p className="mb-5 text-body text-muted-foreground">{t.collectIntro}</p>

          {/* `table-fixed` with proportional column widths, rather than
              `whitespace-nowrap`, so long item/retention text wraps inside
              its own cell instead of forcing the table wider than the
              article and getting clipped on narrower screens. */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-body">
              <tbody>
                {t.collectTable.map((row) => (
                  <tr key={row.item} className="border-b border-border align-top">
                    <td className="w-[28%] py-3 pr-4 font-mono text-caption tracking-wide text-accent uppercase">
                      {row.item}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.purpose}</td>
                    <td className="w-[22%] py-3 text-caption text-muted-foreground/70">
                      {row.retention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-h4 font-semibold text-fg">
            {t.notCollectedHeading}
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-body text-muted-foreground">
            {t.notCollectedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-h4 font-semibold text-fg">
            {t.thirdPartyHeading}
          </h2>
          <div className="flex flex-col gap-3">
            {t.thirdPartyParagraphs.map((p) => (
              <p key={p} className="text-body leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-h4 font-semibold text-fg">
            {t.choicesHeading}
          </h2>
          <div className="flex flex-col gap-3">
            {t.choicesParagraphs.map((p) => (
              <p key={p} className="text-body leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-h4 font-semibold text-fg">
            {t.contactHeading}
          </h2>
          <p className="text-body leading-relaxed text-muted-foreground">
            {fill(t.contactParagraph, { email: CONTACT_LINKS.email })}
          </p>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="mb-3 font-display text-h4 font-semibold text-fg">
            {t.changesHeading}
          </h2>
          <p className="text-body leading-relaxed text-muted-foreground">
            {t.changesParagraph}
          </p>
        </section>
      </div>
    </article>
  );
}
