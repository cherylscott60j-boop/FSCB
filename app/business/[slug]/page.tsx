import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { notFound } from "next/navigation";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

const PAGES = {
  checking: {
    title: "Business Checking",
    subtitle: "Flexible accounts for businesses of every size — no fees, no friction.",
    hero: "linear-gradient(145deg,#1a0a2e,#2d1b4e)",
    label: "Business Banking",
    ctaHref: "/open-account",
    stats: [{ v: "$0", l: "Monthly fees*" }, { v: "Unlimited", l: "Transactions" }, { v: "Same-day", l: "ACH payments" }],
    overview: "Running a business means your bank should work as hard as you do. SGGINV Business Checking accounts give you the flexibility to handle high transaction volumes, the tools to manage your team's access, and a dedicated advisor who understands local business.",
    features: [
      { title: "No Monthly Maintenance Fees", desc: "Keep more of your business revenue. Qualifying accounts pay zero monthly maintenance charges.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Unlimited Transactions", desc: "Process as many deposits, withdrawals, and transfers as your business needs — no per-item fees.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
      { title: "Multi-User Access", desc: "Assign roles and permissions to employees and bookkeepers without sharing your login credentials.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857" },
      { title: "Same-Day ACH Payments", desc: "Send payments to vendors, employees, and contractors with same-day ACH processing.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Business Debit Card", desc: "Manage business expenses with a dedicated debit card. Set spend limits per employee card.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
      { title: "Dedicated Business Advisor", desc: "A local banking expert assigned to your account — available for questions, strategy, and growth planning.", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" },
    ],
    accounts: [
      { name: "Business Basic Checking", fee: "$0/month", min: "$0 to open", txn: "200 items/month", extras: "Online & mobile banking", highlight: false, startHref: "/open-account?account=biz-basic-checking" },
      { name: "Business Premium Checking", fee: "$0/month*", min: "$500 avg balance", txn: "Unlimited", extras: "+ ACH, wire discounts", highlight: true, startHref: "/open-account?account=biz-premium-checking" },
    ],
    note: "* Fee waived with $500 average daily balance or $2,500 monthly deposits.",
    steps: [
      { n: "1", t: "Gather Your Documents", d: "Business formation documents, EIN, and owner identification — we'll tell you exactly what you need." },
      { n: "2", t: "Meet with an Advisor", d: "Open in-branch or start online. A banker reviews your needs and recommends the right account." },
      { n: "3", t: "Start Banking", d: "Account is funded and ready the same day. Set up payroll, online access, and debit cards immediately." },
    ],
    faqs: [
      { q: "What documents do I need to open a business account?", a: "You'll need your EIN, business formation documents (Articles of Incorporation or LLC agreement), a valid photo ID for each owner, and your business address." },
      { q: "Can I have multiple signers on the account?", a: "Yes — you can add authorized signers, set role-based permissions, and grant view-only access to your bookkeeper." },
      { q: "Do you offer accounts for sole proprietors?", a: "Absolutely. Sole proprietors can open a business checking account using their SSN and business name (DBA)." },
    ],
    cta: "Open a Business Account",
  },

  savings: {
    title: "Business Savings",
    subtitle: "Earn more on your business reserves with high-yield accounts designed for growth.",
    hero: "linear-gradient(145deg,#0f1f0f,#1e4020)",
    label: "Business Banking",
    ctaHref: "/open-account",
    stats: [{ v: "High APY", l: "Competitive yield" }, { v: "Same-day", l: "Transfers to checking" }, { v: "$0", l: "Monthly fees" }],
    overview: "Your idle business cash should earn more than nothing. SGGINV Business Savings and Money Market accounts deliver competitive yields on your reserves, with the flexibility to transfer funds to checking the same day when you need to deploy capital.",
    features: [
      { title: "Competitive Business APY", desc: "Earn above-average yields on your business reserves — rates are reviewed regularly to stay competitive.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Same-Day Transfers", desc: "Move funds between your business savings and checking accounts instantly through online banking.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
      { title: "Treasury Management", desc: "Sweep excess daily balances into higher-yield accounts automatically — make every dollar count overnight.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
      { title: "No Lock-In Periods", desc: "Unlike CDs, your funds remain accessible. No penalties for moving money when business needs shift.", icon: "M8 11V7a4 4 0 0 1 8 0m-4 8v-4m-6 8h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" },
      { title: "Multiple Account Options", desc: "Choose from Business Savings, Money Market, or CDs based on your liquidity needs and yield goals.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" },
    ],
    accounts: [
      { name: "Business Savings", fee: "$0/month", min: "$100 to open", txn: "Competitive APY", extras: "6 withdrawals/month", highlight: false, startHref: "/open-account?account=biz-savings" },
      { name: "Business Money Market", fee: "$0/month*", min: "$2,500 avg balance", txn: "Higher yield tier", extras: "Unlimited transfers", highlight: true, startHref: "/open-account?account=biz-money-market" },
    ],
    note: "* Money Market fee waived with $2,500 minimum balance maintained.",
    steps: [
      { n: "1", t: "Open Alongside Checking", d: "Add a savings account when you open business checking or at any time through online banking." },
      { n: "2", t: "Set Up Automatic Transfers", d: "Schedule weekly or monthly transfers from checking to savings to build reserves effortlessly." },
      { n: "3", t: "Monitor and Grow", d: "Track your balance and interest earned in real time through SGGINV Business Online Banking." },
    ],
    faqs: [
      { q: "How often is interest paid?", a: "Interest is compounded daily and credited to your account monthly." },
      { q: "Can I open multiple business savings accounts?", a: "Yes — many businesses open separate accounts for payroll reserves, tax savings, and capital expenditures." },
      { q: "Are there withdrawal limits?", a: "Business Savings is limited to 6 withdrawals per statement cycle under Regulation D. Money Market accounts offer greater flexibility." },
      { q: "Can I link to an external business account?", a: "Yes — you can link external accounts for ACH transfers through SGGINV Business Online Banking." },
    ],
    cta: "Open a Business Savings Account",
  },

  loans: {
    title: "Business Loans",
    subtitle: "Local capital decisions to grow, expand, or smooth your cash flow.",
    hero: "linear-gradient(145deg,#0d2137,#1a4a6b)",
    label: "Business Banking",
    ctaHref: "/about/contact",
    stats: [{ v: "$10K–$5M", l: "Loan range" }, { v: "SBA", l: "Programs available" }, { v: "Local", l: "Underwriting" }],
    overview: "Growing a business takes capital — and capital decisions shouldn't be made by an algorithm in another state. SGGINV business loans are underwritten locally by bankers who know your market, your industry, and your potential.",
    features: [
      { title: "SBA 7(a) & 504 Loans", desc: "Access SBA-backed financing with lower down payments and longer repayment terms for qualified businesses.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "Commercial Real Estate", desc: "Purchase or refinance owner-occupied or investment commercial properties with local expertise.", icon: "M3 21h18M5 21V9l7-6 7 6v12" },
      { title: "Equipment Financing", desc: "Finance new or used equipment with terms matched to the useful life of the asset.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066" },
      { title: "Business Lines of Credit", desc: "Revolving credit lines provide flexible access to working capital exactly when you need it.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9" },
      { title: "Construction Loans", desc: "Finance ground-up construction or major renovations with draw-based construction financing.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3" },
      { title: "Agricultural Lending", desc: "Specialized loan programs for farms, ranches, and agribusiness operations.", icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945" },
    ],
    accounts: [
      { name: "Business Term Loan", fee: "Fixed or variable rate", min: "$10,000–$1M", txn: "12–120 months", extras: "Equipment, expansion", highlight: false, startHref: "/about/contact" },
      { name: "SBA Loan Program", fee: "SBA-backed rate", min: "$50,000–$5M", txn: "Up to 300 months", extras: "Lower down payment", highlight: true, startHref: "/about/contact" },
    ],
    note: "Rates and terms are based on business financials, collateral, and creditworthiness. Contact a business banker for a detailed proposal.",
    steps: [
      { n: "1", t: "Speak with a Business Banker", d: "We start with a no-obligation conversation to understand your funding needs and timeline." },
      { n: "2", t: "Submit Your Application", d: "Provide business financials, tax returns, and business plan. We guide you through every document." },
      { n: "3", t: "Receive Your Decision", d: "Local underwriting means faster answers. Most decisions within 3–5 business days of complete application." },
    ],
    faqs: [
      { q: "What financial documents do I need to apply?", a: "Typically 2 years of business tax returns, current P&L and balance sheet, business bank statements, and personal tax returns for owners with 20%+ ownership." },
      { q: "Do you offer loans to startups?", a: "Yes, with certain conditions. Strong personal credit, collateral, and a solid business plan can qualify a startup for SBA or conventional financing." },
      { q: "How long does the approval process take?", a: "Conventional business loans typically take 5–10 business days. SBA loans take 2–6 weeks depending on the program and loan size." },
      { q: "Can I pay off the loan early without penalties?", a: "Conventional loans have no prepayment penalties. Some SBA loans include prepayment provisions in the first 3 years — your banker will walk you through the terms." },
    ],
    cta: "Apply for a Business Loan",
  },

  "merchant-services": {
    title: "Merchant Services",
    subtitle: "Accept every payment, anywhere — in store, online, or on the go.",
    hero: "linear-gradient(145deg,#1a1a0d,#3d3d00)",
    label: "Business Banking",
    ctaHref: "/about/contact",
    stats: [{ v: "Next-day", l: "Funding" }, { v: "All major", l: "Cards accepted" }, { v: "24/7", l: "Merchant support" }],
    overview: "Getting paid should be the easy part of running a business. SGGINV Merchant Services gives you everything you need to accept credit, debit, and contactless payments — with next-day funding directly to your SGGINV business account and around-the-clock support.",
    features: [
      { title: "Accept All Payment Types", desc: "Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, Samsung Pay, and tap-to-pay cards.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
      { title: "Next-Day Funding", desc: "Sales processed before 10 PM are funded to your SGGINV business account by the next business morning.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Point-of-Sale Systems", desc: "From countertop terminals to full iPad POS systems — we match the hardware to your business type.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "Mobile Card Readers", desc: "Accept payments on your phone or tablet with a Bluetooth card reader — perfect for markets, pop-ups, and delivery.", icon: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
      { title: "Online Payment Gateway", desc: "Integrate secure payment processing into your e-commerce website or booking platform.", icon: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" },
      { title: "Detailed Reporting", desc: "Access real-time sales reports, transaction history, and reconciliation tools in your merchant dashboard.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
    ],
    accounts: [
      { name: "Standard Merchant Account", fee: "Interchange + small %", min: "Any business type", txn: "Countertop terminal", extras: "Next-day funding", highlight: false, startHref: "/about/contact" },
      { name: "Premium Merchant Account", fee: "Custom pricing", min: "High-volume businesses", txn: "Full POS suite", extras: "+ gateway, reporting", highlight: true, startHref: "/about/contact" },
    ],
    note: "Rates vary based on business type, volume, and card mix. A merchant services advisor will provide a free rate analysis and comparison.",
    steps: [
      { n: "1", t: "Request a Free Rate Analysis", d: "Share your current processing statements and we'll show you exactly what you'd save by switching to SGGINV." },
      { n: "2", t: "Choose Your Equipment", d: "We help you select the right terminals, POS systems, or mobile readers for your business environment." },
      { n: "3", t: "Start Accepting Payments", d: "Setup and training are included. You're fully operational within 3–5 business days." },
    ],
    faqs: [
      { q: "Do I need an SGGINV business account to use merchant services?", a: "It's strongly recommended — next-day funding works fastest when deposits go directly to your SGGINV business checking account." },
      { q: "What if I need help after hours?", a: "Our 24/7 merchant support line is always available for terminal issues, charge disputes, or urgent processing questions." },
      { q: "Can I accept tips and split payments?", a: "Yes — our POS systems support tipping, split payments, and itemized receipts out of the box." },
      { q: "What if a customer disputes a charge?", a: "We guide you through the chargeback process and help you respond with the documentation needed to protect your revenue." },
    ],
    cta: "Set Up Merchant Services",
  },

  "credit-cards": {
    title: "Business Credit Cards",
    subtitle: "Manage expenses, earn rewards, and build business credit — all in one card.",
    hero: "linear-gradient(145deg,#2e1a00,#5a3600)",
    label: "Business Banking",
    ctaHref: "/about/contact",
    stats: [{ v: "Up to 2%", l: "Cashback on all purchases" }, { v: "$0", l: "Annual fee" }, { v: "Free", l: "Employee cards" }],
    overview: "Your business spending should work for you. SGGINV Business Credit Cards earn cashback on every purchase, give you tools to manage employee spending, and integrate with your accounting software to simplify reconciliation at month's end.",
    features: [
      { title: "Up to 2% Cashback Everywhere", desc: "Earn 2% on all business purchases — office supplies, travel, utilities, vendors, advertising, and more.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
      { title: "Free Employee Cards", desc: "Issue cards to employees with individual spending limits. Monitor usage in real time from your dashboard.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" },
      { title: "Expense Reporting", desc: "Automatically categorize transactions and export reports directly to QuickBooks, Xero, or CSV.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
      { title: "No Foreign Transaction Fees", desc: "Do business globally without per-transaction surcharges on international purchases or vendor payments.", icon: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9" },
      { title: "Flexible Credit Limits", desc: "Starting credit limits that grow with your business as you demonstrate responsible use over time.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Fraud Liability Protection", desc: "Zero liability on unauthorized business purchases. Real-time fraud alerts keep you informed.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
    ],
    accounts: [
      { name: "Business Cash Card", fee: "$0/year", min: "Good credit", txn: "1.5% all purchases", extras: "Free employee cards", highlight: false, startHref: "/about/contact" },
      { name: "Business Rewards Card", fee: "$0/year", min: "Good–Excellent credit", txn: "2% all purchases", extras: "+ travel rewards, no FX", highlight: true, startHref: "/about/contact" },
    ],
    note: "APR is based on business and personal creditworthiness. See cardholder agreement for complete terms.",
    steps: [
      { n: "1", t: "Apply Online or In Branch", d: "We review your business and personal credit. Decision typically within 1 business day." },
      { n: "2", t: "Set Up Employee Cards", d: "Add employees, set individual limits, and configure real-time spend notifications." },
      { n: "3", t: "Earn and Manage", d: "Cashback is credited monthly. Connect to your accounting software for automatic reconciliation." },
    ],
    faqs: [
      { q: "Will applying for a business card affect my personal credit?", a: "A personal guarantee is required for most small business credit cards. A hard pull on your personal credit is part of the application process." },
      { q: "Can I increase my credit limit over time?", a: "Yes — after 6 months of responsible use, you can request a credit limit increase by contacting your business banker." },
      { q: "How does cashback redemption work?", a: "Cashback is automatically applied as a statement credit each month — no points portals or minimum redemption thresholds." },
      { q: "What if an employee makes an unauthorized purchase?", a: "You have zero liability for unauthorized transactions. You can also freeze or cancel employee cards instantly in the dashboard." },
    ],
    cta: "Apply for a Business Card",
  },
};

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 18 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={icon} /></svg>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) notFound();

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: page.hero, padding: "88px 32px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>{page.label}</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>{page.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 44px" }}>{page.subtitle}</p>
          <Link href={(page as { ctaHref: string }).ctaHref} style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, boxShadow: "0 6px 24px rgba(212,175,55,.4)", marginBottom: 56, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 32, paddingBottom: 40, flexWrap: "wrap" }}>
            {page.stats.map((s, i) => (
              <div key={i} style={{ flex: "1 1 140px", paddingRight: 40, borderRight: i < page.stats.length - 1 ? "1px solid rgba(255,255,255,.12)" : "none", marginRight: i < page.stats.length - 1 ? 40 : 0, marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Overview</div>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px", color: DARK }}>{page.title}</h2>
              <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.75, margin: 0 }}>{page.overview}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {page.steps.map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 16, padding: "16px 18px", background: "rgba(140,29,37,.04)", borderRadius: 14, alignItems: "flex-start" }}>
                  <div style={{ flex: "none", width: 36, height: 36, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 16 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4 }}>{s.t}</div>
                    <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.55 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>Built for how business works</h2>
          </div>
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {page.features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </div>

      {/* Account options */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Account Options</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 36px", color: DARK }}>Choose your account tier</h2>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {page.accounts.map((a, i) => (
              <div key={i} style={{ border: `2px solid ${a.highlight ? RED : "rgba(17,24,39,.08)"}`, borderRadius: 20, padding: "32px 30px", position: "relative", background: a.highlight ? "rgba(140,29,37,.02)" : "#fff" }}>
                {a.highlight && <div style={{ position: "absolute", top: -13, left: 28, background: RED, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>Recommended</div>}
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 24 }}>{a.name}</div>
                {[["Monthly Fee", a.fee], ["Minimum / Eligibility", a.min], ["Key Feature", a.txn], ["Extras", a.extras]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(17,24,39,.06)", fontSize: 14.5 }}>
                    <span style={{ color: GRAY }}>{k}</span><span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                  </div>
                ))}
                <Link href={(a as { startHref: string }).startHref} style={{ marginTop: 24, width: "100%", display: "block", textAlign: "center", boxSizing: "border-box", background: a.highlight ? RED : "transparent", color: a.highlight ? "#fff" : RED, border: `1.5px solid ${a.highlight ? RED : "rgba(140,29,37,.3)"}`, fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "13px", borderRadius: 12, textDecoration: "none" }}>Get Started</Link>
              </div>
            ))}
          </div>
          {page.note && <p style={{ marginTop: 16, fontSize: 12.5, color: "#9CA3AF" }}>{page.note}</p>}
        </div>
      </div>

      {/* FAQ */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: 0, color: DARK }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {page.faqs.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 10 }}>{f.q}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mob-section" style={{ background: page.hero, padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: 40, color: "#fff", margin: "0 0 16px", letterSpacing: "-.02em" }}>Ready to get started?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Speak with a local SGGINV business banking advisor — no obligation, no pressure.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={(page as { ctaHref: string }).ctaHref} style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
            <Link href="/about/contact" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>Schedule a call</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
