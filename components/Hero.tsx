"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="hero-banner">
        <div
          className="hero-banner-bg"
          style={{
            backgroundImage: "url('/Building-Strong-Family-Bonds-and-Healthy-Relationships.jpg')",
          }}
        />
        <div className="hero-banner-scrim" />

        <div className="hero-banner-inner resp-pad mob-hero">
          <div style={{ maxWidth: 620 }}>
            <h1
              className="hero-h1"
              style={{
                fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1.08,
                letterSpacing: "-.03em",
                margin: "0 0 18px",
                color: "#fff",
              }}
            >
              Get more from your<br />global investments
            </h1>

            <p
              className="hero-sub"
              style={{
                fontSize: 17.5,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.88)",
                margin: "0 0 30px",
                maxWidth: 480,
              }}
            >
              Whether you&apos;re opening a personal account or managing an institutional
              portfolio, explore the accounts, rates, and advice built around you.
            </p>

            <Link
              href="/open-account"
              style={{
                background: "#8C1D25",
                color: "#fff",
                fontFamily: "inherit",
                fontSize: 15.5,
                fontWeight: 700,
                padding: "15px 30px",
                borderRadius: 999,
                boxShadow: "0 10px 30px rgba(0,0,0,.28)",
                transition: "all .22s ease",
                display: "inline-block",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.transform = "translateY(-2px)";
                a.style.boxShadow = "0 14px 36px rgba(0,0,0,.34)";
              }}
              onMouseLeave={(e) => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.transform = "";
                a.style.boxShadow = "0 10px 30px rgba(0,0,0,.28)";
              }}
            >
              Discover global banking
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          aria-label="Scroll to explore"
          className="hero-scroll-chevron"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.72, behavior: "smooth" })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* Marquee strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.06)", overflow: "hidden", padding: "14px 0" }}>
        <div className="marquee-track">
          {[0, 1].map((set) => {
            const LOGOS = ["Forbes", "Bloomberg", "Institutional Investor", "Global Finance", "Euromoney"];
            const dot = (k: string) => (
              <span key={k} style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5d4", flexShrink: 0 }} />
            );
            const logoItems = LOGOS.flatMap((name, i) =>
              i < LOGOS.length - 1
                ? [
                    <span key={name} style={{ fontFamily: "var(--font-montserrat),'Libre Franklin',sans-serif", fontWeight: 700, fontSize: 15, color: "#c5ccc7", whiteSpace: "nowrap" }}>{name}</span>,
                    dot(`${set}-dot-${i}`),
                  ]
                : [<span key={name} style={{ fontFamily: "var(--font-montserrat),'Libre Franklin',sans-serif", fontWeight: 700, fontSize: 15, color: "#c5ccc7", whiteSpace: "nowrap" }}>{name}</span>]
            );
            return (
              <div
                key={set}
                aria-hidden={set === 1 ? true : undefined}
                style={{ display: "flex", alignItems: "center", gap: 40, flexShrink: 0, paddingRight: 40 }}
              >
                <span style={{ fontSize: 11, letterSpacing: ".12em", color: "#9aa6a0", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  Trusted by clients in 40+ countries
                </span>
                {dot(`${set}-dot-label`)}
                {logoItems}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
