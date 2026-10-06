"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";
const GRAY = "#6B7280";

const TERMS = [
  { years: 30, rate: 6.375 },
  { years: 20, rate: 6.125 },
  { years: 15, rate: 5.625 },
];
const TAX_RATE = 0.011; // example annual property tax, % of price
const INSURANCE_PER_YEAR = 1500; // example homeowners insurance

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function MortgageCalculator() {
  const [price, setPrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [termIdx, setTermIdx] = useState(0);

  const { years, rate } = TERMS[termIdx];
  const down = (price * downPct) / 100;
  const loan = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const principalInterest = (loan * r) / (1 - Math.pow(1 + r, -n));
  const tax = (price * TAX_RATE) / 12;
  const insurance = INSURANCE_PER_YEAR / 12;
  // Example mortgage insurance when the down payment is under 20%.
  const pmi = downPct < 20 ? (loan * 0.005) / 12 : 0;
  const total = principalInterest + tax + insurance + pmi;

  const breakdown: [string, number][] = [
    ["Principal & interest", principalInterest],
    ["Property tax", tax],
    ["Home insurance", insurance],
    ...(pmi ? ([["Mortgage insurance", pmi]] as [string, number][]) : []),
  ];

  return (
    <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
      <div style={{ padding: "36px 36px 32px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: DARK }}>Home price</label>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BLUE }}>{money(price)}</span>
          </div>
          <input type="range" min={100000} max={1500000} step={5000} value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label="Home price" style={{ width: "100%", accentColor: BLUE }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: DARK }}>Down payment</label>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BLUE }}>
              {money(down)} <span style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>({downPct}%)</span>
            </span>
          </div>
          <input type="range" min={3} max={50} step={1} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} aria-label="Down payment percent" style={{ width: "100%", accentColor: BLUE }} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>Loan term</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TERMS.map((t, i) => (
            <button
              key={t.years}
              type="button"
              onClick={() => setTermIdx(i)}
              style={{
                padding: "9px 14px",
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                border: `1.5px solid ${termIdx === i ? BLUE : "rgba(17,24,39,.15)"}`,
                background: termIdx === i ? BLUE : "#fff",
                color: termIdx === i ? "#fff" : DARK,
              }}
            >
              {t.years}-year fixed
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: GRAY, marginTop: 18 }}>
          Loan amount: <strong style={{ color: DARK }}>{money(loan)}</strong> · Example rate: <strong style={{ color: DARK }}>{rate}%</strong>
        </div>
      </div>

      <div style={{ background: BLUE, color: "#fff", padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>Estimated monthly payment</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.1, marginBottom: 20 }}>{money(total)}</div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 8 }}>
          {breakdown.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13.5 }}>
              <span style={{ color: "rgba(255,255,255,.72)" }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{money(v)}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", lineHeight: 1.6, margin: "14px 0 0" }}>
          Illustrative estimate only. Assumes example rates, 1.1% annual property tax and $1,500 a year home insurance. Not a loan offer.
        </p>
      </div>
    </div>
  );
}
