"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";
const GRAY = "#6B7280";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "13px 16px", border: "1.5px solid rgba(17,24,39,.12)",
  borderRadius: 4, fontSize: 14.5, fontFamily: "inherit", color: DARK,
  background: "#fff", boxSizing: "border-box", outline: "none",
  transition: "border-color .15s",
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", phone: "", topic: "", message: "" };

export default function ContactForm() {
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.06)", padding: "40px 36px", textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(8,0,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 10px" }}>Message sent</h3>
        <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.6, margin: "0 0 24px" }}>
          Thanks, <strong style={{ color: DARK }}>{form.name.split(" ")[0]}</strong>. A member of our team will reply at{" "}
          <strong style={{ color: DARK }}>{form.email}</strong> within one business day.
        </p>
        <button
          onClick={() => { setForm(EMPTY); setSent(false); }}
          style={{ background: "none", border: `1.5px solid ${BLUE}`, borderRadius: 4, padding: "11px 24px", fontSize: 14, fontWeight: 700, color: BLUE, cursor: "pointer", fontFamily: "inherit" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.06)", padding: "40px 36px" }}>
      {error && (
        <div style={{ background: "rgba(8,0,255,.06)", border: "1px solid rgba(8,0,255,.2)", borderRadius: 4, padding: "11px 15px", fontSize: 13.5, color: BLUE, display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>
            Full Name <span style={{ color: BLUE }}>*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            style={INPUT}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = BLUE; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.12)"; }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>
            Email Address <span style={{ color: BLUE }}>*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            style={INPUT}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = BLUE; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.12)"; }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(555) 000-0000"
            autoComplete="tel"
            style={INPUT}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = BLUE; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(17,24,39,.12)"; }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>How can we help?</label>
          <select
            value={form.topic}
            onChange={(e) => update("topic", e.target.value)}
            style={{ ...INPUT, cursor: "pointer" }}
          >
            <option value="">Select a topic…</option>
            <option value="account">Account question</option>
            <option value="loan">Loan inquiry</option>
            <option value="ob-support">Online banking support</option>
            <option value="new-account">New account inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>
            Message <span style={{ color: BLUE }}>*</span>
          </label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us how we can help…"
            style={{ ...INPUT, resize: "vertical" }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = BLUE; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(17,24,39,.12)"; }}
          />
        </div>

        <p style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.6, margin: 0 }}>
          Please don&apos;t include account numbers, card numbers, passwords or one-time codes in your message.
        </p>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "rgba(8,0,255,.6)" : BLUE,
            color: "#fff", border: "none", fontFamily: "inherit",
            fontSize: 15, fontWeight: 700, padding: 16, borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "background .2s",
          }}
        >
          {loading ? (
            <>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 0.75s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Sending…
            </>
          ) : "Send Message"}
        </button>
      </div>
    </form>
  );
}
