import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const ACCOUNTS = [
  {
    name: "Start-up",
    tagline: "For new businesses in their first year of trading.",
    rows: [
      ["Monthly fee", "$0 for 12 months"],
      ["Electronic payments", "Unlimited, free"],
      ["Cash deposits", "$1,000 / month free"],
      ["Checks deposited", "$0.50 each"],
      ["Invoicing tools", "Included"],
    ] as [string, string][],
    href: "/open-account?account=business-startup",
    cta: "Open a Start-up account",
  },
  {
    name: "Business Everyday",
    tagline: "Our most popular account for established small businesses.",
    featured: true,
    rows: [
      ["Monthly fee", "$6"],
      ["Electronic payments", "Unlimited, free"],
      ["Cash deposits", "$3,000 / month free"],
      ["Checks deposited", "Free"],
      ["Users with access", "Up to 5"],
    ] as [string, string][],
    href: "/open-account?account=business-everyday",
    cta: "Open Business Everyday",
  },
  {
    name: "Business Plus",
    tagline: "For larger businesses with higher volumes and a named manager.",
    rows: [
      ["Monthly fee", "$18"],
      ["Electronic payments", "Unlimited, free"],
      ["Cash deposits", "$10,000 / month free"],
      ["International payments", "5 free / month"],
      ["Users with access", "Unlimited"],
    ] as [string, string][],
    href: "/open-account?account=business-plus",
    cta: "Open Business Plus",
  },
];

const FEATURES = [
  { t: "No fees for 12 months", d: "New businesses and switchers pay no monthly fee for their first year.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Unlimited electronic payments", d: "Send and receive as many electronic payments as your business needs.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { t: "Multi-user access", d: "Give your team and bookkeeper their own logins, with permissions you control.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Same-day payments", d: "Pay vendors, contractors and staff with same-day electronic transfers.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Business debit cards", d: "Issue cards to employees and set individual spending limits per card.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "A business manager", d: "Businesses turning over $500K+ get a named manager who knows your account.", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
];

const TOOLS = [
  { t: "Invoicing", d: "Create and send invoices from the app, and see when they've been paid." },
  { t: "Bulk payments & payroll", d: "Pay staff and suppliers in one go by uploading a payment file." },
  { t: "Expense cards", d: "Issue debit cards to employees with individual spending limits." },
  { t: "Cash flow insights", d: "See money coming in and going out, and forecast the weeks ahead." },
];

const STEPS = [
  { t: "Check you're eligible", d: "You'll need to be a U.S.-registered business or sole proprietor, and aged 18 or over." },
  { t: "Apply online", d: "Tell us about your business and the people who run it. It takes about 10 minutes." },
  { t: "Start banking", d: "Once approved, your account details are available straight away in the app." },
];

const FAQS = [
  { q: "What do I need to open a business checking account?", a: "Details of your business, including its registered address and EIN if it has one, plus ID and home addresses for all directors and anyone owning 25% or more." },
  { q: "Is there a minimum opening deposit?", a: "No. You can open a Start-up or Business Everyday account with any amount." },
  { q: "Can I open an account as a sole proprietor?", a: "Yes. Sole proprietors can open any of our business accounts using their SSN and business name." },
  { q: "How is the Business Everyday fee waived?", a: "New businesses and switchers don't pay the monthly fee for their first 12 months. After that it's $6 a month." },
  { q: "Can my accountant access the account?", a: "Yes. You can give your accountant or bookkeeper view-only access with their own login, and connect to popular accounting software." },
  { q: "How long does approval take?", a: "Most applications are approved within 2 business days. Some need extra checks, and we'll let you know if we need more information." },
];

export default function BusinessCheckingPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="Business checking built for how you operate"
        subtitle="No monthly fees for your first year, unlimited electronic payments and multi-user access — everyday banking that keeps pace with your business."
        primary={{ label: "Open a business account", href: "/open-account" }}
        secondary={{ label: "Compare accounts", href: "#accounts" }}
        highlights={[
          { v: "$0", l: "Fees for 12 months" },
          { v: "Unlimited", l: "Electronic payments" },
          { v: "Up to 5", l: "Users with access" },
        ]}
        image={{ src: "/business-checking-hero.jpg", alt: "A business owner reviewing her accounts on a tablet", position: "50% 30%" }}
      />

      <OverlapSection id="accounts">
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Example pricing. Cash deposits above your monthly allowance cost 0.7% of the amount paid in.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Everything your business needs to bank" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* Tools */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Business tools" title="Run your business from your phone" mb={28} />
            <CheckList items={TOOLS} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, background: "#fff", borderRadius: 28, padding: 14, border: "1px solid rgba(17,24,39,.06)" }}>
              <div style={{ background: BLUE, color: "#fff", borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Business Everyday</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, margin: "4px 0 2px" }}>$18,204.55</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Available balance</div>
              </div>
              <div style={{ padding: "16px 8px 6px" }}>
                {[
                  ["Invoice #1042 paid", "+$2,400.00", "Today"],
                  ["Payroll run", "−$6,180.00", "Yesterday"],
                  ["Office supplies", "−$184.30", "Yesterday"],
                  ["Card payments in", "+$1,026.40", "Mon"],
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
        </div>
      </section>

      <StepsSection title="Open a business account in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to open a business account?"
        text="Apply online in about 10 minutes, or talk to our business team."
        primary={{ label: "Open a business account", href: "/open-account" }}
        secondary={{ label: "Talk to our business team", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
