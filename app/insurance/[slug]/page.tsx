import SiteLayout from "@/components/SiteLayout";
import { notFound } from "next/navigation";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

const PAGES = {
  home: {
    title: "Home Insurance",
    subtitle: "Comprehensive coverage for your home, belongings, and liability.",
    hero: "linear-gradient(145deg,#0d2137,#1a4a6b)",
    coverages: [
      { name: "Dwelling Coverage", desc: "Protects the structure of your home — walls, roof, floors, built-in appliances — against covered perils like fire, wind, and hail." },
      { name: "Personal Property", desc: "Covers your furniture, electronics, clothing, and other belongings if stolen or damaged by a covered event." },
      { name: "Liability Protection", desc: "Covers legal costs and damages if someone is injured on your property or you accidentally damage someone else's property." },
      { name: "Additional Living Expenses", desc: "Pays for hotel stays, meals, and other costs if your home is temporarily uninhabitable due to a covered claim." },
      { name: "Other Structures", desc: "Covers detached garages, fences, sheds, and other structures on your property." },
    ],
    addons: ["Flood insurance rider", "Earthquake coverage", "Sewer backup protection", "Jewelry and valuables rider", "Home business coverage", "Umbrella liability policy"],
    features: [
      { title: "Replacement Cost Coverage", desc: "Replace your belongings at today's prices — not the depreciated value.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9" },
      { title: "Bundle and Save", desc: "Bundle home and auto insurance for discounts of up to 20% on both policies.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Local Claims Handling", desc: "File and track claims with a local agent who knows the area and can expedite your resolution.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
      { title: "24/7 Claims Support", desc: "Report a claim any time, day or night. Our support team is always available for emergencies.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11" },
    ],
    discounts: ["Claims-free discount", "Security system discount", "New home discount", "Loyalty discount", "Multi-policy bundle"],
    faqs: [
      { q: "What does home insurance not cover?", a: "Standard policies typically exclude flood, earthquake, normal wear and tear, and pest damage. Riders or separate policies are available for most of these." },
      { q: "How is my premium calculated?", a: "Factors include the home's replacement cost, location, construction type, claims history, credit score, and chosen deductible." },
      { q: "How do I file a claim?", a: "Call our 24/7 claims line or use the SGGINV insurance portal online. A local adjuster will be assigned to your claim." },
      { q: "Is home insurance required by law?", a: "Not by law, but mortgage lenders require it. It's strongly recommended even for homeowners without a mortgage." },
    ],
    cta: "Get a Home Insurance Quote",
  },

  auto: {
    title: "Auto Insurance",
    subtitle: "Stay protected on every road with coverage that fits your life and budget.",
    hero: "linear-gradient(145deg,#1a0d00,#3d2000)",
    coverages: [
      { name: "Liability Coverage", desc: "Covers bodily injury and property damage you cause to others in an at-fault accident. Required in most states." },
      { name: "Collision Coverage", desc: "Pays to repair or replace your vehicle after a collision with another vehicle or object, regardless of fault." },
      { name: "Comprehensive Coverage", desc: "Covers non-collision damage including theft, vandalism, fire, hail, flooding, and animal strikes." },
      { name: "Uninsured Motorist", desc: "Protects you if you're hit by a driver with no insurance or insufficient coverage to cover your damages." },
      { name: "Medical Payments (MedPay)", desc: "Covers medical expenses for you and your passengers after an accident, regardless of fault." },
    ],
    addons: ["Roadside assistance", "Rental car reimbursement", "Gap insurance", "New car replacement", "Rideshare coverage", "Custom equipment coverage"],
    features: [
      { title: "Accident Forgiveness", desc: "Your first at-fault accident won't raise your premium — available to qualifying policyholders.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "Multi-Vehicle Discount", desc: "Insure 2 or more vehicles on the same policy and save up to 15%.", icon: "M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h11l4 4v4a2 2 0 0 1-2 2h-1" },
      { title: "Roadside Assistance", desc: "24/7 towing, battery jump, flat tire change, lockout service, and fuel delivery.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { title: "Safe Driver Discount", desc: "Clean driving record? Save up to 25% on your premium with our safe driver program.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
    ],
    discounts: ["Safe driver discount", "Good student discount", "Multi-car discount", "Anti-theft device discount", "Pay-in-full discount"],
    faqs: [
      { q: "What auto coverage is required in my state?", a: "Most states require liability coverage at a minimum. Requirements vary — contact an SGGINV insurance advisor to confirm what's required in your state." },
      { q: "Does my auto insurance cover rental cars?", a: "If you have comprehensive and collision coverage, it typically extends to rental vehicles. Check your policy for specific terms." },
      { q: "What is gap insurance and do I need it?", a: "Gap insurance covers the difference between your car's actual cash value and what you owe on your loan if the car is totaled. It's recommended if you owe more than the car is worth." },
      { q: "How can I lower my auto insurance premium?", a: "Maintain a clean driving record, increase your deductible, bundle with home insurance, take a defensive driving course, and ask about all available discounts." },
    ],
    cta: "Get an Auto Insurance Quote",
  },

  life: {
    title: "Life Insurance",
    subtitle: "Protect your family's financial future with the right coverage for every stage of life.",
    hero: "linear-gradient(145deg,#0d1f0d,#1a3d1a)",
    coverages: [
      { name: "Term Life Insurance", desc: "Affordable coverage for a set period (10, 20, or 30 years). Ideal for income replacement during your working years." },
      { name: "Whole Life Insurance", desc: "Permanent coverage with a cash value component that grows over time. Premiums never increase." },
      { name: "Universal Life Insurance", desc: "Flexible permanent coverage that lets you adjust premiums and death benefit as your needs change." },
      { name: "Final Expense Insurance", desc: "Smaller whole life policies designed to cover funeral costs and end-of-life expenses. No medical exam required." },
      { name: "Indexed Universal Life", desc: "Cash value growth tied to a market index with downside protection — growth potential without direct market risk." },
    ],
    addons: ["Accelerated death benefit rider", "Waiver of premium rider", "Children's term rider", "Long-term care rider", "Disability income rider", "Return of premium rider"],
    features: [
      { title: "Coverage from $50K to $5M+", desc: "Right-size your coverage to match your income, debt obligations, and family's specific needs.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
      { title: "No Medical Exam Options", desc: "Qualifying applicants can receive coverage without a physical exam — faster approval, less hassle.", icon: "M9 12l2 2 4-4" },
      { title: "Living Benefits", desc: "Access a portion of your death benefit early if diagnosed with a terminal, chronic, or critical illness.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
      { title: "Local Advisor Guidance", desc: "An SGGINV insurance advisor helps you choose the right policy and coverage amount for your family.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
    ],
    discounts: ["Non-smoker discount", "Healthy lifestyle discount", "Multi-policy discount", "Annual pay discount", "Young buyer discount"],
    faqs: [
      { q: "How much life insurance do I need?", a: "A common rule of thumb is 10–12 times your annual income. Consider your mortgage, other debts, income replacement years, and education funding for dependents." },
      { q: "What is the difference between term and whole life?", a: "Term is temporary and affordable — perfect for income replacement. Whole life is permanent, builds cash value, and costs more. The right choice depends on your goals." },
      { q: "Can I get life insurance if I have health issues?", a: "Yes. While some conditions affect your rate, many people with health issues qualify for coverage. Our advisors can find options including guaranteed-issue policies." },
      { q: "How long does it take to get approved?", a: "Simplified issue policies (no medical exam) can be approved in 24–72 hours. Fully underwritten policies take 2–6 weeks." },
    ],
    cta: "Get a Life Insurance Quote",
  },

  business: {
    title: "Business Insurance",
    subtitle: "Protect your business from unexpected events with comprehensive commercial coverage.",
    hero: "linear-gradient(145deg,#1a1a0d,#3d3d00)",
    coverages: [
      { name: "General Liability (GL)", desc: "Covers third-party bodily injury, property damage, and advertising injury claims against your business." },
      { name: "Commercial Property", desc: "Protects your building, equipment, inventory, and other business property against fire, theft, and other perils." },
      { name: "Business Interruption", desc: "Replaces lost income and covers operating expenses if your business is temporarily shut down by a covered loss." },
      { name: "Workers' Compensation", desc: "Required in most states — covers medical bills and lost wages for employees injured on the job." },
      { name: "Professional Liability (E&O)", desc: "Protects service businesses from claims of negligence, errors, or inadequate work." },
    ],
    addons: ["Cyber liability insurance", "Commercial umbrella policy", "Directors & officers (D&O)", "Employment practices liability", "Commercial auto insurance", "Product liability coverage"],
    features: [
      { title: "Business Owner's Policy (BOP)", desc: "Bundle GL and commercial property into one affordable policy — perfect for small to mid-size businesses.", icon: "M3 7h18M3 11h18M3 15h18" },
      { title: "Industry-Specific Programs", desc: "Specialized coverage for restaurants, contractors, healthcare, retail, and professional service firms.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
      { title: "Risk Assessment", desc: "Our commercial insurance advisors conduct a thorough risk assessment to identify gaps in your coverage.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944" },
      { title: "Claims Advocacy", desc: "We advocate on your behalf through the claims process to help you get the fastest, fairest resolution.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
    ],
    discounts: ["Claims-free discount", "Multi-policy bundle", "Safety program discount", "New business discount", "Annual pay discount"],
    faqs: [
      { q: "What is the difference between a BOP and separate policies?", a: "A Business Owner's Policy bundles GL and commercial property at a lower combined rate. Businesses with unique risks may need separate policies for more customized coverage." },
      { q: "Is workers' compensation required?", a: "In most states, yes — if you have employees. Requirements vary by state and business type. An SGGINV advisor can confirm your state's requirements." },
      { q: "What is cyber liability insurance?", a: "Cyber liability covers the costs of data breaches, ransomware attacks, and regulatory fines. With cyber threats rising, it's increasingly essential for businesses of all sizes." },
      { q: "How is my business insurance premium calculated?", a: "Key factors include business type, annual revenue, number of employees, claims history, location, and coverage limits." },
    ],
    cta: "Get a Business Insurance Quote",
  },

  health: {
    title: "Health Insurance",
    subtitle: "Quality health coverage for individuals, families, and your entire workforce.",
    hero: "linear-gradient(145deg,#0d1f1a,#1a3d30)",
    coverages: [
      { name: "Individual Health Plans", desc: "ACA-compliant individual plans with a range of deductible and premium combinations to fit any budget." },
      { name: "Family Health Plans", desc: "Cover your entire family under one plan with family deductibles and out-of-pocket maximums." },
      { name: "Group Health Insurance", desc: "Employer-sponsored plans for businesses of all sizes — attract and retain top talent with strong benefits." },
      { name: "HSA-Compatible (HDHP) Plans", desc: "High-deductible plans paired with Health Savings Accounts — lower premiums, tax-advantaged savings." },
      { name: "Medicare Supplement Plans", desc: "Fill the gaps in Original Medicare with supplemental coverage that reduces your out-of-pocket costs." },
    ],
    addons: ["Dental insurance", "Vision insurance", "Short-term disability", "Long-term disability", "Critical illness coverage", "Accident coverage"],
    features: [
      { title: "Marketplace Plan Guidance", desc: "Confused by the ACA marketplace? Our advisors compare plans and help you apply for available subsidies.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
      { title: "Group Benefits Consulting", desc: "Design a competitive employee benefits package that fits your budget and helps attract top talent.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
      { title: "HSA Account Management", desc: "Pair your high-deductible plan with an SGGINV Health Savings Account for tax-free medical savings.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
      { title: "Open Enrollment Support", desc: "Year-round guidance and hands-on help during open enrollment for individuals and employers.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
    ],
    discounts: ["Employer contribution (group)", "Non-smoker discount", "Wellness program discount", "Annual pay discount", "HSA contribution match"],
    faqs: [
      { q: "When can I enroll in a health insurance plan?", a: "During the ACA Open Enrollment Period (Nov 1–Jan 15) or during a Special Enrollment Period triggered by a qualifying life event such as job loss, marriage, or birth of a child." },
      { q: "What is a deductible?", a: "The amount you pay out-of-pocket for covered healthcare services before your insurance begins to pay. Higher deductible plans typically have lower monthly premiums." },
      { q: "Does SGGINV offer group health plans for small businesses?", a: "Yes — we offer group health insurance for businesses with 2 or more employees. Our advisors can design a plan that fits your budget and workforce." },
      { q: "What is an HSA and how does it work?", a: "A Health Savings Account lets you contribute pre-tax money to pay for qualified medical expenses. Funds roll over year to year and can be invested for long-term growth." },
    ],
    cta: "Explore Health Insurance Options",
  },
};

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "26px 24px" }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 16 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={icon} /></svg>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15.5, color: DARK, marginBottom: 7 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

export default async function InsurancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) notFound();

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: page.hero, padding: "88px 32px 56px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>Insurance</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 56px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 680 }}>{page.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 540, margin: "0 0 40px" }}>{page.subtitle}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>{page.cta}</button>
            <button style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, cursor: "pointer" }}>Speak with an advisor</button>
          </div>
        </div>
      </div>

      {/* What's covered */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Coverage</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: "0 0 36px", color: DARK }}>What&apos;s covered</h2>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {page.coverages.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "22px 24px", border: "1px solid rgba(17,24,39,.07)", borderRadius: 16 }}>
                <div style={{ flex: "none", width: 36, height: 36, borderRadius: 10, background: "rgba(140,29,37,.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 5 }}>{c.name}</div>
                  <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "60px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Optional Add-ons</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 34px)", letterSpacing: "-.02em", margin: "0 0 28px", color: DARK }}>Customize your coverage</h2>
          <div className="g-3col" style={{ gap: 14 }}>
            {page.addons.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why SGGINV */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Why SGGINV Insurance</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>More than just a policy</h2>
          </div>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {page.features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </div>

      {/* Discounts */}
      <div className="mob-section" style={{ background: "rgba(140,29,37,.04)", padding: "60px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Save More</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: "0 0 18px", color: DARK }}>Available discounts</h2>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.7, margin: 0 }}>Many policyholders save significantly through available discounts. Ask your SGGINV insurance advisor which ones apply to you.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {page.discounts.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 12 }}>
                <div style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: "rgba(140,29,37,.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: DARK }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: 0, color: DARK }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 40px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Get covered today</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Talk to a local SGGINV insurance advisor — no obligation, just honest guidance.</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "16px 40px", borderRadius: 12, cursor: "pointer" }}>{page.cta}</button>
        </div>
      </div>
    </SiteLayout>
  );
}
