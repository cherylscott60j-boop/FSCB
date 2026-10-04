"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";
const BLUE = "#1D3FAE";
const DARK = "#111827";
const GRAY = "#6B7280";
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";

function PillButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        background: BLUE,
        color: "#fff",
        fontWeight: 700,
        fontSize: 13.5,
        padding: "10px 20px",
        borderRadius: 999,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(17,24,39,.08)",
        borderRadius: 16,
        padding: "26px 28px",
        boxShadow: "0 2px 10px rgba(17,24,39,.04)",
      }}
    >
      {children}
    </div>
  );
}

export default function RelationshipBanking() {
  return (
    <section style={{ background: "#F4F5F7", padding: "72px 32px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Intro */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: "clamp(24px, 3.4vw, 32px)",
              color: NAVY,
              margin: "0 0 14px",
              letterSpacing: "-.01em",
            }}
          >
            This is Relationship Banking
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: GRAY, maxWidth: 620, margin: "0 auto" }}>
            We believe great banking starts with people. Whether you&apos;re saving, borrowing, or
            investing, our service is built on real, long-standing relationships — face to face,
            over the phone, online, or in our app.
          </p>
        </div>

        {/* Two account cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}
          className="sg-2col"
        >
          <Card>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: NAVY, margin: "0 0 8px" }}>
                  Personal accounts
                </h3>
                <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>
                  From current accounts to savings and mortgages, our personal banking range is
                  designed to cover everything you need.
                </p>
                <PillButton href="/open-account">Get started</PillButton>
              </div>
              <div
                style={{
                  width: 52, height: 52, borderRadius: "50%", background: RED, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: NAVY, margin: "0 0 8px" }}>
                  Investing accounts
                </h3>
                <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>
                  Brokerage, ready-made portfolios, and retirement accounts — linked straight to
                  your everyday banking.
                </p>
                <PillButton href="/financial/retirement">Start investing</PillButton>
              </div>
              <div
                style={{
                  width: 52, height: 52, borderRadius: "50%", background: RED, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M3 17l6-6 4 4 8-8M21 7h-5v5" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Switch banks banner */}
        <Card>
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: NAVY, margin: "0 0 6px" }}>
                Ready to switch banks?
              </h3>
              <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 14px" }}>
                Switching to us is quick and easy. Open your account, fill in our switching form,
                and we&apos;ll take care of moving your payments and direct deposits for you.
              </p>
              <PillButton href="/open-account">Switch your account</PillButton>
            </div>
            <div
              style={{
                border: `1.5px solid ${NAVY}`, borderRadius: 10, padding: "10px 16px", textAlign: "center",
                fontSize: 11, fontWeight: 800, color: NAVY, letterSpacing: ".03em", flexShrink: 0,
              }}
            >
              EASY SWITCH<br />PROMISE
            </div>
          </div>
        </Card>
        <div style={{ height: 20 }} />

        {/* Protecting your money */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 520 }}>
              <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: NAVY, margin: "0 0 6px" }}>
                Protecting your money
              </h3>
              <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 14px" }}>
                Your eligible deposits with Safeguard Global Investment Bank are protected by
                [DEPOSIT INSURANCE SCHEME] up to [$LIMIT]. Investments are not deposits and can go
                down in value.
              </p>
              <Link href="/disclosures" style={{ fontSize: 13.5, fontWeight: 700, color: BLUE, textDecoration: "none" }}>
                How your money is protected →
              </Link>
            </div>
            <div
              style={{
                width: 72, height: 72, borderRadius: 12, border: "2px dashed rgba(17,24,39,.2)",
                display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                fontSize: 10, color: GRAY, flexShrink: 0, padding: 6,
              }}
            >
              [Protection badge]
            </div>
          </div>
        </Card>
        <div style={{ height: 20 }} />

        {/* Scam checker */}
        <Card>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 20 }}>
              <div
                style={{
                  width: 52, height: 52, borderRadius: "50%", background: RED, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div style={{ maxWidth: 480 }}>
                <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: NAVY, margin: "0 0 6px" }}>
                  Safeguard Scam Checker
                </h3>
                <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 10px" }}>
                  Not sure about a text, call, or investment offer? Send it to our Scam Checker and
                  get a fast answer before you act — free for all customers.
                </p>
                <p style={{ fontSize: 11.5, color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 14px" }}>
                  *Availability and limitations apply. We will never ask you to move money to a
                  &quot;safe account.&quot;
                </p>
                <PillButton href="/about/contact">Discover more</PillButton>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .sg-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
