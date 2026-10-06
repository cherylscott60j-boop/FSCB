import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "6", l: "Core coverage types" },
  { v: "Custom", l: "Industry programs" },
  { v: "24/7", l: "Claims support" },
];

const COVERAGES = [
  { t: "General liability", d: "Covers third-party bodily injury, property damage and advertising injury claims.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Commercial property", d: "Protects your building, equipment and inventory against fire, theft and other perils.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" },
  { t: "Business interruption", d: "Replaces lost income and covers expenses if you're temporarily shut down by a covered loss.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Workers' compensation", d: "Covers medical bills and lost wages for employees injured on the job.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Professional liability", d: "Protects service businesses from claims of negligence, errors or inadequate work.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { t: "Equipment breakdown", d: "Covers the cost of repairing or replacing equipment damaged by a mechanical or electrical failure.", icon: "M10.3 4.3c.4-1.7 2.9-1.7 3.3 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.2.8 2.3 2.3a1.7 1.7 0 0 0 1 2.6c1.7.4 1.7 2.9 0 3.3a1.7 1.7 0 0 0-1 2.6c.9 1.5-.8 3.2-2.3 2.3a1.7 1.7 0 0 0-2.6 1c-.4 1.7-2.9 1.7-3.3 0a1.7 1.7 0 0 0-2.6-1c-1.5.9-3.2-.8-2.3-2.3a1.7 1.7 0 0 0-1-2.6c-1.7-.4-1.7-2.9 0-3.3a1.7 1.7 0 0 0 1-2.6c-.9-1.5.8-3.2 2.3-2.3.9.6 2.2.1 2.6-1z" },
];

const ADDONS = [
  "Cyber liability insurance", "Commercial umbrella policy", "Directors & officers cover",
  "Employment practices liability", "Commercial auto insurance", "Product liability cover",
];

const BENEFITS = [
  { t: "Bundle and save", d: "Combine general liability and commercial property in one policy at a lower combined rate." },
  { t: "Industry-specific programs", d: "Specialized coverage for restaurants, contractors, healthcare, retail and professional services." },
  { t: "A risk assessment, free", d: "An advisor reviews your business to identify gaps before you ever make a claim." },
  { t: "Claims advocacy", d: "We advocate on your behalf through the claims process for a faster, fairer resolution." },
];

const STEPS = [
  { t: "Tell us about your business", d: "Industry, revenue, headcount and the assets you want to protect — about 10 minutes." },
  { t: "Get a tailored quote", d: "An advisor matches coverage to your risk, with no pressure to over-insure." },
  { t: "Get covered", d: "Your policy documents are available straight away once you sign." },
];

const FAQS = [
  { q: "What's the difference between a bundled policy and separate policies?", a: "A bundled policy combines general liability and commercial property at a lower combined rate. Businesses with unique risks may still need separate policies for more tailored coverage." },
  { q: "Is workers' compensation required?", a: "In most states, yes, if you have employees. Requirements vary by state and business type — an advisor can confirm what applies to you." },
  { q: "What is cyber liability insurance?", a: "It covers the costs of data breaches and ransomware attacks, including notification costs and regulatory fines. It's increasingly important for businesses of any size." },
  { q: "How is my premium calculated?", a: "Key factors include business type, annual revenue, number of employees, claims history, location and the coverage limits you choose." },
  { q: "How do I file a claim?", a: "Call our 24/7 claims line or use online banking. A dedicated adjuster is assigned to your claim." },
];

export default function BusinessInsurancePage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Insurance"
        title="Protect your business from the unexpected"
        subtitle="Liability, property, business interruption and more — commercial coverage built around your industry."
        primary={{ label: "Get a quote", href: "/about/contact" }}
        secondary={{ label: "See what's covered", href: "#coverage" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/insurance-business-hero.jpg", alt: "A city skyline at dusk", position: "center" }}
      />

      <OverlapSection id="coverage">
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.1)", padding: "40px 36px" }}>
          <SectionTitle eyebrow="Coverage" title="What's covered" mb={28} />
          <IconCards items={COVERAGES} />
        </div>
      </OverlapSection>

      {/* Add-ons */}
      <section className="mob-section" style={{ background: "#fff", padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Optional add-ons" title="Customize your coverage" mb={24} />
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {ADDONS.map((a) => (
              <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, background: TINT, borderRadius: 8, padding: "16px 18px", fontWeight: 600, fontSize: 14.5, color: DARK }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE, flex: "none" }} />
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="Why insure with us" title="More than just a policy" mb={28} />
          <CheckList items={BENEFITS} />
        </div>
      </section>

      <StepsSection title="Get covered in three steps" steps={STEPS} cta={{ label: "Get a quote", href: "/about/contact" }} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to get covered?"
        text="Talk to an advisor for honest guidance — no obligation."
        primary={{ label: "Get a quote", href: "/about/contact" }}
        secondary={{ label: "Talk to an advisor", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
