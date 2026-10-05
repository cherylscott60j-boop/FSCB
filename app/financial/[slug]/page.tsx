import SiteLayout from "@/components/SiteLayout";
import { notFound } from "next/navigation";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

const PAGES = {
  "wealth-management": {
    title: "Wealth Management",
    subtitle: "Personalized strategies to grow, protect, and transfer your wealth across generations.",
    hero: "linear-gradient(145deg,#1a1a2e,#3a2060)",
    stats: [{ v: "Personalized", l: "Investment strategies" }, { v: "Local", l: "Advisors" }, { v: "Holistic", l: "Approach" }],
    overview: "Wealth management at SGGINV goes beyond investment portfolios. We take a comprehensive view of your financial life — income, taxes, estate plan, insurance, and charitable giving — and build a coordinated strategy designed to help you achieve what matters most.",
    services: [
      { name: "Investment Portfolio Management", desc: "Customized portfolios built around your goals, timeline, and risk tolerance — actively monitored and rebalanced." },
      { name: "Tax-Efficient Investing", desc: "Strategies that minimize your tax burden, including tax-loss harvesting, asset location, and Roth conversion planning." },
      { name: "Estate Planning Coordination", desc: "We work alongside your estate attorney to ensure your investment strategy aligns with your legacy and transfer goals." },
      { name: "Charitable Giving Strategies", desc: "Donor-advised funds, charitable trusts, and gifting strategies that maximize your philanthropic impact and tax savings." },
      { name: "Insurance Integration", desc: "Life, disability, and long-term care insurance are reviewed and integrated into your overall wealth plan." },
    ],
    process: [
      { n: "1", t: "Discovery Meeting", d: "We start by learning everything about your financial life, goals, values, and concerns — no forms, just conversation." },
      { n: "2", t: "Comprehensive Plan Development", d: "Our team develops a fully integrated wealth plan covering investments, taxes, estate, insurance, and cash flow." },
      { n: "3", t: "Implementation", d: "We implement your investment strategy and coordinate with your CPA and attorney to execute the full plan." },
      { n: "4", t: "Ongoing Review", d: "Regular quarterly reviews and proactive outreach ensure your plan evolves with your life and market conditions." },
    ],
    faqs: [
      { q: "What is the minimum investment to work with SGGINV Wealth Management?", a: "We serve clients with investable assets starting from £250,000. For smaller balances, we can refer you to our financial planning services." },
      { q: "How are SGGINV wealth advisors compensated?", a: "Our advisors are fee-based — we charge a percentage of assets under management. We do not earn commissions on product sales, so our advice is aligned with your interests." },
      { q: "Do you manage retirement accounts like IRAs and 401(k)s?", a: "Yes — we manage a wide range of account types including IRAs, Roth IRAs, trusts, taxable brokerage accounts, and inherited accounts." },
      { q: "How often will I meet with my advisor?", a: "You'll have formal quarterly reviews and can schedule additional meetings at any time. We also reach out proactively when market events or life changes warrant a conversation." },
    ],
    cta: "Schedule a Wealth Consultation",
  },

  investments: {
    title: "Investment Accounts",
    subtitle: "Professionally managed and self-directed portfolios built for every financial goal.",
    hero: "linear-gradient(145deg,#1a0a2e,#35185a)",
    stats: [{ v: "Stocks, ETFs", l: "Bonds & mutual funds" }, { v: "Managed or", l: "Self-directed" }, { v: "No hidden", l: "Commissions" }],
    overview: "Whether you want a professionally managed portfolio or the freedom to choose your own investments, SGGINV Investment Accounts give you access to a full range of investment vehicles — with transparent pricing, local guidance, and the tools to stay informed.",
    services: [
      { name: "Managed Portfolios", desc: "Our investment team builds and manages a diversified portfolio matched to your risk tolerance and time horizon." },
      { name: "Self-Directed Brokerage", desc: "Trade stocks, ETFs, mutual funds, and bonds independently through our online brokerage platform." },
      { name: "ESG Investing", desc: "Align your portfolio with your values by investing in companies with strong environmental, social, and governance practices." },
      { name: "Dividend Income Portfolios", desc: "Target steady income through portfolios weighted toward dividend-paying stocks and bond ladders." },
      { name: "Taxable and Tax-Advantaged Accounts", desc: "Open brokerage accounts, traditional IRAs, Roth IRAs, and SEP IRAs all under one SGGINV relationship." },
    ],
    process: [
      { n: "1", t: "Risk Assessment", d: "Complete a short questionnaire to determine your risk tolerance, time horizon, and investment goals." },
      { n: "2", t: "Portfolio Construction", d: "We build a diversified, low-cost portfolio using institutional-quality funds and asset allocation strategies." },
      { n: "3", t: "Automatic Rebalancing", d: "Your portfolio is automatically rebalanced to maintain target allocations as markets move." },
      { n: "4", t: "Performance Reporting", d: "Review detailed performance reports and meet with your advisor quarterly to assess progress toward your goals." },
    ],
    faqs: [
      { q: "What is the minimum to open an investment account?", a: "Managed portfolios start at £10,000. Self-directed brokerage accounts can be opened with any amount." },
      { q: "What fees do you charge?", a: "Managed account fees range from 0.25% to 1.00% annually depending on account size. Self-directed brokerage trades are commission-free for stocks and ETFs." },
      { q: "Can I transfer my existing brokerage account to SGGINV?", a: "Yes — SGGINV accepts in-kind transfers from most brokerage firms. The process takes 5–10 business days and can typically be done without liquidating your positions." },
    ],
    cta: "Open an Investment Account",
  },

  planning: {
    title: "Financial Planning",
    subtitle: "A clear, personalized roadmap from where you are today to where you want to be.",
    hero: "linear-gradient(145deg,#0d1f10,#1a3d20)",
    stats: [{ v: "Comprehensive", l: "All areas of finance" }, { v: "Ongoing", l: "Annual reviews" }, { v: "Fee-only", l: "Unbiased advice" }],
    overview: "A financial plan is more than a spreadsheet — it's a dynamic, living document that connects every part of your financial life. SGGINV financial planners take a holistic approach, addressing cash flow, debt, insurance, taxes, investments, and estate planning in one coordinated strategy.",
    services: [
      { name: "Cash Flow and Budget Analysis", desc: "Understand exactly where your money is going and identify opportunities to save more and pay down debt faster." },
      { name: "Debt Elimination Planning", desc: "Strategically prioritize debt payoff — avalanche vs. snowball, refinancing opportunities, and mortgage acceleration." },
      { name: "Education Savings Planning", desc: "529 plan strategy, Coverdell accounts, and financial aid planning to fund education goals tax-efficiently." },
      { name: "Insurance Needs Analysis", desc: "Determine exactly how much life, disability, and long-term care coverage your situation requires." },
      { name: "Tax Planning Integration", desc: "Identify deductions, credits, and strategies across your full financial picture to legally minimize your tax burden." },
    ],
    process: [
      { n: "1", t: "Data Gathering", d: "We collect details about your income, expenses, assets, debts, insurance, and goals." },
      { n: "2", t: "Plan Development", d: "Our CFP®-credentialed planners build a comprehensive written plan with specific recommendations in every area." },
      { n: "3", t: "Plan Presentation", d: "We walk through every recommendation, answer your questions, and prioritize your action steps together." },
      { n: "4", t: "Annual Review", d: "Your plan is updated annually — or whenever a major life event occurs — to keep it relevant and on track." },
    ],
    faqs: [
      { q: "How much does financial planning cost?", a: "SGGINV financial planning is available on a flat-fee basis for comprehensive plans or hourly consulting for specific questions. Contact us for current pricing." },
      { q: "Do I need to invest through SGGINV to get a financial plan?", a: "No — financial planning is available as a stand-alone service. Many clients keep existing accounts elsewhere and use SGGINV purely for planning advice." },
      { q: "How long does it take to develop a financial plan?", a: "A comprehensive financial plan typically takes 2–4 weeks from initial data gathering to final plan delivery." },
      { q: "What qualifications do SGGINV financial planners have?", a: "Our lead financial planners hold the CFP® (Certified Financial Planner) designation, which requires extensive education, experience, and adherence to a fiduciary standard." },
    ],
    cta: "Get Your Financial Plan",
  },

  estate: {
    title: "Estate Planning",
    subtitle: "Protect your legacy, reduce taxes, and ensure your wishes are honored.",
    hero: "linear-gradient(145deg,#1a1200,#3d2e00)",
    stats: [{ v: "Coordinated", l: "With your attorney" }, { v: "Trust services", l: "Available" }, { v: "Legacy", l: "Planning focus" }],
    overview: "Estate planning is one of the most important — and most overlooked — components of a sound financial plan. SGGINV estate planning advisors work alongside your estate attorney to ensure your assets are titled correctly, beneficiaries are current, and your wishes will be carried out exactly as intended.",
    services: [
      { name: "Beneficiary Designation Review", desc: "Outdated beneficiaries are one of the most common estate planning mistakes. We audit every account and policy you own." },
      { name: "Trust Account Management", desc: "SGGINV provides trustee and custodial services for revocable living trusts, irrevocable trusts, and testamentary trusts." },
      { name: "Estate Tax Minimization", desc: "Gifting strategies, irrevocable life insurance trusts (ILITs), and family limited partnerships to reduce taxable estate size." },
      { name: "Power of Attorney Coordination", desc: "Ensure your financial power of attorney is on file and that the right people have the access they need in an emergency." },
      { name: "Business Succession Planning", desc: "If you own a business, we help design buy-sell agreements and funding strategies to ensure a smooth ownership transition." },
    ],
    process: [
      { n: "1", t: "Document Review", d: "We review your existing will, trust documents, beneficiary designations, and asset titling for gaps and conflicts." },
      { n: "2", t: "Strategy Development", d: "Working with your attorney, we develop recommendations for asset titling, trust structures, and transfer strategies." },
      { n: "3", t: "Implementation", d: "We coordinate account retitling, beneficiary updates, and fund transfers to bring your plan into alignment." },
      { n: "4", t: "Ongoing Monitoring", d: "Estate plans are reviewed after major life events (marriage, divorce, birth, death) and every 3–5 years at minimum." },
    ],
    faqs: [
      { q: "Do I need a trust, or is a will enough?", a: "It depends on your situation. A will alone goes through probate — a public, sometimes slow process. A revocable living trust avoids probate, enables faster asset transfer, and provides privacy. For most people with meaningful assets, a trust is recommended." },
      { q: "What happens to my accounts if I die without a will?", a: "Your state's intestacy laws determine who inherits — which may not match your intentions. Accounts with named beneficiaries pass outside probate, but all other assets are distributed by the court." },
      { q: "How often should I update my estate plan?", a: "Review it every 3–5 years and after major life events: marriage, divorce, birth of a child or grandchild, death of a beneficiary, or significant change in financial status." },
      { q: "What is the federal estate tax exemption?", a: "For 2025, the federal estate tax exemption is approximately £13.6 million per individual (£27.2M for married couples). Assets above this threshold may be subject to federal estate tax up to 40%." },
    ],
    cta: "Start Estate Planning",
  },
};

function ServiceCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "22px 24px", border: "1px solid rgba(17,24,39,.07)", borderRadius: 16, background: "#fff" }}>
      <div style={{ flex: "none", width: 36, height: 36, borderRadius: 10, background: "rgba(140,29,37,.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 5 }}>{name}</div>
        <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

export default async function FinancialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) notFound();

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: page.hero, padding: "88px 32px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>Financial Management</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 56px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>{page.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 44px" }}>{page.subtitle}</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer", boxShadow: "0 6px 24px rgba(212,175,55,.4)", marginBottom: 56 }}>{page.cta}</button>
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
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Overview</div>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px", color: DARK }}>{page.title}</h2>
              <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.75, margin: "0 0 28px" }}>{page.overview}</p>
              <button style={{ background: RED, color: "#fff", border: "none", fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "13px 26px", borderRadius: 11, cursor: "pointer" }}>{page.cta}</button>
            </div>
            <div style={{ background: "rgba(140,29,37,.04)", borderRadius: 20, padding: "36px 32px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 20 }}>Our approach</div>
              {["Fiduciary standard — your interests always come first", "Local advisors who know your community and goals", "Holistic view across all areas of your financial life", "Transparent fees with no hidden commissions", "Regular reviews to keep your plan on track"].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ flex: "none", width: 22, height: 22, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                  </div>
                  <span style={{ fontSize: 14.5, color: DARK, lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Services</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 32px", color: DARK }}>What&apos;s included</h2>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {page.services.map((s, i) => <ServiceCard key={i} {...s} />)}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Process</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: "-.02em", margin: "0 0 44px", color: DARK }}>How it works</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {page.process.map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ flex: "none", width: 44, height: 44, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 18 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 6 }}>{s.t}</div>
                    <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: page.hero, borderRadius: 24, padding: "48px 40px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12 }}>Ready to take the next step?</div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7, marginBottom: 32 }}>Schedule a no-obligation conversation with a local SGGINV advisor. We'll listen first and advise second.</p>
            <button style={{ width: "100%", background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: 16, borderRadius: 12, cursor: "pointer", marginBottom: 12 }}>{page.cta}</button>
            <button style={{ width: "100%", background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.22)", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, padding: 14, borderRadius: 12, cursor: "pointer" }}>Call us today</button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: 0, color: DARK }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {page.faqs.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 10 }}>{f.q}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: page.hero, padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 40px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Your financial future starts here</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Speak with a local SGGINV advisor who puts your interests first — always.</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "16px 40px", borderRadius: 12, cursor: "pointer" }}>{page.cta}</button>
        </div>
      </div>
    </SiteLayout>
  );
}
