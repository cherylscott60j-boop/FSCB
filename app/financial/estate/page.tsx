import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "Coordinated", l: "With your attorney" },
  { v: "Trust services", l: "Available" },
  { v: "3–5 years", l: "Recommended review" },
];

const COMPARE = [
  { name: "Will only", desc: "A simple starting point, but your estate goes through probate.", rows: [["Probate", "Required"], ["Privacy", "Public record"], ["Speed", "Can take months"], ["Cost to set up", "Lower"]] },
  { name: "Living trust", desc: "Avoids probate and keeps your estate private, for most situations.", rows: [["Probate", "Avoided"], ["Privacy", "Private"], ["Speed", "Faster transfer"], ["Cost to set up", "Higher"]] },
];

const SERVICES = [
  { t: "Beneficiary designation review", d: "Outdated beneficiaries are one of the most common estate planning mistakes — we audit every account.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { t: "Trust account management", d: "Trustee and custodial services for revocable, irrevocable and testamentary trusts.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Estate tax minimization", d: "Gifting strategies and trust structures designed to reduce your taxable estate.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Power of attorney coordination", d: "Make sure the right people have the access they need in an emergency.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Business succession planning", d: "Buy-sell agreements and funding strategies for a smooth ownership transition.", icon: "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" },
  { t: "Charitable legacy giving", d: "Leave a lasting gift to the causes you care about, tax-efficiently.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
];

const REVIEW_TRIGGERS = [
  { t: "A marriage or divorce", d: "Update beneficiaries and account titling to reflect your current family." },
  { t: "A new child or grandchild", d: "Add guardianship wishes and update who inherits what." },
  { t: "A beneficiary has passed away", d: "Remove outdated beneficiaries so your estate passes as intended." },
  { t: "Your assets have grown significantly", d: "Review whether trust structures or tax strategies now make sense." },
  { t: "It's been more than 5 years", d: "Laws and your life both change — a periodic review keeps your plan current." },
];

const STEPS = [
  { t: "Document review", d: "We review your existing will, trust documents, beneficiary designations and asset titling." },
  { t: "Strategy development", d: "Working with your attorney, we recommend asset titling, trust structures and transfer strategies." },
  { t: "Implementation", d: "We coordinate account retitling, beneficiary updates and fund transfers." },
  { t: "Ongoing monitoring", d: "We review your plan after major life events, and at least every 3 to 5 years." },
];

const FAQS = [
  { q: "Do I need a trust, or is a will enough?", a: "It depends on your situation. A will alone goes through probate — a public, sometimes slow process. A living trust avoids probate, enables faster asset transfer and provides privacy. For most people with meaningful assets, a trust is worth considering." },
  { q: "What happens if I die without a will?", a: "Your state's intestacy laws determine who inherits, which may not match your intentions. Accounts with named beneficiaries pass outside probate, but everything else is distributed by the court." },
  { q: "How often should I update my estate plan?", a: "Review it every 3 to 5 years, and after major life events: marriage, divorce, a new child or grandchild, the death of a beneficiary, or a significant change in your finances." },
  { q: "Is there a federal estate tax?", a: "The IRS sets a federal estate tax exemption each year, and it's adjusted periodically. Assets above the threshold may be subject to estate tax — ask us for the current figure and how it applies to you." },
  { q: "Can you work with my existing attorney?", a: "Yes. We coordinate directly with your estate attorney to make sure your investment strategy and legal documents are aligned." },
];

export default function EstatePlanningPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Estate planning"
        title="Make sure your wealth passes exactly as you intend"
        subtitle="We work alongside your attorney to keep your accounts titled correctly, your beneficiaries current, and your wishes honored."
        primary={{ label: "Start estate planning", href: "/about/contact" }}
        secondary={{ label: "Will vs. trust", href: "#compare" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/estate-planning-hero.jpg", alt: "A couple reviewing documents with their financial advisor", position: "50% 40%" }}
      />

      <OverlapSection id="compare" maxWidth={900}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {COMPARE.map((c, i) => (
            <div key={c.name} style={{ padding: "32px 30px", background: i === 1 ? BLUE : "#fff", color: i === 1 ? "#fff" : DARK }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, marginBottom: 8 }}>{c.name}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: i === 1 ? "rgba(255,255,255,.78)" : GRAY, marginBottom: 20 }}>{c.desc}</div>
              {c.rows.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: `1px solid ${i === 1 ? "rgba(255,255,255,.18)" : "rgba(17,24,39,.08)"}`, fontSize: 14.5 }}>
                  <span style={{ color: i === 1 ? "rgba(255,255,255,.7)" : GRAY }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Services */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our services" title="Protecting your legacy, coordinated with your attorney" />
          <IconCards items={SERVICES} />
        </div>
      </section>

      {/* Review triggers */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="When to review" title="Signs it's time to update your plan" mb={28} />
          <CheckList items={REVIEW_TRIGGERS} />
        </div>
      </section>

      <StepsSection title="How we build your estate plan" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to protect your legacy?"
        text="Talk to an estate planning advisor about your family and your wishes."
        primary={{ label: "Start estate planning", href: "/about/contact" }}
        secondary={{ label: "Explore wealth management", href: "/financial/wealth-management" }}
      />
    </SiteLayout>
  );
}
