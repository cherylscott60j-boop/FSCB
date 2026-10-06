import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import LoanCalculator from "@/components/LoanCalculator";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "$1K–$50K", l: "Borrow between" },
  { v: "1–7 years", l: "Repayment terms" },
  { v: "$0", l: "Arrangement fees" },
];

const USES = [
  { t: "Consolidate debt", d: "Combine card and store balances into one fixed monthly payment.", icon: "M4 6h16M4 12h16M4 18h10" },
  { t: "Improve your home", d: "Fund a new kitchen, bathroom or the repairs you've been putting off.", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { t: "Buy a car", d: "Pay the seller upfront and own the vehicle outright from day one.", icon: "M5 17H3v-5l2-5h14l2 5v5h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm6 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" },
  { t: "Life events", d: "Weddings, moves and the other big moments that don't fit a monthly budget.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
];

const BENEFITS = [
  { t: "Fixed rate, fixed payment", d: "Your rate is set when you sign, so your payment never changes." },
  { t: "No arrangement or early repayment fees", d: "Pay off part or all of your loan whenever you like." },
  { t: "Check your rate without affecting your credit", d: "Pre-qualification uses a soft search that isn't visible to other lenders." },
  { t: "A real person reviews your application", d: "If something needs clarifying, a lending specialist calls you." },
];

const RATES = [
  { term: "1–2 years", apr: "7.99% – 14.99%", amount: "$1,000 – $15,000" },
  { term: "3–5 years", apr: "9.49% – 18.99%", amount: "$5,000 – $35,000" },
  { term: "6–7 years", apr: "11.99% – 21.99%", amount: "$15,000 – $50,000" },
];

const STEPS = [
  { t: "Check your rate", d: "Tell us how much you need and what it's for. It takes about 5 minutes." },
  { t: "Apply", d: "Confirm your income and identity. We'll let you know if anything else is needed." },
  { t: "Get your money", d: "Once you've signed your agreement, funds are paid into your account." },
];

const FAQS = [
  { q: "Who can apply?", a: "You need to be 18 or over, have a regular income and hold an account with us. We look at your whole financial picture, not just your credit score." },
  { q: "Can I repay early?", a: "Yes. There are no early repayment fees, so you can make overpayments or settle the full balance at any time." },
  { q: "How is my rate decided?", a: "Your rate depends on your credit history, income, how much you borrow and for how long. You'll see your personal rate before you commit." },
  { q: "Will you ever ask me to pay a fee before I get my loan?", a: "No. We never charge an upfront fee to release a loan. If anyone asks you to pay to receive a loan, it's a scam." },
  { q: "What can't I use a personal loan for?", a: "Personal loans can't be used for business purposes, gambling or paying for tuition. Take a look at our business loans if you're borrowing for a company." },
];

export default function PersonalLoansPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Personal loans"
        title="Borrow with a fixed rate and a payment that never changes"
        subtitle="Loans from $1,000 to $50,000 over 1 to 7 years. Check your rate in minutes without affecting your credit score."
        primary={{ label: "Check your rate", href: "/about/contact" }}
        secondary={{ label: "Work out your payments", href: "#calculator" }}
        highlights={HIGHLIGHTS}
        cutout={{ src: "/loans-hero.webp", alt: "A couple reviewing their loan options at home" }}
      />

      <OverlapSection id="calculator">
        <LoanCalculator />
      </OverlapSection>

      {/* Uses */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What it's for" title="One loan, lots of possibilities" />
          <IconCards items={USES} />
        </div>
      </section>

      {/* Benefits + rates */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Why borrow with us" title="Straightforward from start to finish" mb={28} />
            <CheckList items={BENEFITS} />
          </div>

          <div>
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
              <div style={{ background: BLUE, color: "#fff", padding: "18px 24px", fontFamily: FONT, fontWeight: 600, fontSize: 17 }}>Example rates</div>
              <div className="mob-table-wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.3fr", padding: "12px 24px", fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
                  <div>Term</div>
                  <div>APR range</div>
                  <div>Amount</div>
                </div>
                {RATES.map((r, i) => (
                  <div key={r.term} style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.3fr", padding: "16px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none" }}>
                    <div style={{ fontWeight: 600, color: DARK }}>{r.term}</div>
                    <div style={{ color: GRAY }}>{r.apr}</div>
                    <div style={{ color: GRAY }}>{r.amount}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
              Illustrative rates only. The rate you&apos;re offered depends on your circumstances and may differ from these examples.
            </p>
          </div>
        </div>
      </section>

      <StepsSection title="Three simple steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to see your rate?"
        text="It only takes a few minutes and won't affect your credit score."
        primary={{ label: "Check your rate", href: "/about/contact" }}
        secondary={{ label: "Talk to a lending specialist", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
