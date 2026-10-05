"use client";

import { useState } from "react";

const FONT = "var(--font-poppins), sans-serif";
const RED = "#E31E24";
const DARK = "#111827";
const GRAY = "#6B7280";

export default function FAQAccordion({ faqs, accent = RED }: { faqs: { q: string; a: string }[]; accent?: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ border: "1px solid rgba(17,24,39,.08)", borderRadius: 16, overflow: "hidden" }}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                padding: "22px 24px", fontFamily: FONT,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: DARK }}>{f.q}</span>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4"
                style={{ flexShrink: 0, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 300 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height .25s ease, opacity .2s ease",
              }}
            >
              <div style={{ padding: "0 24px 22px", fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{f.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
