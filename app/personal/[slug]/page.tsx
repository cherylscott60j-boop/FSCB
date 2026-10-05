import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import FAQAccordion from "@/components/FAQAccordion";

/* ─── Shared style tokens ───────────────────────────────────────────────── */
const FONT = "var(--font-poppins), sans-serif";
const RED  = "#E31E24";
const DARK = "#111827";
const GRAY = "#6B7280";

/* ─── Page data ─────────────────────────────────────────────────────────── */
const PAGES = {
  "credit-cards": {
    title: "Credit Cards",
    subtitle: "Earn rewards and cashback on every purchase with cards built for community members.",
    stats: [{ v: "Up to 3%", l: "Cashback" }, { v: "£0", l: "Annual fee" }, { v: "0% APR", l: "12-month intro" }],
    overview: "SGGINV credit cards are designed to reward the way you actually spend — groceries, gas, dining, and everyday purchases. With no annual fees, competitive rates, and rewards that never expire, our cards are a smart choice for every wallet.",
    features: [
      { title: "Up to 3% Cashback", desc: "Earn 3% on groceries and gas, 2% on dining, and 1% on all other purchases — automatically.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
      { title: "No Annual Fee", desc: "Our Community Rewards Card comes with zero annual fee. Keep the rewards, ditch the cost.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "0% Intro APR — 12 Months", desc: "Pay no interest on purchases for the first 12 months. Great for large purchases or balance transfers.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "Free Credit Score Monitoring", desc: "Check your credit score for free anytime in the mobile app — no impact to your credit.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Fraud Protection", desc: "24/7 fraud monitoring with real-time alerts. Zero liability on unauthorized purchases.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
      { title: "Contactless & Digital Wallet", desc: "Tap to pay with your physical card or add to Apple Pay, Google Pay, or Samsung Pay.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
    ],
    accounts: [
      { name: "Community Card", monthly: "£0/yr", min: "Good credit", apy: "1% on all purchases", transfers: "No foreign txn fee", highlight: false, startHref: "/open-account?account=community-card" },
      { name: "Rewards Card", monthly: "£0/yr", min: "Good–Excellent", apy: "Up to 3% cashback", transfers: "No foreign txn fee", highlight: true, startHref: "/open-account?account=rewards-card" },
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
      { q: "How do I report a lost or stolen card?", a: "Lock your card instantly in the SGGINV mobile app, then call our 24/7 card services line to request a replacement." },
      { q: "How long does a balance transfer take?", a: "Balance transfers typically post within 5–7 business days after your application is approved." },
    ],
    cta: "Apply for a Credit Card",
    ctaHref: "/open-account",
  },

  loans: {
    title: "Personal Loans",
    subtitle: "Fast local decisions, transparent rates, and no hidden fees for any purpose.",
    stats: [{ v: "£1K–£50K", l: "Loan amounts" }, { v: "1 Day", l: "Decision time" }, { v: "£0", l: "Origination fee" }],
    overview: "Life doesn't always wait for the perfect moment — and neither should your financing. SGGINV personal loans give you access to the funds you need quickly, with fixed monthly payments, no prepayment penalties, and a local team that actually reviews your application.",
    features: [
      { title: "Fixed Rates, No Surprises", desc: "Your interest rate and monthly payment stay the same from day one to your last payment.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
      { title: "No Origination Fees", desc: "We don't charge origination fees or prepayment penalties. What we quote is what you pay.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Borrow £1,000–£50,000", desc: "Whether it's a small expense or a major purchase, we have the right loan size for you.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "Terms from 12 to 84 Months", desc: "Choose a repayment timeline that fits your budget, from 1 to 7 years.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
      { title: "Same-Day Funding Available", desc: "Approved by noon? Funds could hit your SGGINV account the same business day.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Local Underwriting", desc: "Your application is reviewed by a real person here in the community — not an algorithm.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" },
    ],
    accounts: [
      { name: "Standard Personal Loan", monthly: "Fixed rate", min: "£1,000–£25,000", apy: "12–60 months", transfers: "Good credit", highlight: false, startHref: "/about/contact" },
      { name: "Premier Personal Loan", monthly: "Lower fixed rate", min: "£5,000–£50,000", apy: "12–84 months", transfers: "Excellent credit", highlight: true, startHref: "/about/contact" },
    ],
    accountNote: "Rates are based on creditworthiness and loan term. Contact a banker for your personalized rate.",
    steps: [
      { n: "1", t: "Apply Online or In Person", d: "Tell us the amount you need and what it's for. The form takes under 10 minutes." },
      { n: "2", t: "Get a Decision", d: "A local underwriter reviews your application — most decisions come within 1 business day." },
      { n: "3", t: "Receive Your Funds", d: "Once approved and signed, funds are deposited directly to your SGGINV account." },
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

};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(227,30,36,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 18 }}>
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
      <div className="mob-hero" style={{ background: "linear-gradient(135deg,#0D1B4C 0%,#0800FF 60%,#E31E24 100%)", padding: "88px 32px", overflow: "hidden" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 260px", gap: 48, alignItems: "start" }}>
          {/* Left: copy */}
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.75)", fontWeight: 700, marginBottom: 16 }}>Personal Banking</div>
            <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 4.4vw, 46px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>{page.title}</h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 32px" }}>{page.subtitle}</p>
            <Link href={page.ctaHref} style={{ background: RED, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer", boxShadow: "0 6px 24px rgba(227,30,36,.4)", textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
          </div>

          {/* Right: stats, stacked on desktop / inline row on mobile */}
          <div className="mob-hero-stats" style={{ display: "flex", flexDirection: "column", gap: 24, borderLeft: "1px solid rgba(255,255,255,.14)", paddingLeft: 32 }}>
            {page.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Overview</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px", color: DARK }}>{page.title}</h2>
          <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.75, margin: 0 }}>{page.overview}</p>
        </div>
      </div>

      {/* Features grid */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.02em", margin: "0 0 14px", color: DARK }}>Everything you need, nothing you don&apos;t</h2>
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
          <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.02em", margin: "0 0 36px", color: DARK }}>Choose the right account for you</h2>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {page.accounts.map((a, i) => (
              <div key={i} style={{ border: `2px solid ${a.highlight ? RED : "rgba(17,24,39,.08)"}`, borderRadius: 20, padding: "32px 30px", position: "relative", background: a.highlight ? "rgba(227,30,36,.02)" : "#fff" }}>
                {a.highlight && <div style={{ position: "absolute", top: -13, left: 28, background: RED, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>Most Popular</div>}
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: DARK, marginBottom: 24 }}>{a.name}</div>
                {Object.entries({ "Monthly Fee": a.monthly, "Minimum": a.min, "Yield / Rate": (a as unknown as Record<string,string>).apy, "Included": (a as unknown as Record<string,string>).transfers }).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(17,24,39,.06)", fontSize: 14.5 }}>
                    <span style={{ color: GRAY }}>{k}</span>
                    <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                  </div>
                ))}
                <Link href={a.startHref} style={{ marginTop: 24, display: "block", textAlign: "center", width: "100%", background: a.highlight ? RED : "transparent", color: a.highlight ? "#fff" : RED, border: `1.5px solid ${a.highlight ? RED : "rgba(227,30,36,.3)"}`, fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "13px", borderRadius: 12, cursor: "pointer", textDecoration: "none", boxSizing: "border-box" }}>Get Started</Link>
              </div>
            ))}
          </div>
          {page.accountNote && <p style={{ marginTop: 16, fontSize: 12.5, color: "#9CA3AF" }}>{page.accountNote}</p>}
        </div>
      </div>

      {/* How it works */}
      <div className="mob-section" style={{ background: "rgba(227,30,36,.03)", padding: "72px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.02em", margin: "0 0 40px", color: DARK }}>Get started in 3 simple steps</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {page.steps.map((s) => <Step key={s.n} {...s} />)}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 20px 60px -20px rgba(227,30,36,.15)" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: DARK, marginBottom: 8 }}>Ready to open your account?</div>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, marginBottom: 28 }}>Join 17,000+ community members who trust SGGINV for their everyday banking needs.</p>
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
            <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>Common questions</h2>
          </div>
          <FAQAccordion faqs={page.faqs} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "#F4F5F7", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3vw, 28px)", color: DARK, margin: "0 0 16px", letterSpacing: "-.02em" }}>Start banking smarter today</h2>
          <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.65, margin: "0 0 36px" }}>Open your account online in minutes or visit any SGGINV branch to speak with a local banker.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={page.ctaHref} style={{ background: RED, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>{page.cta}</Link>
            <Link href="/about/contact" style={{ background: "#fff", color: DARK, border: "1.5px solid rgba(17,24,39,.14)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>Find a branch</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
