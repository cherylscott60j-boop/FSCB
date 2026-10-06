import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "$1K–$5M", l: "Loan range" },
  { v: "3–5 days", l: "Typical decision" },
  { v: "Local", l: "Underwriting" },
];

const LENDING = [
  { type: "Business overdraft", amount: "$500 – $50,000", term: "Reviewed yearly", rate: "From 9.9% APR" },
  { type: "Small business loan", amount: "$1,000 – $50,000", term: "1 – 7 years", rate: "From 7.4% APR" },
  { type: "Growth loan", amount: "$50,000 – $250,000", term: "1 – 10 years", rate: "From 6.5% APR" },
  { type: "Commercial mortgage", amount: "$100,000 – $2m", term: "Up to 25 years", rate: "Ask us" },
  { type: "Asset finance", amount: "$5,000 – $500,000", term: "1 – 7 years", rate: "Ask us" },
];

const USES = [
  { t: "Equipment & vehicles", d: "Finance new or used equipment with terms matched to its useful life.", icon: "M10.3 4.3c.4-1.7 2.9-1.7 3.3 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.2.8 2.3 2.3a1.7 1.7 0 0 0 1 2.6c1.7.4 1.7 2.9 0 3.3a1.7 1.7 0 0 0-1 2.6c.9 1.5-.8 3.2-2.3 2.3a1.7 1.7 0 0 0-2.6 1c-.4 1.7-2.9 1.7-3.3 0a1.7 1.7 0 0 0-2.6-1c-1.5.9-3.2-.8-2.3-2.3a1.7 1.7 0 0 0-1-2.6c-1.7-.4-1.7-2.9 0-3.3a1.7 1.7 0 0 0 1-2.6c-.9-1.5.8-3.2 2.3-2.3.9.6 2.2.1 2.6-1z" },
  { t: "Commercial real estate", d: "Purchase or refinance owner-occupied or investment property.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
  { t: "Line of credit", d: "A revolving credit line gives flexible access to working capital.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
  { t: "Working capital", d: "Smooth out cash flow between invoices, payroll and expenses.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Expansion & growth", d: "Fund a new location, bigger team or a push into new markets.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { t: "Stock & inventory", d: "Buy stock ahead of busy periods without draining your cash reserves.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
];

const BENEFITS = [
  { t: "Fixed or variable rate", d: "Choose the option that fits your business — your lending specialist explains both." },
  { t: "No early repayment fees", d: "Pay off part or all of your loan early without a penalty." },
  { t: "Local underwriting", d: "Decisions are made by people who look at your whole business, not just a credit score." },
  { t: "A named relationship manager", d: "One person who knows your business for loans over $50,000." },
];

const STEPS = [
  { t: "Speak with a business banker", d: "A no-obligation conversation to understand your funding needs and timeline." },
  { t: "Submit your application", d: "Provide business financials and a brief plan. We guide you through every document." },
  { t: "Get your decision", d: "Local underwriting means faster answers — most decisions within 3–5 business days." },
];

const FAQS = [
  { q: "What financial documents do I need to apply?", a: "Typically 2 years of business tax returns, a current profit and loss statement, business bank statements, and personal tax returns for owners with 20%+ ownership." },
  { q: "Do you lend to startups?", a: "Yes, with conditions. Strong personal credit, some collateral and a solid business plan can qualify a new business for financing." },
  { q: "How long does approval take?", a: "Most business loans take 3–5 business days. Commercial mortgages and larger facilities can take 2–4 weeks." },
  { q: "Can I repay early without penalties?", a: "Yes. There are no early repayment fees on our business loans." },
  { q: "Is security required?", a: "Larger loans and commercial mortgages are usually secured against business or personal assets. Your lending specialist will explain what's needed." },
];

export default function BusinessLoansPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="Funding to help your business grow"
        subtitle="From equipment and premises to expansion and cash flow — lending decisions from people who understand small business."
        primary={{ label: "Talk to a business banker", href: "/about/contact" }}
        secondary={{ label: "See loan types", href: "#lending" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/business-loans-hero.png", alt: "Two business owners signing a loan agreement", position: "50% 40%" }}
      />

      <OverlapSection id="lending">
        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
          <div className="mob-table-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 1fr", padding: "14px 20px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
              <div>Product</div>
              <div>Amount</div>
              <div>Term</div>
              <div>Rate</div>
            </div>
            {LENDING.map((l, i) => (
              <div key={l.type} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 1fr", padding: "15px 20px", fontSize: 14, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none", background: "#fff" }}>
                <div style={{ fontWeight: 600, color: DARK }}>{l.type}</div>
                <div style={{ color: GRAY }}>{l.amount}</div>
                <div style={{ color: GRAY }}>{l.term}</div>
                <div style={{ color: DARK }}>{l.rate}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Illustrative rates. Lending is subject to status. Security may be required for larger loans.
        </p>
      </OverlapSection>

      {/* Uses */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What it's for" title="Finance for every stage of growth" />
          <IconCards items={USES} />
        </div>
      </section>

      {/* Why borrow with us */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="Why borrow with us" title="Straightforward from start to finish" mb={28} />
          <CheckList items={BENEFITS} />
        </div>
      </section>

      <StepsSection title="Three simple steps" steps={STEPS} cta={{ label: "Talk to a business banker", href: "/about/contact" }} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to talk financing?"
        text="Speak with a business banker about the right loan for your plans."
        primary={{ label: "Talk to a business banker", href: "/about/contact" }}
        secondary={{ label: "Open a business account", href: "/open-account" }}
      />
    </SiteLayout>
  );
}
