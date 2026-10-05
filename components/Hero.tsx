"use client";

import Link from "next/link";

const RED = "#E31E24";

export default function Hero() {
  return (
    <section
      className="sg-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/hero-background-2.webp')",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundColor: "#0b007e",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%)",
      }}
    >
      <div
        className="sg-hero-content"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "64px 32px 320px",
          textAlign: "center",
          fontFamily: "var(--font-poppins), sans-serif",
        }}
      >
        <h1
          className="sg-hero-h1"
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 600,
            fontSize: "clamp(30px, 4.4vw, 46px)",
            lineHeight: 1.3,
            letterSpacing: "-.02em",
            color: "#fff",
            margin: "0 0 16px",
          }}
        >
          Grow more with banking<br />and investing in one place
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(255,255,255,.82)",
            margin: "0 auto 32px",
            maxWidth: 620,
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
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          Discover our accounts
        </Link>
      </div>

      {/* mobile-only: the photo image, full-bleed, flush with the bottom edge of the hero */}
      <div className="sg-hero-mobile-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-background-2.webp"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* scroll chevron, anchored to the bottom edge of the hero */}
      <div className="sg-hero-chevron" style={{ position: "absolute", left: "50%", bottom: 36, transform: "translateX(-50%)" }}>
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

      <style>{`
        .sg-hero-mobile-img { display: none; }
        @media (max-width: 760px) {
          .sg-hero {
            background-image: none !important;
            background-color: #0800FF !important;
            clip-path: none !important;
          }
          .sg-hero-content { padding: 48px 24px 32px !important; }
          .sg-hero-mobile-img { display: block; }
          .sg-hero-chevron { display: none; }
          .sg-hero-h1 { font-size: 26px !important; }
        }
        @media (max-width: 400px) {
          .sg-hero-h1 { font-size: 22px !important; }
        }
      `}</style>
    </section>
  );
}
