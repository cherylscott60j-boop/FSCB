"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "13px 16px", fontSize: 15, borderRadius: 10,
  border: "1.5px solid rgba(17,24,39,.13)", outline: "none",
  boxSizing: "border-box", background: "#FAFAFA", color: DARK,
  fontFamily: "inherit", transition: "border-color .15s, background .15s",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: username, password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message ?? "Invalid credentials. Please try again.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next") ?? "/dashboard";
    window.location.href = next;
  }

  return (
    <div className="mob-login-wrap" style={{ display: "flex", minHeight: "100vh", fontFamily: FONT }}>

      {/* ═══════════════════════════════════════════════════════
          LEFT — full-height photo with maroon overlay
      ═══════════════════════════════════════════════════════ */}
      <div
        className="mob-login-left"
        style={{
          width: 500, flexShrink: 0,
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80")`,
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />

        {/* Gradient overlay — dark at top, maroon-tinted at bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(175deg, rgba(10,2,4,0.88) 0%, rgba(60,8,16,0.82) 45%, rgba(140,29,37,0.78) 100%)",
        }} />

        {/* Subtle vignette on the right edge for a clean split */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, transparent 70%, rgba(10,2,4,0.35) 100%)",
        }} />

        {/* Content sits above overlays */}
        <div style={{ position: "relative", zIndex: 1, padding: "44px 48px", display: "flex", flexDirection: "column", flex: 1 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(212,175,55,.18)", border: "1px solid rgba(212,175,55,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 19V8.5L12 4l8 4.5V19" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, color: "#fff", display: "block", lineHeight: 1 }}>FSCB</span>
              <span style={{ fontSize: 9, letterSpacing: ".35em", color: "rgba(255,255,255,.45)", display: "block", marginTop: 3 }}>COMMUNITY BANK</span>
            </div>
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Hero text */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-.03em" }}>
              Banking built<br />for your community.
            </h2>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,.62)", lineHeight: 1.65, margin: 0, maxWidth: 340 }}>
              Trusted by families and businesses across the region since 1987. Your money, your neighbors, your bank.
            </p>
          </div>

          {/* Trust stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            {[
              { value: "$250K", label: "FDIC Insured" },
              { value: "37+",   label: "Years Serving" },
              { value: "24/7",  label: "Fraud Monitoring" },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, padding: "14px 12px",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 14, textAlign: "center",
                backdropFilter: "blur(6px)",
              }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: GOLD, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Security notice */}
          <div style={{ padding: "13px 16px", background: "rgba(0,0,0,.28)", borderRadius: 10, borderLeft: `3px solid rgba(212,175,55,.5)`, backdropFilter: "blur(4px)" }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", lineHeight: 1.55, margin: 0 }}>
              FSCB will <strong style={{ color: "rgba(255,255,255,.72)" }}>never</strong> ask for your password via email or phone.
              Questions? Call <a href="tel:18002372669" style={{ color: "rgba(212,175,55,.8)", textDecoration: "none", fontWeight: 700 }}>1-800-FSCB-NOW</a>.
            </p>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          RIGHT — login form
      ═══════════════════════════════════════════════════════ */}
      <div
        className="mob-login-right"
        style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column" }}
      >
        {/* Top bar */}
        <div style={{ padding: "18px 52px", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
          <Link href="/" style={{ fontSize: 13, color: GRAY, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back to fscb.com
          </Link>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 52px" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Heading */}
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 33, color: DARK, margin: "0 0 8px", letterSpacing: "-.03em" }}>Welcome back</h1>
              <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.5 }}>Sign in to your FSCB account</p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Error banner */}
              {error && (
                <div style={{ background: "rgba(140,29,37,.06)", border: "1px solid rgba(140,29,37,.2)", borderRadius: 10, padding: "12px 15px", fontSize: 13.5, color: RED, display: "flex", alignItems: "center", gap: 9 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 7 }}>Email Address</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  style={INPUT}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = RED; (e.target as HTMLInputElement).style.background = "#fff"; }}
                  onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.13)"; (e.target as HTMLInputElement).style.background = "#FAFAFA"; }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <label style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: RED, textDecoration: "none" }}>Forgot password?</Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ ...INPUT, paddingRight: 50 }}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = RED; (e.target as HTMLInputElement).style.background = "#fff"; }}
                    onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.13)"; (e.target as HTMLInputElement).style.background = "#FAFAFA"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 2, display: "flex" }}
                  >
                    {showPw ? (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", background: loading ? "rgba(140,29,37,.6)" : RED,
                  color: "#fff", border: "none", fontFamily: FONT, fontSize: 15.5, fontWeight: 700,
                  padding: "15px", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 6px 24px -4px rgba(140,29,37,.5)",
                  letterSpacing: ".01em", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 10, transition: "background .2s, box-shadow .2s",
                }}
              >
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: "spin 0.75s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in…
                  </>
                ) : "Sign In →"}
              </button>

            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
              <span style={{ fontSize: 12.5, color: "rgba(17,24,39,.3)", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
            </div>

            {/* CTA cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href="/open-account"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#FAFAFA", border: "1.5px solid rgba(17,24,39,.09)",
                  borderRadius: 13, padding: "16px 20px", textDecoration: "none",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = RED)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(17,24,39,.09)")}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>New to FSCB?</div>
                  <div style={{ fontSize: 12.5, color: GRAY }}>Open an account in minutes</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link
                href="/open-account"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#FAFAFA", border: "1.5px solid rgba(17,24,39,.09)",
                  borderRadius: 13, padding: "16px 20px", textDecoration: "none",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = RED)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(17,24,39,.09)")}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>Have an account but no online access?</div>
                  <div style={{ fontSize: 12.5, color: GRAY }}>Enroll in online banking</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ padding: "14px 52px", borderTop: "1px solid rgba(17,24,39,.06)", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "256-bit SSL" },
            { icon: "M3 11h18M5 11V8h4v3M5 21h14M4 21V11M20 21V11M9 21v-5h6v5", label: "Equal Housing" },
            { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z", label: "Member FDIC" },
          ].map((b) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={b.icon} /></svg>
              {b.label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 16, fontSize: 12 }}>
            <Link href="/privacy" style={{ color: GRAY, textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms"   style={{ color: GRAY, textDecoration: "none" }}>Terms</Link>
            <Link href="/accessibility" style={{ color: GRAY, textDecoration: "none" }}>Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
