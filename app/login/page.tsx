"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Logo from "@/components/Logo";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";
const GRAY = "#6B7280";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "13px 16px", fontSize: 15, borderRadius: 4,
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

  const focusOn  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = BLUE; e.target.style.background = "#fff"; };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(17,24,39,.13)"; e.target.style.background = "#FAFAFA"; };

  const linkCard: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 8,
    padding: "14px 18px", textDecoration: "none", transition: "border-color .15s",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, background: BLUE, display: "flex", flexDirection: "column" }}>

      <div className="mob-login-wrap" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 460px", gap: 0, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 60px", alignItems: "center" }}>

        {/* Left: welcome copy */}
        <div className="mob-login-left" style={{ padding: "60px 60px 60px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 64 }}>
            <Logo variant="light" height={40} />
          </Link>

          <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 14 }}>Online banking</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(30px, 3.6vw, 44px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.15, letterSpacing: "-.02em" }}>
            Your money, wherever<br />you are
          </h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,.8)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 420 }}>
            Check balances, move money, pay bills and manage your cards securely, any time of day.
          </p>

          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 44 }}>
            {[
              { value: "24/7", label: "Account access" },
              { value: "24/7", label: "Fraud support" },
              { value: "£0", label: "To use online banking" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#fff" }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", border: "1px solid rgba(255,255,255,.3)", borderRadius: 8, maxWidth: 440 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            </svg>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.82)", lineHeight: 1.6, margin: 0 }}>
              We&apos;ll <strong style={{ color: "#fff" }}>never</strong> ask for your password, PIN or a one-time code by email, text or phone.
              Not sure? Call us on <a href="tel:5553021900" style={{ color: "#fff", fontWeight: 700 }}>(555) 302-1900</a>.
            </p>
          </div>
        </div>

        {/* Right: form card */}
        <div className="mob-login-right" style={{ padding: "40px 0" }}>
          <div className="login-card" style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>

            <div className="login-card-header" style={{ padding: "16px 32px", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
              <Link href="/" style={{ fontSize: 13, color: GRAY, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Back to homepage
              </Link>
            </div>

            <div className="login-card-body" style={{ padding: "36px 32px 32px" }}>
              <div style={{ marginBottom: 30 }}>
                <h1 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: DARK, margin: "0 0 6px", letterSpacing: "-.02em" }}>Welcome back</h1>
                <p style={{ fontSize: 14.5, color: GRAY, margin: 0, lineHeight: 1.5 }}>Log in to your account</p>
              </div>

              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {error && (
                  <div role="alert" style={{ background: "rgba(8,0,255,.06)", border: "1px solid rgba(8,0,255,.25)", borderRadius: 4, padding: "12px 15px", fontSize: 13.5, color: DARK, display: "flex", alignItems: "center", gap: 9 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 7 }}>Email address</label>
                  <input id="login-email" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" style={INPUT} onFocus={focusOn} onBlur={focusOff} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <label htmlFor="login-password" style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>Password</label>
                    <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: "none" }}>Forgot password?</Link>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input id="login-password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" style={{ ...INPUT, paddingRight: 50 }} onFocus={focusOn} onBlur={focusOff} />
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
                  width: "100%", background: loading ? "rgba(8,0,255,.6)" : BLUE,
                  color: "#fff", border: "none", fontFamily: FONT, fontSize: 15.5, fontWeight: 700,
                  padding: "15px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background .2s",
                }}>
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.75s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Logging in…
                    </>
                  ) : "Log in"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
                <span style={{ fontSize: 12.5, color: GRAY, fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(17,24,39,.08)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { t: "New to us?", d: "Open an account in about 5 minutes", href: "/open-account" },
                  { t: "Have an account but no online access?", d: "Register for online banking", href: "/open-account" },
                ].map((c) => (
                  <Link key={c.t} href={c.href} style={linkCard}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(17,24,39,.12)")}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>{c.t}</div>
                      <div style={{ fontSize: 12.5, color: GRAY }}>{c.d}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="login-card-footer" style={{ padding: "14px 32px", borderTop: "1px solid rgba(17,24,39,.08)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: "#F4F5FB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                Encrypted connection
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 14, fontSize: 12 }}>
                <Link href="/accessibility" style={{ color: GRAY, textDecoration: "none" }}>Accessibility</Link>
                <Link href="/privacy" style={{ color: GRAY, textDecoration: "none" }}>Privacy</Link>
                <Link href="/terms" style={{ color: GRAY, textDecoration: "none" }}>Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
