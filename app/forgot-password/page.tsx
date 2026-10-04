"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "13px 16px", fontSize: 15, borderRadius: 10,
  border: "1.5px solid rgba(17,24,39,.15)", outline: "none",
  boxSizing: "border-box", background: "#fff", color: DARK, fontFamily: "inherit",
  transition: "border-color .15s",
};

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="mob-login-wrap" style={{ display: "flex", minHeight: "100vh", fontFamily: FONT }}>

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div className="mob-login-left" style={{
        width: 420, flexShrink: 0,
        background: "linear-gradient(160deg,#1a0509,#5a1018,#8C1D25)",
        padding: "44px 40px", display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,.035)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -60, right: -70, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.025)", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 52 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Logo height={38} variant="light" />
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>Forgot your password?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.68)", lineHeight: 1.65, margin: "0 0 32px" }}>
            No problem. Enter the email address tied to your Safeguard Global account and we&apos;ll send you a reset link.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Reset link expires after 1 hour" },
              { icon: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z", text: "Check your spam folder if you don’t see it" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "256-bit SSL secured" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,.65)", fontSize: 13.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d={icon} />
                </svg>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 20, fontSize: 12.5, color: "rgba(255,255,255,.4)" }}>
          Need help? Call <span style={{ color: "rgba(255,255,255,.7)", fontWeight: 600 }}>1-800-555-SAFE</span> Mon–Fri 9am–5pm
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div className="mob-login-right" style={{
        flex: 1, minWidth: 0, background: "#F8F9FA",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            {sent ? (
              /* ── Success state ── */
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                </div>
                <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: DARK, margin: "0 0 10px", letterSpacing: "-.02em" }}>Check your inbox</h1>
                <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: "0 0 8px" }}>
                  We sent a password reset link to
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 32px" }}>{email}</p>

                <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 14, padding: "20px 22px", textAlign: "left", marginBottom: 28 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: DARK, marginBottom: 12 }}>Didn&apos;t receive it?</div>
                  {["Check your spam or junk folder.", "Make sure you entered the correct email.", "The link expires in 1 hour — request a new one if needed."].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
                      <span style={{ color: RED, fontWeight: 700, flexShrink: 0, fontSize: 14 }}>·</span>
                      <span style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => { setEmail(""); setSent(false); }}
                    style={{ width: "100%", background: RED, color: "#fff", border: "none", fontFamily: FONT, fontSize: 14.5, fontWeight: 700, padding: "13px", borderRadius: 12, cursor: "pointer" }}
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/login"
                    style={{ display: "block", textAlign: "center", fontSize: 14, fontWeight: 600, color: GRAY, textDecoration: "none" }}
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div style={{ marginBottom: 32 }}>
                  <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: GRAY, textDecoration: "none", marginBottom: 28 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                    Back to sign in
                  </Link>
                  <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: DARK, margin: "0 0 8px", letterSpacing: "-.025em" }}>Reset your password</h1>
                  <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.55 }}>
                    Enter the email address on your Safeguard Global account and we&apos;ll send a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {error && (
                    <div style={{ background: "rgba(140,29,37,.07)", border: "1px solid rgba(140,29,37,.22)", borderRadius: 10, padding: "11px 15px", fontSize: 13.5, color: RED, display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                      {error}
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 7 }}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      autoFocus
                      style={INPUT}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = RED; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.15)"; }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", background: loading ? "rgba(140,29,37,.65)" : RED,
                      color: "#fff", border: "none", fontFamily: FONT, fontSize: 15.5, fontWeight: 700,
                      padding: "15px", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: loading ? "none" : "0 6px 20px -4px rgba(140,29,37,.45)",
                      letterSpacing: ".01em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      transition: "background .2s, box-shadow .2s",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          style={{ animation: "spin 0.75s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Sending reset link…
                      </>
                    ) : "Send Reset Link"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ padding: "14px 48px", borderTop: "1px solid rgba(17,24,39,.07)", background: "#fff", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: GRAY }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            256-bit SSL Secured
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: GRAY }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Member FDIC
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18, fontSize: 12 }}>
            <Link href="/privacy" style={{ color: GRAY, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: GRAY, textDecoration: "none" }}>Terms of Use</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
