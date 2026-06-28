"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Menu data ─────────────────────────────────────────────────────────── */

const MENU_DATA = {
  Personal: {
    tagline: "Banking that fits your life",
    viewAll: "/personal/checking",
    items: [
      {
        title: "Checking Accounts",
        desc: "No-fee everyday banking with early direct deposit",
        href: "/personal/checking",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 10h18" />
          </svg>
        ),
      },
      {
        title: "Savings Accounts",
        desc: "High-yield savings to grow your money faster",
        href: "/personal/savings",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 6H7a4 4 0 0 0 0 8h1v4l3-2 3 2v-4h5a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
          </svg>
        ),
      },
      {
        title: "Credit Cards",
        desc: "Rewards and cashback on every purchase",
        href: "/personal/credit-cards",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20M6 15h4" />
          </svg>
        ),
      },
      {
        title: "Personal Loans",
        desc: "Fast local decisions on personal financing",
        href: "/personal/loans",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2-5 1.5-5 4a2.5 2 0 0 0 5 0" />
          </svg>
        ),
      },
      {
        title: "Online Banking",
        desc: "Manage all your accounts from anywhere, anytime",
        href: "/personal/online-banking",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        ),
      },
    ],
  },
  Business: {
    tagline: "Built for local businesses",
    viewAll: "/business/checking",
    items: [
      {
        title: "Business Checking",
        desc: "Flexible accounts for businesses of all sizes",
        href: "/business/checking",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        ),
      },
      {
        title: "Business Savings",
        desc: "Earn more on your business reserves",
        href: "/business/savings",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-5h6v5" />
          </svg>
        ),
      },
      {
        title: "Business Loans",
        desc: "Capital to grow and expand your local business",
        href: "/business/loans",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10C7.5 20.5 4 17 4 12V6l8-4z" />
          </svg>
        ),
      },
      {
        title: "Merchant Services",
        desc: "Accept payments securely and efficiently",
        href: "/business/merchant-services",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
        ),
      },
      {
        title: "Business Credit Cards",
        desc: "Manage business expenses and earn rewards",
        href: "/business/credit-cards",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20M6 15h2M12 15h2" />
          </svg>
        ),
      },
    ],
  },
  Loans: {
    tagline: "Local decisions, competitive rates",
    viewAll: "/loans/personal",
    items: [
      {
        title: "Personal Loans",
        desc: "Flexible financing for any purpose",
        href: "/loans/personal",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2-5 1.5-5 4a2.5 2 0 0 0 5 0" />
          </svg>
        ),
      },
      {
        title: "Home Mortgages",
        desc: "Buy or refinance with local expertise",
        href: "/loans/mortgage",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-5h6v5" />
          </svg>
        ),
      },
      {
        title: "Auto Loans",
        desc: "Drive away with great rates",
        href: "/loans/auto",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h11l4 4v4a2 2 0 0 1-2 2h-1" />
            <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
          </svg>
        ),
      },
      {
        title: "Home Equity",
        desc: "Put your home's value to work for you",
        href: "/loans/home-equity",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" />
            <path d="M9 21v-6h6v6" />
          </svg>
        ),
      },
      {
        title: "Business Loans",
        desc: "Capital for business growth and expansion",
        href: "/loans/business",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" />
          </svg>
        ),
      },
    ],
  },
  Insurance: {
    tagline: "Protect what matters most",
    viewAll: "/insurance/home",
    items: [
      {
        title: "Home Insurance",
        desc: "Comprehensive coverage for your home",
        href: "/insurance/home",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" />
            <path d="M9 21v-6h6v6" />
          </svg>
        ),
      },
      {
        title: "Auto Insurance",
        desc: "Stay protected on every road you travel",
        href: "/insurance/auto",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h11l4 4v4a2 2 0 0 1-2 2h-1" />
            <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
          </svg>
        ),
      },
      {
        title: "Life Insurance",
        desc: "Secure your family's future today",
        href: "/insurance/life",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        title: "Business Insurance",
        desc: "Protect your business from the unexpected",
        href: "/insurance/business",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        ),
      },
      {
        title: "Health Insurance",
        desc: "Quality coverage for you and your family",
        href: "/insurance/health",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
    ],
  },
  "Financial Management": {
    tagline: "Grow and protect your wealth",
    viewAll: "/financial/wealth-management",
    items: [
      {
        title: "Wealth Management",
        desc: "Personalized strategies for long-term growth",
        href: "/financial/wealth-management",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" />
          </svg>
        ),
      },
      {
        title: "Retirement Planning",
        desc: "Build the retirement you truly deserve",
        href: "/financial/retirement",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v6l4 2" />
          </svg>
        ),
      },
      {
        title: "Investment Accounts",
        desc: "Diversified portfolios for every financial goal",
        href: "/financial/investments",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" />
          </svg>
        ),
      },
      {
        title: "Financial Planning",
        desc: "A clear roadmap to your financial future",
        href: "/financial/planning",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          </svg>
        ),
      },
      {
        title: "Estate Planning",
        desc: "Protect and pass on your legacy with confidence",
        href: "/financial/estate",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 21h18M5 21V9l7-6 7 6v12" />
          </svg>
        ),
      },
    ],
  },
  About: {
    tagline: "Community banking since 1902",
    viewAll: "/about/story",
    items: [
      {
        title: "Our Story",
        desc: "Over 120 years of community banking tradition",
        href: "/about/story",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 7l9-4 9 4-9 4-9-4zM21 7v6M7 9v5c0 1.5 2.2 3 5 3s5-1.5 5-3V9" />
          </svg>
        ),
      },
      {
        title: "Community Impact",
        desc: "$1M+ reinvested in our neighbors and community",
        href: "/about/community",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 21v-2a4 4 0 0 1 4-4h3M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
          </svg>
        ),
      },
      {
        title: "Careers",
        desc: "Join our team and make a difference locally",
        href: "/about/careers",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 12v4M10 14h4" />
          </svg>
        ),
      },
      {
        title: "Press & News",
        desc: "Latest announcements and bank news",
        href: "/about/news",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
            <path d="M14 2v6h6M2 15h10M2 12h10M2 18h7" />
          </svg>
        ),
      },
      {
        title: "Contact Us",
        desc: "We're always here to help you",
        href: "/about/contact",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
    ],
  },
};

