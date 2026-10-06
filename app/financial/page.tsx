import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, LinkCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const SERVICES = [
  { t: "Investments", d: "Ready-made and managed portfolios to grow your money over the long term.", href: "/financial/investments", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Wealth management", d: "A personal investment manager for larger portfolios.", href: "/financial/wealth-management", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Private banking", d: "A dedicated relationship manager, retirement planning and more.", href: "/financial/retirement", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
  { t: "Financial planning", d: "A plan for your goals, from buying a home to paying for education.", href: "/financial/planning", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
  { t: "Estate planning", d: "Make sure your wealth passes to the people you choose.", href: "/financial/estate", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Savings accounts", d: "Not ready to invest? Start with a savings account and earn interest.", href: "/personal/savings", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
];

const WAYS = [
  { name: "Invest yourself", desc: "Choose from our range of ready-made portfolios and manage them in the app.", from: "From $50 a month", fee: "0.45% a year" },
  { name: "Managed for you", desc: "Tell us your goals and attitude to risk. Our team builds and manages your portfolio.", from: "From $10,000", fee: "0.75% a year" },
  { name: "Private banking", desc: "A relationship manager and a team of specialists across your whole financial life.", from: "From $250,000", fee: "Tiered from 1.00%" },
];

const BEFORE = [
  { t: "Have an emergency fund", d: "Keep three to six months of essential costs in an easy-access savings account first." },
  { t: "Pay off expensive debt", d: "Clear credit cards and other high-interest borrowing before you invest." },
  { t: "Think long term", d: "Plan to invest for at least five years so you have time to ride out ups and downs." },
  { t: "Understand the risks", d: "Investments can fall as well as rise, and you may get back less than you put in." },
];

const STEPS = [
  { t: "Tell us your goals", d: "What you're investing for, when you'll need the money and how you feel about risk." },
  { t: "Choose how to invest", d: "Pick a ready-made portfolio, or let our team manage it for you." },
  { t: "Track your progress", d: "See how your investments are doing any time in the app, with a full review each year." },
];

const FAQS = [
  { q: "How much do I need to start investing?", a: "You can start with $50 a month or a $500 lump sum in a ready-made portfolio. Managed portfolios start at $10,000." },
  { q: "What's the difference between saving and investing?", a: "Savings earn interest and your balance doesn't fall. Investing puts your money into things like shares and bonds. It has the potential for higher returns over time, but the value can go down as well as up." },
  { q: "Can I take my money out?", a: "Yes. You can sell some or all of your investments at any time. It usually takes 3 to 5 business days for the money to reach your account." },
  { q: "What fees will I pay?", a: "You pay an annual management fee, shown for each option above, plus the costs of the underlying funds. We'll show you the total cost before you invest." },
];

export default function InvestingPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Investing"
        title="Grow your money for the future you want"
        subtitle="Invest on your own, have us manage it for you, or work with a private banking team. Start from just $50 a month."
        primary={{ label: "Start investing", href: "/about/contact" }}
        secondary={{ label: "Ways to invest", href: "#ways" }}
        highlights={[
          { v: "$50", l: "Minimum monthly investment" },
          { v: "3", l: "Ways to invest" },
          { v: "From 0.45%", l: "Annual fee" },
        ]}
      />

      <OverlapSection id="ways" maxWidth={1240}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {WAYS.map((w, i) => (
            <div key={w.name} style={{ padding: "32px 30px", background: i === 1 ? BLUE : "#fff", color: i === 1 ? "#fff" : DARK }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, marginBottom: 8 }}>{w.name}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: i === 1 ? "rgba(255,255,255,.78)" : GRAY, marginBottom: 20 }}>{w.desc}</div>
              {[["Minimum", w.from], ["Management fee", w.fee]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: `1px solid ${i === 1 ? "rgba(255,255,255,.18)" : "rgba(17,24,39,.08)"}`, fontSize: 14.5 }}>
                  <span style={{ color: i === 1 ? "rgba(255,255,255,.7)" : GRAY }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>Example fees. Fund costs also apply.</p>
      </OverlapSection>

      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our services" title="Investment and wealth services" />
          <LinkCards items={SERVICES} />
        </div>
      </section>

      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="Before you invest" title="Is investing right for you?" mb={28} />
          <CheckList items={BEFORE} />
        </div>
      </section>

      <StepsSection title="Start investing in three steps" steps={STEPS} />

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

      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to start investing?"
        text="Talk to our team about the right option for you."
        primary={{ label: "Start investing", href: "/about/contact" }}
        secondary={{ label: "Explore private banking", href: "/financial/retirement" }}
      />
    </SiteLayout>
  );
}
