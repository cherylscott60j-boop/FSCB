"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="resp-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 90px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#8C1D25,#6B151C)",
          borderRadius: 28,
          padding: "clamp(40px, 6vw, 70px) clamp(24px, 5vw, 60px)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Radial overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(212,175,55,.2), transparent 35%), radial-gradient(circle at 88% 80%, rgba(255,255,255,.06), transparent 38%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 620, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 4vw, 42px)",
              lineHeight: 1.1,
              letterSpacing: "-.02em",
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            Not Sure Where to Start?
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,.82)",
              lineHeight: 1.55,
              margin: "0 0 34px",
            }}
          >
            Open an account in minutes, call us, send a message, or find a branch near you. We&apos;re always here to help.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/open-account"
              style={{ background: "#D4AF37", color: "#4A0E14", fontWeight: 700, fontFamily: "inherit", fontSize: 16, padding: "16px 32px", borderRadius: 14, boxShadow: "0 6px 20px rgba(212,175,55,.35)", transition: "all .22s ease", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.boxShadow = "0 16px 34px rgba(212,175,55,.45)"; a.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.boxShadow = "0 6px 20px rgba(212,175,55,.35)"; a.style.transform = ""; }}
            >
              Open Account
            </Link>
            <a
              href="tel:18002372669"
              style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)", fontWeight: 600, fontFamily: "inherit", fontSize: 16, padding: "16px 32px", borderRadius: 14, transition: "all .22s ease", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(255,255,255,.18)"; a.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(255,255,255,.1)"; a.style.transform = ""; }}
            >
              Call Now
            </a>
            <Link
              href="/about/contact"
              style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)", fontWeight: 600, fontFamily: "inherit", fontSize: 16, padding: "16px 32px", borderRadius: 14, transition: "all .22s ease", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(255,255,255,.18)"; a.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(255,255,255,.1)"; a.style.transform = ""; }}
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
