import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import RetirementCalculator from "@/components/RetirementCalculator";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const PILLARS = [
  { t: "A dedicated relationship manager", d: "One named contact who knows you, your family and your goals.", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
  { t: "Wealth & investments", d: "Portfolios built around your goals, timeline and appetite for risk.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Retirement planning", d: "A clear plan for how much you need and where your income will come from.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Private lending", d: "Mortgages and credit lines tailored to complex finances.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
];

const BENEFITS = [
  { t: "Priority service", d: "A direct line to your relationship manager and a dedicated private banking team, Monday to Saturday." },
  { t: "Preferential rates", d: "Higher savings rates and lower borrowing rates than our standard accounts." },
  { t: "Fee-free everyday banking", d: "No monthly fees, free wires, worldwide ATM fee refunds and no foreign transaction fees." },
  { t: "Complimentary planning", d: "A full financial plan, reviewed every year, at no extra cost." },
  { t: "A premium debit and credit card", d: "Metal cards with travel benefits and 24/7 concierge support." },
];

const SERVICES = [
  { t: "Investment management", d: "Discretionary or advisory portfolios, reviewed regularly and rebalanced as markets move.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Retirement income planning", d: "Turn your savings into a reliable income that lasts as long as you do.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Estate & legacy planning", d: "Plan how your wealth passes to the people and causes you care about.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Tax-aware strategies", d: "We work alongside your tax adviser to keep more of what you earn.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Private mortgages & credit", d: "Jumbo mortgages, securities-backed credit lines and bridge financing.", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { t: "Business owner services", d: "Succession planning, business banking and support for selling your company.", icon: "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" },
];

const RETIREMENT = [
  { t: "Retirement income planning", d: "How much you need, where it will come from and how long it will last, with inflation built in." },
  { t: "Social Security timing", d: "When to claim to make the most of your lifetime benefits, including spousal options." },
  { t: "401(k) and IRA rollovers", d: "Bring old workplace plans together for simpler management and a clearer picture." },
  { t: "Required minimum distributions", d: "Plan withdrawals from age 73 to manage your tax bill." },
  { t: "Roth conversion analysis", d: "Find the right years and amounts to convert, building tax-free income for later." },
];

const TEAM = [
  { t: "Relationship manager", d: "Your main point of contact, coordinating everything across the team." },
  { t: "Investment specialist", d: "Builds and manages your portfolio and explains every decision." },
  { t: "Retirement planner", d: "Models your retirement income and keeps your plan on track." },
  { t: "Lending specialist", d: "Arranges mortgages and credit structured around your assets." },
];

const PORTFOLIOS = [
  { name: "Conservative", desc: "Focuses on protecting what you have, with modest growth.", mix: [["Bonds", 60], ["Stocks", 30], ["Cash", 10]] },
  { name: "Balanced", desc: "A mix of growth and stability for medium to long-term goals.", mix: [["Stocks", 55], ["Bonds", 40], ["Cash", 5]] },
  { name: "Growth", desc: "Aims for higher long-term growth and accepts bigger ups and downs.", mix: [["Stocks", 80], ["Bonds", 17], ["Cash", 3]] },
] as const;

const FEES = [
  ["First $1 million", "1.00%"],
  ["$1 million – $3 million", "0.80%"],
  ["$3 million – $10 million", "0.60%"],
  ["Over $10 million", "Ask us"],
];

const STEPS = [
  { t: "Introductory meeting", d: "Meet your relationship manager to talk about your goals, family and priorities." },
  { t: "Discovery and analysis", d: "We review your finances, from accounts and investments to property and pensions." },
  { t: "Your personal plan", d: "We present a written plan with clear recommendations and costs." },
  { t: "Ongoing reviews", d: "We meet at least once a year, and whenever your life changes." },
];

const FAQS = [
  { q: "Who is private banking for?", a: "Private banking is for clients with $250,000 or more in savings and investments with us, or a household income of $300,000 or more. If you're close to these levels, talk to us. We look at your whole situation." },
  { q: "Is there a fee for private banking?", a: "Private banking accounts and everyday banking services are free. If you choose investment management, you pay an annual advisory fee based on the value of your portfolio. You'll see every fee in writing before you commit." },
  { q: "What are the IRA contribution limits for 2025?", a: "For 2025 you can contribute up to $7,000 a year to IRAs, or $8,000 if you're 50 or older. Income limits apply to Roth IRA contributions." },
  { q: "When should I start taking Social Security?", a: "It depends on your health, other income and whether you're married. Delaying from 62 to 70 can increase your monthly benefit significantly. Your retirement planner can run the numbers for you." },
  { q: "What is a required minimum distribution?", a: "Once you reach 73, you must withdraw a minimum amount each year from traditional IRAs and most workplace plans. Missing an RMD can lead to a tax penalty." },
  { q: "Can I still use my existing financial adviser or accountant?", a: "Yes. Many clients ask us to work alongside their accountant or attorney, and we're happy to coordinate with them." },
  { q: "Are investments guaranteed?", a: "No. The value of investments can go down as well as up, and you may get back less than you invest. Past performance is not a reliable guide to future returns." },
];

export default function PrivateBankingPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Private banking"
        title="Personal service for every part of your financial life"
        subtitle="A dedicated relationship manager and a team of specialists to help you grow, protect and pass on your wealth, and plan for the retirement you want."
        primary={{ label: "Book a consultation", href: "/about/contact" }}
        secondary={{ label: "Plan your retirement", href: "#retirement" }}
        highlights={[
          { v: "1", l: "Dedicated relationship manager" },
          { v: "$250K+", l: "To qualify" },
          { v: "Annual", l: "Planning reviews" },
        ]}
        image={{ src: "/private-banking-hero.jpg", alt: "A relationship manager meeting with a private banking client", position: "56% 40%" }}
      />

      {/* Pillars */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {PILLARS.map((c, i) => (
            <div key={c.t} style={{ padding: "30px 28px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={c.icon} size={22} />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: DARK, marginBottom: 6 }}>{c.t}</div>
              <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Who it's for + benefits */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "start" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Who it&apos;s for</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 16px", letterSpacing: "-.01em" }}>Is private banking right for you?</h3>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,.8)", lineHeight: 1.7, margin: "0 0 20px" }}>You can join private banking if you have either:</p>
            {["$250,000 or more in savings and investments with us", "A household income of $300,000 or more"].map((t) => (
              <div key={t} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 15.5, fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" style={{ flex: "none", marginTop: 3 }}><path d="M5 12l5 5L20 7" /></svg>
                {t}
              </div>
            ))}
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)", lineHeight: 1.6, margin: "16px 0 0" }}>
              Close to these levels? Talk to us anyway. We look at your whole financial picture.
            </p>
          </div>
          <div>
            <SectionTitle eyebrow="Membership benefits" title="What you get as a private client" mb={28} />
            <CheckList items={BENEFITS} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our services" title="Expert help across your whole financial life" />
          <IconCards items={SERVICES} />
        </div>
      </section>

      {/* Retirement */}
      <section id="retirement" className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "start", marginBottom: 48 }}>
            <div>
              <SectionTitle eyebrow="Retirement planning" title="Plan the retirement you want" mb={18} />
              <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0 }}>
                Whether you&apos;re decades away or already retired, your retirement planner builds a clear plan for how much you need, where your income will come from and how to make it last.
              </p>
            </div>
            <CheckList items={RETIREMENT} />
          </div>
          <RetirementCalculator />
        </div>
      </section>

      {/* Portfolios */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Investment approach" title="A portfolio that matches your goals" mb={14} />
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 720 }}>
            We start by understanding your goals, timeline and how you feel about risk. Then we recommend a portfolio. These are examples of how a portfolio might be split.
          </p>
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PORTFOLIOS.map((p) => (
              <div key={p.name} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "28px 26px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, marginBottom: 22 }}>{p.desc}</div>
                <div style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden", marginBottom: 16, background: TINT }}>
                  {p.mix.map(([label, pct], i) => (
                    <div key={label} style={{ width: `${pct}%`, background: BLUE, opacity: [1, 0.55, 0.25][i] }} />
                  ))}
                </div>
                {p.mix.map(([label, pct], i) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid rgba(17,24,39,.06)", fontSize: 14.5 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, color: GRAY }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: BLUE, opacity: [1, 0.55, 0.25][i] }} />
                      {label}
                    </span>
                    <span style={{ fontWeight: 600, color: DARK }}>{pct}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team + fees */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Your team" title="Specialists working together for you" mb={28} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {TEAM.map((m) => (
                <div key={m.t} style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "22px 20px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: TINT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" size={20} />
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 6 }}>{m.t}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{m.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="Clear pricing" title="Simple, transparent fees" mb={18} />
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.7, margin: "0 0 22px" }}>
              Private banking itself is free. If you choose investment management, you pay one annual advisory fee based on your portfolio value.
            </p>
            <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", padding: "14px 24px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                <div>Portfolio value</div>
                <div style={{ textAlign: "right" }}>Annual fee</div>
              </div>
              {FEES.map(([band, fee], i) => (
                <div key={band} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", padding: "15px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none" }}>
                  <div style={{ color: DARK, fontWeight: 600 }}>{band}</div>
                  <div style={{ color: DARK, textAlign: "right" }}>{fee}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
              Example fee schedule. Fees are tiered, so each rate applies only to the part of your portfolio in that band. Fund costs may also apply.
            </p>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(17,24,39,.06)" }} />
      <StepsSection title="How we work with you" steps={STEPS} />

      {/* Important information */}
      <section className="mob-section" style={{ background: "#fff", padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", border: `2px solid ${BLUE}`, borderRadius: 8, padding: "32px 34px", display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ color: BLUE, flex: "none" }}>
            <Icon d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={28} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18, color: DARK, marginBottom: 8 }}>Important information about investing</div>
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              Investment products are not bank deposits and are not insured. The value of investments can go down as well as up, and you may get back less than you invest. Past performance is not a reliable guide to future returns. We never ask you to pay a fee or move money in order to release investment returns.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Let's talk about your goals"
        text="Book a no-obligation consultation with a relationship manager."
        primary={{ label: "Book a consultation", href: "/about/contact" }}
        secondary={{ label: "Call (555) 302-1900", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
