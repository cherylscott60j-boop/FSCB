"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
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

const LOGIN_CSS = `
.login-flat-input::placeholder { color: rgba(255,255,255,.5); }
.login-flat-input:-webkit-autofill { -webkit-text-fill-color: #fff; -webkit-box-shadow: 0 0 0 1000px #0800FF inset; caret-color: #fff; }
@media (max-width: 1000px) {
  .login-float-transfer { display: none !important; }
}
@media (max-width: 860px) {
  .login-wrap { flex-direction: column !important; min-height: auto !important; }
  .login-right { position: relative !important; width: 100% !important; height: auto !important; aspect-ratio: 16 / 9 !important; flex: none !important; }
  .login-left { max-width: none !important; width: 100% !important; padding: 40px 24px 48px !important; justify-content: flex-start !important; }
  .login-float { display: none !important; }
}
@media (max-width: 480px) {
  .login-left { padding: 32px 18px 40px !important; }
  .login-left h1 { font-size: 25px !important; }
}
`;

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

  const focusOn  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderBottomColor = "#fff"; };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderBottomColor = "rgba(255,255,255,.35)"; };

  const linkCard: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    border: "1px solid rgba(255,255,255,.28)", borderRadius: 8,
    padding: "14px 18px", textDecoration: "none", transition: "border-color .15s, background .15s",
  };

  return (
    <div className="login-wrap" style={{ minHeight: "100vh", fontFamily: FONT, background: BLUE, display: "flex" }}>

      {/* Left: login, flat on blue — no card */}
      <div className="login-left" style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "56px 48px" }}>
      <div className="login-left-inner" style={{ width: "100%", maxWidth: 440 }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 40 }}>
          <Logo variant="light" height={36} />
        </Link>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "#fff", margin: "0 0 8px", letterSpacing: "-.02em" }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", margin: 0, lineHeight: 1.5 }}>Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {error && (
            <div role="alert" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.4)", borderRadius: 4, padding: "12px 15px", fontSize: 13.5, color: "#fff", display: "flex", alignItems: "center", gap: 9 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#fff", marginBottom: 7 }}>Email address</label>
            <input id="login-email" className="login-flat-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" style={INPUT} onFocus={focusOn} onBlur={focusOff} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <label htmlFor="login-password" style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "underline" }}>Forgot password?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <input id="login-password" className="login-flat-input" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" style={{ ...INPUT, paddingRight: 32 }} onFocus={focusOn} onBlur={focusOff} />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.7)", padding: 2, display: "flex" }}>
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
                Logging in…
              </>
            ) : "Log in"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.2)" }} />
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.2)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {[
            { t: "New to us?", d: "Open an account in about 5 minutes", href: "/open-account" },
            { t: "Have an account but no online access?", d: "Register for online banking", href: "/open-account" },
          ].map((c) => (
            <Link key={c.t} href={c.href} style={linkCard}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.28)"; e.currentTarget.style.background = "transparent"; }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{c.t}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)" }}>{c.d}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 24 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          </svg>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.6, margin: 0 }}>
            We&apos;ll <strong style={{ color: "#fff" }}>never</strong> ask for your password, PIN or a one-time code by email, text or phone.
            Not sure? Call us on <a href="tel:5553021900" style={{ color: "#fff", fontWeight: 700 }}>(555) 302-1900</a>.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12, color: "rgba(255,255,255,.65)" }}>
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
      <div className="login-right" style={{ position: "relative", flex: "1 1 50%", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bc1.webp"
          alt="A customer managing her account on a laptop"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "32% 50%", display: "block" }}
        />

        {/* Transfer sent */}
        <div className="login-float login-float-transfer" style={{ position: "absolute", top: "6%", left: "6%", background: "#fff", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 11, minWidth: 200, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#1C9A5B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 11.5, color: "#6B7280" }}>Transfer sent · Just now</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#111827" }}>$250.00 to Alex</span>
          </span>
        </div>

        {/* Salary received */}
        <div className="login-float" style={{ position: "absolute", top: "6%", right: "6%", background: "#fff", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 220, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 12, color: "#6B7280" }}>Salary received · Today</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 17, color: "#111827" }}>+$1,850.00</span>
          </span>
        </div>

        {/* Available balance */}
        <div className="login-float" style={{ position: "absolute", top: "23%", right: "6%", background: "#fff", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 220, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20M17 15h.01" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 12, color: "#6B7280" }}>Available balance</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 17, color: "#111827" }}>$12,480.16</span>
          </span>
        </div>

        {/* Savings goal progress */}
        <div className="login-float" style={{ position: "absolute", bottom: "11%", right: "7%", background: "#fff", borderRadius: 8, padding: "16px 18px", minWidth: 220, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Vacation fund</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>68%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(17,24,39,.08)", overflow: "hidden", marginBottom: 9 }}>
            <div style={{ width: "68%", height: "100%", background: BLUE, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>$3,400 of $5,000</div>
        </div>

        {/* Card status */}
        <div className="login-float" style={{ position: "absolute", bottom: "7%", left: "6%", background: "#fff", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 11, minWidth: 190, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 11.5, color: "#6B7280" }}>Card •••• 4821</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#111827" }}>Active</span>
          </span>
        </div>
      </div>

      <style>{LOGIN_CSS}</style>
    </div>
  );
}
