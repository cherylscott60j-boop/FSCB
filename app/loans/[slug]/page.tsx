import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { notFound } from "next/navigation";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

const PAGES = {
  personal: {
    title: "Personal Loans",
    subtitle: "Flexible financing for any purpose — fast local decisions with no hidden fees.",
    hero: "linear-gradient(145deg,#0d1f3c,#1a3a6b)",
    stats: [{ v: "$1K–$50K", l: "Loan range" }, { v: "As low as 7.99%", l: "Starting APR*" }, { v: "Same day", l: "Funding available" }],
    overview: "Whether you're consolidating high-interest debt, funding a home renovation, or covering an unexpected expense, SGGINV personal loans give you a fixed rate, predictable payment, and a local team who reviews your application personally — not an algorithm.",
    uses: ["Debt consolidation", "Home improvements", "Medical expenses", "Major appliances", "Wedding costs", "Vacation financing", "Moving expenses", "Emergency expenses"],
    features: [
      { title: "Fixed Monthly Payments", desc: "Your rate and payment are locked from day one — no variable rate surprises ever.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "No Origination Fees", desc: "We don't charge application fees, origination fees, or prepayment penalties.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "12–84 Month Terms", desc: "Choose your repayment period to fit your budget — from 1 to 7 years.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
      { title: "Same-Day Funding", desc: "Approve by noon and funds are often deposited to your SGGINV account the same business day.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Soft Pull Pre-Qualification", desc: "Check your rate with no impact to your credit score before you formally apply.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "Local Underwriting", desc: "Every application is reviewed by an SGGINV banker who understands our community's needs.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
    ],
    rates: [
      { term: "12–24 months", range: "7.99% – 14.99%", amount: "$1,000–$15,000", best: "Short-term needs" },
      { term: "36–60 months", range: "9.49% – 18.99%", amount: "$5,000–$35,000", best: "Debt consolidation" },
      { term: "61–84 months", range: "11.99% – 21.99%", amount: "$15,000–$50,000", best: "Large projects" },
    ],
    steps: [
      { n: "1", t: "Pre-Qualify Online", d: "Enter the loan amount and purpose. We do a soft credit pull — zero impact to your score." },
      { n: "2", t: "Submit Your Application", d: "Provide income verification and ID. The full application takes under 15 minutes." },
      { n: "3", t: "Receive Your Funds", d: "Once approved and e-signed, funds hit your account same day or next business morning." },
    ],
    faqs: [
      { q: "What credit score do I need to qualify?", a: "We look at the full picture, not just your score. Most personal loans require a score of 620+, but we have options for a range of credit profiles." },
      { q: "Can I pay off my loan early?", a: "Yes — there are absolutely no prepayment penalties. Pay it off anytime and save on interest." },
      { q: "How is my rate determined?", a: "Rates are based on your credit history, income, loan amount, and term. Better credit and shorter terms typically mean lower rates." },
      { q: "Can I use the loan for anything?", a: "Almost. Personal loans cannot be used for education (see student loan refinancing) or business purposes (see business loans). Most other uses are fine." },
    ],
    cta: "Apply for a Personal Loan",
  },

  mortgage: {
    title: "Home Mortgages",
    subtitle: "Buy or refinance your home with local expertise and competitive rates.",
    hero: "linear-gradient(145deg,#0f1e0f,#1e3d20)",
    stats: [{ v: "15 & 30 yr", l: "Fixed rate options" }, { v: "FHA / VA / USDA", l: "Government programs" }, { v: "Local", l: "Fast closings" }],
    overview: "Buying a home is the biggest financial decision most people ever make. At SGGINV, your mortgage application is reviewed by local underwriters who know your market, not a national call center. From first-time buyer programs to jumbo loans, we have the right mortgage for every buyer.",
    uses: ["First home purchase", "Move-up purchase", "Investment property", "Rate and term refinance", "Cash-out refinance", "Construction-to-perm", "Vacation home", "Jumbo purchase"],
    features: [
      { title: "Conventional Loans", desc: "30, 20, and 15-year fixed-rate options with competitive rates for buyers with strong credit.", icon: "M3 21h18M5 21V9l7-6 7 6v12" },
      { title: "FHA Loans", desc: "Low down payment options (3.5%) for first-time buyers or those with less-than-perfect credit.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "VA Loans", desc: "No down payment mortgages for eligible veterans and active-duty service members.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
      { title: "USDA Rural Loans", desc: "100% financing for eligible rural and suburban homebuyers through the USDA program.", icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945" },
      { title: "Jumbo Loans", desc: "Financing above conforming loan limits for higher-value properties with personalized terms.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Construction Loans", desc: "Fund your build from the ground up with draw-based construction-to-permanent financing.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3" },
    ],
    rates: [
      { term: "30-Year Fixed", range: "Contact for today's rate", amount: "Up to conforming limit", best: "Lower monthly payment" },
      { term: "15-Year Fixed", range: "Contact for today's rate", amount: "Up to conforming limit", best: "Build equity faster" },
      { term: "5/1 ARM", range: "Contact for today's rate", amount: "Up to conforming limit", best: "Short-term ownership" },
    ],
    steps: [
      { n: "1", t: "Get Pre-Approved", d: "A pre-approval letter tells you exactly how much home you can afford and shows sellers you're serious." },
      { n: "2", t: "Find Your Home", d: "Shop with confidence knowing your financing is ready. Your SGGINV mortgage advisor is available throughout." },
      { n: "3", t: "Close with Confidence", d: "Local processing and underwriting means fewer delays. We target closings in 21–30 days." },
    ],
    faqs: [
      { q: "How much down payment do I need?", a: "It depends on the loan type. Conventional loans start at 3% down, FHA at 3.5%, VA and USDA offer 0% down for eligible buyers." },
      { q: "What's the difference between pre-qualification and pre-approval?", a: "Pre-qualification is an estimate based on self-reported info. Pre-approval is a verified commitment from SGGINV based on your actual financial documents." },
      { q: "How long does the mortgage process take?", a: "From complete application to closing, SGGINV targets 21–30 days for most purchase loans. Refinances may be faster." },
      { q: "Can I lock my interest rate?", a: "Yes — once your application is approved, you can lock your rate for 30, 45, or 60 days while you finalize your purchase." },
    ],
    cta: "Start Your Mortgage Application",
  },

  auto: {
    title: "Auto Loans",
    subtitle: "Drive away with great rates on new, used, or refinanced vehicle loans.",
    hero: "linear-gradient(145deg,#1a0d00,#3d2000)",
    stats: [{ v: "Up to 84 mo", l: "Loan terms" }, { v: "Pre-approval", l: "Available before you shop" }, { v: "Same day", l: "Decisions" }],
    overview: "Shop for your next car with confidence. SGGINV auto loans offer competitive rates on new and used vehicles, fast decisions, and the option to get pre-approved before you set foot on the lot. No dealer financing pressure — just straightforward local lending.",
    uses: ["New car purchase", "Used car purchase", "Private-party purchase", "Refinance existing loan", "Motorcycle or RV", "Boat financing", "Classic car purchase", "Commercial vehicle"],
    features: [
      { title: "New Vehicle Financing", desc: "Competitive rates on new vehicles from any dealership. Bring your SGGINV check and negotiate as a cash buyer.", icon: "M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h11l4 4v4a2 2 0 0 1-2 2h-1" },
      { title: "Used Vehicle Financing", desc: "Finance used vehicles up to 10 years old from dealerships or private sellers.", icon: "M9 17H7m10 0h-4M3 11l2-4 16.5.5-2 3.5" },
      { title: "Refinancing", desc: "Lower your existing auto payment by refinancing with SGGINV — often with no fees and quick processing.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9" },
      { title: "Pre-Approval in Minutes", desc: "Know your rate and budget before you shop. Pre-approval letters are accepted at all dealerships.", icon: "M9 12l2 2 4-4" },
      { title: "Terms Up to 84 Months", desc: "Choose the repayment term that fits your monthly budget — from 24 to 84 months.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
      { title: "No Prepayment Penalties", desc: "Pay extra or pay it off early whenever you want — with absolutely no penalty.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
    ],
    rates: [
      { term: "New Vehicle (up to 36 mo)", range: "From 5.49% APR*", amount: "Any amount", best: "Lowest total cost" },
      { term: "New Vehicle (37–84 mo)", range: "From 6.49% APR*", amount: "Any amount", best: "Lower monthly payment" },
      { term: "Used Vehicle (up to 60 mo)", range: "From 6.99% APR*", amount: "Vehicle up to 10 yrs", best: "Great value purchase" },
    ],
    steps: [
      { n: "1", t: "Get Pre-Approved", d: "Apply in 5 minutes online or in-branch. Receive your pre-approval letter the same day." },
      { n: "2", t: "Shop Your Vehicle", d: "Visit any dealership or private seller. Present your pre-approval and negotiate from strength." },
      { n: "3", t: "Finalize and Drive", d: "Bring the signed purchase agreement to SGGINV. We fund the dealer directly and you drive home." },
    ],
    faqs: [
      { q: "Can I finance a private-party purchase?", a: "Yes — SGGINV funds private-party vehicle purchases. We'll need the title and a bill of sale from the seller." },
      { q: "Is there a minimum loan amount?", a: "We typically finance vehicles of $5,000 or more. Contact a banker for purchases below that amount." },
      { q: "Can I include tax, title, and registration in my loan?", a: "Yes — in most cases, we can roll in tax, title, and registration fees so you owe nothing out of pocket at purchase." },
      { q: "Does my vehicle serve as collateral?", a: "Yes — auto loans are secured by the vehicle. SGGINV holds the title until the loan is paid in full." },
    ],
    cta: "Apply for an Auto Loan",
  },

  "home-equity": {
    title: "Home Equity Loans & HELOCs",
    subtitle: "Put your home's built-up value to work for you — on your terms.",
    hero: "linear-gradient(145deg,#1c1200,#3d2c00)",
    stats: [{ v: "Up to 85%", l: "LTV available" }, { v: "HELOC or fixed", l: "Two options" }, { v: "Local", l: "Appraisals & decisions" }],
    overview: "Your home may be your biggest asset — and SGGINV can help you access its equity for renovations, debt consolidation, education, or any major expense. Choose between a fixed-rate Home Equity Loan (lump sum) or a flexible Home Equity Line of Credit (HELOC).",
    uses: ["Home renovations", "Debt consolidation", "College tuition", "Major medical expenses", "Emergency fund", "Investment opportunity", "Business startup costs", "Dream vacation"],
    features: [
      { title: "Borrow Up to 85% LTV", desc: "Access up to 85% of your home's appraised value minus your existing mortgage balance.", icon: "M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" },
      { title: "Fixed-Rate Home Equity Loan", desc: "Receive a lump sum with a fixed interest rate and predictable monthly payment for the life of the loan.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "HELOC — Draw as You Need", desc: "A revolving credit line you draw from when needed. Pay interest only on what you use during the draw period.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9" },
      { title: "Potential Tax Deduction", desc: "Interest on home equity loans used for home improvements may be tax-deductible. Consult your tax advisor.", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01" },
      { title: "No Closing Costs on Select Loans", desc: "Qualifying home equity loans include a no-closing-cost option — saving you thousands upfront.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Local Appraisal Team", desc: "SGGINV uses trusted local appraisers for faster turnaround and fair market value assessments.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
    ],
    rates: [
      { term: "HELOC (variable rate)", range: "Prime + margin", amount: "$10K–$500K", best: "Ongoing projects" },
      { term: "Home Equity Loan (10 yr)", range: "Fixed — contact us", amount: "$10K–$500K", best: "One-time lump sum" },
      { term: "Home Equity Loan (20 yr)", range: "Fixed — contact us", amount: "$25K–$500K", best: "Lower monthly payment" },
    ],
    steps: [
      { n: "1", t: "Apply and Estimate Your Equity", d: "We'll calculate your available equity based on your home's value and existing mortgage balance." },
      { n: "2", t: "Home Appraisal", d: "A local appraiser determines the current market value of your home — usually within 1–2 weeks." },
      { n: "3", t: "Close and Access Funds", d: "After approval, attend a brief closing and access your funds — typically within 3 business days." },
    ],
    faqs: [
      { q: "What is the difference between a Home Equity Loan and a HELOC?", a: "A Home Equity Loan gives you a lump sum at a fixed rate. A HELOC is a revolving credit line with a variable rate — you draw from it as needed during the draw period." },
      { q: "How much can I borrow?", a: "Most borrowers can access up to 85% of their home's appraised value minus any outstanding mortgage balance. Exact amounts depend on your credit profile and income." },
      { q: "How long does the process take?", a: "From application to closing typically takes 3–5 weeks depending on appraisal scheduling and loan complexity." },
      { q: "What happens if I sell my home while I have a home equity loan?", a: "The loan balance must be repaid from the sale proceeds at closing, just like your first mortgage." },
    ],
    cta: "Apply for Home Equity Financing",
  },

  business: {
    title: "Business Loans",
    subtitle: "Capital for growth, expansion, equipment, and commercial real estate — decided locally.",
    hero: "linear-gradient(145deg,#0f0f1e,#1e1e40)",
    stats: [{ v: "$10K–$5M", l: "Loan range" }, { v: "SBA preferred", l: "Lender" }, { v: "3–5 days", l: "Average decision" }],
    overview: "The capital you need to grow your business shouldn't require a trip to a distant headquarters. SGGINV business loans are underwritten by local bankers who know your market and your industry — from startups seeking their first credit line to established businesses financing major expansions.",
    uses: ["Equipment purchase", "Working capital", "Commercial RE purchase", "Business acquisition", "Franchise financing", "Inventory purchase", "Tenant improvements", "Partner buyout"],
    features: [
      { title: "SBA 7(a) Loans", desc: "Up to $5M in SBA-backed financing with lower down payments, longer terms, and more flexible eligibility.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "SBA 504 Loans", desc: "Long-term, fixed-rate financing for major fixed assets like commercial real estate and large equipment.", icon: "M3 21h18M5 21V9l7-6 7 6v12" },
      { title: "Commercial Real Estate", desc: "Purchase or refinance owner-occupied or investment commercial property with local market expertise.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3" },
      { title: "Equipment Financing", desc: "Finance new or used equipment with terms matched to the asset's useful life — up to 10 years.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066" },
      { title: "Business Line of Credit", desc: "A revolving credit facility for ongoing working capital needs — draw and repay on your schedule.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9" },
      { title: "Agricultural Lending", desc: "Farm operating loans, equipment financing, and real estate loans tailored for agricultural operations.", icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945" },
    ],
    rates: [
      { term: "Business Term Loan", range: "Fixed or variable", amount: "$10,000–$1,000,000", best: "Equipment, expansion" },
      { term: "SBA 7(a) Loan", range: "Prime + 2.25–4.75%", amount: "Up to $5,000,000", best: "Most business purposes" },
      { term: "Business Line of Credit", range: "Variable rate", amount: "$25,000–$500,000", best: "Working capital" },
    ],
    steps: [
      { n: "1", t: "Initial Consultation", d: "Meet with a business banker to discuss your needs, timeline, and which loan type fits best." },
      { n: "2", t: "Submit Your Package", d: "Two years of business tax returns, P&L, balance sheet, and personal financials for all 20%+ owners." },
      { n: "3", t: "Local Decision", d: "SGGINV underwrites business loans in-house. Most decisions within 3–5 business days of a complete package." },
    ],
    faqs: [
      { q: "Do I need collateral to qualify?", a: "Most business loans require some form of collateral — real estate, equipment, or business assets. SBA loans include a government guarantee that can reduce collateral requirements." },
      { q: "Can startups apply?", a: "Yes. Startups with strong personal credit, industry experience, and a viable business plan can qualify for certain loan types, particularly SBA programs." },
      { q: "How long is the SBA loan process?", a: "SBA 7(a) loans typically take 30–60 days from complete application to funding. SBA 504 loans may take 45–90 days due to the dual-lender structure." },
      { q: "Do you offer construction loans for businesses?", a: "Yes — SGGINV offers commercial construction loans for ground-up builds and major renovations, with draws released in stages as work is completed." },
    ],
    cta: "Apply for a Business Loan",
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

export default async function LoansPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) notFound();

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: page.hero, padding: "88px 32px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>Loans</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>{page.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 44px" }}>{page.subtitle}</p>
          <Link href="/about/contact" style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, boxShadow: "0 6px 24px rgba(212,175,55,.4)", marginBottom: 56, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 32, paddingBottom: 40, flexWrap: "wrap" }}>
            {page.stats.map((s, i) => (
              <div key={i} style={{ flex: "1 1 140px", paddingRight: 40, borderRight: i < page.stats.length - 1 ? "1px solid rgba(255,255,255,.12)" : "none", marginRight: i < page.stats.length - 1 ? 40 : 0, marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Overview</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 18px", color: DARK }}>{page.title}</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, margin: 0 }}>{page.overview}</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 16, fontFamily: FONT }}>Common uses</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {page.uses.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: GRAY }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0 }} />
                  {u}
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
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Why SGGINV</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>What sets our loans apart</h2>
          </div>
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {page.features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </div>

      {/* Rate table */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Rates & Terms</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 32px", color: DARK }}>Illustrative rate guide</h2>
          <div className="mob-table-wrap" style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1.5fr", background: RED, padding: "16px 24px" }}>
              {["Loan Type", "Rate Range", "Loan Amount", "Best For"].map(h => (
                <div key={h} style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: ".08em", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {page.rates.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1.5fr", padding: "18px 24px", borderTop: "1px solid rgba(17,24,39,.06)", background: i % 2 === 0 ? "#fff" : "rgba(248,249,250,.6)" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14.5, color: DARK }}>{r.term}</div>
                <div style={{ fontSize: 14.5, color: GRAY }}>{r.range}</div>
                <div style={{ fontSize: 14.5, color: GRAY }}>{r.amount}</div>
                <div style={{ fontSize: 14.5, color: GRAY }}>{r.best}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>* APR shown is illustrative and varies based on creditworthiness, term, and loan type. Contact SGGINV for your personalized rate.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="mob-section" style={{ background: "rgba(140,29,37,.04)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Process</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: "-.02em", margin: "0 0 44px", color: DARK }}>How to apply</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {page.steps.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 20 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 8 }}>{s.t}</div>
                  <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.65 }}>{s.d}</div>
                </div>
              </div>
            ))}
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

      {/* CTA */}
      <div className="mob-section" style={{ background: page.hero, padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: 40, color: "#fff", margin: "0 0 16px", letterSpacing: "-.02em" }}>Ready to apply?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Local decisions from people who know your community and want you to succeed.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/about/contact" style={{ background: GOLD, color: "#4A0E14", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
            <Link href="/about/contact" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>Speak with a loan officer</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
