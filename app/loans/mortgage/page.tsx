import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import MortgageCalculator from "@/components/MortgageCalculator";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const LOAN_TYPES = [
  { t: "Fixed-rate mortgage", d: "Lock your rate for 15, 20 or 30 years so your principal and interest payment never changes.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
  { t: "Adjustable-rate mortgage", d: "A lower starting rate fixed for 5, 7 or 10 years, then adjusting once a year within set limits.", icon: "M4 4v5h.6M20 20v-5h-.6M5 9a8 8 0 0 1 14.4-2M19 15a8 8 0 0 1-14.4 2" },
  { t: "First-time buyer", d: "Buy with as little as 3% down, with reduced mortgage insurance and help with closing costs.", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { t: "Jumbo loans", d: "Financing up to £3 million for higher-value homes, with fixed and adjustable options.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
  { t: "Refinance", d: "Lower your rate, shorten your term or switch from adjustable to fixed.", icon: "M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" },
  { t: "Construction to permanent", d: "One loan, one closing. Fund the build in stages, then convert to a regular mortgage.", icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
];

const RATES = [
  { product: "30-year fixed", rate: "6.375%", apr: "6.512%", points: "0.5" },
  { product: "20-year fixed", rate: "6.125%", apr: "6.290%", points: "0.5" },
  { product: "15-year fixed", rate: "5.625%", apr: "5.841%", points: "0.5" },
  { product: "7/1 adjustable", rate: "5.875%", apr: "6.704%", points: "0.25" },
  { product: "5/1 adjustable", rate: "5.750%", apr: "6.812%", points: "0.25" },
];

const RATE_FACTORS = [
  { t: "Credit score", d: "A higher score usually means a lower rate. Scores of 740 and above get our best pricing." },
  { t: "Down payment", d: "Putting 20% or more down lowers your rate and removes the need for mortgage insurance." },
  { t: "Loan term", d: "Shorter terms like 15 years have lower rates but higher monthly payments." },
  { t: "Property type", d: "Rates for primary homes are lower than for second homes or investment properties." },
  { t: "Debt-to-income ratio", d: "We look at how much of your monthly income goes on debt. Below 43% is ideal." },
];

const DOCUMENTS = [
  { t: "Proof of identity", d: "A valid driver's license or passport for everyone on the application." },
  { t: "Income", d: "Your last two pay stubs and W-2s, or two years of tax returns if you're self-employed." },
  { t: "Assets", d: "Two months of bank statements showing your down payment and closing cost funds." },
  { t: "Debts", d: "Details of car loans, student loans, credit cards and any other monthly payments." },
  { t: "The property", d: "Your signed purchase agreement, or your current mortgage statement if refinancing." },
];

const CLOSING_COSTS = [
  ["Appraisal", "£500 – £700"],
  ["Title search & insurance", "£1,000 – £2,500"],
  ["Origination", "£0 on most loans"],
  ["Recording fees", "£100 – £250"],
  ["Prepaid taxes & insurance", "Varies"],
];

const STEPS = [
  { t: "Get pre-approved", d: "Share your income and assets and we'll tell you how much you can borrow. Pre-approval is valid for 90 days." },
  { t: "Find your home", d: "Shop with confidence and make an offer with your pre-approval letter in hand." },
  { t: "Apply and lock your rate", d: "Complete your application, upload documents and lock your rate for up to 60 days." },
  { t: "Close and get your keys", d: "We order the appraisal, finalize underwriting and aim to close in 30 days." },
];

const FIRST_TIME = [
  { t: "From 3% down", d: "On a £350,000 home, that's a down payment of £10,500." },
  { t: "Up to £5,000 towards closing costs", d: "A credit for eligible first-time buyers, applied at closing." },
  { t: "Free homebuyer course", d: "A short online course covering budgets, offers, inspections and closing." },
];

const REFINANCE = [
  { t: "Lower your monthly payment", d: "Refinance into a lower rate or a longer term." },
  { t: "Pay off your home sooner", d: "Move from a 30-year to a 15-year term and save on total interest." },
  { t: "Cash-out refinance", d: "Borrow against your home's equity for renovations or other big expenses." },
];

const GLOSSARY = [
  ["APR", "The annual percentage rate. It includes your interest rate plus certain fees, so it's the best way to compare loans."],
  ["Points", "An optional upfront fee to lower your rate. One point costs 1% of the loan amount."],
  ["Escrow", "An account we manage to pay your property tax and home insurance from your monthly payment."],
  ["Mortgage insurance (PMI)", "Usually required when you put down less than 20%. It can be removed once you reach 20% equity."],
  ["Loan-to-value (LTV)", "Your loan amount divided by the home's value. A £320,000 loan on a £400,000 home is 80% LTV."],
  ["Rate lock", "A guarantee that your rate won't change between application and closing, for a set period."],
];

const FAQS = [
  { q: "How much do I need for a down payment?", a: "First-time buyers can put down as little as 3%. Most other loans need 5% or more. With less than 20% down you'll usually pay mortgage insurance until you reach 20% equity." },
  { q: "What's the difference between pre-qualification and pre-approval?", a: "Pre-qualification is a quick estimate based on what you tell us. Pre-approval means we've checked your credit, income and assets, so sellers take your offer more seriously." },
  { q: "Should I choose a fixed or adjustable rate?", a: "A fixed rate gives you the same payment for the life of the loan. An adjustable rate starts lower but can rise later, so it suits people who plan to move or refinance within a few years." },
  { q: "How long does it take to close?", a: "Most purchase loans close in about 30 days from a complete application. Refinances can be quicker." },
  { q: "Can I lock my rate?", a: "Yes. Once you apply you can lock your rate for 30, 45 or 60 days. If rates drop before you close, you may be able to take the lower rate once." },
  { q: "What credit score do I need?", a: "Most loans need a score of 620 or higher. Some first-time buyer options accept lower scores, and a higher score usually gets you a better rate." },
  { q: "Can I pay off my mortgage early?", a: "Yes. There are no prepayment penalties, so you can make extra payments or pay off the loan at any time." },
  { q: "What are closing costs?", a: "Fees for things like the appraisal, title insurance and recording, plus prepaid taxes and insurance. They typically add up to 2–5% of the loan amount. You'll get a full estimate within 3 days of applying." },
];

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 8, padding: "32px 30px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 22 }}>{title}</div>
      {children}
    </div>
  );
}

export default function MortgagePage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Mortgages"
        title="Home loans that make buying and refinancing simpler"
        subtitle="Fixed and adjustable rates, options from 3% down and a dedicated mortgage advisor from pre-approval to closing."
        primary={{ label: "Get pre-approved", href: "/about/contact" }}
        secondary={{ label: "Estimate your payment", href: "#calculator" }}
        highlights={[
          { v: "From 3%", l: "Down payment" },
          { v: "15–30 yrs", l: "Fixed-rate terms" },
          { v: "~30 days", l: "Typical closing" },
        ]}
      />

      <OverlapSection id="calculator">
        <MortgageCalculator />
      </OverlapSection>

      {/* Loan types */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Mortgage options" title="Find the right home loan for you" />
          <IconCards items={LOAN_TYPES} />
        </div>
      </section>

      {/* Rates + factors */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Rates" title="Example mortgage rates" mb={28} />
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
              <div className="mob-table-wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr .8fr", padding: "14px 24px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  <div>Product</div>
                  <div>Rate</div>
                  <div>APR</div>
                  <div>Points</div>
                </div>
                {RATES.map((r, i) => (
                  <div key={r.product} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr .8fr", padding: "16px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none" }}>
                    <div style={{ fontWeight: 600, color: DARK }}>{r.product}</div>
                    <div style={{ color: DARK }}>{r.rate}</div>
                    <div style={{ color: GRAY }}>{r.apr}</div>
                    <div style={{ color: GRAY }}>{r.points}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
              Illustrative rates only, based on a £320,000 loan for a primary home with 20% down and a 740+ credit score. Your rate will depend on your circumstances.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="Your rate" title="What affects your rate" mb={28} />
            <CheckList items={RATE_FACTORS} />
          </div>
        </div>
      </section>

      <StepsSection title="From pre-approval to keys in four steps" steps={STEPS} />

      {/* Documents + closing costs */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Be prepared" title="What you'll need, and what it costs" />
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <InfoCard title="Documents checklist">
              <CheckList items={DOCUMENTS} />
            </InfoCard>
            <InfoCard title="Typical closing costs">
              <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65, margin: "0 0 18px" }}>
                Closing costs usually add up to 2–5% of your loan amount. You&apos;ll get a detailed Loan Estimate within 3 business days of applying.
              </p>
              {CLOSING_COSTS.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: "1px solid rgba(17,24,39,.08)", fontSize: 14.5 }}>
                  <span style={{ color: GRAY }}>{k}</span>
                  <span style={{ fontWeight: 600, color: DARK, textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, margin: "14px 0 0" }}>Example ranges only. Costs vary by location and loan.</p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* First-time buyers + refinance */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>First-time buyers</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 24px", letterSpacing: "-.01em" }}>Buying your first home?</h3>
            {FIRST_TIME.map((f) => (
              <div key={f.t} style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,.18)" }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{f.t}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>{f.d}</div>
              </div>
            ))}
          </div>
          <div style={{ border: `2px solid ${BLUE}`, borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 12 }}>Refinancing</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 24px", color: DARK, letterSpacing: "-.01em" }}>Already own your home?</h3>
            {REFINANCE.map((f) => (
              <div key={f.t} style={{ padding: "14px 0", borderTop: "1px solid rgba(17,24,39,.08)" }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 4 }}>{f.t}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Jargon buster" title="Mortgage terms explained" />
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {GLOSSARY.map(([term, def]) => (
              <div key={term} style={{ background: "#fff", borderRadius: 8, padding: "24px 24px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16.5, color: DARK, marginBottom: 8 }}>{term}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{def}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to find out how much you can borrow?"
        text="Get pre-approved and shop for your home with confidence."
        primary={{ label: "Get pre-approved", href: "/about/contact" }}
        secondary={{ label: "Talk to a mortgage advisor", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
