"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const BLUE = "#0800FF";
const RED = "#E31E24";

const NAV_LINKS = [
  { label: "Bank accounts", href: "/personal/checking" },
  { label: "Savings", href: "/personal/savings" },
  { label: "Borrowing", href: "/loans/personal" },
  { label: "Mortgages", href: "/loans/mortgage" },
  { label: "Credit cards", href: "/personal/credit-cards" },
  { label: "Safe deposit boxes", href: "/personal/safe-deposit-boxes" },
  { label: "Ways to bank", href: "/personal/online-banking" },
  { label: "Private banking", href: "/financial/retirement" },
];

// Top-bar links, repeated in the mobile menu because the top bar is hidden on small screens.
const MOBILE_EXTRA_LINKS = [
  { label: "Business", href: "/business" },
  { label: "Investing", href: "/financial" },
  { label: "About", href: "/about/contact" },
  { label: "Find a Store", href: "/about/contact#branches" },
  { label: "Service status", href: "/service-status" },
  { label: "Extra support for customers", href: "/extra-support" },
  { label: "Help", href: "/accessibility" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sg-nav-header" style={{ background: BLUE, borderBottom: "1px solid rgba(255,255,255,.12)", position: "sticky", top: 42, zIndex: 100 }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Logo variant="light" height={36} />
        </Link>

        <nav aria-label="Primary" className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="sg-nav-mobile-actions" style={{ display: "none", alignItems: "center", gap: 10 }}>
          <Link
            href="/login"
            style={{
              background: RED, color: "#fff", fontWeight: 700, fontSize: 12.5,
              padding: "7px 16px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            Log in
          </Link>
          <button
            className="nav-mobile-btn"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            style={{ color: "#fff" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay${open ? " open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
          <Logo variant="dark" height={32} />
          <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Primary mobile" style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 8 }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 16, fontWeight: 600, color: "#111827", textDecoration: "none",
                padding: "14px 0", borderBottom: "1px solid rgba(17,24,39,.08)",
              }}
            >
              {l.label}
            </Link>
          ))}
          {MOBILE_EXTRA_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontSize: 15, fontWeight: 500, color: "#4B5563", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(17,24,39,.08)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          onClick={() => setOpen(false)}
          style={{
            marginTop: 24, background: RED, color: "#fff", fontWeight: 700, fontSize: 15,
            padding: "13px 0", borderRadius: 999, textDecoration: "none", textAlign: "center",
          }}
        >
          Log in
        </Link>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .sg-nav-mobile-actions { display: flex !important; }
        }
        @media (max-width: 860px) {
          .sg-nav-header { top: 0 !important; }
        }
      `}</style>
    </header>
  );
}
