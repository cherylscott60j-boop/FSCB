const NAVY = "#0D1B4C";
const RED = "#E31E24";

export default function Logo({
  variant = "dark",
  height = 38,
}: {
  variant?: "dark" | "light";
  height?: number;
}) {
  const textColor = variant === "light" ? "#fff" : NAVY;
  const subColor = variant === "light" ? "rgba(255,255,255,.72)" : "#6B7280";
  const iconSize = height * 0.84;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: height * 0.26 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
        <rect width="40" height="40" rx="10" fill={RED} />
        <path
          d="M9 24c3-5 7-5 10 0s7 5 10 0"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M9 16c3-5 7-5 10 0s7 5 10 0"
          stroke="#fff"
          strokeOpacity=".55"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
        <span
          style={{
            fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: height * 0.4,
            color: textColor,
            letterSpacing: "-.01em",
            whiteSpace: "nowrap",
          }}
        >
          SAFEGUARD GLOBAL
        </span>
        <span
          style={{
            fontSize: height * 0.19,
            fontWeight: 600,
            letterSpacing: ".12em",
            color: subColor,
            whiteSpace: "nowrap",
          }}
        >
          INVESTMENT BANK
        </span>
      </span>
    </span>
  );
}
