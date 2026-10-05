import Link from "next/link";

/* Shared building blocks for the personal product pages (checking, savings, loans). */

export const FONT = "var(--font-poppins), sans-serif";
export const BLUE = "#0800FF";
export const DARK = "#111827";
export const GRAY = "#6B7280";
export const TINT = "#F4F5FB";

export function Icon({ d, size = 24 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: light ? "rgba(255,255,255,.75)" : BLUE, marginBottom: 12 }}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, center, mb = 36 }: { eyebrow: string; title: string; center?: boolean; mb?: number }) {
  return (
    <div style={{ textAlign: center ? "center" : undefined, marginBottom: mb }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(24px, 3.2vw, 34px)", color: DARK, margin: 0, letterSpacing: "-.02em" }}>{title}</h2>
    </div>
  );
}

export const solidButton = { background: "#fff", color: BLUE, fontWeight: 700, fontSize: 15, padding: "13px 30px", borderRadius: 4, textDecoration: "none" } as const;
export const outlineButton = { color: "#fff", fontWeight: 600, fontSize: 15, padding: "12px 26px", borderRadius: 4, border: "1.5px solid rgba(255,255,255,.4)", textDecoration: "none" } as const;

export function ProductHero({
  eyebrow, title, subtitle, primary, secondary, highlights,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  highlights: { v: string; l: string }[];
}) {
  return (
    <section
      className="mob-hero"
      style={{
        background: BLUE,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%)",
        padding: "80px 32px 150px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1 style={{ fontWeight: 600, fontSize: "clamp(30px, 4.6vw, 50px)", lineHeight: 1.2, letterSpacing: "-.02em", color: "#fff", margin: "0 0 18px", maxWidth: 720 }}>
          {title}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.82)", maxWidth: 580, margin: "0 0 32px" }}>{subtitle}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={primary.href} style={solidButton}>{primary.label}</Link>
          <a href={secondary.href} style={outlineButton}>{secondary.label}</a>
        </div>

        <div className="mob-hero-stats" style={{ display: "flex", flexWrap: "wrap", gap: 48, marginTop: 56 }}>
          {highlights.map((h) => (
            <div key={h.l}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 4 }}>{h.l}</div>
              <div style={{ fontWeight: 700, fontSize: 28, color: "#fff" }}>{h.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* White card that overlaps the bottom edge of the hero. */
export function OverlapSection({ id, children, maxWidth = 1040, className = "" }: { id?: string; children: React.ReactNode; maxWidth?: number; className?: string }) {
  return (
    <section id={id} className={`mob-section ${className}`.trim()} style={{ padding: "0 32px 80px", marginTop: -90, position: "relative" }}>
      <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export function IconCards({ items }: { items: { t: string; d: string; icon: string }[] }) {
  return (
    <div className={items.length % 3 === 0 ? "g-3col" : "g-4col"} style={{ display: "grid", gridTemplateColumns: `repeat(${items.length % 3 === 0 ? 3 : 4}, 1fr)`, gap: 20 }}>
      {items.map((u) => (
        <div key={u.t} style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "26px 24px", background: "#fff" }}>
          <div style={{ color: BLUE, marginBottom: 16 }}>
            <Icon d={u.icon} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: DARK, marginBottom: 8 }}>{u.t}</div>
          <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{u.d}</div>
        </div>
      ))}
    </div>
  );
}

/* Clickable cards that lead to another page. */
export function LinkCards({ items }: { items: { t: string; d: string; icon: string; href: string }[] }) {
  return (
    <div className={items.length % 3 === 0 ? "g-3col" : "g-4col"} style={{ display: "grid", gridTemplateColumns: `repeat(${items.length % 3 === 0 ? 3 : 4}, 1fr)`, gap: 20 }}>
      {items.map((q) => (
        <Link key={q.t} href={q.href} style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "26px 24px", textDecoration: "none", background: "#fff" }}>
          <div style={{ color: BLUE, marginBottom: 16 }}>
            <Icon d={q.icon} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: DARK, marginBottom: 8 }}>{q.t}</div>
          <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, flex: 1 }}>{q.d}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: BLUE, fontWeight: 600, fontSize: 14.5, marginTop: 18 }}>
            Find out more <Icon d="M9 5l7 7-7 7" size={16} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CheckList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {items.map((b) => (
        <div key={b.t} style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 4 }}>{b.t}</div>
            <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{b.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepsSection({
  title, steps, cta,
}: {
  title: string;
  steps: { t: string; d: string }[];
  cta?: { label: string; href: string };
}) {
  const cols = steps.length === 4 ? 4 : 3;
  const GAP = 24;
  return (
    <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
          <SectionTitle eyebrow="How it works" title={title} mb={0} />
          {cta && (
            <Link href={cta.href} style={{ background: BLUE, color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap" }}>
              {cta.label}
            </Link>
          )}
        </div>
        <ol className={cols === 4 ? "g-4col" : "g-3col"} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: GAP, listStyle: "none", margin: 0, padding: 0 }}>
          {steps.map((s, i) => (
            <li key={s.t} style={{ position: "relative", background: TINT, borderRadius: 8, padding: "28px 26px 30px" }}>
              {/* Connector from this step's number to the next card. */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="step-connector"
                  style={{ position: "absolute", top: 51, left: 82, right: -GAP, height: 2, background: "rgba(8,0,255,.18)" }}
                />
              )}
              <div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 19, marginBottom: 22 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: BLUE, marginBottom: 6 }}>Step {i + 1}</div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, color: DARK, marginBottom: 8 }}>{s.t}</div>
              <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.65 }}>{s.d}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ClosingCTA({
  title, text, primary, secondary,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="mob-section" style={{ background: BLUE, padding: "72px 32px", textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(26px, 3.6vw, 38px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>{title}</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.78)", lineHeight: 1.65, margin: "0 0 30px" }}>{text}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={primary.href} style={solidButton}>{primary.label}</Link>
          <Link href={secondary.href} style={outlineButton}>{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}

/* Side-by-side account comparison cards; `featured` gets the solid blue treatment. */
export function AccountCards({
  accounts,
}: {
  accounts: { name: string; tagline: string; featured?: boolean; rows: [string, string][]; href: string; cta: string }[];
}) {
  return (
    <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: `repeat(${accounts.length}, 1fr)`, gap: 0, background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
      {accounts.map((a) => (
        <div key={a.name} style={{ padding: "34px 34px 30px", background: a.featured ? BLUE : "#fff", color: a.featured ? "#fff" : DARK, display: "flex", flexDirection: "column" }}>
          {a.featured && (
            <div style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 4, background: "rgba(255,255,255,.16)", marginBottom: 14 }}>
              Most popular
            </div>
          )}
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, marginBottom: 6 }}>{a.name}</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.6, color: a.featured ? "rgba(255,255,255,.78)" : GRAY, marginBottom: 22 }}>{a.tagline}</div>
          <div style={{ flex: 1 }}>
            {a.rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderTop: `1px solid ${a.featured ? "rgba(255,255,255,.18)" : "rgba(17,24,39,.08)"}`, fontSize: 14.5 }}>
                <span style={{ color: a.featured ? "rgba(255,255,255,.7)" : GRAY }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <Link
            href={a.href}
            style={{
              marginTop: 24,
              display: "block",
              textAlign: "center",
              fontWeight: 700,
              fontSize: 15,
              padding: "13px",
              borderRadius: 4,
              textDecoration: "none",
              background: a.featured ? "#fff" : BLUE,
              color: a.featured ? BLUE : "#fff",
            }}
          >
            {a.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
