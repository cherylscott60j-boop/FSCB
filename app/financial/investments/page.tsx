import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "$10K", l: "Minimum for managed portfolios" },
  { v: "Any amount", l: "To open self-directed" },
  { v: "$0", l: "Commission on stocks & ETFs" },
];

const WAYS = [
  { name: "Managed Portfolios", desc: "Our investment team builds and manages a diversified portfolio matched to your goals and risk tolerance.", from: "From $10,000", fee: "0.25% – 0.75% a year" },
  { name: "Self-Directed Brokerage", desc: "Trade stocks, ETFs, mutual funds and bonds yourself through our online brokerage platform.", from: "Any amount", fee: "$0 per trade" },
];

const TYPES = [
  { t: "Managed portfolios", d: "A diversified, professionally managed portfolio matched to your time horizon.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Self-directed brokerage", d: "Choose your own stocks, ETFs, mutual funds and bonds.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "ESG investing", d: "Invest in companies with strong environmental, social and governance practices.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Dividend income portfolios", d: "Target steady income through dividend-paying stocks and bond ladders.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Traditional & Roth IRAs", d: "Tax-advantaged accounts for retirement, invested the way you choose.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "SEP IRAs", d: "Tax-advantaged retirement accounts built for the self-employed.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
];

const BEFORE = [
  { t: "Have an emergency fund", d: "Keep three to six months of essential costs in an easy-access savings account first." },
  { t: "Pay off expensive debt", d: "Clear credit cards and other high-interest borrowing before you invest." },
  { t: "Think long term", d: "Plan to invest for at least five years so you have time to ride out ups and downs." },
  { t: "Understand the risks", d: "Investments can fall as well as rise, and you may get back less than you put in." },
];

const STEPS = [
  { t: "Complete a risk profile", d: "A short questionnaire covering your goals, time horizon and comfort with risk." },
  { t: "We build your portfolio", d: "A diversified, low-cost portfolio using institutional-quality funds, or open a brokerage account yourself." },
  { t: "Track and rebalance", d: "Managed portfolios rebalance automatically. Review performance any time in the app." },
];

const FAQS = [
  { q: "What's the minimum to open an investment account?", a: "Managed portfolios start at $10,000. Self-directed brokerage accounts can be opened with any amount." },
  { q: "What fees will I pay?", a: "Managed portfolios charge an annual fee of 0.25% to 1.00% depending on account size, plus fund costs. Self-directed stock and ETF trades are commission-free." },
  { q: "Can I transfer an existing brokerage account to you?", a: "Yes. We accept in-kind transfers from most brokerage firms. It typically takes 5–10 business days and can usually be done without selling your positions." },
  { q: "What's the difference between a traditional and Roth IRA?", a: "Traditional IRA contributions may be tax-deductible now, with withdrawals taxed in retirement. Roth IRA contributions are made after tax, and qualifying withdrawals are tax-free." },
  { q: "Can I take my money out?", a: "Yes. You can sell some or all of your investments at any time. It usually takes 3 to 5 business days for the money to reach your account." },
];

export default function InvestmentsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Investing"
        title="Investment accounts for every kind of investor"
        subtitle="A professionally managed portfolio, or the freedom to choose your own investments — with transparent pricing and no hidden commissions."
        primary={{ label: "Open an investment account", href: "/about/contact" }}
        secondary={{ label: "Compare account types", href: "#ways" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/investing-hero.webp", alt: "A rising bar chart illustrating long-term growth", position: "62% 55%" }}
      />

      <OverlapSection id="ways" maxWidth={900}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {WAYS.map((w, i) => (
            <div key={w.name} style={{ padding: "32px 30px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: DARK, marginBottom: 8 }}>{w.name}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: GRAY, marginBottom: 20 }}>{w.desc}</div>
              {[["Minimum", w.from], ["Fee", w.fee]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid rgba(17,24,39,.08)", fontSize: 14.5 }}>
                  <span style={{ color: GRAY }}>{k}</span>
                  <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>Example fees. Fund costs also apply.</p>
      </OverlapSection>

      {/* Account types */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Ways to invest" title="Investment accounts built for your goals" />
          <IconCards items={TYPES} />
        </div>
      </section>

      {/* Before you invest */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="Before you invest" title="Is investing right for you?" mb={28} />
          <CheckList items={BEFORE} />
        </div>
      </section>

      <StepsSection title="Start investing in three steps" steps={STEPS} />

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
        title="Ready to start investing?"
        text="Talk to our team about the right account for you."
        primary={{ label: "Open an investment account", href: "/about/contact" }}
        secondary={{ label: "Explore wealth management", href: "/financial/wealth-management" }}
      />
    </SiteLayout>
  );
}
