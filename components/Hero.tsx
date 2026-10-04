"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";

function PhotoPlaceholder({ label, tint }: { label: string; tint: "blue" | "red" }) {
  return (
    <div
      style={{
        border: "2px dashed rgba(255,255,255,.4)",
        borderRadius: 14,
        background: tint === "blue" ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        height: "100%",
        minHeight: 220,
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(255,255,255,.65)", fontWeight: 500, maxWidth: 160, lineHeight: 1.5 }}>
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(115deg, ${NAVY} 0%, ${NAVY} 62%, ${RED} 62%, ${RED} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "72px 32px 96px",
          display: "grid",
          gridTemplateColumns: "220px 1fr 220px",
          gap: 32,
          alignItems: "center",
        }}
        className="sg-hero-grid"
      >
        {/* Left photo placeholder */}
        <div className="sg-hero-side">
          <PhotoPlaceholder label="[Photo: smiling customer, cut-out]" tint="blue" />
        </div>

        {/* Center copy */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <h1
            style={{
              fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px, 4.4vw, 46px)",
              lineHeight: 1.08,
              letterSpacing: "-.02em",
              color: "#fff",
              margin: "0 0 18px",
            }}
          >
            Grow more with banking<br />and investing in one place
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(255,255,255,.82)",
              margin: "0 auto 30px",
              maxWidth: 480,
            }}
          >
            Whether you&apos;re opening your first account, switching banks, or starting to
            invest, see how we can help you move forward. Eligibility criteria and T&amp;Cs apply.
          </p>
          <Link
            href="/open-account"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: RED,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "13px 30px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(227,30,36,.35)",
            }}
          >
            Discover our accounts
          </Link>

          {/* scroll chevron */}
          <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Right photo placeholder */}
        <div className="sg-hero-side">
          <PhotoPlaceholder label="[Photo: branch colleagues, cut-out]" tint="red" />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sg-hero-grid { grid-template-columns: 1fr !important; }
          .sg-hero-side { display: none; }
        }
      `}</style>
    </section>
  );
}
