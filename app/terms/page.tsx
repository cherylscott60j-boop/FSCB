import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import LegalSections, { type LegalSection } from "@/components/product/LegalSections";
import {
  BLUE, ClosingCTA, DARK, FONT, GRAY, Icon,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const SUMMARY = [
  { t: "Use it lawfully", d: "Use our website and app for your own banking, and nothing illegal or harmful.", icon: "M9 12l2 2 4-4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" },
  { t: "Keep your login safe", d: "Never share your password, PIN or one-time codes with anyone.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
  { t: "Information, not advice", d: "Our website explains our products but isn't personal financial advice.", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Product terms apply too", d: "Each account or loan has its own terms, which you'll get before you sign up.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" },
];

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: [
      { p: "These terms explain how you can use our website and mobile app. By using them, you agree to these terms. If you don't agree, please don't use our website or app." },
      { p: "These terms cover the website and app themselves. The accounts, loans and other products you hold with us have their own terms and conditions, which you'll receive before you open them. If anything in these terms conflicts with your product terms, your product terms apply." },
    ],
  },
  {
    id: "who",
    title: "Who we are",
    body: [
      { p: "Safeguard Global Investment Bank provides secure banking and financial services designed to support individuals, businesses, and investors.We are committed to maintaining high standards of security, transparency, regulatory compliance, and responsible financial service." },
    ],
  },
  {
    id: "use",
    title: "Using our website and app",
    body: [
      { p: "You may use our website and app to:" },
      {
        list: [
          { t: "Find out about our products", d: "Read about our accounts, loans, mortgages and other services." },
          { t: "Apply for products", d: "Complete applications for accounts and lending online." },
          { t: "Manage your accounts", d: "Use online and mobile banking to check balances, make payments and manage your cards." },
          { t: "Contact us", d: "Send us messages and use our tools and calculators." },
        ],
      },
      { p: "You must not use our website or app to break the law, to try to access accounts or systems you're not allowed to, to upload anything harmful such as viruses, or to copy, scrape or resell our content." },
    ],
  },
  {
    id: "security",
    title: "Keeping your account secure",
    body: [
      { p: "You're responsible for keeping your login details safe. In particular:" },
      {
        list: [
          { t: "Keep your details private", d: "Don't share your password, PIN or one-time codes with anyone, including people who say they're from the bank." },
          { t: "Use a secure device", d: "Keep your device's software up to date and use a screen lock." },
          { t: "Log out when you're done", d: "Especially on shared or public devices." },
          { t: "Tell us straight away", d: "Call (555) 302-1911 at any time if you think someone else knows your details or has used your account." },
        ],
      },
      { p: "We may suspend access to online banking if we think your account is at risk, and we'll tell you why unless the law stops us." },
    ],
  },
  {
    id: "content",
    title: "Our content",
    body: [
      { p: "The content on our website and app, including text, images, logos and software, belongs to us or the people who license it to us. You can view and print pages for your own personal use, but you can't copy, change or share our content for any other purpose without our written permission." },
    ],
  },
  {
    id: "advice",
    title: "Rates, information and advice",
    body: [
      { p: "We work hard to keep the information on our website accurate and up to date, but rates, fees and product features can change. The terms you're offered when you apply are the ones that apply to you." },
      { p: "Calculators and examples on our website are for illustration only. Nothing on our website is personal financial, tax or legal advice. If you're not sure whether a product is right for you, please speak to a qualified adviser." },
    ],
  },
  {
    id: "links",
    title: "Links to other websites",
    body: [
      { p: "Our website may link to websites run by other organizations. We don't control those websites and aren't responsible for their content or how they use your information. Please read their own terms and privacy notices." },
    ],
  },
  {
    id: "availability",
    title: "Availability",
    body: [
      { p: "We aim to keep our website and app available at all times, but we can't promise they'll never be interrupted. We sometimes need to carry out maintenance, which we'll try to do overnight. You can check the current status of our services on our service status page." },
    ],
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: [
      { p: "We're responsible for losses you suffer as a direct and foreseeable result of us breaking these terms or not taking reasonable care. We're not responsible for losses caused by things outside our reasonable control, or for business losses if you use our personal website for business purposes." },
      { p: "Nothing in these terms limits our responsibility where it would be unlawful to do so, or affects your legal rights as a consumer." },
    ],
  },
  {
    id: "communications",
    title: "Electronic communications",
    body: [
      { p: "By using online banking, you agree that we can send you statements, notices and other documents electronically, through the app, online banking or by email. You can ask for paper copies at any time." },
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      { p: "We may update these terms from time to time, for example to reflect new features or changes in the law. We'll show the date of the latest version at the top of this page, and tell you about any important changes before they take effect." },
    ],
  },
  {
    id: "law",
    title: "Law and disputes",
    body: [
      { p: "These terms are governed by the laws of the State of Delaware and applicable U.S. federal law. If you have a complaint, please contact us first so we can try to put things right." },
    ],
  },
];

const FAQS = [
  { q: "Do these terms replace my account terms?", a: "No. These terms cover using our website and app. Each product you hold has its own terms and conditions, which apply alongside these." },
  { q: "What should I do if I think someone has accessed my account?", a: "Call us straight away on (555) 302-1911, any time of day. We'll secure your account and help you check for anything you don't recognize." },
  { q: "Can I use your calculators to make decisions?", a: "Our calculators give illustrative figures only. The actual rate and terms you're offered will depend on your circumstances." },
  { q: "How will I know if these terms change?", a: "We'll update the date at the top of this page and tell you about any important changes before they take effect." },
];

export default function TermsPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Terms of use"
        title="The terms for using our website and app"
        subtitle="Please read these terms carefully. They explain what you can expect from us, and what we expect from you, when you use our website and mobile app."
        primary={{ label: "Read the terms", href: "#terms" }}
        secondary={{ label: "Contact us", href: "#contact" }}
        highlights={[
          { v: "Oct 2026", l: "Last updated" },
          { v: `${SECTIONS.length}`, l: "Sections" },
          { v: "5 min", l: "Reading time" },
        ]}
      />

      {/* Summary */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {SUMMARY.map((c, i) => (
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

      <LegalSections id="terms" sections={SECTIONS} />

      {/* Contact */}
      <section id="contact" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Contact us</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 20px", letterSpacing: "-.01em" }}>Questions about these terms?</h3>
            {[
              ["Phone", "(555) 302-1900"],
              ["Email", "customercare@sgginv.com"],
              ["Mail", "Customer Care, 102 Main Street, Downtown, ST 00001"],
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
              ["Privacy notice", "/privacy"],
              ["Accessibility", "/accessibility"],
              ["Disclosures", "/disclosures"],
              ["Service status", "/service-status"],
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
          <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 28 }}>These terms were last updated in October 2026.</p>
        </div>
      </section>

      <ClosingCTA
        title="Need help with online banking?"
        text="Our team is here to help, by phone, chat or at a branch."
        primary={{ label: "Contact us", href: "/about/contact" }}
        secondary={{ label: "Online banking help", href: "/personal/online-banking" }}
      />
    </SiteLayout>
  );
}
