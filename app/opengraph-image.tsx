import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
            fontSize: 60,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.2,
            maxWidth: 950,
          }}
        >
          I design payroll systems that don&apos;t get tax calculations wrong.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8b96a3", marginTop: 32 }}>
          Tech Lead &amp; Senior Software Engineer
        </div>
      </div>
    ),
    { ...size },
  );
}
