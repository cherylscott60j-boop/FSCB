"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const RED  = "#E31E24";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "11px 2px", fontSize: 15, borderRadius: 0,
  border: "none", borderBottom: "1.5px solid rgba(255,255,255,.35)", outline: "none",
  boxSizing: "border-box", background: "transparent", color: "#fff",
  fontFamily: "inherit", transition: "border-color .15s",
};

const PAGE_CSS = `
.fp-flat-input::placeholder { color: rgba(255,255,255,.5); }
.fp-flat-input:-webkit-autofill { -webkit-text-fill-color: #fff; -webkit-box-shadow: 0 0 0 1000px #0800FF inset; caret-color: #fff; }
@media (max-width: 860px) {
  .fp-wrap { flex-direction: column !important; min-height: auto !important; }
  .fp-right { position: relative !important; width: 100% !important; height: auto !important; aspect-ratio: 16 / 9 !important; flex: none !important; }
  .fp-left { max-width: none !important; width: 100% !important; padding: 40px 24px 48px !important; justify-content: flex-start !important; }
}
@media (max-width: 480px) {
  .fp-left { padding: 32px 18px 40px !important; }
  .fp-left h1 { font-size: 25px !important; }
}
`;

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

  const focusOn  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderBottomColor = "#fff"; };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderBottomColor = "rgba(255,255,255,.35)"; };

  const outlineBtn: React.CSSProperties = {
    width: "100%", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.4)",
    fontFamily: FONT, fontSize: 14.5, fontWeight: 700, padding: "13px", borderRadius: 4, cursor: "pointer",
  };

  return (
    <div className="fp-wrap" style={{ minHeight: "100vh", fontFamily: FONT, background: BLUE, display: "flex" }}>

      {/* Left: flat on blue — no card */}
      <div className="fp-left" style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "56px 48px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 40 }}>
          <Logo variant="light" height={36} />
        </Link>

        {sent ? (
          /* ── Success state ── */
          <div>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
            </div>
            <h1 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "#fff", margin: "0 0 8px", letterSpacing: "-.02em" }}>Check your inbox</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", margin: "0 0 4px", lineHeight: 1.55 }}>We sent a password reset link to</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 28px" }}>{email}</p>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "#fff", marginBottom: 12 }}>Didn&apos;t receive it?</div>
              {["Check your spam or junk folder.", "Make sure you entered the correct email.", "The link expires in 1 hour — request a new one if needed."].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
                  <span style={{ color: "rgba(255,255,255,.5)", fontWeight: 700, flexShrink: 0, fontSize: 14 }}>·</span>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.75)", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={() => { setEmail(""); setSent(false); }} style={outlineBtn}>
                Try a different email
              </button>
              <Link href="/login" style={{ display: "block", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "underline" }}>
                ← Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.75)", textDecoration: "none", marginBottom: 28 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to sign in
            </Link>

            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "#fff", margin: "0 0 8px", letterSpacing: "-.02em" }}>Reset your password</h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", margin: 0, lineHeight: 1.55 }}>
                Enter the email address on your account and we&apos;ll send a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {error && (
                <div role="alert" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.4)", borderRadius: 4, padding: "12px 15px", fontSize: 13.5, color: "#fff", display: "flex", alignItems: "center", gap: 9 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#fff", marginBottom: 7 }}>Email address</label>
                <input
                  className="fp-flat-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  style={INPUT}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", background: loading ? "rgba(227,30,36,.6)" : RED,
                color: "#fff", border: "none", fontFamily: FONT, fontSize: 15.5, fontWeight: 700,
                padding: "15px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background .2s",
              }}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.75s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Sending reset link…
                  </>
                ) : "Send reset link"}
              </button>
            </form>

            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", margin: "24px 0" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
              </svg>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.6, margin: 0 }}>
                We&apos;ll <strong style={{ color: "#fff" }}>never</strong> ask for your password, PIN or a one-time code by email, text or phone.
                Not sure? Call us on <a href="tel:5553021900" style={{ color: "#fff", fontWeight: 700 }}>(555) 302-1900</a>.
              </p>
            </div>
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12, color: "rgba(255,255,255,.65)", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
            Encrypted connection
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
            <Link href="/accessibility" style={{ color: "rgba(255,255,255,.65)", textDecoration: "none" }}>Accessibility</Link>
            <Link href="/privacy" style={{ color: "rgba(255,255,255,.65)", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "rgba(255,255,255,.65)", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </div>
      </div>

      {/* Right: full-bleed photo */}
      <div className="fp-right" style={{ position: "relative", flex: "1 1 50%", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bc1.webp"
          alt="A customer managing her account on a laptop"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "32% 50%", display: "block" }}
        />
      </div>

      <style>{PAGE_CSS}</style>
    </div>
  );
}
