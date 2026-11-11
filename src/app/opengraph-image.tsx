import { ImageResponse } from "next/og";

export const alt = "NMN.DEV: Digital Experiences. Engineered to Perform.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0D10",
          color: "#F5F5F0",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="56" fill="#0B0D10" stroke="#C6F55A" strokeWidth="4" />
            <path d="M24 78V44L42 78V44M50 78V44L60 62L70 44V78M78 78V44L96 78V44" stroke="#F5F5F0" strokeWidth="5" />
            <path d="M60 58.5L64.5 64L60 69.5L55.5 64Z" fill="#C6F55A" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>NMN.DEV</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          <span>Digital Experiences.</span>
          <span style={{ color: "#C6F55A" }}>Engineered to Perform.</span>
        </div>
        <div style={{ fontSize: 28, color: "#92979F" }}>Websites · Custom software · Web applications</div>
      </div>
    ),
    size,
  );
}
