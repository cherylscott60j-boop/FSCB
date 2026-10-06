"use client";

import { useEffect, useState } from "react";

const BLUE = "#0800FF";
const DARK = "#111827";
const GRAY = "#6B7280";
const FONT = "var(--font-poppins), sans-serif";

const STORAGE_KEY = "sg-cookie-consent";

type Consent = { performance: boolean; marketing: boolean };

const CSS = `
@media (max-width: 680px) {
  .cc-row { flex-direction: column; align-items: stretch !important; }
  .cc-actions { justify-content: stretch !important; }
  .cc-actions button { flex: 1; }
}
`;

const solidBtn = {
  background: BLUE,
  color: "#fff",
  fontWeight: 700,
  fontSize: 13.5,
  padding: "11px 20px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

const outlineBtn = {
  background: "#fff",
  color: DARK,
  fontWeight: 600,
  fontSize: 13.5,
  padding: "11px 20px",
  borderRadius: 4,
  border: "1.5px solid rgba(17,24,39,.2)",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        border: "none",
        padding: 2,
        flexShrink: 0,
        background: checked ? BLUE : "rgba(17,24,39,.2)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.7 : 1,
        display: "flex",
        justifyContent: checked ? "flex-end" : "flex-start",
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", display: "block" }} />
    </button>
  );
}

function PrefRow({
  label, desc, checked, disabled, onChange,
}: { label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "12px 0", borderTop: "1px solid rgba(17,24,39,.08)" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: DARK, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Toggle checked={checked} disabled={disabled} onChange={onChange} />
    </div>
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [consent, setConsent] = useState<Consent>({ performance: false, marketing: false });

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(next: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, decidedAt: Date.now() }));
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1000,
        background: "#fff", borderTop: "1px solid rgba(17,24,39,.12)",
        boxShadow: "0 -8px 28px rgba(17,24,39,.14)", fontFamily: FONT,
      }}
    >
      <style>{CSS}</style>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 32px" }}>
        {!showPrefs ? (
          <div className="cc-row" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: DARK, maxWidth: 640 }}>
              We use cookies to keep your account secure and the site working, and — with your consent — to understand how the site is used and show you relevant information. See our{" "}
              <a href="/privacy#cookies" style={{ color: BLUE, textDecoration: "underline" }}>cookies notice</a>.
            </p>
            <div className="cc-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={outlineBtn} onClick={() => setShowPrefs(true)}>Manage preferences</button>
              <button style={outlineBtn} onClick={() => save({ performance: false, marketing: false })}>Reject non-essential</button>
              <button style={solidBtn} onClick={() => save({ performance: true, marketing: true })}>Accept all</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 4 }}>Manage cookie preferences</div>
                <div style={{ fontSize: 12.5, color: GRAY }}>Choose which cookies we can use. You can change this any time from the privacy notice.</div>
              </div>
              <button style={outlineBtn} onClick={() => setShowPrefs(false)}>Back</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <PrefRow label="Essential cookies" desc="Needed to keep you logged in securely and make the website work. Always on." checked disabled />
              <PrefRow
                label="Performance cookies"
                desc="Help us understand how the website is used so we can improve it."
                checked={consent.performance}
                onChange={(v) => setConsent((c) => ({ ...c, performance: v }))}
              />
              <PrefRow
                label="Marketing cookies"
                desc="Used to show you relevant information about our products."
                checked={consent.marketing}
                onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
              />
            </div>
            <div className="cc-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button style={outlineBtn} onClick={() => save({ performance: false, marketing: false })}>Reject non-essential</button>
              <button style={solidBtn} onClick={() => save(consent)}>Save preferences</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
