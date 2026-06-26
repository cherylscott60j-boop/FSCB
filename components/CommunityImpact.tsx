"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  {
    title: "Financial Literacy Programs",
    body: "Free community workshops reaching thousands of students and families each year.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M21 7v6M7 9v5c0 1.5 2.2 3 5 3s5-1.5 5-3V9" />
      </svg>
    ),
  },
  {
    title: "Small Business Support",
    body: "$1M+ in local donations and grants to founders traditional banks overlook.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Community Development",
    body: "Partnering on 200+ neighborhood revitalization projects since our founding.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M5 21V9l5-3 5 3v12M9 13h2M9 17h2" />
      </svg>
    ),
  },
  {
    title: "Housing Support",
    body: "First-time homebuyer assistance programs for families in our region.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
];

export default function CommunityImpact() {
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
    <section className="resp-pad mob-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "84px 32px" }} ref={ref}>
      <div className="g-2col-rev" style={{ gap: 60 }}>
        {/* Left: image + badge */}
        <div className="reveal" style={{ position: "relative" }}>
          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 26px 56px -24px rgba(140,29,37,.28)",
              aspectRatio: "5/4.4",
              backgroundImage: "url('/31-RibbonCuttingConfetti.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="mob-badge"
            style={{
              position: "absolute",
              right: -24,
              bottom: 36,
              background: "#D4AF37",
              color: "#4A0E14",
              borderRadius: 18,
              padding: "20px 24px",
              boxShadow: "0 18px 40px -14px rgba(212,175,55,.5)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
                fontWeight: 800,
                fontSize: 30,
                lineHeight: 1,
              }}
            >
              $1M+
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 5 }}>reinvested locally</div>
          </div>
        </div>

        {/* Right: copy */}
        <div className="reveal">
          <span
            style={{
              fontSize: 13,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#8C1D25",
              fontWeight: 700,
            }}
          >
            Our Impact Initiative
          </span>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 4vw, 38px)",
              lineHeight: 1.12,
              letterSpacing: "-.02em",
              margin: "14px 0 18px",
            }}
          >
            We measure success by who we lift up
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.62, margin: "0 0 30px" }}>
            We believe in building stronger communities. With over 200 projects, $875,000 in donations and 17,000 hours
            of service, we are proud of the impact we make in our communities every day.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {ITEMS.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    flex: "none",
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "rgba(140,29,37,.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8C1D25",
                  }}
                >
                  {it.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
                      fontWeight: 700,
                      fontSize: 16.5,
                      marginBottom: 3,
                    }}
                  >
                    {it.title}
                  </div>
                  <div style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.5 }}>{it.body}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              marginTop: 30,
              background: "none",
              border: "none",
              color: "#8C1D25",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 15.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: 0,
              transition: "gap .2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.gap = "13px"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.gap = "9px"; }}
          >
            See our impact report
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
