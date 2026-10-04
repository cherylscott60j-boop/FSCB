"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";
const BLUE = "#1D3FAE";
const GRAY = "#6B7280";
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";

const WHY_CARDS = [
  {
    title: "Relationship Banking",
    desc: "Real people who know your name, your goals, and your plans — from your first account to your retirement.",
    cta: "Come and see us",
    href: "/about/contact",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21l7.78-7.55 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    title: "Investing made simple",
    desc: "Start from [$X], choose a ready-made portfolio, and review with a financial advisor for free in branch.",
    cta: "Find out more",
    href: "/financial/retirement",
    icon: <path d="M3 17l6-6 4 4 8-8M21 7h-5v5" />,
  },
  {
    title: "Your pocket-sized bank",
    desc: "Log in with your face or fingerprint, manage accounts, invest, and track spending with a tap.",
    cta: "Explore our app",
    href: "/personal/online-banking",
    icon: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
  },
];

function Banner({
  title,
  desc,
  cta,
  href,
  icon,
}: {
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(17,24,39,.08)",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15.5, color: NAVY, margin: "0 0 6px" }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 14px" }}>{desc}</p>
        <Link
          href={href}
          style={{
            display: "inline-block", background: BLUE, color: "#fff", fontWeight: 700, fontSize: 13,
            padding: "9px 18px", borderRadius: 999, textDecoration: "none",
          }}
        >
          {cta}
        </Link>
      </div>
      <div
        style={{
          width: 52, height: 52, borderRadius: "50%", background: RED, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default function WhySafeguard() {
  return (
    <section style={{ background: "#F4F5F7", padding: "16px 32px 72px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3vw, 28px)", color: NAVY,
            textAlign: "center", margin: "0 0 32px", letterSpacing: "-.01em",
          }}
        >
          Why Safeguard Global?
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 20 }} className="sg-3col">
          {WHY_CARDS.map((c) => (
            <div
              key={c.title}
              style={{
                background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 16,
                padding: "26px 24px", textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: "50%", background: "rgba(227,30,36,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8">
                  {c.icon}
                </svg>
              </div>
              <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15.5, color: NAVY, margin: "0 0 8px" }}>
                {c.title}
              </h3>
              <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>{c.desc}</p>
              <Link
                href={c.href}
                style={{
                  display: "inline-block", background: BLUE, color: "#fff", fontWeight: 700, fontSize: 13,
                  padding: "9px 18px", borderRadius: 999, textDecoration: "none",
                }}
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Banner
            title="We're extending our Saturday branch hours"
            desc="Branches open on a Saturday are now open from 9.30am to 4pm. Check whether your local branch is open on a Saturday below."
            cta="Branch hours"
            href="/about/contact"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M3 10l9-6 9 6M4 10v9h16v-9M9 19v-6h6v6" />
              </svg>
            }
          />
          <Banner
            title="Free investment reviews in every branch"
            desc="Sit down with a qualified advisor to review your savings, pensions, and investments. No obligation, no jargon."
            cta="Book a review"
            href="/about/contact"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <circle cx="9" cy="8" r="3.2" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 8a3 3 0 1 1 3.2 3M21 20c0-2.6-1.7-4.8-4-5.6" />
              </svg>
            }
          />
          <Banner
            title="Give us a call"
            desc="If you have an enquiry relating to any of our stores, products, or services, please get in touch to speak to someone on our contact centre team who'll be happy to assist."
            cta="Get in touch"
            href="/about/contact"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            }
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sg-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