const NAV_KEYS = Object.keys(MENU_DATA) as (keyof typeof MENU_DATA)[];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(name);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 12) {
        el.style.boxShadow = "0 6px 24px -12px rgba(140,29,37,.28)";
        el.style.background = "rgba(248,249,250,.96)";
      } else {
        el.style.boxShadow = "none";
        el.style.background = "rgba(248,249,250,.88)";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActiveMenu(null); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeData = activeMenu ? MENU_DATA[activeMenu as keyof typeof MENU_DATA] : null;

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(248,249,250,.88)",
          backdropFilter: "saturate(180%) blur(14px)",
          borderBottom: "1px solid rgba(17,24,39,.06)",
          transition: "box-shadow .25s ease, background .25s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 32px",
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fscb-horizontal-logo.webp" alt="FSCB — First State Community Bank" style={{ height: 38, width: "auto" }} />
          </Link>

          {/* Desktop nav */}
          <nav className="nav-links" style={{ fontSize: 14.5, fontWeight: 500, color: "#111827" }}>
            {NAV_KEYS.map((key) => (
              <div
                key={key}
                onMouseEnter={() => openMenu(key)}
                onMouseLeave={scheduleClose}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
              >
                <span
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 2px",
                    color: activeMenu === key ? "#8C1D25" : "#111827",
                    fontWeight: activeMenu === key ? 600 : 500,
                    transition: "color .15s",
                  }}
                >
                  {key}
                  <svg
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    style={{ transition: "transform .2s", transform: activeMenu === key ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="nav-cta">
            <Link href="/login" style={{ background: "none", border: "none", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, color: "#8C1D25", cursor: "pointer", padding: "10px 8px", textDecoration: "none" }}>
              Log in
            </Link>
            <Link
              href="/open-account"
              style={{ background: "#8C1D25", color: "#fff", border: "none", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, padding: "11px 22px", borderRadius: 12, cursor: "pointer", boxShadow: "0 4px 14px rgba(140,29,37,.28)", transition: "all .2s ease", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = "translateY(-1px)"; a.style.boxShadow = "0 8px 22px rgba(140,29,37,.38)"; }}
              onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = ""; a.style.boxShadow = "0 4px 14px rgba(140,29,37,.28)"; }}
            >
              Open Account
            </Link>
          </div>

          {/* Hamburger */}
          <button className="nav-mobile-btn" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            )}
          </button>
        </div>

        {/* ── Mega menu panel ───────────────────────────────────────────── */}
        {activeData && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              borderTop: "1px solid rgba(17,24,39,.07)",
              boxShadow: "0 24px 48px -12px rgba(17,24,39,.18)",
              zIndex: 100,
            }}
          >
            <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 36px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48 }}>
              {/* Left: category header */}
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#8C1D25", fontWeight: 700, marginBottom: 8 }}>
                  {activeMenu}
                </div>
                <h3 style={{ fontFamily: "var(--font-montserrat),'Libre Franklin',sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1.2, margin: "0 0 10px", color: "#111827" }}>
                  {activeData.tagline}
                </h3>
                <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.55, margin: "0 0 22px" }}>
                  Personalized service from people who know you by name.
                </p>
                <Link
                  href={activeData.viewAll}
                  onClick={() => setActiveMenu(null)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700, color: "#8C1D25", textDecoration: "none" }}
                >
                  View all
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C1D25" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>

              {/* Right: 2-col grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                {activeData.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveMenu(null)}
                    style={{ textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 14px", borderRadius: 12, transition: "background .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(140,29,37,.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                  >
                    <div style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8C1D25" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-montserrat),'Libre Franklin',sans-serif", fontWeight: 700, fontSize: 14.5, color: "#111827", marginBottom: 2 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.45 }}>
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      <div className={`mobile-nav-overlay${menuOpen ? " open" : ""}`}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 74, borderBottom: "1px solid rgba(17,24,39,.06)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fscb-horizontal-logo.webp" alt="FSCB — First State Community Bank" style={{ height: 34, width: "auto" }} />
          </Link>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#111827" }} onClick={() => setMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Accordion links */}
        <nav style={{ paddingTop: 4 }}>
          {NAV_KEYS.map((key) => {
            const isOpen = mobileExpanded === key;
            const data = MENU_DATA[key];
            return (
              <div key={key} style={{ borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                <button
                  onClick={() => setMobileExpanded(isOpen ? null : key)}
                  style={{ width: "100%", background: "none", border: "none", fontSize: 17, fontWeight: 600, color: "#111827", padding: "17px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit" }}
                >
                  {key}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" style={{ transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: 8 }}>
                    {data.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "11px 0 11px 4px" }}
                      >
                        <div style={{ flex: "none", width: 34, height: 34, borderRadius: 9, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8C1D25" }}>
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14.5, color: "#111827" }}>{item.title}</div>
                          <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 1 }}>{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile CTAs */}
        <div style={{ paddingBottom: 40, paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/open-account" onClick={() => setMenuOpen(false)} style={{ background: "#8C1D25", color: "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 700, padding: 16, borderRadius: 14, cursor: "pointer", width: "100%", textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}>
            Open Account
          </Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ background: "none", border: "1.5px solid rgba(17,24,39,.14)", fontFamily: "inherit", fontSize: 16, fontWeight: 600, padding: 16, borderRadius: 14, cursor: "pointer", color: "#8C1D25", width: "100%", textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}>
            Log in
          </Link>
        </div>
      </div>
    </>
  );
}
