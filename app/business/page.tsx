import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards, LinkCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const PRODUCTS = [
  { t: "Business checking", d: "Everyday accounts for taking payments, paying suppliers and running payroll.", href: "/business/checking", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Business savings", d: "Put spare cash to work and build a reserve for tax bills and growth.", href: "/business/savings", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Business loans", d: "Funding for equipment, premises, stock and expansion.", href: "/business/loans", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
  { t: "Card payments", d: "Take card and contactless payments in store, online and on the go.", href: "/business/merchant-services", icon: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { t: "Business credit cards", d: "Manage spending with employee cards, limits and cashback.", href: "/business/credit-cards", icon: "M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" },
  { t: "Business insurance", d: "Cover for your premises, stock, liability and people.", href: "/insurance/business", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
];

const TOP = [
  { t: "Open an account online", d: "Apply in about 10 minutes.", icon: "M12 4v16m8-8H4" },
  { t: "A named business manager", d: "For businesses turning over $500K+.", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
  { t: "Free banking for 12 months", d: "For new businesses and switchers.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Accounting software links", d: "Sync transactions automatically.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
];

const ACCOUNTS = [
  {
    name: "Start-up",
    tagline: "For new businesses in their first year of trading.",
    rows: [
      ["Monthly fee", "$0 for 12 months"],
      ["Electronic payments", "Unlimited, free"],
      ["Cash deposits", "$1,000 / month free"],
      ["Cheques paid in", "50p each"],
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
      ["Cheques paid in", "Free"],
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

const SIZES = [
  { name: "Sole traders & start-ups", desc: "Simple accounts and tools to get you up and running.", points: ["Free banking for 12 months", "Invoicing and expense tracking in the app", "Start-up loans from $1,000"] },
  { name: "Small & growing businesses", desc: "Room to grow, with lending and payments that scale with you.", points: ["Multi-user access with permissions", "Overdrafts and loans up to $250,000", "Card payments from 1.39% per transaction"] },
  { name: "Established businesses", desc: "A dedicated relationship team for more complex needs.", points: ["A named business manager", "Commercial mortgages and asset finance", "International payments and currency accounts"] },
];

const TOOLS = [
  { t: "Invoicing", d: "Create and send invoices from the app, and see when they've been paid.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" },
  { t: "Bulk payments & payroll", d: "Pay staff and suppliers in one go by uploading a payment file.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Multi-user access", d: "Give your team access with their own logins and set who can view, create or approve payments.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
  { t: "Expense cards", d: "Issue debit cards to employees with individual spending limits.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Tax pots", d: "Set money aside automatically for VAT and your tax bill.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Cash flow insights", d: "See money coming in and going out, and forecast the weeks ahead.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
];

const LENDING = [
  { type: "Business overdraft", amount: "$500 – $50,000", term: "Reviewed yearly", rate: "From 9.9% EAR" },
  { type: "Small business loan", amount: "$1,000 – $50,000", term: "1 – 7 years", rate: "From 7.4% APR" },
  { type: "Growth loan", amount: "$50,000 – $250,000", term: "1 – 10 years", rate: "From 6.5% APR" },
  { type: "Commercial mortgage", amount: "$100,000 – $2m", term: "Up to 25 years", rate: "Ask us" },
  { type: "Asset finance", amount: "$5,000 – $500,000", term: "1 – 7 years", rate: "Ask us" },
];

const CARD_FEES = [
  ["In person (debit cards)", "1.39%"],
  ["In person (credit cards)", "1.69%"],
  ["Online payments", "1.49% + 20p"],
  ["Card reader", "$29 one-off"],
  ["Money in your account", "Next business day"],
];

const INDUSTRIES = [
  "Retail & shops", "Cafés & restaurants", "Trades & construction", "Health & beauty",
  "Professional services", "Creative & media", "Farming & agriculture", "Charities & clubs",
  "Property & landlords", "Transport & logistics", "Technology & e-commerce", "Manufacturing",
];

const SWITCH = [
  { t: "We do the work", d: "We move your balance, direct debits and standing orders for you." },
  { t: "Pick your switch date", d: "Choose a date that suits your business. It takes 7 working days." },
  { t: "Payments redirected", d: "Payments made to your old account are redirected for 3 years." },
  { t: "12 months' free banking", d: "No monthly fee for your first year when you switch to us." },
];

const DOCUMENTS = [
  { t: "Business details", d: "Your business name, address, what you do and expected annual turnover." },
  { t: "Company number", d: "If you're a limited company or LLP, your registered company number." },
  { t: "Owners and directors", d: "Names, dates of birth and home addresses for directors and anyone owning 25% or more." },
  { t: "Photo ID", d: "A passport or driving licence for each director, uploaded through the app." },
];

const FRAUD = [
  { t: "Payment approval rules", d: "Require two people to approve payments over a set amount." },
  { t: "Confirmation of payee", d: "We check the account name matches before you send a payment to a new supplier." },
  { t: "Invoice fraud warnings", d: "If a supplier emails to say their bank details have changed, call them on a number you trust before paying." },
  { t: "24/7 fraud team", d: "Call (555) 302-1911 any time if you spot a payment you don't recognise." },
];

const BENEFITS = [
  { t: "Real people who understand business", d: "Our business team is available by phone Monday to Saturday, and in branch." },
  { t: "Transparent pricing", d: "Clear monthly fees with no hidden charges. See exactly what you pay before you sign up." },
  { t: "Fast lending decisions", d: "Most loan decisions within 3 business days of a complete application." },
  { t: "Business app and online banking", d: "Pay suppliers, approve payments and check balances from anywhere." },
];

const STEPS = [
  { t: "Check you're eligible", d: "You'll need to be a UK-registered business or sole trader, and aged 18 or over." },
  { t: "Apply online", d: "Tell us about your business and the people who run it. It takes about 10 minutes." },
  { t: "Start banking", d: "Once approved, your account details are available straight away in the app." },
];

const FAQS = [
  { q: "What do I need to open a business account?", a: "Details of your business, including its registered address and company number if it has one, plus ID and home addresses for all directors and anyone owning 25% or more." },
  { q: "How long does it take to open an account?", a: "Most applications are approved within 2 business days. Some need extra checks, and we'll let you know if we need more information." },
  { q: "Can I switch my business account to you?", a: "Yes. We'll move your balance and payments across for you in 7 working days, and redirect payments made to your old account for 3 years." },
  { q: "Are there fees for business banking?", a: "New businesses and switchers get 12 months of free everyday banking. After that, Business Everyday is $6 a month including unlimited electronic payments." },
  { q: "Can I open an account as a sole trader?", a: "Yes. Sole traders can open any of our business accounts. Keeping business and personal money separate makes your tax return much easier." },
  { q: "Can my accountant access my account?", a: "Yes. You can give your accountant or bookkeeper view-only access with their own login, and connect your account to popular accounting software." },
  { q: "Can I pay in cash and cheques?", a: "Yes, at any of our branches. Each account includes a free monthly cash deposit allowance, shown in the account comparison above." },
  { q: "How do I apply for a loan or overdraft?", a: "Existing customers can apply in the app or online banking. For loans over $50,000, your business manager will talk through your plans and what you need." },
];

function SectionShell({ bg, id, children, max = 1240 }: { bg: string; id?: string; children: React.ReactNode; max?: number }) {
  return (
    <section id={id} className="mob-section" style={{ background: bg, padding: "80px 32px" }}>
      <div style={{ maxWidth: max, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export default function BusinessPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="Banking that helps your business grow"
        subtitle="Accounts, lending, card payments and support for sole traders, small businesses and established companies."
        primary={{ label: "Open a business account", href: "/open-account" }}
        secondary={{ label: "Compare accounts", href: "#accounts" }}
        highlights={[
          { v: "12 months", l: "Free banking for new businesses" },
          { v: "3 days", l: "Typical loan decision" },
          { v: "10 min", l: "To apply online" },
        ]}
      />

      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {TOP.map((c, i) => (
            <div key={c.t} style={{ padding: "28px 26px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon d={c.icon} size={22} />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16.5, color: DARK, marginBottom: 4 }}>{c.t}</div>
              <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Products */}
      <section id="products" className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our products" title="Everything your business needs" />
          <LinkCards items={PRODUCTS} />
        </div>
      </section>

      {/* Account comparison */}
      <SectionShell bg={TINT} id="accounts">
        <SectionTitle eyebrow="Business accounts" title="Compare our business accounts" />
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Example pricing. Cash deposits above your monthly allowance cost 0.7% of the amount paid in. International payments $15 each above any free allowance.
        </p>
      </SectionShell>

      {/* Business size */}
      <SectionShell bg="#fff">
        <SectionTitle eyebrow="Whatever your size" title="Support at every stage of your business" />
        <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {SIZES.map((s, i) => (
            <div key={s.name} style={{ background: i === 1 ? BLUE : "#fff", color: i === 1 ? "#fff" : DARK, border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "30px 28px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: i === 1 ? "rgba(255,255,255,.78)" : GRAY, marginBottom: 18 }}>{s.desc}</div>
              {s.points.map((p) => (
                <div key={p} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1px solid ${i === 1 ? "rgba(255,255,255,.18)" : "rgba(17,24,39,.08)"}`, fontSize: 14.5 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i === 1 ? "#fff" : BLUE} strokeWidth="3" style={{ flex: "none", marginTop: 3 }}><path d="M5 12l5 5L20 7" /></svg>
                  {p}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Tools */}
      <SectionShell bg={TINT}>
        <SectionTitle eyebrow="Business tools" title="Run your business from your phone" />
        <IconCards items={TOOLS} />
      </SectionShell>

      {/* Lending + card fees */}
      <SectionShell bg="#fff">
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Business lending" title="Finance to help you grow" mb={24} />
            <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
              <div className="mob-table-wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 1fr", padding: "14px 20px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  <div>Product</div>
                  <div>Amount</div>
                  <div>Term</div>
                  <div>Rate</div>
                </div>
                {LENDING.map((l, i) => (
                  <div key={l.type} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 1fr", padding: "15px 20px", fontSize: 14, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none" }}>
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
          </div>

          <div>
            <SectionTitle eyebrow="Card payments" title="Get paid your way" mb={24} />
            <div style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "8px 24px 16px" }}>
              {CARD_FEES.map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "13px 0", borderTop: i ? "1px solid rgba(17,24,39,.08)" : "none", fontSize: 14.5 }}>
                  <span style={{ color: GRAY }}>{k}</span>
                  <span style={{ fontWeight: 600, color: DARK, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>Example fees. No monthly contract or minimum term.</p>
          </div>
        </div>
      </SectionShell>

      {/* Industries */}
      <SectionShell bg={TINT}>
        <SectionTitle eyebrow="Who we work with" title="Banking for businesses of every kind" mb={14} />
        <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 720 }}>
          Our business managers work with companies across many sectors and understand the challenges each one faces.
        </p>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {INDUSTRIES.map((ind) => (
            <div key={ind} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "16px 18px", fontWeight: 600, fontSize: 14.5, color: DARK, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE, flex: "none" }} />
              {ind}
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Switching + documents */}
      <SectionShell bg="#fff">
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Switching</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 20px", letterSpacing: "-.01em" }}>Switch your business account in 7 days</h3>
            {SWITCH.map((s) => (
              <div key={s.t} style={{ padding: "13px 0", borderTop: "1px solid rgba(255,255,255,.18)" }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>{s.t}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 12 }}>Be prepared</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 24px", color: DARK, letterSpacing: "-.01em" }}>What you&apos;ll need to apply</h3>
            <CheckList items={DOCUMENTS} />
          </div>
        </div>
      </SectionShell>

      {/* Fraud + why us */}
      <SectionShell bg={TINT}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Fraud protection" title="Keeping your business safe" mb={28} />
            <CheckList items={FRAUD} />
          </div>
          <div>
            <SectionTitle eyebrow="Why us" title="Business banking made simple" mb={28} />
            <CheckList items={BENEFITS} />
          </div>
        </div>
      </SectionShell>

      <StepsSection title="Open a business account in three steps" steps={STEPS} />

      <SectionShell bg={TINT} max={820}>
        <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
        <FAQAccordion faqs={FAQS} accent={BLUE} />
      </SectionShell>

      <ClosingCTA
        title="Ready to bank with us?"
        text="Open a business account online, or talk to our business team."
        primary={{ label: "Open a business account", href: "/open-account" }}
        secondary={{ label: "Talk to our business team", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
