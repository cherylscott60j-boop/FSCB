"use client";

import Link from "next/link";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";

const FOOTER_COLS = [
  {
    title: "Personal Banking",
    links: [
      { label: "Checking Accounts",  href: "/personal/checking" },
      { label: "Savings Accounts",   href: "/personal/savings" },
      { label: "Credit Cards",       href: "/personal/credit-cards" },
      { label: "Personal Loans",     href: "/personal/loans" },
      { label: "Online Banking",     href: "/personal/online-banking" },
    ],
  },
  {
    title: "Business Banking",
    links: [
      { label: "Business Checking",  href: "/business/checking" },
      { label: "Business Savings",   href: "/business/savings" },
      { label: "Business Loans",     href: "/business/loans" },
      { label: "Merchant Services",  href: "/business/merchant-services" },
      { label: "Business Cards",     href: "/business/credit-cards" },
    ],
  },
  {
    title: "Loans",
    links: [
      { label: "Personal Loans",     href: "/loans/personal" },
      { label: "Home Mortgages",     href: "/loans/mortgage" },
      { label: "Auto Loans",         href: "/loans/auto" },
      { label: "Home Equity",        href: "/loans/home-equity" },
      { label: "Business Loans",     href: "/loans/business" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story",          href: "/about/story" },
      { label: "Community Impact",   href: "/about/community" },
      { label: "Careers",            href: "/about/careers" },
      { label: "Press & News",       href: "/about/news" },
      { label: "Contact Us",         href: "/about/contact" },
    ],
  },
];

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H17V1.2C16.6 1.1 15.5 1 14.3 1 11.7 1 10 2.6 10 5.2V7H7v3h3v9h3v-9z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.9 22H3l7-8L2 2h6.2l4.3 5.7L18.2 2zm-2.1 18h1.7L7.9 3.8H6.1L16.1 20z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 7A1.94 1.94 0 1 1 7 3.12 1.94 1.94 0 0 1 6.94 7zM5.3 21V8.5h3.3V21H5.3zm5.4 0V8.5h3.16v1.7h.05c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.9 2.17 3.9 5V21h-3.3v-4.9c0-1.17 0-2.67-1.63-2.67s-1.88 1.27-1.88 2.59V21h-3.3z" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Notice",  href: "/privacy" },
  { label: "Terms of Use",    href: "/terms" },
  { label: "Accessibility",   href: "/accessibility" },
  { label: "Disclosures",     href: "/disclosures" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#3D0E15", color: "rgba(255,255,255,.72)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "70px 32px 0" }}>

        {/* Main grid */}
        <div
          className="g-footer"
          style={{ gap: 40, paddingBottom: 56, borderBottom: "1px solid rgba(255,255,255,.1)" }}
        >
          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", marginBottom: 18, textDecoration: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/fscb-horizontal-logo.webp" alt="FSCB — First State Community Bank" style={{ height: 36, width: "auto", filter: "brightness(0) invert(1)" }} />
            </Link>

            <p style={{ fontSize: 13.5, lineHeight: 1.68, margin: "0 0 8px", maxWidth: 270, color: "rgba(255,255,255,.65)" }}>
              Locally owned and operated since 1902. Banking built on trust, driven by community.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 24px", maxWidth: 270, color: "rgba(255,255,255,.4)" }}>
              Main Street Branch &middot; 102 Main Street<br />
              Mon–Fri 9am–5pm &middot; Sat 9am–12pm
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: "rgba(255,255,255,.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.7)",
                    textDecoration: "none",
                    transition: "background .18s ease, color .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "#8C1D25";
                    el.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,.07)";
                    el.style.color = "rgba(255,255,255,.7)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 11.5,
                  letterSpacing: ".1em",
                  color: "#fff",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                {col.title}
              </div>
              <nav aria-label={col.title}>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {col.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="underline-hover"
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,.65)",
                        textDecoration: "none",
                        width: "fit-content",
                        transition: "color .15s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.65)"; }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          ))}
        </div>

        {/* Regulatory strip */}
        <div
          style={{
            padding: "26px 0",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* FDIC badge */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,.18)", borderRadius: 7, padding: "7px 12px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12.5, color: "#fff", letterSpacing: ".04em" }}>FDIC</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>Member FDIC</span>
          </div>

          {/* Equal Housing badge */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,.18)", borderRadius: 7, padding: "7px 12px",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2">
              <path d="M3 11h18M5 11V8h4v3M5 21h14M4 21V11M20 21V11M9 21v-5h6v5" />
            </svg>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>Equal Housing Lender</span>
          </div>

          {/* Routing number */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,.18)", borderRadius: 7, padding: "7px 12px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".06em" }}>Routing</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12.5, color: "#fff", letterSpacing: ".06em" }}>0810&thinsp;2437&thinsp;6</span>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: 11, lineHeight: 1.6,
              color: "rgba(255,255,255,.38)",
              margin: 0, flex: 1, minWidth: 260,
            }}
          >
            First State Community Bank is FDIC insured. Deposits insured up to $250,000 per depositor. Investment
            products are not FDIC insured, not bank guaranteed, and may lose value. All loans subject to credit
            approval. Rates and terms subject to change without notice.{" "}
            <Link href="/disclosures" style={{ color: "rgba(255,255,255,.45)", textDecoration: "underline" }}>
              Full disclosures →
            </Link>
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "22px 0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12,
            color: "rgba(255,255,255,.38)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fdic.png" alt="FDIC Insured" style={{ height: 36, width: "auto" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lenderlogo.png" alt="Equal Housing Lender" style={{ height: 36, width: "auto" }} />
            <span>&copy; {new Date().getFullYear()} First State Community Bank. All rights reserved.</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "rgba(255,255,255,.38)", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.7)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.38)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
