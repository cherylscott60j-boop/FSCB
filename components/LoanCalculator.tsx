"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const NAVY = "#0800FF";
const DARK = "#111827";
const GRAY = "#6B7280";

const TERMS = [12, 24, 36, 48, 60, 72, 84];
const EXAMPLE_APR = 9.9;

const money = (n: number, cents = false) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents ? 2 : 0 });

export default function LoanCalculator() {
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(36);

  const r = EXAMPLE_APR / 100 / 12;
  const monthly = (amount * r) / (1 - Math.pow(1 + r, -term));
  const total = monthly * term;

  return (
    <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
      <div style={{ padding: "36px 36px 32px" }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>
          How much would you like to borrow?
        </label>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: NAVY, marginBottom: 12 }}>{money(amount)}</div>
        <input
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          aria-label="Loan amount"
          style={{ width: "100%", accentColor: NAVY }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY, marginTop: 4 }}>
          <span>$1,000</span>
          <span>$50,000</span>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, margin: "28px 0 10px" }}>Over how long?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TERMS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTerm(t)}
              style={{
                padding: "9px 14px",
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                border: `1.5px solid ${term === t ? NAVY : "rgba(17,24,39,.15)"}`,
                background: term === t ? NAVY : "#fff",
                color: term === t ? "#fff" : DARK,
              }}
            >
              {t / 12} yr{t > 12 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: NAVY, color: "#fff", padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>Example monthly payment</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.1, marginBottom: 24 }}>{money(monthly, true)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 20, fontSize: 13 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>Example APR</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{EXAMPLE_APR}%</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>Total repayable</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{money(total)}</div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", lineHeight: 1.6, margin: "20px 0 0" }}>
          Illustrative figures only, calculated at a fixed {EXAMPLE_APR}% APR. This is not a loan offer.
        </p>
      </div>
    </div>
  );
}
