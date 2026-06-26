import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ─── Shared style tokens ───────────────────────────────────────────────── */
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

/* ─── Page data ─────────────────────────────────────────────────────────── */
const PAGES = {
  checking: {
    title: "Checking Accounts",
    subtitle: "No-fee everyday banking with early direct deposit and 55,000+ surcharge-free ATMs.",
    stats: [{ v: "$0", l: "Monthly fees" }, { v: "55K+", l: "Fee-free ATMs" }, { v: "2 Days", l: "Early direct deposit" }],
    overview: "Our personal checking accounts are built for real life — no minimum balance, no hidden charges, and tools that actually help you stay on top of your money. Whether you're depositing a paycheck, sending money to a friend, or checking your balance at midnight, FSCB is right there with you.",
    features: [
      { title: "No Monthly Fees", desc: "Keep every dollar you earn. No maintenance fees, no minimum balance requirements — ever.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
      { title: "Early Direct Deposit", desc: "Get your paycheck up to 2 days before payday when you set up direct deposit.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
      { title: "55,000+ ATMs Nationwide", desc: "Access your cash anywhere through the Allpoint® network — surcharge-free, coast to coast.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
      { title: "Instant Card Controls", desc: "Lock and unlock your debit card instantly from the mobile app if it's ever lost or misplaced.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
      { title: "Zelle® Money Transfers", desc: "Send and receive money in seconds with Zelle® — directly from your FSCB account.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
      { title: "Overdraft Protection", desc: "Optional overdraft protection links your savings account so you're covered when it matters.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ],
    accounts: [
      { name: "FSCB Free Checking", monthly: "$0", min: "None", atm: "55,000+ free", dd: "Yes (+2 days)", zelle: "Yes", highlight: false, startHref: "/open-account?account=free-checking" },
      { name: "FSCB Premium Checking", monthly: "$0*", min: "$500 avg daily", atm: "55,000+ free + rebates", dd: "Yes (+2 days)", zelle: "Yes", highlight: true, startHref: "/open-account?account=premium-checking" },
    ],
    accountNote: "* Monthly fee waived with $500 average daily balance or $1,500 in monthly direct deposits.",
    steps: [
      { n: "1", t: "Apply Online", d: "Complete your application in under 5 minutes. Just your ID and Social Security number." },
      { n: "2", t: "Fund Your Account", d: "Transfer money from another bank or deposit a check through the mobile app." },
      { n: "3", t: "Start Banking", d: "Your debit card arrives in 5–7 days. Digital access is instant." },
    ],
    faqs: [
      { q: "Is there a minimum opening deposit?", a: "No — you can open a Free Checking account with any amount. Premium Checking requires $25 to open." },
      { q: "How does early direct deposit work?", a: "When your employer sends your paycheck electronically, we release the funds up to 2 business days before your actual payday." },
      { q: "What if I overdraw my account?", a: "With optional overdraft protection, we transfer funds from your linked savings account automatically. Without it, transactions over your balance are declined to prevent fees." },
      { q: "Can I open an account if I've had banking issues before?", a: "We review each application individually. Contact a local banker — we work with you, not against you." },
    ],
    cta: "Open a Checking Account",
    ctaHref: "/open-account",
  },

  savings: {
    title: "Savings Accounts",
    subtitle: "High-yield savings with automatic goal tracking and round-up tools that build real wealth.",
    stats: [{ v: "High", l: "Competitive APY" }, { v: "$0", l: "Monthly fees" }, { v: "$250K", l: "FDIC insured" }],
    overview: "A great savings account does more than hold your money — it grows it. FSCB savings accounts come with goal-tracking tools, automatic round-ups on every debit card purchase, and competitive yields that put your money to work every single day.",
    features: [
      { title: "Competitive High-Yield APY", desc: "Earn more than the national average with rates that are reviewed regularly to stay competitive.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Automatic Round-Ups", desc: "Every debit card purchase rounds up to the nearest dollar and sweeps the difference into savings.", icon: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" },
      { title: "Savings Goals", desc: "Set goals for anything — a car, vacation, emergency fund — and track your progress in real time.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
      { title: "No Minimum Balance", desc: "Start saving with whatever you have. There's no minimum balance requirement to earn your full APY.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "FDIC Insured to $250,000", desc: "Your deposits are fully insured by the FDIC up to $250,000 per depositor, per category.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
      { title: "Instant Transfers", desc: "Move money between your FSCB checking and savings accounts instantly, any time of day.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
    ],
    accounts: [
      { name: "Regular Savings", monthly: "$0", min: "None", apy: "Competitive", transfers: "6/month", highlight: false, startHref: "/open-account?account=regular-savings" },
      { name: "Money Market", monthly: "$0*", min: "$2,500", apy: "Higher yield", transfers: "Unlimited", highlight: true, startHref: "/open-account?account=money-market" },
    ],
    accountNote: "* Money Market fee waived with $2,500 minimum balance.",
    steps: [
      { n: "1", t: "Choose Your Account", d: "Pick Regular Savings for flexibility or Money Market for higher yields on larger balances." },
      { n: "2", t: "Set Your Goals", d: "Use the app to create and name savings goals — emergency fund, vacation, down payment." },
      { n: "3", t: "Automate and Grow", d: "Set up automatic transfers and round-ups and watch your savings grow on autopilot." },
    ],
    faqs: [
      { q: "How often is interest calculated?", a: "Interest is compounded daily and credited to your account monthly." },
      { q: "Is there a limit on how many times I can withdraw?", a: "Federal Regulation D limits savings withdrawals to 6 per month. Money Market accounts offer more flexibility." },
      { q: "Can I have multiple savings accounts?", a: "Yes — you can open multiple accounts and dedicate each one to a specific goal." },
      { q: "Are my savings FDIC insured?", a: "Yes. All FSCB deposits are FDIC insured up to $250,000 per depositor per ownership category." },
    ],
    cta: "Open a Savings Account",
    ctaHref: "/open-account",
  },

  "credit-cards": {
    title: "Credit Cards",
    subtitle: "Earn rewards and cashback on every purchase with cards built for community members.",
    stats: [{ v: "Up to 3%", l: "Cashback" }, { v: "$0", l: "Annual fee" }, { v: "0% APR", l: "12-month intro" }],
    overview: "FSCB credit cards are designed to reward the way you actually spend — groceries, gas, dining, and everyday purchases. With no annual fees, competitive rates, and rewards that never expire, our cards are a smart choice for every wallet.",
    features: [
      { title: "Up to 3% Cashback", desc: "Earn 3% on groceries and gas, 2% on dining, and 1% on all other purchases — automatically.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
      { title: "No Annual Fee", desc: "Our Community Rewards Card comes with zero annual fee. Keep the rewards, ditch the cost.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "0% Intro APR — 12 Months", desc: "Pay no interest on purchases for the first 12 months. Great for large purchases or balance transfers.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "Free Credit Score Monitoring", desc: "Check your credit score for free anytime in the mobile app — no impact to your credit.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Fraud Protection", desc: "24/7 fraud monitoring with real-time alerts. Zero liability on unauthorized purchases.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
      { title: "Contactless & Digital Wallet", desc: "Tap to pay with your physical card or add to Apple Pay, Google Pay, or Samsung Pay.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
    ],
    accounts: [
      { name: "Community Card", monthly: "$0/yr", min: "Good credit", apy: "1% on all purchases", transfers: "No foreign txn fee", highlight: false, startHref: "/open-account?account=community-card" },
      { name: "Rewards Card", monthly: "$0/yr", min: "Good–Excellent", apy: "Up to 3% cashback", transfers: "No foreign txn fee", highlight: true, startHref: "/open-account?account=rewards-card" },
    ],
    accountNote: "APR varies based on creditworthiness. See card agreement for full details.",
    steps: [
      { n: "1", t: "Apply in Minutes", d: "Complete your application online or in-branch. Get a decision in seconds in most cases." },
      { n: "2", t: "Receive Your Card", d: "Your card arrives in 7–10 business days. Activate instantly and start earning rewards." },
      { n: "3", t: "Earn and Redeem", d: "Cashback is credited to your statement automatically each month. No redemption hoops." },
    ],
    faqs: [
      { q: "Do my rewards expire?", a: "No — your cashback rewards never expire as long as your account is open and in good standing." },
      { q: "Can I use my card internationally?", a: "Yes. Both cards carry no foreign transaction fees, so you're free to spend abroad without surcharges." },
      { q: "How do I report a lost or stolen card?", a: "Lock your card instantly in the FSCB mobile app, then call our 24/7 card services line to request a replacement." },
      { q: "How long does a balance transfer take?", a: "Balance transfers typically post within 5–7 business days after your application is approved." },
    ],
    cta: "Apply for a Credit Card",
    ctaHref: "/open-account",
  },

  loans: {
    title: "Personal Loans",
    subtitle: "Fast local decisions, transparent rates, and no hidden fees for any purpose.",
    stats: [{ v: "$1K–$50K", l: "Loan amounts" }, { v: "1 Day", l: "Decision time" }, { v: "$0", l: "Origination fee" }],
    overview: "Life doesn't always wait for the perfect moment — and neither should your financing. FSCB personal loans give you access to the funds you need quickly, with fixed monthly payments, no prepayment penalties, and a local team that actually reviews your application.",
    features: [
      { title: "Fixed Rates, No Surprises", desc: "Your interest rate and monthly payment stay the same from day one to your last payment.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "No Origination Fees", desc: "We don't charge origination fees or prepayment penalties. What we quote is what you pay.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Borrow $1,000–$50,000", desc: "Whether it's a small expense or a major purchase, we have the right loan size for you.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Terms from 12 to 84 Months", desc: "Choose a repayment timeline that fits your budget, from 1 to 7 years.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
      { title: "Same-Day Funding Available", desc: "Approved by noon? Funds could hit your FSCB account the same business day.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Local Underwriting", desc: "Your application is reviewed by a real person here in the community — not an algorithm.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" },
    ],
    accounts: [
      { name: "Standard Personal Loan", monthly: "Fixed rate", min: "$1,000–$25,000", apy: "12–60 months", transfers: "Good credit", highlight: false, startHref: "/about/contact" },
      { name: "Premier Personal Loan", monthly: "Lower fixed rate", min: "$5,000–$50,000", apy: "12–84 months", transfers: "Excellent credit", highlight: true, startHref: "/about/contact" },
    ],
    accountNote: "Rates are based on creditworthiness and loan term. Contact a banker for your personalized rate.",
    steps: [
      { n: "1", t: "Apply Online or In Person", d: "Tell us the amount you need and what it's for. The form takes under 10 minutes." },
      { n: "2", t: "Get a Decision", d: "A local underwriter reviews your application — most decisions come within 1 business day." },
      { n: "3", t: "Receive Your Funds", d: "Once approved and signed, funds are deposited directly to your FSCB account." },
    ],
    faqs: [
      { q: "What can I use a personal loan for?", a: "Almost anything — debt consolidation, home improvements, medical bills, major appliances, weddings, and more." },
      { q: "Will applying hurt my credit score?", a: "We do a soft pull to pre-qualify, which doesn't affect your score. A hard pull is only done if you proceed with the full application." },
      { q: "Can I pay off my loan early?", a: "Yes — there are no prepayment penalties. Pay it off whenever you like and save on interest." },
      { q: "What if I miss a payment?", a: "Contact us right away. We work with customers experiencing hardship and can often find a solution before fees apply." },
    ],
    cta: "Apply for a Personal Loan",
    ctaHref: "/about/contact",
  },

  "online-banking": {
    title: "Online & Mobile Banking",
    subtitle: "Bank securely from anywhere — your full FSCB account in your pocket, 24/7.",
    stats: [{ v: "24/7", l: "Account access" }, { v: "256-bit", l: "Encryption" }, { v: "Free", l: "Forever" }],
    overview: "Managing your finances should be as easy as checking the weather. FSCB Online and Mobile Banking gives you full control of your accounts from any device — check balances, pay bills, deposit checks, transfer money, and more — with bank-grade security protecting every action.",
    features: [
      { title: "Mobile Check Deposit", desc: "Deposit checks by taking a photo with your phone. No branch visit needed, funds available quickly.", icon: "M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" },
      { title: "Bill Pay", desc: "Pay any bill — utilities, loans, vendors — directly from your FSCB account on any schedule you choose.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
      { title: "Instant Transfers", desc: "Move money between your FSCB accounts or send to other banks via ACH — fast and free.", icon: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" },
      { title: "Real-Time Alerts", desc: "Get push notifications for every transaction, low balance warning, or suspicious activity.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 0 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" },
      { title: "Spending Insights", desc: "Automatically categorize your spending, set budgets, and see trends across all your accounts.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Bank-Grade Security", desc: "256-bit encryption, multi-factor authentication, biometric login, and real-time fraud detection.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
    ],
    accounts: [
      { name: "Online Banking", monthly: "Free", min: "Any FSCB account", apy: "Web & mobile", transfers: "Unlimited", highlight: false, startHref: "/login" },
      { name: "Mobile App (iOS & Android)", monthly: "Free", min: "Any FSCB account", apy: "Full-featured", transfers: "Biometric login", highlight: true, startHref: "/login" },
    ],
    accountNote: "Online and mobile banking are free for all FSCB personal and business account holders.",
    steps: [
      { n: "1", t: "Enroll Online", d: "Register at fscb.com with your account number and Social Security number. Takes 2 minutes." },
      { n: "2", t: "Download the App", d: "Get the FSCB app on the App Store or Google Play. Log in with your new credentials." },
      { n: "3", t: "Set Up Your Preferences", d: "Enable biometric login, configure alerts, set up bill pay, and you're ready to go." },
    ],
    faqs: [
      { q: "Is online banking secure?", a: "Yes. We use 256-bit SSL encryption, multi-factor authentication, and continuous fraud monitoring to protect your account." },
      { q: "What if I forget my password?", a: "Use the 'Forgot Password' link to reset via your email or phone number on file — no branch visit needed." },
      { q: "Can I deposit a check with my phone?", a: "Yes — mobile check deposit is available in the FSCB app. Funds are typically available by the next business day." },
      { q: "Is there a fee for online bill pay?", a: "No — bill pay is completely free for all personal account holders." },
    ],
    cta: "Enroll in Online Banking",
    ctaHref: "/login",
  },
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 18 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d={icon} />
        </svg>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: "none", width: 44, height: 44, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 18 }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 6 }}>{t}</div>
        <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{d}</div>
      </div>
    </div>
  );
}

/* ─── Page component ─────────────────────────────────────────────────────── */

export default async function PersonalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) notFound();

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: "linear-gradient(145deg,#2C0A10,#8C1D25)", padding: "88px 32px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>Personal Banking</div>
          <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>{page.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 44px" }}>{page.subtitle}</p>
          <Link href={page.ctaHref} style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer", boxShadow: "0 6px 24px rgba(212,175,55,.4)", marginBottom: 56, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>

          {/* Stat bar */}
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
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Overview</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px", color: DARK }}>{page.title}</h2>
            <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.75, margin: 0 }}>{page.overview}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", t: "FDIC Insured to $250,000", d: "Your deposits are federally insured for complete peace of mind." },
              { icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z", t: "Bank-Grade Security", d: "256-bit encryption and multi-factor authentication on every login." },
              { icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0", t: "Local Human Support", d: "Real bankers available by phone, in-branch, or online chat." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "18px 20px", background: "rgba(140,29,37,.04)", borderRadius: 14 }}>
                <div style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "rgba(140,29,37,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: RED }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14.5, color: DARK, marginBottom: 3 }}>{item.t}</div>
                  <div style={{ fontSize: 13.5, color: GRAY }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 14px", color: DARK }}>Everything you need, nothing you don&apos;t</h2>
          </div>
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {page.features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </div>

      {/* Account comparison */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Account Options</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 36px", color: DARK }}>Choose the right account for you</h2>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {page.accounts.map((a, i) => (
              <div key={i} style={{ border: `2px solid ${a.highlight ? RED : "rgba(17,24,39,.08)"}`, borderRadius: 20, padding: "32px 30px", position: "relative", background: a.highlight ? "rgba(140,29,37,.02)" : "#fff" }}>
                {a.highlight && <div style={{ position: "absolute", top: -13, left: 28, background: RED, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>Most Popular</div>}
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 24 }}>{a.name}</div>
                {Object.entries({ "Monthly Fee": a.monthly, "Minimum": a.min, "Yield / Rate": (a as unknown as Record<string,string>).apy, "Included": (a as unknown as Record<string,string>).transfers }).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(17,24,39,.06)", fontSize: 14.5 }}>
                    <span style={{ color: GRAY }}>{k}</span>
                    <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                  </div>
                ))}
                <Link href={a.startHref} style={{ marginTop: 24, display: "block", textAlign: "center", width: "100%", background: a.highlight ? RED : "transparent", color: a.highlight ? "#fff" : RED, border: `1.5px solid ${a.highlight ? RED : "rgba(140,29,37,.3)"}`, fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "13px", borderRadius: 12, cursor: "pointer", textDecoration: "none", boxSizing: "border-box" }}>Get Started</Link>
              </div>
            ))}
          </div>
          {page.accountNote && <p style={{ marginTop: 16, fontSize: 12.5, color: "#9CA3AF" }}>{page.accountNote}</p>}
        </div>
      </div>

      {/* How it works */}
      <div className="mob-section" style={{ background: "rgba(140,29,37,.03)", padding: "72px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: "-.02em", margin: "0 0 40px", color: DARK }}>Get started in 3 simple steps</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {page.steps.map((s) => <Step key={s.n} {...s} />)}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 20px 60px -20px rgba(140,29,37,.15)" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 8 }}>Ready to open your account?</div>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, marginBottom: 28 }}>Join 17,000+ community members who trust FSCB for their everyday banking needs.</p>
            <Link href={page.ctaHref} style={{ display: "block", textAlign: "center", width: "100%", background: RED, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: 16, borderRadius: 12, cursor: "pointer", marginBottom: 12, textDecoration: "none", boxSizing: "border-box" }}>{page.cta}</Link>
            <Link href="/about/contact" style={{ display: "block", textAlign: "center", width: "100%", background: "none", color: GRAY, border: "1.5px solid rgba(17,24,39,.14)", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, padding: 14, borderRadius: 12, cursor: "pointer", textDecoration: "none", boxSizing: "border-box" }}>Talk to a banker</Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: 0, color: DARK }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {page.faqs.map((f, i) => (
              <div key={i} style={{ border: "1px solid rgba(17,24,39,.08)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 10 }}>{f.q}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "linear-gradient(145deg,#2C0A10,#8C1D25)", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", margin: "0 0 16px", letterSpacing: "-.02em" }}>Start banking smarter today</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Open your account online in minutes or visit any FSCB branch to speak with a local banker.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={page.ctaHref} style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
            <Link href="/about/contact" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>Find a branch</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
