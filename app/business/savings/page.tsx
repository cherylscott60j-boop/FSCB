import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const ACCOUNTS = [
  {
    name: "Business Savings",
    tagline: "A simple reserve account alongside your everyday banking.",
    rows: [
      ["Monthly fee", "$0"],
      ["Opening deposit", "$100"],
      ["Interest", "Competitive APY"],
      ["Withdrawals", "6 per statement cycle"],
      ["Transfers to checking", "Same business day"],
    ] as [string, string][],
    href: "/open-account?account=biz-savings",
    cta: "Open Business Savings",
  },
  {
    name: "Business Money Market",
    tagline: "A higher yield tier for larger balances, with more flexibility.",
    featured: true,
    rows: [
      ["Monthly fee", "$0 with qualifying balance*"],
      ["Minimum balance", "$2,500 average daily"],
      ["Interest", "Higher yield tier"],
      ["Withdrawals", "Unlimited transfers"],
      ["Transfers to checking", "Same business day"],
    ] as [string, string][],
    href: "/open-account?account=biz-money-market",
    cta: "Open Money Market",
  },
];

const FEATURES = [
  { t: "Competitive business APY", d: "Earn above-average yields on your reserves, reviewed regularly to stay competitive.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Same-day transfers", d: "Move funds between savings and checking instantly through online banking.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
  { t: "Automatic sweeps", d: "Move excess daily balances into your savings automatically — make every dollar work.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "No lock-in periods", d: "Unlike CDs, your funds stay accessible — no penalties for moving money when you need to.", icon: "M8 11V7a4 4 0 0 1 8 0m-4 8v-4m-6 8h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" },
  { t: "Multiple account tiers", d: "Choose Business Savings or Money Market based on your balance and goals.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" },
  { t: "Interest paid monthly", d: "Interest compounds daily and is credited to your account every month.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
];

const USES = [
  { t: "Tax reserves", d: "Set aside what you'll owe so tax season never catches you short." },
  { t: "Payroll buffer", d: "Keep a cushion so payroll always clears, even in a slow month." },
  { t: "Growth capital", d: "Build up a reserve for equipment, stock or your next hire." },
];

const STEPS = [
  { t: "Open alongside checking", d: "Add a savings account when you open business checking, or at any time afterwards." },
  { t: "Set up automatic transfers", d: "Schedule weekly or monthly transfers from checking to build reserves effortlessly." },
  { t: "Monitor and grow", d: "Track your balance and interest earned in real time in online banking." },
];

const FAQS = [
  { q: "How often is interest paid?", a: "Interest is compounded daily and credited to your account monthly." },
  { q: "Can I open multiple business savings accounts?", a: "Yes. Many businesses open separate accounts for payroll reserves, tax savings and capital expenditure." },
  { q: "Are there withdrawal limits?", a: "Business Savings is limited to 6 withdrawals per statement cycle. Money Market accounts offer more flexibility." },
  { q: "How is the Money Market fee waived?", a: "The monthly fee is waived when you keep a $2,500 average daily balance. Otherwise it's $10." },
  { q: "Can I link an external account?", a: "Yes, you can link external accounts for transfers through online banking." },
];

export default function BusinessSavingsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="Put your business reserves to work"
        subtitle="Competitive yields on idle cash, same-day transfers to checking and no lock-in periods — earn more without losing access to your money."
        primary={{ label: "Open a savings account", href: "/open-account" }}
        secondary={{ label: "Compare accounts", href: "#accounts" }}
        highlights={[
          { v: "High APY", l: "On business reserves" },
          { v: "Same-day", l: "Transfers to checking" },
          { v: "$0", l: "Monthly fees" },
        ]}
        cutout={{ src: "/business-savings-cutout.png", alt: "A confident business owner" }}
      />

      <OverlapSection id="accounts">
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          * Money Market fee waived with a $2,500 average daily balance. Otherwise $10.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Reserves that don't just sit there" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* Uses */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What it's for" title="Build reserves for whatever's next" mb={28} />
          <CheckList items={USES} />
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
        title="Ready to put your reserves to work?"
        text="Open a business savings account online, or talk to our business team."
        primary={{ label: "Open a savings account", href: "/open-account" }}
        secondary={{ label: "Talk to our business team", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
