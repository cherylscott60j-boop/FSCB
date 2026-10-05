"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";

const RETURNS = [3, 5, 7];

const money = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function RetirementCalculator() {
  const [age, setAge] = useState(45);
  const [retireAge, setRetireAge] = useState(65);
  const [saved, setSaved] = useState(250000);
  const [monthly, setMonthly] = useState(1500);
  const [ret, setRet] = useState(5);

  const years = Math.max(retireAge - age, 0);
  const r = Math.pow(1 + ret / 100, 1 / 12) - 1;
  const n = years * 12;
  const total = saved * Math.pow(1 + r, n) + (n ? monthly * ((Math.pow(1 + r, n) - 1) / r) : 0);
  // A common rule of thumb: draw about 4% of savings in the first year of retirement.
  const income = (total * 0.04) / 12;

  const row = (label: string, display: string, input: React.ReactNode) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{label}</label>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: BLUE }}>{display}</span>
      </div>
      {input}
    </div>
  );

  const range = (value: number, set: (v: number) => void, min: number, max: number, step: number, label: string) => (
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label} style={{ width: "100%", accentColor: BLUE }} />
  );

  return (
    <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
      <div style={{ padding: "34px 36px 30px" }}>
        {row("Your age", `${age}`, range(age, (v) => { setAge(v); if (v >= retireAge) setRetireAge(Math.min(v + 1, 75)); }, 25, 74, 1, "Your age"))}
        {row("Retirement age", `${retireAge}`, range(retireAge, (v) => setRetireAge(Math.max(v, age + 1)), 50, 75, 1, "Retirement age"))}
        {row("Saved so far", money(saved), range(saved, setSaved, 0, 3000000, 10000, "Saved so far"))}
        {row("Monthly contribution", money(monthly), range(monthly, setMonthly, 0, 10000, 100, "Monthly contribution"))}

        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>Assumed annual return</div>
        <div style={{ display: "flex", gap: 8 }}>
          {RETURNS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setRet(v)}
              style={{
                padding: "9px 16px",
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                border: `1.5px solid ${ret === v ? BLUE : "rgba(17,24,39,.15)"}`,
                background: ret === v ? BLUE : "#fff",
                color: ret === v ? "#fff" : DARK,
              }}
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: BLUE, color: "#fff", padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>Projected savings at {retireAge}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, lineHeight: 1.1, marginBottom: 22 }}>{money(total)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 18, fontSize: 13 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>Years to retirement</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{years}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,.65)" }}>Est. monthly income</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{money(income)}</div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", lineHeight: 1.6, margin: "18px 0 0" }}>
          Illustration only, in today&apos;s money before tax and fees. Returns are not guaranteed and the value of investments can go down as well as up. Income assumes a 4% first-year withdrawal.
        </p>
      </div>
    </div>
  );
}
