"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";
const BLUE = "#1D3FAE";
const GRAY = "#6B7280";
const FONT = "var(--font-poppins), sans-serif";

type WhyCard = {
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon?: React.ReactNode;
  image?: string;
};

const WHY_CARDS: WhyCard[] = [
  {
    title: "Relationship Banking",
    desc: "Real people who know your name, your goals, and your plans — from your first account to your retirement.",
    cta: "Come and see us",
    href: "/about/contact",
    image: "/personal-service-icon.webp",
  },
  {
    title: "Investing made simple",
    desc: "Start from £100,000, choose a ready-made portfolio, and review with a financial advisor for free in branch.",
    cta: "Find out more",
    href: "/financial/retirement",
    image: "/opening-hours-icon.webp",
  },
  {
    title: "Your pocket-sized bank",
    desc: "Log in with your face or fingerprint, manage accounts, invest, and track spending with a tap.",
    cta: "Explore our app",
    href: "/personal/online-banking",
    image: "/app-icon-1.webp",
  },
];

export default function WhySafeguard() {
  return (
    <section style={{ background: "#F4F5F7", padding: "16px 32px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3vw, 28px)", color: NAVY,
            textAlign: "center", margin: "0 0 32px", letterSpacing: "-.01em",
          }}
        >
          Why Safeguard Global?
        </h2>

        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(17,24,39,.08)",
            borderRadius: 24,
            boxShadow: "0 12px 40px rgba(13,27,76,.07)",
            padding: "80px 44px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }} className="sg-3col sg-big-card">
            {WHY_CARDS.map((c, i) => (
              <div
                key={c.title}
                className="sg-big-card-item"
                style={{
                  textAlign: "center",
                  padding: "0 32px",
                  borderLeft: i === 0 ? "none" : "1px solid rgba(17,24,39,.08)",
                }}
              >
                {c.image ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 34px", height: 70 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" style={{ width: 80, height: 80, objectFit: "contain" }} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 68, height: 68, borderRadius: "50%", background: "rgba(227,30,36,.08)",
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 34px",
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.6">
                      {c.icon}
                    </svg>
                  </div>
                )}
                <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, color: NAVY, margin: "0 0 18px" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: "0 0 34px" }}>{c.desc}</p>
                <Link
                  href={c.href}
                  style={{
                    display: "inline-block", background: BLUE, color: "#fff", fontWeight: 700, fontSize: 14,
                    padding: "11px 24px", borderRadius: 999, textDecoration: "none",
                  }}
                >
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sg-3col { grid-template-columns: 1fr !important; }
          .sg-big-card-item {
            border-left: none !important;
            padding: 28px 8px !important;
            border-top: 1px solid rgba(17,24,39,.08);
          }
          .sg-big-card-item:first-child { border-top: none; padding-top: 0 !important; }
        }
      `}</style>
    </section>
  );
}
