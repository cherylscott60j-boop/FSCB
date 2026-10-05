"use client";

import { useEffect, useRef } from "react";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

interface Result {
  name: string;
  pct: number;
  ours?: boolean;
}

const PERSONAL_RESULTS: Result[] = [
  { name: "Safeguard Global", pct: 83, ours: true },
  { name: "Meridian Trust", pct: 79 },
  { name: "Kestrel Financial", pct: 76 },
  { name: "Union Federal", pct: 75 },
  { name: "Heritage National", pct: 68 },
  { name: "Cascade Bank", pct: 60 },
];

const BUSINESS_RESULTS: Result[] = [
  { name: "Safeguard Global", pct: 85, ours: true },
  { name: "Meridian Trust", pct: 83 },
  { name: "Union Federal", pct: 79 },
  { name: "Kestrel Financial", pct: 70 },
  { name: "Heritage National", pct: 69 },
  { name: "Cascade Bank", pct: 63 },
];

function Panel({ title, blurb, results }: { title: string; blurb: string; results: Result[] }) {
  const max = Math.max(...results.map((r) => r.pct));
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 22, padding: "30px 30px 26px" }}>
      <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.55, margin: "0 0 24px", maxWidth: 440 }}>{blurb}</p>

      <div role="table" aria-label={title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((r, i) => (
          <div role="row" key={r.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              role="cell"
              style={{
                flex: "none",
                width: 148,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13.5,
                fontWeight: r.ours ? 700 : 500,
                color: r.ours ? "#111827" : "#374151",
              }}
            >
              <span style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 12, width: 14, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
              {r.ours && (
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 9.5,
                    fontWeight: 800,
                    letterSpacing: ".04em",
                    color: "#8C1D25",
                    background: "rgba(140,29,37,.1)",
                    borderRadius: 5,
                    padding: "2px 5px",
                  }}
                >
                  YOU
                </span>
              )}
            </div>

            <div role="cell" style={{ flex: 1, height: 18, borderRadius: 9, background: "rgba(17,24,39,.055)", overflow: "hidden" }}>
              <div
                className="svcq-bar"
                data-width={`${(r.pct / max) * 100}%`}
                style={{
                  width: 0,
                  height: "100%",
                  background: r.ours ? "#8C1D25" : "#9CA3AF",
                  borderRadius: "0 4px 4px 0",
                }}
              />
            </div>

            <div role="cell" style={{ flex: "none", width: 38, textAlign: "right", fontSize: 13.5, fontWeight: r.ours ? 800 : 600, color: r.ours ? "#8C1D25" : "#374151" }}>
              {r.pct}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceQuality() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = el.querySelectorAll<HTMLElement>(".svcq-bar");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            bars.forEach((b, i) => {
              setTimeout(() => { b.style.transition = "width .7s cubic-bezier(.16,.84,.44,1)"; b.style.width = b.dataset.width || "0%"; }, i * 40);
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section style={{ background: "#F8F9FA", borderTop: "1px solid rgba(17,24,39,.05)", borderBottom: "1px solid rgba(17,24,39,.05)" }}>
      <div className="resp-pad mob-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px" }} ref={ref}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <span style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#8C1D25", fontWeight: 700 }}>
            Our Service Quality
          </span>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "14px 0 0" }}>
            Independent survey results
          </h2>
        </div>

        <div className="g-2col-even" style={{ gap: 24 }}>
          <Panel
            title="Personal & Wealth Banking"
            blurb="Share of customers who said they would recommend their provider to friends and family."
            results={PERSONAL_RESULTS}
          />
          <Panel
            title="Business & Institutional Banking"
            blurb="Share of small and mid-sized business clients who said they would recommend their provider."
            results={BUSINESS_RESULTS}
          />
        </div>

        <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, margin: "28px auto 0", maxWidth: 760, textAlign: "center" }}>
          Independent customer survey conducted January–June 2026 among clients of the largest providers in each
          category. Results reflect overall satisfaction with service quality.
        </p>
      </div>
    </section>
  );
}
