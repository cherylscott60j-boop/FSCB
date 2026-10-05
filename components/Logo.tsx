const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";

export default function Logo({
  height = 36,
  variant = "dark",
}: {
  height?: number;
  variant?: "dark" | "light";
}) {
  const light = variant === "light";
  const mark = light ? "#fff" : "#8C1D25";
  const word = light ? "#fff" : "#111827";
  const sub = light ? "rgba(255,255,255,.6)" : "#6B7280";
  const accent = light ? "#D4AF37" : "#8C1D25";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(height * 0.22), height, flexShrink: 0 }}>
      <svg width={height} height={height} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
        <path d="M20 3l14 5v10c0 9-6 15.5-14 19-8-3.5-14-10-14-19V8l14-5z" stroke={mark} strokeWidth="2.2" />
        <path d="M13 20.5l4.8 4.8L28 14.5" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: Math.round(height * 0.4), letterSpacing: "-.01em", color: word, whiteSpace: "nowrap" }}>
          SAFEGUARD <span style={{ color: accent }}>GLOBAL</span>
        </span>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: Math.max(9, Math.round(height * 0.185)), letterSpacing: ".16em", textTransform: "uppercase", color: sub, marginTop: 1, whiteSpace: "nowrap" }}>
          Investment Bank
        </span>
      </span>
    </span>
  );
}
