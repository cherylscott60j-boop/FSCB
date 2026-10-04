"use client";

import Link from "next/link";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

export default function ProtectionBanner() {
  return (
    <section className="resp-pad mob-px" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <div
            style={{
              flex: "none",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(140,29,37,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8C1D25",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l8 4v6c0 5.5-3.5 9.5-8 10-4.5-.5-8-4.5-8-10V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, margin: "0 0 6px" }}>
              Protecting your money
            </h3>
            <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
              Your eligible deposits are protected up to $250,000 by the FDIC, and your eligible
              securities are protected up to $500,000 by SIPC.
            </p>
          </div>
        </div>

        <Link
          href="/about/story"
          className="underline-hover"
          style={{ color: "#8C1D25", fontWeight: 600, fontSize: 14.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}
        >
          How we protect you
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
