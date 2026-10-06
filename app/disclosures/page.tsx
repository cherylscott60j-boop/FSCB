import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import LegalSections, { type LegalSection } from "@/components/product/LegalSections";
import {
  BLUE, ClosingCTA, DARK, FONT, GRAY, Icon,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const KEY_POINTS = [
  { t: "Investments can fall", d: "The value of investments can go down as well as up.", icon: "M4 5v14h16M8 9l3 4 3-2 4 5" },
  { t: "Rates are examples", d: "Rates, fees and figures on this website are illustrative.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" },
  { t: "24/7 fraud support", d: "Call (555) 302-1911 any time if something doesn't look right.", icon: "M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  { t: "We'll never ask you to move money", d: "Not to a 'safe account', and never to release funds or returns.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
];

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About this bank",
    body: [
      { p: "Safeguard Global Investment Bank is a U.S. banking institution providing financial and investment services to individuals and businesses.  Safeguard Global Investment Bank is authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority.  Registered in England and Wales. Registered Office: 143 Financial Street, London, UK." },
      { p: "All transactions, or share real personal or financial information are protected." },
    ],
  },
  {
    id: "deposits",
    title: "Deposits",
    body: [
      { p: "Money shown in accounts on this website is are protected. All account is covered by  deposit protection or insurance." },
    ],
  },
  {
    id: "investments",
    title: "Investments",
    body: [
      { p: "Investment products described on this website are:" },
      {
        list: [
          { t: "Not bank deposits", d: "They are not savings accounts and don't earn a guaranteed rate of interest." },
          { t: "Not covered by any protection scheme", d: "No deposit protection or investor compensation scheme applies." },
          { t: "Not guaranteed", d: "Their value can go down as well as up, and you may get back less than you invest." },
          { t: "Not a guide to the future", d: "Past performance is not a reliable indicator of future returns." },
        ],
      },
      { p: "We never ask anyone to pay a fee, or to move money, in order to release investment returns. Anyone who does is a scammer." },
    ],
  },
  {
    id: "rates",
    title: "Rates and representative examples",
    body: [
      { p: "Rates shown on this website are examples. The rate you'd be offered depends on your circumstances, how much you borrow and for how long. Here's how we explain the terms we use:" },
      {
        list: [
          { t: "APR (annual percentage rate)", d: "The yearly cost of borrowing, including interest and any compulsory fees. Use it to compare loans." },
          { t: "AER (annual equivalent rate)", d: "What a savings rate would be if interest were paid and compounded once a year. Use it to compare savings accounts." },
          { t: "EAR (effective annual rate)", d: "The yearly interest rate on an overdraft, including the effect of compounding." },
        ],
      },
      { p: "Representative example for a personal loan:" },
      {
        table: [
          ["Amount borrowed", "$10,000"],
          ["Term", "60 months"],
          ["Representative APR", "9.9% (fixed)"],
          ["Monthly repayment", "$209.91"],
          ["Total amount repayable", "$12,594.46"],
          ["Total interest", "$2,594.46"],
        ],
      },
    ],
  },
  {
    id: "fees",
    title: "Fees summary",
    body: [
      { p: "These are the main fees for our personal and business accounts. Full details are included in each product's terms." },
      {
        table: [
          ["Everyday Checking monthly fee", "$0"],
          ["Premium Checking monthly fee", "$9 (waived with a qualifying balance)"],
          ["Money Market monthly fee", "$5 if your balance is below $2,500"],
          ["Business Everyday monthly fee", "$6 (free for your first 12 months)"],
          ["Replacement debit card", "Free"],
          ["Replacement safe deposit box key", "$25"],
          ["International payment (business)", "$15 above any free allowance"],
        ],
      },
    ],
  },
  {
    id: "fair",
    title: "Treating customers fairly",
    body: [
      { p: "We assess every application on its merits. We don't discriminate on the basis of age, disability, gender, gender reassignment, marriage or civil partnership, pregnancy, race, religion or belief, or sexual orientation." },
      { p: "If you need us to make adjustments because of a disability or your circumstances, please see our accessibility and extra support pages." },
    ],
  },
  {
    id: "details",
    title: "Your account details",
    body: [
      { p: "Your sort code and account number are shown in the app and in online banking. Only share them with people you want to receive payments from." },
      {
        list: [
          { t: "We'll never ask you to move money", d: "Not to a 'safe account', and not to protect it from fraud." },
          { t: "Check before you pay", d: "If a company emails to say their bank details have changed, call them on a number you trust before paying." },
          { t: "Report anything suspicious", d: "Call our fraud team on (555) 302-1911, 24 hours a day." },
        ],
      },
    ],
  },
  {
    id: "complaints",
    title: "Complaints",
    body: [
      { p: "If you're unhappy with any part of our service, please tell us by phone, in branch, through our contact form or by post. We'll acknowledge your complaint within 2 business days and aim to resolve it within 15." },
    ],
  },
];

const FAQS = [
  { q: "Is my money protected?", a: "YES. Safeguard Global Investment Bank is a FDIC INSURED bank and your account is covered by FDIC." },
  { q: "Are the rates on this website real?", a: "No. All rates, fees and calculator results are illustrative ." },
  { q: "What's the difference between APR and AER?", a: "APR shows the yearly cost of borrowing, including fees. AER shows what a savings rate would be if interest were paid once a year. Use APR to compare loans and AER to compare savings." },
  { q: "How do I make a complaint?", a: "Contact us by phone on (555) 302-1900, in any branch, through our contact form or by post. We'll acknowledge it within 2 business days." },
];

export default function DisclosuresPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Disclosures"
        title="Important information about our products"
        subtitle="Key facts about deposits, investments, rates and fees, and how to keep your account safe. Please read this alongside each product's terms."
        primary={{ label: "Read the disclosures", href: "#disclosures" }}
        secondary={{ label: "Fees summary", href: "#fees" }}
        highlights={[
          { v: "Oct 2026", l: "Last updated" },
          { v: `${SECTIONS.length}`, l: "Sections" },
        ]}
      />

      {/* Key points */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {KEY_POINTS.map((c, i) => (
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

      <LegalSections id="disclosures" sections={SECTIONS} />

      {/* Related */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Contact us</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 20px", letterSpacing: "-.01em" }}>Questions about this information?</h3>
            {[
              ["Phone", "(555) 302-1900"],
              ["Fraud line (24/7)", "(555) 302-1911"],
              ["Email", "help@sgginv.com"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "13px 0", borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 15 }}>
                <span style={{ color: "rgba(255,255,255,.72)" }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 12 }}>Related</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 20px", color: DARK, letterSpacing: "-.01em" }}>Other important information</h3>
            {[
              ["Terms of use", "/terms"],
              ["Privacy notice", "/privacy"],
              ["Accessibility", "/accessibility"],
              ["Extra support", "/extra-support"],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderTop: "1px solid rgba(17,24,39,.08)", fontSize: 15, fontWeight: 600, color: DARK, textDecoration: "none" }}>
                {label}
                <span style={{ color: BLUE }}><Icon d="M9 5l7 7-7 7" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
          <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 28 }}>This information was last updated in October 2026.</p>
        </div>
      </section>

      <ClosingCTA
        title="Have a question?"
        text="Our team is happy to explain anything on this page."
        primary={{ label: "Contact us", href: "/about/contact" }}
        secondary={{ label: "Find a branch", href: "/about/contact#branches" }}
      />
    </SiteLayout>
  );
}
