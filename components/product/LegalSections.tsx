import { BLUE, CheckList, DARK, FONT, GRAY, TINT } from "@/components/product/ui";

/* Numbered legal sections with a sticky contents list, used by terms and disclosures. */

export type LegalBlock =
  | { p: string }
  | { list: { t: string; d: string }[] }
  | { table: [string, string][] };

export type LegalSection = { id: string; title: string; body: LegalBlock[] };

function Block({ b }: { b: LegalBlock }) {
  if ("list" in b) return <div style={{ margin: "6px 0 16px" }}><CheckList items={b.list} /></div>;
  if ("table" in b)
    return (
      <div style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "4px 22px", margin: "6px 0 16px" }}>
        {b.table.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "13px 0", borderTop: i ? "1px solid rgba(17,24,39,.08)" : "none", fontSize: 14.5 }}>
            <span style={{ color: GRAY }}>{k}</span>
            <span style={{ color: DARK, fontWeight: 600, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>
    );
  return <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.75, margin: "0 0 14px" }}>{b.p}</p>;
}

export default function LegalSections({ id, sections }: { id?: string; sections: LegalSection[] }) {
  return (
    <section id={id} className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
      <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "280px 1fr", gap: 56, alignItems: "start" }}>
        <nav aria-label="Contents" style={{ position: "sticky", top: 130, background: TINT, borderRadius: 8, padding: "24px 22px" }}>
          <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 14 }}>Contents</div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={{ display: "flex", gap: 10, padding: "7px 0", fontSize: 14, color: DARK, textDecoration: "none", lineHeight: 1.4 }}>
                  <span style={{ color: BLUE, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {sections.map((s, i) => (
            <article key={s.id} id={s.id} style={{ scrollMarginTop: 130, padding: "28px 0", borderTop: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
                <span style={{ flex: "none", width: 36, height: 36, borderRadius: "50%", background: BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: DARK, margin: 0, letterSpacing: "-.01em" }}>{s.title}</h2>
              </div>
              <div style={{ paddingLeft: 52 }}>
                {s.body.map((b, j) => <Block key={j} b={b} />)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
