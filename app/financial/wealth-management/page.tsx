import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const TOP = [
  { t: "A dedicated wealth advisor", d: "One named contact who coordinates your whole financial life.", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
  { t: "Fee-based advice", d: "We charge a fee on assets managed — never a commission on products.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "A coordinated strategy", d: "Investments, taxes, estate and insurance planned together, not in isolation.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
  { t: "Quarterly reviews", d: "Regular check-ins, plus proactive outreach when markets or your life changes.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
];

const SERVICES = [
  { t: "Investment portfolio management", d: "Customized portfolios built around your goals, timeline and risk tolerance — actively monitored and rebalanced.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Tax-efficient investing", d: "Tax-loss harvesting, asset location and Roth conversion planning to keep more of what you earn.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Estate planning coordination", d: "We work alongside your estate attorney so your investments align with your legacy goals.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Charitable giving strategies", d: "Donor-advised funds and gifting strategies that maximize your impact and tax savings.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
  { t: "Insurance integration", d: "Life, disability and long-term care cover reviewed as part of your overall plan.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Business owner services", d: "Succession planning and support if you're preparing to sell or pass on your company.", icon: "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" },
];

const APPROACH = [
  { t: "Fiduciary standard", d: "Your interests always come first — in writing, not just in principle." },
  { t: "Local advisors", d: "People who know your community, your goals and your family." },
  { t: "A holistic view", d: "Every part of your financial life planned together, not as separate pieces." },
  { t: "Transparent fees", d: "One clear advisory fee. No hidden commissions on products we recommend." },
  { t: "Regular reviews", d: "Your plan is revisited at least quarterly, and whenever life changes." },
];

const STEPS = [
  { t: "Discovery meeting", d: "We learn about your financial life, goals, values and concerns — no forms, just conversation." },
  { t: "Plan development", d: "Our team builds a fully integrated plan covering investments, taxes, estate and cash flow." },
  { t: "Implementation", d: "We put your strategy in place and coordinate with your CPA and attorney." },
  { t: "Ongoing review", d: "Regular reviews and proactive outreach keep your plan aligned as life changes." },
];

const FAQS = [
  { q: "What's the minimum to work with a wealth advisor?", a: "We work with clients who have $250,000 or more in investable assets. Below that, our financial planning service is a great place to start." },
  { q: "How are wealth advisors paid?", a: "Our advisors are fee-based — a percentage of assets managed. We don't earn commissions on product sales, so our advice is aligned with your interests." },
  { q: "Do you manage retirement accounts?", a: "Yes. We manage IRAs, Roth IRAs, trusts, taxable brokerage accounts and inherited accounts." },
  { q: "How often will I meet with my advisor?", a: "You'll have formal quarterly reviews and can schedule additional meetings any time. We also reach out when market events or life changes warrant a conversation." },
  { q: "Can I keep my existing accountant or attorney?", a: "Yes. We regularly coordinate with clients' existing CPAs and estate attorneys as part of building your plan." },
];

export default function WealthManagementPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Wealth management"
        title="A coordinated strategy for growing and protecting your wealth"
        subtitle="A dedicated advisor and a team of specialists who plan your investments, taxes, estate and insurance together — not in isolation."
        primary={{ label: "Schedule a consultation", href: "/about/contact" }}
        secondary={{ label: "See our services", href: "#services" }}
        highlights={[
          { v: "$250K+", l: "To qualify" },
          { v: "Fee-based", l: "No product commissions" },
          { v: "Quarterly", l: "Portfolio reviews" },
        ]}
        image={{ src: "/private-banking-hero.jpg", alt: "A wealth advisor meeting with a client", position: "40% 35%" }}
      />

      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {TOP.map((c, i) => (
            <div key={c.t} style={{ padding: "28px 26px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon d={c.icon} size={22} />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16.5, color: DARK, marginBottom: 4 }}>{c.t}</div>
              <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Services */}
      <section id="services" className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our services" title="A plan that covers your whole financial life" />
          <IconCards items={SERVICES} />
        </div>
      </section>

      {/* Approach */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our approach" title="How we work with you" mb={28} />
          <CheckList items={APPROACH} />
        </div>
      </section>

      <StepsSection title="How we build your plan" steps={STEPS} />

      {/* Risk disclosure */}
      <section className="mob-section" style={{ background: "#fff", padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", border: `2px solid ${BLUE}`, borderRadius: 8, padding: "28px 32px", display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div style={{ color: BLUE, flex: "none" }}>
            <Icon d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={26} />
          </div>
          <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: DARK }}>Capital at risk.</strong> Investments are not bank deposits and are not insured. Their value can go down as well as up, and you may get back less than you invest. Past performance is not a reliable guide to future returns.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Let's talk about your wealth"
        text="Book a no-obligation consultation with a wealth advisor."
        primary={{ label: "Schedule a consultation", href: "/about/contact" }}
        secondary={{ label: "Explore private banking", href: "/financial/retirement" }}
      />
    </SiteLayout>
  );
}
