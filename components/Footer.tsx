"use client";

import Link from "next/link";
import { BANK } from "@/lib/bankConstants";

const RED = "#E31E24";

const FOOTER_LINKS = [
  { label: "Branch Locator", href: "/about/contact" },
  { label: "Careers", href: "/about/careers" },
  { label: "Press", href: "/about/news" },
  { label: "Mortgage Intermediaries", href: "/loans/mortgage" },
  { label: "Accessibility", href: "/accessibility" },
];

const LEGAL_LINKS = [
  { label: "Legal information", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/privacy" },
  { label: "Sitemap", href: "/about" },
];

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 7A1.94 1.94 0 1 1 7 3.12 1.94 1.94 0 0 1 6.94 7zM5.3 21V8.5h3.3V21H5.3zm5.4 0V8.5h3.16v1.7h.05c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.9 2.17 3.9 5V21h-3.3v-4.9c0-1.17 0-2.67-1.63-2.67s-1.88 1.27-1.88 2.59V21h-3.3z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.9 22H3l7-8L2 2h6.2l4.3 5.7L18.2 2zm-2.1 18h1.7L7.9 3.8H6.1L16.1 20z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H17V1.2C16.6 1.1 15.5 1 14.3 1 11.7 1 10 2.6 10 5.2V7H7v3h3v9h3v-9z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 0 0 2-2C22 15.2 22 12 22 12zM10 15.2V8.8L15.6 12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: RED, color: "rgba(255,255,255,.88)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 32px 0" }}>
        {/* Link row + socials */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            paddingBottom: 28,
          }}
        >
          <nav aria-label="Footer" style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 10 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,.14)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.25)",
            padding: "18px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{ color: "rgba(255,255,255,.8)", textDecoration: "underline" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,.8)" }}>
            Copyright {new Date().getFullYear()} {BANK.name}. All rights reserved.
          </span>
        </div>

        {/* Disclosure block */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.25)", padding: "18px 0 28px" }}>
          <p style={{ fontSize: 11.5, lineHeight: 1.7, color: "rgba(255,255,255,.75)", margin: 0 }}>
                        Safeguard Global Investment Bank provides secure banking and financial services designed to support individuals, businesses, and investors.
                        We are committed to maintaining high standards of security, transparency, regulatory compliance, and responsible financial service.

                        Eligible deposits are insured by the Federal Deposit Insurance Corporation (FDIC), subject to applicable coverage limits, ownership categories, terms, and federal regulations.

                        Banking products and services are subject to eligibility requirements, account terms, applicable laws, and regulatory requirements.
                        Member FDIC. Deposits are insured by the Federal Deposit Insurance Corporation up to $250,000 USD{" "}
            <Link href="/disclosures" style={{ color: "#fff", textDecoration: "underline" }}>
              Full disclosures →
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
