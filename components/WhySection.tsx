"use client";

import { useEffect, useRef } from "react";

const CARDS = [
  {
    title: "Strong Local Roots",
    body: "Serving our community since 1902 — built on trust, guided by values, and always close to home.",
    cta: "Learn about us",
    iconBg: "rgba(140,29,37,.09)",
    iconColor: "#8C1D25",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Banking Fit To Your Needs",
    body: "Your needs are unique. Our team is here to make sure you get the guidance and products that fit your life.",
    cta: "Explore products",
    iconBg: "rgba(212,175,55,.15)",
    iconColor: "#b8941f",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8h13l-4-4M21 16H8l4 4" />
      </svg>
    ),
  },
  {
    title: "Community-Local Banking",
    body: "We're proud to be part of this community — supporting local families, businesses, and causes every day.",
    cta: "See our impact",
    iconBg: "rgba(16,185,129,.1)",
    iconColor: "#059669",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21v-2a4 4 0 0 1 4-4h3M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
];

export default function WhySection() {
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
    <section style={{ background: "#fff", borderTop: "1px solid rgba(17,24,39,.05)", borderBottom: "1px solid rgba(17,24,39,.05)" }} ref={ref}>
      <div className="resp-pad mob-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px" }}>
      <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px" }}>
        <span
          style={{
            fontSize: 13,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#8C1D25",
            fontWeight: 700,
          }}
        >
          Why Bank with SGGINV?
        </span>
        <h2
          style={{
            fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            margin: "14px 0 16px",
          }}
        >
          Banking that works for you
        </h2>
        <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
          Secure, personal, and right here when you need us.
        </p>
      </div>

      <div className="g-3col" style={{ gap: 26 }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="reveal"
            style={{
              background: "#fff",
              border: "1px solid rgba(17,24,39,.06)",
              borderRadius: 20,
              padding: "36px 30px",
              transition: "transform .3s ease, box-shadow .3s ease",
              cursor: "pointer",
              animationDelay: `${i * 0.1}s`,
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-6px)";
              el.style.boxShadow = "0 22px 44px -22px rgba(140,29,37,.28)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "";
              el.style.boxShadow = "";
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.iconColor,
                marginBottom: 24,
              }}
            >
              {card.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
                fontWeight: 700,
                fontSize: 21,
                margin: "0 0 11px",
                letterSpacing: "-.01em",
              }}
            >
              {card.title}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.62, color: "#6B7280", margin: "0 0 20px", flexGrow: 1 }}>
              {card.body}
            </p>
            <span
              className="underline-hover"
              style={{
                color: "#8C1D25",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {card.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
