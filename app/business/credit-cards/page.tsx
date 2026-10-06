import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const ACCOUNTS = [
  {
    name: "Business Cash Card",
    tagline: "Straightforward cashback on everyday business spending.",
    rows: [
      ["Annual fee", "$0"],
      ["Cashback", "1.5% on all purchases"],
      ["Eligibility", "Good credit"],
      ["Employee cards", "Free"],
      ["Foreign transaction fee", "3%"],
    ] as [string, string][],
    href: "/about/contact",
    cta: "Apply for Cash Card",
  },
  {
    name: "Business Rewards Card",
    tagline: "Higher cashback and travel perks for growing businesses.",
    featured: true,
    rows: [
      ["Annual fee", "$0"],
      ["Cashback", "2% on all purchases"],
      ["Eligibility", "Good–excellent credit"],
      ["Employee cards", "Free"],
      ["Foreign transaction fee", "None"],
    ] as [string, string][],
    href: "/about/contact",
    cta: "Apply for Rewards Card",
  },
];

const FEATURES = [
  { t: "Cashback on everything", d: "Earn on every business purchase — supplies, travel, utilities, vendors and more.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
  { t: "Free employee cards", d: "Issue cards to employees with individual spending limits you set.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857" },
  { t: "Expense reporting", d: "Transactions categorize automatically and export to your accounting software.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
  { t: "No foreign transaction fees*", d: "Do business globally without per-transaction surcharges on the Rewards Card.", icon: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9" },
  { t: "Flexible credit limits", d: "Starting limits that grow with your business as you build a track record.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Zero liability protection", d: "No liability on unauthorized purchases, with real-time fraud alerts.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
];

const USES = [
  { t: "Set spending limits per card", d: "Give each employee a card with the limit that fits their role." },
  { t: "Freeze a card instantly", d: "Lost a card or spotted something odd? Freeze it in seconds in the app." },
  { t: "Sync to your books", d: "Connect to QuickBooks, Xero or export a CSV at month's end." },
];

const STEPS = [
  { t: "Apply online or in branch", d: "We review your business and personal credit. Most decisions within 1 business day." },
  { t: "Set up employee cards", d: "Add employees, set individual limits and turn on spend notifications." },
  { t: "Earn and manage", d: "Cashback is credited monthly. Connect your accounting software for easy reconciliation." },
];

const FAQS = [
  { q: "Will applying affect my personal credit?", a: "A personal guarantee is required for most small business credit cards, which includes a check on your personal credit as part of the application." },
  { q: "Can I increase my credit limit over time?", a: "Yes. After 6 months of responsible use, you can request a credit limit increase by contacting your business banker." },
  { q: "How does cashback work?", a: "Cashback is applied automatically as a statement credit each month — no points portal or minimum redemption." },
  { q: "What if an employee makes an unauthorized purchase?", a: "You have zero liability for unauthorized transactions, and you can freeze or cancel employee cards instantly." },
  { q: "Is there an annual fee?", a: "No. Both the Cash Card and Rewards Card have no annual fee." },
];

export default function BusinessCreditCardsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="A card that keeps pace with your spending"
        subtitle="Cashback on every purchase, free employee cards with individual limits, and tools that plug into your accounting software."
        primary={{ label: "Apply for a business card", href: "/about/contact" }}
        secondary={{ label: "Compare cards", href: "#cards" }}
        highlights={[
          { v: "Up to 2%", l: "Cashback on purchases" },
          { v: "$0", l: "Annual fee" },
          { v: "Free", l: "Employee cards" },
        ]}
        cutout={{ src: "/business-credit-cards-cutout.png", alt: "A business owner managing her company's spending" }}
      />

      <OverlapSection id="cards">
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          * The Business Cash Card carries a 3% foreign transaction fee. APR is based on business and personal creditworthiness.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Your business spending, working for you" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* Uses */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Stay in control" title="Spending tools built for teams" mb={28} />
          <CheckList items={USES} />
        </div>
      </section>

      <StepsSection title="Apply in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to apply for a business card?"
        text="Apply online or in branch — most decisions within 1 business day."
        primary={{ label: "Apply for a business card", href: "/about/contact" }}
        secondary={{ label: "Open a business account", href: "/open-account" }}
      />
    </SiteLayout>
  );
}
