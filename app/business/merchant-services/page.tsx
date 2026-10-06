import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const HIGHLIGHTS = [
  { v: "Next-day", l: "Funding" },
  { v: "All major", l: "Cards accepted" },
  { v: "24/7", l: "Merchant support" },
];

const FEES = [
  ["In person (debit cards)", "1.39%"],
  ["In person (credit cards)", "1.69%"],
  ["Online payments", "1.49% + 20¢"],
  ["Card reader", "$29 one-off"],
  ["Money in your account", "Next business day"],
];

const FEATURES = [
  { t: "Accept every payment type", d: "Visa, Mastercard, Amex, Discover, mobile wallets and tap-to-pay cards.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Next-day funding", d: "Sales processed before 10pm are funded to your account by the next business morning.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { t: "Point-of-sale systems", d: "From countertop terminals to full tablet POS — matched to your business type.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "Mobile card readers", d: "Accept payments on your phone or tablet — perfect for markets and deliveries.", icon: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { t: "Online payment gateway", d: "Integrate secure payment processing into your website or booking platform.", icon: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" },
  { t: "Detailed reporting", d: "Real-time sales reports, transaction history and reconciliation tools.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
];

const BENEFITS = [
  { t: "No monthly contract", d: "No long-term commitment and no minimum term on your merchant account." },
  { t: "24/7 merchant support", d: "Terminal issues, disputes or urgent processing questions — always answered." },
  { t: "Fast chargeback help", d: "We guide you through disputes and help you respond with the right documentation." },
  { t: "Tipping & split payments", d: "Our POS systems support tipping, split payments and itemized receipts." },
];

const STEPS = [
  { t: "Get a free rate comparison", d: "Share your current processing statements and see what you'd save by switching." },
  { t: "Choose your equipment", d: "We help you pick the right terminals, POS systems or mobile readers." },
  { t: "Start accepting payments", d: "Setup and training are included. You're operational within 3–5 business days." },
];

const FAQS = [
  { q: "Do I need a business account to use merchant services?", a: "It's strongly recommended — next-day funding works fastest when deposits go directly to your business checking account." },
  { q: "What if I need help after hours?", a: "Our 24/7 merchant support line is always available for terminal issues, charge disputes or urgent processing questions." },
  { q: "Can I accept tips and split payments?", a: "Yes. Our POS systems support tipping, split payments and itemized receipts out of the box." },
  { q: "What if a customer disputes a charge?", a: "We guide you through the chargeback process and help you respond with the documentation needed to protect your revenue." },
  { q: "How quickly am I funded?", a: "Sales processed before 10pm are typically funded to your account by the next business morning." },
];

export default function MerchantServicesPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Business banking"
        title="Accept every payment, anywhere"
        subtitle="Card, contactless and online payments with next-day funding to your business account and support around the clock."
        primary={{ label: "Get a rate comparison", href: "/about/contact" }}
        secondary={{ label: "See pricing", href: "#pricing" }}
        highlights={HIGHLIGHTS}
        image={{ src: "/merchant-services-hero.jpg", alt: "A customer paying with a mobile wallet", position: "60% 40%" }}
      />

      <OverlapSection id="pricing" maxWidth={720}>
        <div style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "8px 24px 16px", background: "#fff" }}>
          {FEES.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "13px 0", borderTop: i ? "1px solid rgba(17,24,39,.08)" : "none", fontSize: 14.5 }}>
              <span style={{ color: GRAY }}>{k}</span>
              <span style={{ fontWeight: 600, color: DARK, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          Example fees. Rates vary based on business type, volume and card mix — a merchant services advisor will give you a free rate analysis.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Getting paid should be the easy part" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* Benefits */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="Why bank with us" title="Support when you need it" mb={28} />
          <CheckList items={BENEFITS} />
        </div>
      </section>

      <StepsSection title="Start accepting payments in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to start accepting payments?"
        text="Get a free rate comparison from our merchant services team."
        primary={{ label: "Get a rate comparison", href: "/about/contact" }}
        secondary={{ label: "Open a business account", href: "/open-account" }}
      />
    </SiteLayout>
  );
}
