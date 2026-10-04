"use client";

import Link from "next/link";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

export default function SwitchCTA() {
  return (
    <section className="resp-pad mob-px" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(17,24,39,.07)",
          borderRadius: 22,
          padding: "36px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 580 }}>
          <div style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#8C1D25", fontWeight: 700, marginBottom: 10 }}>
            Ready to switch banks?
          </div>
          <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(20px, 3vw, 27px)", lineHeight: 1.2, margin: "0 0 10px" }}>
            Switching to Safeguard Global is fast and easy
          </h3>
          <p style={{ fontSize: 15.5, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            Open your account, fill in our switching form, and we&apos;ll move your direct
            deposits, bill pay, and recurring transfers for you.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1.5px solid #111827",
              borderRadius: 10,
              padding: "10px 14px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 10.5, letterSpacing: ".04em", lineHeight: 1.3 }}>
              SWITCH
              <br />
              GUARANTEE
            </span>
          </div>

          <Link
            href="/personal/checking"
            style={{
              background: "#8C1D25",
              color: "#fff",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background .2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6B151C"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#8C1D25"; }}
          >
            Switch Personal Account
          </Link>
        </div>
      </div>
    </section>
  );
}
