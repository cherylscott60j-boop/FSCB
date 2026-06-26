"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="hero-split">
        {/* Left — dark panel with copy */}
        <div className="hero-left">
          <div style={{ maxWidth: 520 }}>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", display: "inline-block" }} />
              Banking Built For Your Community
            </div>

            <h1
              className="hero-h1"
              style={{
                fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
                fontWeight: 900,
                fontSize: 52,
                lineHeight: 1.06,
                letterSpacing: "-.03em",
                margin: "0 0 18px",
                color: "#fff",
              }}
            >
              Life&apos;s Little Moments<br />
              Are Just an{" "}
              <span style={{ color: "#D4AF37" }}>FSCB<br />Account Away</span>
            </h1>

            <p
              className="hero-sub"
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "rgba(255,255,255,.82)",
                margin: "0 0 32px",
              }}
            >
              Personalized service, community roots, and modern digital tools —
              right where you live.
            </p>

            <div style={{ display: "flex", gap: 13, flexWrap: "wrap" }}>
              <Link
                href="/open-account"
                style={{
                  background: "#D4AF37",
                  color: "#4A0E14",
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 28px",
                  borderRadius: 12,
                  boxShadow: "0 6px 20px rgba(212,175,55,.4)",
                  transition: "all .22s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "translateY(-2px)";
                  a.style.boxShadow = "0 10px 28px rgba(212,175,55,.52)";
                }}
                onMouseLeave={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "";
                  a.style.boxShadow = "0 6px 20px rgba(212,175,55,.4)";
                }}
              >
                Open an Account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                href="/about/story"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,.28)",
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "14px 24px",
                  borderRadius: 12,
                  transition: "all .2s ease",
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.1)";
                }}
              >
                Learn More
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hero-badges" style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30, flexWrap: "wrap" }}>
              {[
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                  label: "256-bit encryption",
                },
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  ),
                  label: "FDIC insured to $250K",
                },
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37">
                      <path d="M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" />
                    </svg>
                  ),
                  label: "4.9 / 5 · 12k reviews",
                },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.75)", fontSize: 12.5, fontWeight: 500 }}
                >
                  {icon}
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — full image */}
        <div
          className="hero-right"
          style={{
            backgroundImage: "url('/Building-Strong-Family-Bonds-and-Healthy-Relationships.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </section>

      {/* Marquee strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.06)", overflow: "hidden", padding: "14px 0" }}>
        <div className="marquee-track">
          {[0, 1].map((set) => {
            const LOGOS = ["Forbes", "Bankrate", "U.S. News", "ICBA", "ABA"];
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
                  Trusted by 17,000+ community members
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
