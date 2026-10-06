import Link from "next/link";

/* Shared building blocks for the personal product pages (checking, savings, loans). */

export const FONT = "var(--font-poppins), sans-serif";
export const BLUE = "#0800FF";
export const DARK = "#111827";
export const GRAY = "#6B7280";
export const TINT = "#F4F5FB";
export const RED = "#E31E24";

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

export const solidButton = { background: RED, color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 30px", borderRadius: 4, textDecoration: "none" } as const;
export const outlineButton = { color: "#fff", fontWeight: 600, fontSize: 15, padding: "12px 26px", borderRadius: 4, border: "1.5px solid rgba(255,255,255,.4)", textDecoration: "none" } as const;

/* Photo hero layout on tablets and phones: narrower photo, then photo on top. */
const PH_HERO_CSS = `
@media (max-width: 960px) {
  .ph-hero-photo { width: 44% !important; }
  .ph-hero-copy { max-width: 440px !important; }
}
@media (max-width: 760px) {
  .ph-hero { display: flex; flex-direction: column; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%) !important; }
  .ph-hero-photo { position: relative !important; width: 100% !important; aspect-ratio: 3 / 2; }
  .ph-hero-photo-fade { background: linear-gradient(180deg, rgba(8,0,255,0) 60%, #0800FF 100%) !important; }
  .ph-hero-content { padding: 4px 20px 110px !important; }
  .ph-hero-copy { max-width: none !important; }
}
`;

/* Cut-out hero on tablets and phones: smaller figure, then figure below the text. */
const PH_CUT_CSS = `
@media (max-width: 1100px) {
  .ph-cutout { height: min(380px, 70%) !important; }
  .ph-cut-copy { max-width: 480px !important; }
}
@media (max-width: 860px) {
  .ph-cut-hero { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%) !important; }
  .ph-cut-content { padding: 44px 20px 40px !important; }
  .ph-cut-copy { max-width: none !important; }
  .ph-cutout { position: static !important; height: auto !important; width: 86% !important; max-width: 360px; margin: 28px auto 0; }
}
`;

export function ProductHero({
  eyebrow, title, subtitle, primary, secondary, highlights, image, cutout,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  highlights: { v: string; l: string }[];
  /* Optional photo: shown on the right half on desktop, on top on phones. */
  image?: { src: string; alt: string; position?: string };
  /* Optional transparent cut-out (e.g. people) that sits on the blue, bottom right. */
  cutout?: { src: string; alt: string; maxHeight?: number };
}) {
  return (
    <section
      className={image ? "ph-hero" : cutout ? "ph-cut-hero" : "mob-hero"}
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLUE,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%)",
        padding: image || cutout ? 0 : "80px 32px 150px",
        fontFamily: FONT,
      }}
    >
      {image && (
        <div className="ph-hero-photo" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: image.position ?? "center", display: "block" }} />
          <div
            aria-hidden
            className="ph-hero-photo-fade"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #0800FF 0%, rgba(8,0,255,.55) 10%, rgba(8,0,255,0) 26%), radial-gradient(ellipse at 55% 45%, rgba(6,10,46,0) 55%, rgba(6,10,46,.5) 100%)",
            }}
          />
        </div>
      )}

      <div className={image ? "ph-hero-content" : cutout ? "ph-cut-content" : undefined} style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: image ? "72px 32px 150px" : cutout ? "72px 32px 160px" : 0 }}>
        {cutout && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ph-cutout" src={cutout.src} alt={cutout.alt} style={{
              position: "absolute", right: 32, bottom: 110, height: `min(${cutout.maxHeight ?? 470}px, 82%)`, width: "auto", display: "block",
              // Soften the hard edges of the cut-out (rug and sofa) so it fades into the blue.
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 7%, #000 88%, transparent 100%), linear-gradient(to top, transparent 0%, #000 14%)",
              WebkitMaskComposite: "source-in",
              maskImage: "linear-gradient(to right, transparent 0%, #000 7%, #000 88%, transparent 100%), linear-gradient(to top, transparent 0%, #000 14%)",
              maskComposite: "intersect",
            }} />
        )}
        <div className={image ? "ph-hero-copy" : cutout ? "ph-cut-copy" : undefined} style={{ position: "relative", maxWidth: image || cutout ? 560 : undefined }}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 style={{ fontWeight: 600, fontSize: image ? "clamp(30px, 3.6vw, 46px)" : "clamp(30px, 4.6vw, 50px)", lineHeight: 1.2, letterSpacing: "-.02em", color: "#fff", margin: "0 0 18px", maxWidth: 720 }}>
            {title}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.82)", maxWidth: image ? 500 : 580, margin: "0 0 32px" }}>{subtitle}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={primary.href} style={solidButton}>{primary.label}</Link>
            <a href={secondary.href} style={outlineButton}>{secondary.label}</a>
          </div>

          <div className="mob-hero-stats" style={{ display: "flex", flexWrap: "wrap", gap: image ? 36 : 48, marginTop: image ? 44 : 56 }}>
            {highlights.map((h) => (
              <div key={h.l}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 4 }}>{h.l}</div>
                <div style={{ fontWeight: 700, fontSize: 28, color: "#fff" }}>{h.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {image && <style>{PH_HERO_CSS}</style>}
      {cutout && <style>{PH_CUT_CSS}</style>}
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

const STEP_ICONS = [
  "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  "M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5m-4 0V5a2 2 0 1 1 4 0v1m-4 0a2 2 0 1 0 4 0m-5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 0 0-2.83 2M15 11h3m-3 4h2",
  "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z",
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
];

export function StepsSection({
  title, steps, cta,
}: {
  title: string;
  steps: { t: string; d: string; icon?: string }[];
  cta?: { label: string; href: string };
}) {
  return (
    <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 36 }}>
          <SectionTitle eyebrow="How it works" title={title} mb={0} />
          {cta && (
            <Link href={cta.href} style={{ background: RED, color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap" }}>
              {cta.label}
            </Link>
          )}
        </div>

        <ol className="steps-panel" style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, listStyle: "none", margin: 0, padding: 0, background: BLUE, borderRadius: 8, overflow: "hidden" }}>
          {steps.map((s, i) => (
            <li key={s.t} className="steps-item" style={{ position: "relative", padding: "36px 32px 38px", color: "#fff", borderLeft: i ? "1px solid rgba(255,255,255,.18)" : "none" }}>
              {/* Large step number */}
              <span aria-hidden style={{ position: "absolute", top: 18, right: 24, fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1, color: "rgba(255,255,255,.12)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Arrow on the divider leading to the next step */}
              {i < steps.length - 1 && (
                <span aria-hidden className="steps-arrow" style={{ position: "absolute", top: 46, right: -15, zIndex: 1, width: 30, height: 30, borderRadius: "50%", background: "#fff", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>
                </span>
              )}

              <span style={{ width: 52, height: 52, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                <Icon d={s.icon ?? STEP_ICONS[i % STEP_ICONS.length]} size={26} />
              </span>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 8 }}>Step {i + 1}</div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, marginBottom: 10, letterSpacing: "-.01em" }}>{s.t}</div>
              <div style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.82)", maxWidth: 340 }}>{s.d}</div>
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
              background: RED,
              color: "#fff",
            }}
          >
            {a.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
