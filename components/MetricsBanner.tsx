"use client";

import { useEffect, useRef } from "react";

const METRICS = [
  { display: "202", target: 202, prefix: "", suffix: "", decimals: 0, label: "Completed Community Projects" },
  { display: "$1M+", target: 1, prefix: "$", suffix: "M+", decimals: 0, label: "in Donations to Our Community" },
  { display: "17K+", target: 17, prefix: "", suffix: "K+", decimals: 0, label: "Hours Served in Our Community" },
  { display: "120+", target: 120, prefix: "", suffix: "+", decimals: 0, label: "Years of Community Banking" },
];

function animateCount(
  el: HTMLElement,
  target: number,
  prefix: string,
  suffix: string,
  decimals: number
) {
  const dur = 1600;
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function MetricsBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>("[data-metric]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            animateCount(
              el,
              parseFloat(el.dataset.target || "0"),
              el.dataset.prefix || "",
              el.dataset.suffix || "",
              parseInt(el.dataset.decimals || "0", 10)
            );
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg,#8C1D25,#6B151C)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(212,175,55,.18), transparent 38%), radial-gradient(circle at 85% 90%, rgba(255,255,255,.06), transparent 40%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="resp-pad mob-section"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "64px 32px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 44,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(20px, 3.5vw, 34px)",
              letterSpacing: "-.02em",
              margin: 0,
              maxWidth: 520,
              lineHeight: 1.14,
            }}
          >
            Numbers that mean something to real people
          </h2>
          <span style={{ color: "rgba(255,255,255,.72)", fontSize: 14.5 }}>Updated Q2 2026</span>
        </div>

        <div className="g-4col" style={{ gap: 24 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ borderLeft: "2px solid rgba(212,175,55,.55)", paddingLeft: 20 }}>
              <div
                data-metric
                data-target={m.target}
                data-prefix={m.prefix}
                data-suffix={m.suffix}
                data-decimals={m.decimals}
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(30px, 6vw, 46px)",
                  lineHeight: 1,
                  letterSpacing: "-.02em",
                }}
              >
                {m.display}
              </div>
              <div style={{ marginTop: 12, fontSize: 14.5, color: "rgba(255,255,255,.8)", lineHeight: 1.4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
