import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { BLUE, CheckList, DARK, FONT, GRAY, OverlapSection, ProductHero, SectionTitle, TINT } from "@/components/product/ui";

// Static example data. Replace with a live feed when one is available.
const SERVICES = [
  ["Mobile app", "Working normally"],
  ["Online banking", "Working normally"],
  ["Card payments", "Working normally"],
  ["Cash machines", "Working normally"],
  ["Bank transfers", "Working normally"],
  ["Telephone banking", "Working normally"],
  ["Branches", "Working normally"],
  ["Business online banking", "Working normally"],
];

const MAINTENANCE = [
  { when: "Sunday 1am – 4am", what: "Mobile app and online banking", detail: "You may not be able to log in. Card payments and cash machines won't be affected." },
  { when: "Sunday 2am – 3am", what: "Bank transfers", detail: "Transfers made during this time will be processed once the work is complete." },
];

const HISTORY = [
  { date: "12 September", what: "Mobile app", detail: "Some customers couldn't log in between 8:10am and 9:05am. This has been fixed." },
  { date: "28 August", what: "Card payments", detail: "A small number of online card payments were declined between 6pm and 6:40pm. No money was taken for declined payments." },
  { date: "3 August", what: "Online banking", detail: "Statements were slow to load for about 2 hours. This has been fixed." },
];

const TIPS = [
  { t: "If the app isn't working", d: "Try online banking, or call telephone banking on (555) 302-1900. Your card will still work in shops and cash machines." },
  { t: "If a payment fails", d: "Check your balance before trying again so you don't pay twice. Failed payments won't leave your account." },
  { t: "Beware of scams during outages", d: "We'll never call to ask you to move money or share a code because of a technical problem." },
];

function Dot() {
  return <span style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE, display: "inline-block", flex: "none" }} />;
}

export default function ServiceStatusPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Service status"
        title="Check if our services are working"
        subtitle="See the current status of the app, online banking, cards and payments, plus any planned maintenance."
        primary={{ label: "Report a problem", href: "/about/contact" }}
        secondary={{ label: "Planned maintenance", href: "#maintenance" }}
        highlights={[
          { v: "All services", l: "Working normally" },
          { v: "2", l: "Planned updates this week" },
        ]}
      />

      <OverlapSection maxWidth={1040}>
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.1)", overflow: "hidden" }}>
          <div style={{ background: BLUE, color: "#fff", padding: "20px 28px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18 }}>All services are working normally</div>
          </div>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {SERVICES.map(([name, status], i) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 28px", borderTop: i > 1 ? "1px solid rgba(17,24,39,.08)" : "none", borderLeft: i % 2 ? "1px solid rgba(17,24,39,.08)" : "none" }}>
                <span style={{ fontWeight: 600, color: DARK, fontSize: 15 }}>{name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: GRAY, fontSize: 14 }}>
                  <Dot /> {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </OverlapSection>

      <section id="maintenance" className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionTitle eyebrow="Planned maintenance" title="Upcoming updates" mb={14} />
          <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.7, margin: "0 0 28px" }}>
            We carry out most updates overnight to keep disruption to a minimum.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {MAINTENANCE.map((m) => (
              <div key={m.when + m.what} className="mob-stack" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "22px 26px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, color: BLUE, fontSize: 15.5 }}>{m.when}</div>
                <div>
                  <div style={{ fontWeight: 600, color: DARK, fontSize: 16, marginBottom: 4 }}>{m.what}</div>
                  <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Recent issues" title="Past 30 days" mb={24} />
            {HISTORY.map((h) => (
              <div key={h.date} style={{ padding: "16px 0", borderTop: "1px solid rgba(17,24,39,.1)" }}>
                <div style={{ fontSize: 13, color: GRAY, marginBottom: 4 }}>{h.date} · Resolved</div>
                <div style={{ fontWeight: 600, color: DARK, fontSize: 16, marginBottom: 4 }}>{h.what}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{h.detail}</div>
              </div>
            ))}
          </div>
          <div>
            <SectionTitle eyebrow="Having trouble?" title="What to do if something isn't working" mb={28} />
            <CheckList items={TIPS} />
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, margin: "28px 0 0" }}>
              Still stuck? <Link href="/about/contact" style={{ color: BLUE, fontWeight: 600 }}>Contact us</Link> and we&apos;ll help.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
