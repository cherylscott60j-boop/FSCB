"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";

const YEARS = [1, 2, 3, 5, 10];
const EXAMPLE_APY = 3.75;

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function SavingsCalculator() {
  const [start, setStart] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(3);

  // Compound monthly at the monthly-equivalent rate of the example APY.
  const r = Math.pow(1 + EXAMPLE_APY / 100, 1 / 12) - 1;
  const n = years * 12;
  const balance = start * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
  const paidIn = start + monthly * n;

  const slider = (label: string, value: number, set: (v: number) => void, max: number, step: number) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{label}</label>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BLUE }}>{money(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={label}
        style={{ width: "100%", accentColor: BLUE }}
      />
    </div>
  );

  return (
    <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
      <div style={{ padding: "36px 36px 32px" }}>
        {slider("Starting amount", start, setStart, 25000, 250)}
        {slider("Monthly deposit", monthly, setMonthly, 2000, 25)}

        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>For how long?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYears(y)}
              style={{
                padding: "9px 14px",
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                border: `1.5px solid ${years === y ? BLUE : "rgba(17,24,39,.15)"}`,
                background: years === y ? BLUE : "#fff",
                color: years === y ? "#fff" : DARK,
              }}
            >
              {y} yr{y > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: BLUE, color: "#fff", padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>Example balance after {years} year{years > 1 ? "s" : ""}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.1, marginBottom: 24 }}>{money(balance)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 20, fontSize: 13 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>You pay in</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{money(paidIn)}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>Interest earned</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{money(balance - paidIn)}</div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", lineHeight: 1.6, margin: "20px 0 0" }}>
          Illustrative figures only, assuming a fixed {EXAMPLE_APY}% APY. Rates can change.
        </p>
      </div>
    </div>
  );
}
