"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div style={{ background: "#6B151C", color: "rgba(255,255,255,.85)", fontSize: "12.5px", letterSpacing: ".01em" }}>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 32px",
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: trust signal */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#D4AF37",
              boxShadow: "0 0 0 3px rgba(212,175,55,.25)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span>FDIC Insured &middot; Member FDIC &middot; Backed by the full faith of the U.S. Government</span>
        </div>

        {/* Right: quick links */}
        <div className="topbar-right">
          <Link
            href="/about/contact"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,.85)", textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.85)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Find a Branch
          </Link>

          <a
            href="tel:18002372669"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,.85)", textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.85)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            1-800-FSCB-NOW
          </a>
        </div>
      </div>
    </div>
  );
}
