"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Product {
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  rate: string;
  rateLabel: string;
  icon: ReactNode;
  href: string;
}

const PRODUCTS: Product[] = [
  {
    title: "Personal Banking",
    body: "No-fee checking with early direct deposit and 55,000 fee-free ATMs nationwide.",
    tag: "Popular",
    tagColor: "#8C1D25",
    tagBg: "rgba(140,29,37,.1)",
    rate: "$0",
    rateLabel: "monthly fees",
    href: "/personal/checking",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    title: "Savings Accounts",
    body: "High-yield savings with automatic goals and roundups that build real wealth over time.",
    tag: "Competitive APY",
    tagColor: "#059669",
    tagBg: "rgba(5,150,105,.12)",
    rate: "High",
    rateLabel: "APY rates",
    href: "/personal/savings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 6H7a4 4 0 0 0 0 8h1v4l3-2 3 2v-4h5a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
        <circle cx="11" cy="10" r="1" />
      </svg>
    ),
  },
  {
    title: "Business Banking",
    body: "Built for local businesses — multi-user access, merchant services, and expert support.",
    tag: "For businesses",
    tagColor: "#8C1D25",
    tagBg: "rgba(140,29,37,.1)",
    rate: "Free",
    rateLabel: "to start",
    href: "/business/checking",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Insurance",
    body: "Protect what matters most with home, auto, and life insurance solutions.",
    tag: "From $29/mo",
    tagColor: "#b8941f",
    tagBg: "rgba(212,175,55,.15)",
    rate: "$29+",
    rateLabel: "per month",
    href: "/insurance/home",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
      </svg>
    ),
  },
  {
    title: "Financial Management",
    body: "Automated portfolios, retirement planning, and expert advisors — all in one place.",
    tag: "New",
    tagColor: "#8C1D25",
    tagBg: "rgba(140,29,37,.1)",
    rate: "$0",
    rateLabel: "commissions",
    href: "/financial/investments",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" />
      </svg>
    ),
  },
  {
    title: "Loans & Mortgages",
    body: "Personal, home, and business loans with transparent rates and fast local decisions.",
    tag: "Local decisions",
    tagColor: "#059669",
    tagBg: "rgba(5,150,105,.12)",
    rate: "Low",
    rateLabel: "rates",
    href: "/loans/personal",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2-5 1.5-5 4a2.5 2 0 0 0 5 0" />
      </svg>
    ),
  },
];

export default function Products() {
  return (
    <section style={{ background: "#fff", borderTop: "1px solid rgba(17,24,39,.05)", borderBottom: "1px solid rgba(17,24,39,.05)" }}>
      <div className="resp-pad mob-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 46,
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <span
              style={{
                fontSize: 13,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#8C1D25",
                fontWeight: 700,
              }}
            >
              How Can We Help?
            </span>
            <h2
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(22px, 4vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-.02em",
                margin: "14px 0 0",
              }}
            >
              Everything you need to manage money
            </h2>
          </div>
          <Link
            href="/open-account"
            className="underline-hover"
            style={{
              color: "#8C1D25",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            View all products
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="g-3col" style={{ gap: 22 }}>
          {PRODUCTS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{
                display: "block",
                border: "1px solid rgba(17,24,39,.08)",
                borderRadius: 18,
                padding: 28,
                textDecoration: "none",
                color: "inherit",
                transition: "all .28s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(140,29,37,.35)";
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 20px 40px -22px rgba(140,29,37,.28)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(17,24,39,.08)";
                el.style.transform = "";
                el.style.boxShadow = "";
              }}
            >
              {/* Icon + tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: "rgba(140,29,37,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8C1D25",
                  }}
                >
                  {p.icon}
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: p.tagColor,
                    background: p.tagBg,
                    padding: "5px 11px",
                    borderRadius: 999,
                  }}
                >
                  {p.tag}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  margin: "0 0 8px",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.55, margin: "0 0 18px" }}>
                {p.body}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(17,24,39,.07)",
                  paddingTop: 16,
                }}
              >
                <span style={{ fontSize: 13, color: "#111827" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {p.rate}
                  </span>{" "}
                  {p.rateLabel}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
