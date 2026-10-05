"use client";

import Link from "next/link";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

export default function ScamShield() {
  return (
    <section className="resp-pad mob-px" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#8C1D25,#6B151C)",
          borderRadius: 22,
          padding: "36px 40px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 85% 20%, rgba(212,175,55,.2), transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", position: "relative" }}>
          <div
            style={{
              flex: "none",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(212,175,55,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4AF37",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M9 9l1.8 1.8L15 7" />
            </svg>
          </div>
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, color: "#fff", margin: "0 0 6px" }}>
              Safeguard Global Scam Shield, powered by AI
            </h3>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.78)", lineHeight: 1.6, margin: 0 }}>
              We&apos;re piloting an AI-powered scam checker to help you spot fraud before you send money.
              The checker may miss things — if in doubt, don&apos;t act without delay, contact us directly.
            </p>
          </div>
        </div>

        <Link
          href="/about/story"
          style={{
            flexShrink: 0,
            position: "relative",
            background: "#D4AF37",
            color: "#4A0E14",
            fontFamily: "inherit",
            fontSize: 14.5,
            fontWeight: 700,
            padding: "13px 26px",
            borderRadius: 999,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "transform .2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}
        >
          Discover more
        </Link>
      </div>
    </section>
  );
}
