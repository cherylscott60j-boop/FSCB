import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import SavingsCalculator from "@/components/SavingsCalculator";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const ACCOUNTS = [
  {
    name: "Everyday Savings",
    tagline: "Flexible savings you can dip into whenever you need.",
    rows: [
      ["Example APY", "3.25%"],
      ["Monthly fee", "$0"],
      ["Minimum balance", "None"],
      ["Withdrawals", "6 per month"],
      ["Round-ups & goals", "Included"],
    ] as [string, string][],
    href: "/open-account?account=regular-savings",
    cta: "Open Everyday Savings",
  },
  {
    name: "Money Market",
    tagline: "A higher rate for bigger balances, with easy access.",
    featured: true,
    rows: [
      ["Example APY", "3.75%"],
      ["Monthly fee", "$0 with $2,500 balance*"],
      ["Minimum balance", "$2,500"],
      ["Withdrawals", "Unlimited"],
      ["Check writing", "Included"],
    ] as [string, string][],
    href: "/open-account?account=money-market",
    cta: "Open a Money Market",
  },
];

const FEATURES = [
  { t: "Savings goals", d: "Create named goals for a car, a trip or a rainy-day fund and track your progress.", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
  { t: "Automatic round-ups", d: "Round up every card purchase to the nearest dollar and save the spare change.", icon: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" },
  { t: "Scheduled transfers", d: "Move a set amount into savings every payday without having to think about it.", icon: "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" },
  { t: "Interest every month", d: "Interest is calculated daily and paid into your account each month.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Instant transfers", d: "Move money between your checking and savings accounts instantly, any time.", icon: "M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" },
  { t: "No minimum to start", d: "Open Everyday Savings with any amount and earn interest from your first cent.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
];

const HABITS = [
  { t: "Pay yourself first", d: "Set a transfer for the day you get paid so saving happens before spending." },
  { t: "Separate your goals", d: "Open multiple accounts or goals so each pot of money has one job." },
  { t: "Start an emergency fund", d: "Aim for three months of essential costs to cover the unexpected." },
  { t: "Let small amounts add up", d: "Round-ups and small weekly transfers grow faster than you'd expect." },
];

const STEPS = [
  { t: "Choose your account", d: "Everyday Savings for flexibility, or a Money Market for a higher rate on bigger balances." },
  { t: "Set your goals", d: "Name your goals in the app and choose how much to save toward each one." },
  { t: "Automate it", d: "Turn on round-ups and scheduled transfers and watch your savings grow." },
];

const FAQS = [
  { q: "How often is interest paid?", a: "Interest is calculated every day on your balance and paid into your account monthly." },
  { q: "Can the rate change?", a: "Yes. Savings rates are variable, so they can go up or down. We'll let you know before any change takes effect." },
  { q: "How many withdrawals can I make?", a: "Everyday Savings allows 6 withdrawals or transfers out each month. Money Market accounts have no limit." },
  { q: "Can I have more than one savings account?", a: "Yes. You can open several accounts and dedicate each one to a different goal." },
  { q: "How is the Money Market fee waived?", a: "There's no monthly fee as long as your balance stays at $2,500 or more. Otherwise the fee is $5 a month." },
];

export default function SavingsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Savings accounts"
        title="Grow your savings with tools that do the work for you"
        subtitle="Earn interest every month, set goals and save automatically with round-ups and scheduled transfers."
        primary={{ label: "Open a savings account", href: "/open-account" }}
        secondary={{ label: "See how it could grow", href: "#calculator" }}
        highlights={[
          { v: "Up to 3.75%", l: "Example APY" },
          { v: "$0", l: "Monthly fees" },
          { v: "Any amount", l: "To get started" },
        ]}
        image={{ src: "/savings-hero.webp", alt: "A couple saving money in a piggy bank at home", position: "72% 45%" }}
      />

      <OverlapSection id="calculator">
        <SavingsCalculator />
      </OverlapSection>

      {/* Accounts */}
      <section id="accounts" className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our accounts" title="Choose the right account for you" />
          <AccountCards accounts={ACCOUNTS} />
          <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
            APYs shown are examples and are variable. * $5 monthly fee applies if your balance falls below $2,500.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Built to help you save more" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* Habits */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Saving tips" title="Small habits, big difference" mb={28} />
            <CheckList items={HABITS} />
          </div>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>Example goal</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, marginBottom: 24 }}>Emergency fund</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 28, fontFamily: FONT }}>$3,600</span>
              <span style={{ color: "rgba(255,255,255,.7)", alignSelf: "flex-end" }}>of $6,000</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,.2)", overflow: "hidden", marginBottom: 28 }}>
              <div style={{ width: "60%", height: "100%", background: "#fff", borderRadius: 999 }} />
            </div>
            {[
              ["Round-ups this month", "$23.40"],
              ["Payday transfer", "$250.00"],
              ["On track to finish", "In 9 months"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 14.5 }}>
                <span style={{ color: "rgba(255,255,255,.75)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StepsSection title="Start saving in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Start building your savings today"
        text="Open an account online in minutes with any amount."
        primary={{ label: "Open a savings account", href: "/open-account" }}
        secondary={{ label: "Talk to us", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
