import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon,
  IconCards, OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "Up to 3%", l: "Cashback" },
  { v: "$0", l: "Annual fee" },
  { v: "0% APR", l: "12-month intro" },
];

const ACCOUNTS = [
  {
    name: "Community Card",
    tagline: "A simple, no-annual-fee card that earns on everything.",
    rows: [
      ["Annual fee", "$0"],
      ["Cashback", "1% on all purchases"],
      ["Eligibility", "Good credit"],
      ["Intro APR", "0% for 12 months"],
      ["Foreign transaction fee", "None"],
    ] as [string, string][],
    href: "/open-account?account=community-card",
    cta: "Apply for Community Card",
  },
  {
    name: "Rewards Card",
    tagline: "Higher cashback on the categories you spend the most.",
    featured: true,
    rows: [
      ["Annual fee", "$0"],
      ["Cashback", "Up to 3% on groceries & gas"],
      ["Eligibility", "Good–excellent credit"],
      ["Intro APR", "0% for 12 months"],
      ["Foreign transaction fee", "None"],
    ] as [string, string][],
    href: "/open-account?account=rewards-card",
    cta: "Apply for Rewards Card",
  },
];

const FEATURES = [
  { t: "Up to 3% cashback", d: "3% on groceries and gas, 2% on dining and 1% on everything else — automatically.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
  { t: "No annual fee", d: "Keep the rewards, skip the cost. Both cards carry a $0 annual fee.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "0% intro APR", d: "No interest on purchases for the first 12 months — handy for a big purchase or a balance transfer.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Free credit score monitoring", d: "Check your score any time in the app, with no impact to your credit.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Zero-liability fraud protection", d: "24/7 fraud monitoring with real-time alerts, and no liability on unauthorized purchases.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Contactless & digital wallet", d: "Tap to pay with your physical card, or add it to Apple Pay, Google Pay or Samsung Pay.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
];

const STEPS = [
  { t: "Apply in minutes", d: "Complete your application online or in branch. Most people get a decision in seconds." },
  { t: "Receive your card", d: "Your card arrives in 7–10 business days. Activate it instantly and start earning." },
  { t: "Earn and redeem", d: "Cashback is credited to your statement automatically each month — no redemption hoops." },
];

const FAQS = [
  { q: "Do my rewards expire?", a: "No. Your cashback never expires as long as your account stays open and in good standing." },
  { q: "Can I use my card internationally?", a: "Yes. Both cards carry no foreign transaction fees, so you can spend abroad without surcharges." },
  { q: "How do I report a lost or stolen card?", a: "Lock your card instantly in the app, then call our 24/7 card services line to request a replacement." },
  { q: "How long does a balance transfer take?", a: "Balance transfers typically post within 5 to 7 business days after your application is approved." },
  { q: "Will applying affect my credit score?", a: "Checking your eligibility uses a soft search that isn't visible to other lenders. A full application includes a hard credit check." },
];

export default function PersonalCreditCardsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Credit cards"
        title="A card that rewards how you spend"
        subtitle="Cashback on groceries, gas and everyday purchases, with no annual fee and rewards that never expire."
        primary={{ label: "Apply for a card", href: "/open-account" }}
        secondary={{ label: "Compare cards", href: "#accounts" }}
        highlights={HIGHLIGHTS}
        cutout={{ src: "/credit-cards-hero.png", alt: "Two stacked credit cards", maxHeight: 380 }}
      />

      <OverlapSection id="accounts">
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          APR varies based on creditworthiness. See the card agreement for full details.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="More than just a card" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* App */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Manage it your way" title="Your card, controlled from your phone" mb={28} />
            <CheckList
              items={[
                { t: "Freeze your card instantly", d: "Lost it, or just being careful? Freeze and unfreeze in the app any time." },
                { t: "Track cashback in real time", d: "See exactly what you've earned this month, category by category." },
                { t: "Set spend alerts", d: "Get notified the moment your card is used, so nothing catches you by surprise." },
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, background: "#fff", borderRadius: 28, padding: 14, border: "1px solid rgba(17,24,39,.06)" }}>
              <div style={{ background: BLUE, color: "#fff", borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Rewards Card</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, margin: "4px 0 2px" }}>$42.18</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Cashback earned this month</div>
              </div>
              <div style={{ padding: "16px 8px 6px" }}>
                {[
                  ["Grocery store", "−$64.21", "+$1.93"],
                  ["Gas station", "−$41.00", "+$1.23"],
                  ["Coffee shop", "−$4.75", "+$0.10"],
                  ["Online shopping", "−$92.40", "+$0.92"],
                ].map(([n, a, cb]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{n}</div>
                      <div style={{ fontSize: 11.5, color: GRAY }}>{a}</div>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#16A34A" }}>{cb}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StepsSection title="Get your card in three steps" steps={STEPS} />

      {/* Credit disclosure */}
      <section className="mob-section" style={{ background: "#fff", padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", border: `2px solid ${BLUE}`, borderRadius: 8, padding: "28px 32px", display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div style={{ color: BLUE, flex: "none" }}>
            <Icon d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={26} />
          </div>
          <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: DARK }}>Credit is subject to status.</strong> You must be 18 or over and a U.S. resident to apply. APR and credit limit depend on your individual circumstances. Missing payments can affect your credit score and ability to borrow in future.
          </p>
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
        title="Ready to start earning?"
        text="Apply online in minutes, with a decision in seconds for most applicants."
        primary={{ label: "Apply for a card", href: "/open-account" }}
        secondary={{ label: "Compare our accounts", href: "/personal/checking" }}
      />
    </SiteLayout>
  );
}
