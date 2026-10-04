"use client";

const NAVY = "#0D1B4C";
const RED = "#E31E24";
const BLUE = "#3B5BDB";
const GRAY = "#6B7280";
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";

type Row = { label?: string; pct: number; highlight?: boolean };

const PERSONAL_ROWS: Row[] = [
  { pct: 82 },
  { pct: 78 },
  { pct: 75 },
  { pct: 70 },
  { pct: 66 },
  { label: "Safeguard", pct: 48, highlight: true },
];

const BUSINESS_ROWS: Row[] = [
  { pct: 85 },
  { pct: 80 },
  { pct: 74 },
  { pct: 69 },
  { label: "Safeguard", pct: 55, highlight: true },
];

function SampleBadge() {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.4)",
        borderRadius: 999, padding: "3px 10px", fontSize: 10.5, fontWeight: 800,
        letterSpacing: ".04em", color: "#B45309", textTransform: "uppercase",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M12 9v4m0 4h.01M12 3l9.5 16.5H2.5L12 3z" />
      </svg>
      Sample data
    </span>
  );
}

function BarPanel({ title, blurb, rows }: { title: string; blurb: string; rows: Row[] }) {
  const max = Math.max(...rows.map((r) => r.pct));
  return (
    <div
      style={{
        background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 16,
        padding: "26px 26px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: NAVY, margin: 0 }}>{title}</h3>
        <SampleBadge />
      </div>
      <p style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.6, margin: "0 0 20px" }}>{blurb}</p>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Overall service quality</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 14, fontSize: 11.5, color: GRAY, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
            <span
              style={{
                width: 84, fontSize: 12.5, fontWeight: r.highlight ? 800 : 500,
                color: r.highlight ? RED : GRAY, flexShrink: 0,
              }}
            >
              {r.label ?? ""}
            </span>
            <div style={{ flex: 1, background: "rgba(17,24,39,.06)", borderRadius: 4, height: 14, position: "relative" }}>
              <div
                style={{
                  width: `${(r.pct / max) * 100}%`, height: "100%", borderRadius: 4,
                  background: r.highlight ? RED : BLUE,
                }}
              />
            </div>
            <span style={{ width: 34, fontSize: 11.5, color: GRAY, textAlign: "right", flexShrink: 0 }}>
              {r.pct}%
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6, marginTop: 18 }}>
        Illustrative placeholder chart — not a real survey. Replace with real independent survey
        results, methodology, and source before publishing.
      </p>
    </div>
  );
}

export default function ServiceQuality() {
  return (
    <section style={{ background: "#fff", padding: "72px 32px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3vw, 28px)", color: NAVY,
            textAlign: "center", margin: "0 0 32px", letterSpacing: "-.01em",
          }}
        >
          Our service quality
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="sg-2col">
          <BarPanel
            title="Service quality | Personal"
            blurb="If and when a real independent survey of personal account providers is conducted, summarize its methodology and sample size here."
            rows={PERSONAL_ROWS}
          />
          <BarPanel
            title="Service quality | Business"
            blurb="If and when a real independent survey of business account providers is conducted, summarize its methodology and sample size here."
            rows={BUSINESS_ROWS}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .sg-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
