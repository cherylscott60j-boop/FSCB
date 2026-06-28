"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ).auth.getUser().then(({ data: { user } }) => {
      if (user) window.location.replace("/dashboard");
    });
  }, []);

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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: username, password,
    });
    if (authError) {
      setLoading(false);
      setError(authError.message ?? "Invalid credentials. Please try again.");
      return;
    }
    const explicit = new URLSearchParams(window.location.search).get("next");
    if (explicit) { window.location.href = explicit; return; }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();
    setLoading(false);
    window.location.href = (profile as Record<string,string>|null)?.role === "admin" ? "/cpanel" : "/dashboard";
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, position: "relative" }}>

      {/* ── Full-page background image ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80")`,
        backgroundSize: "cover", backgroundPosition: "center 30%",
      }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "linear-gradient(135deg, rgba(6,1,2,0.82) 0%, rgba(40,6,12,0.78) 40%, rgba(100,20,30,0.65) 100%)" }} />

      {/* ── Content layer ── */}
      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <div className="mob-login-wrap" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 460px", gap: 0, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 60px", alignItems: "center" }}>

          {/* ── Left: hero content overlaid on image ── */}
          <div className="mob-login-left" style={{ padding: "60px 60px 60px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 64 }}>
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

            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: "#fff", margin: "0 0 18px", lineHeight: 1.08, letterSpacing: "-.03em" }}>
              Banking built<br />for your community.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.65, margin: "0 0 44px", maxWidth: 380 }}>
              Trusted by families and businesses across the region since 1987. Your money, your neighbors, your bank.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              {[
                { value: "$250K", label: "FDIC Insured" },
                { value: "37+",   label: "Years Serving" },
                { value: "24/7",  label: "Fraud Monitoring" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, padding: "14px 12px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, textAlign: "center", backdropFilter: "blur(6px)" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: GOLD, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "13px 16px", background: "rgba(0,0,0,.28)", borderRadius: 10, borderLeft: `3px solid rgba(212,175,55,.5)`, backdropFilter: "blur(4px)", maxWidth: 400 }}>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", lineHeight: 1.55, margin: 0 }}>
                FSCB will <strong style={{ color: "rgba(255,255,255,.72)" }}>never</strong> ask for your password via email or phone.
                Questions? Call <a href="tel:18002372669" style={{ color: "rgba(212,175,55,.8)", textDecoration: "none", fontWeight: 700 }}>1-800-FSCB-NOW</a>.
              </p>
            </div>
          </div>

          {/* ── Right: form card ── */}
          <div className="mob-login-right" style={{ padding: "40px 0" }}>
            <div className="login-card" style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,.35)", overflow: "hidden" }}>

              {/* Top bar */}
              <div className="login-card-header" style={{ padding: "16px 32px", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                <Link href="/" style={{ fontSize: 13, color: GRAY, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                  Back to fscb.com
                </Link>
              </div>

              <div className="login-card-body" style={{ padding: "36px 32px 32px" }}>
                {/* Heading */}
                <div style={{ marginBottom: 32 }}>
                  <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: DARK, margin: "0 0 6px", letterSpacing: "-.03em" }}>Welcome back</h1>
                  <p style={{ fontSize: 14.5, color: GRAY, margin: 0, lineHeight: 1.5 }}>Sign in to your FSCB account</p>
                </div>

                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {error && (
                    <div style={{ background: "rgba(140,29,37,.06)", border: "1px solid rgba(140,29,37,.2)", borderRadius: 10, padding: "12px 15px", fontSize: 13.5, color: RED, display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                      {error}
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 7 }}>Email Address</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" style={INPUT}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = RED; (e.target as HTMLInputElement).style.background = "#fff"; }}
                      onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.13)"; (e.target as HTMLInputElement).style.background = "#FAFAFA"; }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <label style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>Password</label>
                      <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: RED, textDecoration: "none" }}>Forgot password?</Link>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" style={{ ...INPUT, paddingRight: 50 }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = RED; (e.target as HTMLInputElement).style.background = "#fff"; }}
                        onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.13)"; (e.target as HTMLInputElement).style.background = "#FAFAFA"; }}
                      />
                      <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 2, display: "flex" }}>
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

                  <button type="submit" disabled={loading} style={{
                    width: "100%", background: loading ? "rgba(140,29,37,.6)" : RED,
                    color: "#fff", border: "none", fontFamily: FONT, fontSize: 15.5, fontWeight: 700,
                    padding: "15px", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 6px 24px -4px rgba(140,29,37,.5)",
                    letterSpacing: ".01em", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 10, transition: "background .2s, box-shadow .2s",
                  }}>
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.75s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Signing in…
                      </>
                    ) : "Sign In →"}
                  </button>

                </form>

                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
                  <span style={{ fontSize: 12.5, color: "rgba(17,24,39,.3)", fontWeight: 500 }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Link href="/open-account" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAFA", border: "1.5px solid rgba(17,24,39,.09)", borderRadius: 13, padding: "14px 18px", textDecoration: "none", transition: "border-color .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = RED)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(17,24,39,.09)")}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>New to FSCB?</div>
                      <div style={{ fontSize: 12.5, color: GRAY }}>Open an account in minutes</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                  <Link href="/open-account" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAFA", border: "1.5px solid rgba(17,24,39,.09)", borderRadius: 13, padding: "14px 18px", textDecoration: "none", transition: "border-color .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = RED)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(17,24,39,.09)")}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>Have an account but no online access?</div>
                      <div style={{ fontSize: 12.5, color: GRAY }}>Enroll in online banking</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="login-card-footer" style={{ padding: "14px 32px", borderTop: "1px solid rgba(17,24,39,.06)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: "#FAFAFA" }}>
                {[
                  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "256-bit SSL" },
                  { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z", label: "Member FDIC" },
                ].map((b) => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: GRAY }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={b.icon} /></svg>
                    {b.label}
                  </div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", gap: 14, fontSize: 11.5 }}>
                  <Link href="/privacy" style={{ color: GRAY, textDecoration: "none" }}>Privacy</Link>
                  <Link href="/terms"   style={{ color: GRAY, textDecoration: "none" }}>Terms</Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
