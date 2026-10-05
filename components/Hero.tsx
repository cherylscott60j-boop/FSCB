"use client";

import Link from "next/link";

const BLUE = "#0800FF";

export default function Hero() {
  return (
    <section
      className="sg-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/hero-home.webp')",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        backgroundColor: BLUE,
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
            background: "#fff",
            color: BLUE,
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
          src="/hero-home.webp"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <style>{`
        .sg-hero-mobile-img { display: none; }
        @media (max-width: 760px) {
          .sg-hero {
            background-image: none !important;
            background-color: #0800FF !important;
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%) !important;
          }
          .sg-hero-content { padding: 48px 24px 32px !important; }
          .sg-hero-mobile-img { display: block; }
          .sg-hero-h1 { font-size: 26px !important; }
        }
        @media (max-width: 400px) {
          .sg-hero-h1 { font-size: 22px !important; }
        }
      `}</style>
    </section>
  );
}
