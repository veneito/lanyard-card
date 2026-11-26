import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "veneito";

// Link-preview image (Discord, iMessage, etc.): white name on black, like the banner.
export default async function Image() {
  // Google Fonts serves a TTF link to clients without a browser user agent.
  const font = await fetch("https://fonts.googleapis.com/css2?family=Unbounded:wght@500")
    .then((r) => r.text())
    .then((css) => css.match(/url\(([^)]+\.ttf)\)/)?.[1])
    .then((url) => (url ? fetch(url).then((r) => r.arrayBuffer()) : null))
    .catch(() => null);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ fontSize: 140, fontFamily: font ? "Unbounded" : "sans-serif", letterSpacing: 6 }}>veneito</div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.45)", marginTop: 24 }}>rust apps · homelab · roblox dev</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Unbounded", data: font, weight: 500 }] : [] }
  );
}
