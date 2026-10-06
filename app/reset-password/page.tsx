"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

const RED  = "#E31E24";
const GOLD = "#D4AF37";
const DARK = "#111827";
const MID  = "#374151";
const GRAY = "#6B7280";
const FONT = "var(--font-poppins), sans-serif";
const INP: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid rgba(17,24,39,.18)", borderRadius:9, fontSize:14, fontFamily:"inherit", color:DARK, outline:"none", boxSizing:"border-box" };

type Status = "waiting" | "ready" | "success" | "error";

export default function ResetPasswordPage() {
  const [status,   setStatus]   = useState<Status>("waiting");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    // PKCE flow: auth/callback exchanges the code server-side and appends ?ready=1
    if (new URLSearchParams(window.location.search).get("ready") === "1") {
      setStatus("ready");
      return;
    }
    const sb = createClient();
    // Implicit/magic-link flow: PASSWORD_RECOVERY fires when the client processes the token
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });
    // Fallback: existing session (e.g. tab reload after PKCE exchange)
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus("ready");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setLoading(true);
    const sb = createClient();
    const { error } = await sb.auth.updateUser({ password });
    if (error) { setErr(error.message); setLoading(false); return; }
    setStatus("success");
    setTimeout(() => { window.location.href = "/dashboard"; }, 3000);
  }

  function strength(pw: string): { label: string; color: string; width: string } {
    if (!pw) return { label: "", color: "transparent", width: "0%" };
    const has = (r: RegExp) => r.test(pw);
    const score = [pw.length >= 8, pw.length >= 12, has(/[A-Z]/), has(/[0-9]/), has(/[^A-Za-z0-9]/)].filter(Boolean).length;
    if (score <= 2) return { label: "Weak",   color: "#DC2626", width: "33%" };
    if (score <= 3) return { label: "Fair",   color: "#D97706", width: "60%" };
    if (score === 4) return { label: "Good",  color: "#2563EB", width: "80%" };
    return               { label: "Strong", color: "#16A34A", width: "100%" };
  }

  const str = strength(password);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter,system-ui,sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 4px 32px rgba(17,24,39,.1)", border: "1px solid rgba(17,24,39,.06)" }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <Logo variant="dark" height={36} />
        </div>

        {/* ── Success ── */}
        {status === "success" && (
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(22,163,74,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#16A34A" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, margin: "0 0 10px" }}>Password Updated!</h2>
            <p style={{ color: GRAY, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Your password has been changed successfully. Redirecting you to your dashboard…</p>
            <div style={{ height: 3, background: "rgba(17,24,39,.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", background: RED, borderRadius: 99, animation: "sgginv-progress 3s linear forwards" }}/>
            </div>
          </div>
        )}

        {/* ── Waiting for recovery event ── */}
        {status === "waiting" && (
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(227,30,36,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: RED }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2"/></svg>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, margin: "0 0 10px" }}>Waiting for link…</h2>
            <p style={{ color: GRAY, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              Please open the password reset link from your email. If you arrived here directly, request a new link below.
            </p>
            <Link href="/forgot-password" style={{ display: "inline-block", background: RED, color: "#fff", borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Request new link
            </Link>
            <div style={{ marginTop: 16 }}>
              <Link href="/login" style={{ fontSize: 13, color: GRAY, textDecoration: "none" }}>← Back to sign in</Link>
            </div>
          </div>
        )}

        {/* ── Reset form ── */}
        {status === "ready" && (
          <>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 6px" }}>Set New Password</h2>
            <p style={{ color: GRAY, fontSize: 13.5, margin: "0 0 24px", lineHeight: 1.5 }}>Choose a strong password for your SGGINV account.</p>

            <form onSubmit={handleSubmit}>
              {/* New password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ ...INP, paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, lineHeight: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPw
                        ? <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                        : <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                      }
                    </svg>
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "rgba(17,24,39,.08)", borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ height: "100%", width: str.width, background: str.color, borderRadius: 99, transition: "all .3s" }}/>
                    </div>
                    <span style={{ fontSize: 11.5, color: str.color, fontWeight: 600 }}>{str.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCf ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    style={{ ...INP, paddingRight: 42, borderColor: confirm && confirm !== password ? "#DC2626" : undefined }}
                  />
                  <button type="button" onClick={() => setShowCf(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, lineHeight: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showCf
                        ? <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                        : <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                      }
                    </svg>
                  </button>
                </div>
                {confirm && confirm !== password && <p style={{ fontSize: 12, color: "#DC2626", margin: "5px 0 0" }}>Passwords do not match</p>}
              </div>

              {err && <div style={{ fontSize: 13, color: "#DC2626", background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{err}</div>}

              <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "rgba(227,30,36,.5)" : RED, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: FONT, transition: "opacity .15s" }}>
                {loading ? "Updating password…" : "Set New Password"}
              </button>
            </form>

            <div style={{ marginTop: 18, textAlign: "center" }}>
              <Link href="/login" style={{ fontSize: 13, color: GRAY, textDecoration: "none" }}>← Back to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
