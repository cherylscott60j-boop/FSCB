"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

const CARDS = [
  {
    title: "Personal & Private Banking",
    body: "From everyday checking to private wealth management, our personal accounts are designed to cover everything you need.",
    cta: "Get started",
    href: "/personal/checking",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    ),
  },
  {
    title: "Business & Institutional Banking",
    body: "From straightforward business accounts to institutional finance, we know how to help your organization grow.",
    cta: "Take a look",
    href: "/business/checking",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 21h18M6 21V9l6-5 6 5v12M10 21v-6h4v6" />
      </svg>
    ),
  },
];

export default function RelationshipBanking() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section style={{ background: "#F8F9FA" }} ref={ref}>
      <div className="resp-pad mob-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "84px 32px" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 52px" }}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 40px)",
              lineHeight: 1.12,
              letterSpacing: "-.02em",
              margin: "0 0 18px",
            }}
          >
            This is Global Investment Banking
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>
            We believe real relationships drive real results. Our service is built on human
            connection — whether you bank with us in person, over the phone, online, or in our app.
          </p>
        </div>

        <div className="g-2col-even reveal" style={{ gap: 24 }}>
          {CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                background: "#fff",
                border: "1px solid rgba(17,24,39,.07)",
                borderRadius: 22,
                padding: "34px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, margin: 0, flex: 1, minWidth: 180 }}>
                  {card.title}
                </h3>
                <div
                  style={{
                    flex: "none",
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    background: "#8C1D25",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <p style={{ fontSize: 15.5, color: "#6B7280", lineHeight: 1.6, margin: "0 0 8px", flexGrow: 1 }}>
                {card.body}
              </p>
              <Link
                href={card.href}
                style={{
                  alignSelf: "flex-start",
                  background: "#8C1D25",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: 14.5,
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: 999,
                  textDecoration: "none",
                  transition: "all .2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6B151C"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#8C1D25"; }}
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
