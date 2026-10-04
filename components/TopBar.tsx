"use client";

import Link from "next/link";

const NAVY = "#0D1B4C";
const RED = "#E31E24";

const UTILITY_LINKS = [
  { label: "Personal", href: "/" },
  { label: "Business", href: "/business" },
  { label: "Investing", href: "/financial" },
  { label: "About", href: "/about" },
  { label: "Service status", href: "/accessibility" },
  { label: "Extra support for customers", href: "/accessibility" },
];

export default function TopBar() {
  return (
    <div style={{ background: NAVY, color: "rgba(255,255,255,.88)", fontSize: "13px" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: utility nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }} className="topbar-utility">
          {UTILITY_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{ color: "rgba(255,255,255,.82)", textDecoration: "none", transition: "color .15s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.82)"; }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: quick links */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <Link
            href="/about/contact"
            style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.82)", textDecoration: "none" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Find a Branch
          </Link>
          <Link href="/accessibility" style={{ color: "rgba(255,255,255,.82)", textDecoration: "none" }}>
            Help
          </Link>
          <Link
            href="/login"
            style={{
              background: RED,
              color: "#fff",
              fontWeight: 700,
              padding: "7px 18px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 12.5,
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
