import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#07091a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#E68369" }}>
          JustHustle
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 16 }}>
          AI-powered Google reviews for Indian businesses
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            color: "#E68369",
            border: "1px solid #E68369",
            padding: "8px 24px",
            borderRadius: 999,
          }}
        >
          Start free — ₹599/month
        </div>
      </div>
    )
  );
}
