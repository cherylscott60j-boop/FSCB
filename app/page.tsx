import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import Hero from "@/components/Hero";
import AuthRedirect from "@/components/AuthRedirect";
import FAQAccordion from "@/components/FAQAccordion";
import SavingsCalculator from "@/components/SavingsCalculator";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, LinkCards,
  OverlapSection, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const OPEN_ACCOUNT = [
  {
    name: "Open a checking account",
    tagline: "Fee-free everyday banking for you, with your pay up to 2 days early.",
    rows: [
      ["Monthly fee", "$0"],
      ["Minimum balance", "None"],
      ["Early pay", "Up to 2 days"],
      ["Contactless debit card", "Included"],
      ["Time to apply", "About 5 minutes"],
    ] as [string, string][],
    href: "/open-account?account=free-checking",
    cta: "Open a checking account",
  },
  {
    name: "Open a business account",
    tagline: "Banking for sole traders, start-ups and growing companies.",
    featured: true,
    rows: [
      ["Monthly fee", "$0 for 12 months"],
      ["Electronic payments", "Unlimited, free"],
      ["Invoicing tools", "Included"],
      ["Multi-user access", "Included"],
      ["Time to apply", "About 10 minutes"],
    ] as [string, string][],
    href: "/open-account?account=business-startup",
    cta: "Open a business account",
  },
];

