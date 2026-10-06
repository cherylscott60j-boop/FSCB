import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, ClosingCTA, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "Fee-only", l: "Unbiased advice" },
  { v: "2–4 weeks", l: "To a finished plan" },
  { v: "Annual", l: "Plan reviews" },
];

const SERVICES = [
  { t: "Cash flow & budget analysis", d: "See exactly where your money goes and find room to save more.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Debt elimination planning", d: "Prioritize payoff — avalanche vs. snowball, refinancing and mortgage acceleration.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { t: "Education savings planning", d: "529 plan strategy and financial aid planning to fund education tax-efficiently.", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.02 12.02 0 0 1 12 21.5a12.02 12.02 0 0 1-6.16-10.92L12 14z" },
  { t: "Insurance needs analysis", d: "Work out exactly how much life, disability and long-term care cover you need.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Tax planning integration", d: "Identify deductions and strategies across your whole financial picture.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Retirement readiness check", d: "See if you're on track, and what to adjust if you're not.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
];

const GOALS = [
  { t: "Buying a home", d: "Work out what you can afford and how much to save for a down payment.", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { t: "Paying for education", d: "Plan ahead for tuition, whether it's your child's or your own.", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.02 12.02 0 0 1 12 21.5a12.02 12.02 0 0 1-6.16-10.92L12 14z" },
  { t: "Paying off debt faster", d: "A clear, prioritized order to clear what you owe.", icon: "M4 6h16M4 12h16M4 18h10" },
  { t: "Building an emergency fund", d: "Know exactly how much you need and how long it will take to get there.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Preparing for retirement", d: "See if you're saving enough, and what to change if you're not.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Protecting what matters", d: "Make sure your family is covered if the unexpected happens.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
];

const STEPS = [
  { t: "Data gathering", d: "We collect details about your income, expenses, assets, debts, insurance and goals." },
  { t: "Plan development", d: "Our planners build a comprehensive written plan with specific recommendations." },
  { t: "Plan presentation", d: "We walk through every recommendation and prioritize your action steps together." },
  { t: "Annual review", d: "Your plan is updated every year, or whenever a major life event happens." },
];

const FAQS = [
  { q: "How much does financial planning cost?", a: "Comprehensive plans are available on a flat fee, with hourly consulting for specific questions. Contact us for current pricing." },
  { q: "Do I need to invest with you to get a plan?", a: "No. Financial planning is available as a stand-alone service. Many clients keep accounts elsewhere and use us purely for planning advice." },
  { q: "How long does it take to build a plan?", a: "A comprehensive plan typically takes 2 to 4 weeks from initial data gathering to final delivery." },
  { q: "What qualifications do your planners have?", a: "Our lead planners hold recognized financial planning credentials, which require extensive education, experience and a fiduciary standard of care." },
  { q: "Can I just ask about one thing, like debt or a home purchase?", a: "Yes. You don't need a full plan to get help with a specific goal — hourly consulting covers single-topic questions." },
];

export default function FinancialPlanningPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Financial planning"
        title="A clear plan for every financial goal"
        subtitle="From buying a home to paying for education, a personalized roadmap that connects every part of your financial life."
        primary={{ label: "Get your financial plan", href: "/about/contact" }}
        secondary={{ label: "See what's included", href: "#services" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/financial-planning-hero.jpg", alt: "A couple reviewing their finances together at home", position: "55% 40%" }}
      />

      {/* Goals */}
      <OverlapSection maxWidth={1240}>
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.1)", padding: "40px 36px" }}>
          <SectionTitle eyebrow="Common goals" title="What people plan for" mb={28} />
          <IconCards items={GOALS} />
        </div>
      </OverlapSection>

      {/* Services */}
      <section id="services" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="A plan that covers every area of your finances" />
          <IconCards items={SERVICES} />
        </div>
      </section>

      <StepsSection title="How your plan comes together" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready for a clearer financial picture?"
        text="Talk to a planner about building your personalized plan."
        primary={{ label: "Get your financial plan", href: "/about/contact" }}
        secondary={{ label: "Explore investing", href: "/financial/investments" }}
      />
    </SiteLayout>
  );
}
