"use client";

import Link from "next/link";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

export default function ExtendedHours() {
  return (
    <section className="resp-pad mob-px" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px 20px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(17,24,39,.07)",
          borderRadius: 22,
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, margin: "0 0 8px" }}>
            Advisors available evenings &amp; Saturdays
          </h3>
          <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            Markets don&apos;t keep office hours, so neither do we. Branches now open Saturdays
            9:30am–4pm — find your local hours below.
          </p>
        </div>

        <Link
          href="/about/contact"
          style={{
            flexShrink: 0,
            background: "#8C1D25",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: 14.5,
            fontWeight: 700,
            padding: "13px 26px",
            borderRadius: 999,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background .2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6B151C"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#8C1D25"; }}
        >
          Branch hours
        </Link>
      </div>
    </section>
  );
}