const PRODUCTS = [
  { t: "Checking accounts", d: "Fee-free everyday banking with early pay and instant card controls.", href: "/personal/checking", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Savings", d: "Earn interest every month and save automatically with round-ups.", href: "/personal/savings", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Personal loans", d: "Borrow $1,000 to $50,000 with a fixed rate and fixed payments.", href: "/loans/personal", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Mortgages", d: "Buy your first home, move or remortgage with options from 3% deposit.", href: "/loans/mortgage", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { t: "Safe deposit boxes", d: "Keep documents and valuables in our secure vault from $60 a year.", href: "/personal/safe-deposit-boxes", icon: "M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z" },
  { t: "Private banking", d: "A dedicated relationship manager, investments and retirement planning.", href: "/financial/retirement", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
];

const ACCOUNTS = [
  {
    name: "Everyday Checking",
    tagline: "Simple, fee-free banking for day-to-day spending.",
    rows: [
      ["Monthly fee", "$0"],
      ["Minimum balance", "None"],
      ["Early pay", "Up to 2 days"],
      ["Contactless debit card", "Included"],
    ] as [string, string][],
    href: "/personal/checking",
    cta: "Find out more",
  },
  {
    name: "Premium Checking",
    tagline: "Extra perks for people who bank with us for everything.",
    featured: true,
    rows: [
      ["Monthly fee", "$0 with qualifying balance"],
      ["ATM fee refunds", "Up to $15 / month"],
      ["Foreign card fees", "2 free each month"],
      ["Overdraft cover", "Included"],
    ] as [string, string][],
    href: "/personal/checking",
    cta: "Find out more",
  },
  {
    name: "Everyday Savings",
    tagline: "Flexible savings you can dip into whenever you need.",
    rows: [
      ["Example rate", "3.25% AER"],
      ["Monthly fee", "$0"],
      ["Minimum to open", "Any amount"],
      ["Round-ups & goals", "Included"],
    ] as [string, string][],
    href: "/personal/savings",
    cta: "Find out more",
  },
];

const APP = [
  { t: "See everything in one place", d: "All your accounts, balances and recent payments on one screen." },
  { t: "Instant notifications", d: "Know the moment your card is used or money arrives." },
  { t: "Freeze your card in seconds", d: "Lost your card? Freeze it in the app and unfreeze it if it turns up." },
  { t: "Pay and transfer", d: "Send money, pay bills and set up standing orders wherever you are." },
];

const SWITCH = [
  { t: "We move everything for you", d: "Your balance, direct debits and standing orders come across automatically." },
  { t: "Pick your switch date", d: "It takes 7 working days, on a date that suits you." },
  { t: "Nothing gets missed", d: "Payments made to your old account are redirected for 3 years." },
];

const SECURITY = [
  { t: "We'll never ask for your password or PIN", d: "Not by phone, email, text or in the app." },
  { t: "We'll never ask you to move money to keep it safe", d: "Anyone asking you to move money to a 'safe account' is a scammer." },
  { t: "We'll never ask you to pay a fee to release money", d: "If anyone asks, hang up and call us on a number you trust." },
];

const STEPS = [
  { t: "Apply online", d: "Tell us a little about yourself. It takes about 5 minutes." },
  { t: "Verify your identity", d: "Take a photo of your ID and a quick selfie in the app." },
  { t: "Start banking", d: "Use your digital card straight away. Your physical card arrives in 5–7 days." },
];

const FAQS = [
  { q: "How do I open an account?", a: "Apply online or in the app in about 5 minutes. You'll need to be 18 or over, live in the UK and have a valid photo ID." },
  { q: "Are there any monthly fees?", a: "Everyday Checking and Everyday Savings have no monthly fees. Premium Checking is free when you keep a qualifying balance." },
  { q: "Can I switch my current account to you?", a: "Yes. We'll move your balance and regular payments for you in 7 working days, and redirect any payments to your old account." },
  { q: "How do I contact you?", a: "Call us on (555) 302-1900, chat in the app 24/7, email us or visit one of our branches. Our card and fraud lines are open 24 hours a day." },
  { q: "What should I do if I lose my card?", a: "Freeze it straight away in the app, then call (555) 302-1999 to cancel it and order a replacement." },
  { q: "Is online and mobile banking free?", a: "Yes. Online banking, the app, bill payments and transfers between your accounts are all free." },
];

function Section({ bg, id, children, max = 1240, pad = "80px 32px" }: { bg: string; id?: string; children: React.ReactNode; max?: number; pad?: string }) {
  return (
    <section id={id} className="mob-section" style={{ background: bg, padding: pad }}>
      <div style={{ maxWidth: max, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <SiteLayout>
      <AuthRedirect />
      <Hero />

      {/* Open an account */}
      <OverlapSection className="home-overlap" maxWidth={1040}>
        <AccountCards accounts={OPEN_ACCOUNT} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Business accounts are $6 a month after your first 12 months. Eligibility criteria apply.
        </p>
      </OverlapSection>

      {/* Products */}
      <Section bg="#fff" pad="0 32px 80px">
        <SectionTitle eyebrow="Personal banking" title="Everything you need from your bank" />
        <LinkCards items={PRODUCTS} />
      </Section>

      {/* Accounts */}
      <Section bg={TINT}>
        <SectionTitle eyebrow="Our accounts" title="Find the right account for you" />
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Rates are examples and can change. Premium Checking fee waived with a $500 average daily balance or $1,500 paid in each month; otherwise $9 a month.
        </p>
      </Section>

      {/* Savings calculator */}
      <Section bg="#fff">
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Start saving" title="See how your savings could grow" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 24px" }}>
              Small, regular deposits add up. Move the sliders to see what you could have in a few years.
            </p>
            <Link href="/personal/savings" style={{ color: BLUE, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Explore savings accounts <Icon d="M9 5l7 7-7 7" size={16} />
            </Link>
          </div>
          <SavingsCalculator />
        </div>
      </Section>

      {/* App */}
      <Section bg={TINT}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, background: "#fff", borderRadius: 28, padding: 14, border: "1px solid rgba(17,24,39,.1)" }}>
              <div style={{ background: BLUE, color: "#fff", borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Everyday Checking</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, margin: "4px 0 2px" }}>$2,418.60</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Available balance</div>
              </div>
              <div style={{ padding: "16px 8px 6px" }}>
                {[
                  ["Salary", "+$1,850.00", "Today"],
                  ["Supermarket", "−$64.21", "Yesterday"],
                  ["Coffee shop", "−$4.75", "Yesterday"],
                  ["Electricity", "−$92.40", "Mon"],
                ].map(([n, a, d]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{n}</div>
                      <div style={{ fontSize: 11.5, color: GRAY }}>{d}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: a.startsWith("+") ? BLUE : DARK }}>{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Mobile banking" title="Your bank in your pocket" mb={28} />
            <CheckList items={APP} />
            <Link href="/personal/online-banking" style={{ marginTop: 28, color: BLUE, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              More about online & mobile banking <Icon d="M9 5l7 7-7 7" size={16} />
            </Link>
          </div>
        </div>
      </Section>

      {/* Switch + business/investing */}
      <Section bg="#fff">
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Switch to us</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, margin: "0 0 20px", letterSpacing: "-.01em" }}>Switching is easier than you think</h3>
            {SWITCH.map((s) => (
              <div key={s.t} style={{ padding: "13px 0", borderTop: "1px solid rgba(255,255,255,.18)" }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>{s.t}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
            <Link href="/open-account" style={{ marginTop: 22, display: "inline-block", background: "#fff", color: BLUE, fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 4, textDecoration: "none" }}>
              Switch to us
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { e: "Business banking", t: "Banking that helps your business grow", d: "Accounts, lending and card payments for sole traders through to established companies.", href: "/business", cta: "Explore business banking" },
              { e: "Investing", t: "Grow your money for the future", d: "Invest yourself, let us manage it, or work with our private banking team. Capital at risk.", href: "/financial", cta: "Explore investing" },
            ].map((c) => (
              <Link key={c.href} href={c.href} style={{ flex: 1, border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "30px 30px", textDecoration: "none", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 10 }}>{c.e}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: DARK, marginBottom: 8 }}>{c.t}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, flex: 1 }}>{c.d}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: BLUE, fontWeight: 600, fontSize: 14.5, marginTop: 16 }}>
                  {c.cta} <Icon d="M9 5l7 7-7 7" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section bg={TINT}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Stay safe" title="How to know it's really us" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 20px" }}>
              Scammers often pretend to be from a bank. If a call, text or email doesn&apos;t feel right, hang up and contact us using the numbers on our website.
            </p>
            <Link href="/about/contact" style={{ color: BLUE, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Contact us <Icon d="M9 5l7 7-7 7" size={16} />
            </Link>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "32px 30px" }}>
            <CheckList items={SECURITY} />
          </div>
        </div>
      </Section>

      <StepsSection title="Open an account in three steps" steps={STEPS} cta={{ label: "Open an account", href: "/open-account" }} />

      <Section bg={TINT} max={820}>
        <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
        <FAQAccordion faqs={FAQS} accent={BLUE} />
      </Section>

      <ClosingCTA
        title="Ready to bank with us?"
        text="Open an account online in about 5 minutes, or visit one of our branches."
        primary={{ label: "Open an account", href: "/open-account" }}
        secondary={{ label: "Find a branch", href: "/about/contact#branches" }}
      />
    </SiteLayout>
  );
}
