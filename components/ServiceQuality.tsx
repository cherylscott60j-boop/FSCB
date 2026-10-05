"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";
const BLUE = "#3B5BDB";
const GRAY = "#6B7280";
const FONT = "var(--font-poppins), sans-serif";

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



function BarPanel({
  description,
  rows,
  resultsLabel,
  citation,
}: {
  title?: string;
  description: string;
  rows: Row[];
  resultsLabel: string;
  citation?: string;
}) {
  const max = Math.max(...rows.map((r) => r.pct));
  return (
    <div
      style={{
        background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 16,
        padding: "26px 26px 22px",
      }}
    >
      

      <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65, margin: "0 0 20px" }}>{description}</p>

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

      <Link
        href="/disclosures"
        style={{ display: "inline-block", fontSize: 12.5, fontWeight: 700, color: BLUE, textDecoration: "none", margin: "18px 0 10px" }}
      >
        {resultsLabel} →
      </Link>

      <p style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 10px" }}>{citation}</p>

      <p style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
      
      </p>
    </div>
  );
}

export default function ServiceQuality() {
  return (
    <section style={{ background: "#F4F5F7", padding: "32px 32px 72px", fontFamily: FONT }}>
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
            title="Independent service quality survey results | Personal"
            description="As part of a regulatory requirement, an independent survey was conducted to ask approximately 2000 customers of each of the 17 largest personal current account providers whether they would recommend their provider to friends and family. The results represent the view of customers who took part in the survey."
            rows={PERSONAL_ROWS}
            resultsLabel="See the full personal service quality survey results"
           
          />
          <BarPanel
            title="Independent service quality survey results | Business"
            description="As part of a regulatory requirement, an independent survey was conducted to ask approximately 2100 customers of each of the 17 largest business current account providers whether they would recommend their provider to other small and medium-sized enterprises (SMEs*). The results represent the view of customers who took part in the survey."
            rows={BUSINESS_ROWS}
            resultsLabel="See the full business service quality survey results"
            
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
