import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e1b30",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          background: "#ca3500",
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 700,
          fontFamily: "serif",
          marginBottom: 32,
        }}
      >
        L
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        La Voie De L&rsquo;Info
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#ffffffaa",
        }}
      >
        Actualités indépendantes
      </div>
    </div>,
    { ...size }
  );
}
