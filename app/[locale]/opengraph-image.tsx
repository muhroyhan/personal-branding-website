import { ImageResponse } from "next/og";
import { LOCALES, getDictionary, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * One card per locale. A link shared into an Indonesian group chat previewing
 * an English headline is a small thing, but it's the first impression and it
 * costs nothing to get right.
 *
 * The proof row is here for the same reason it's in the hero: a shared link is
 * often all a recruiter sees before deciding whether to open it.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0f14",
          color: "#e8ecef",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#d4a24e",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Muhammad Royhan
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.2,
            maxWidth: 980,
          }}
        >
          {dict.hero.headline}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8b96a3", marginTop: 28 }}>
          {dict.hero.role}
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 22,
            color: "#6f7b89",
            marginTop: 36,
            paddingTop: 28,
            borderTop: "1px solid #2a323c",
          }}
        >
          {dict.hero.proof.map((fact, i) => (
            <div key={fact} style={{ display: "flex", gap: 20 }}>
              {i > 0 ? <span style={{ color: "#2a323c" }}>·</span> : null}
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
