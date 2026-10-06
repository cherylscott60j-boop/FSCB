import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const PROMISES = [
  { t: "We never sell your data", d: "Your personal information is never sold to anyone.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "You're in control", d: "Choose what marketing you get and change it any time.", icon: "M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4" },
  { t: "Kept secure", d: "Encryption, access controls and regular security testing.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
  { t: "Only what we need", d: "We collect only what's needed to run your accounts and keep you safe.", icon: "M9 12l2 2 4-4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" },
];

const COLLECT = [
  { t: "Identity details", d: "Your name, date of birth, nationality and photo ID, so we can confirm who you are.", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
  { t: "Contact details", d: "Your address, email address and phone number, so we can stay in touch.", icon: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" },
  { t: "Financial details", d: "Your income, account balances, transactions and credit history.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Device and usage", d: "Information about the device and browser you use, and how you use our app and website.", icon: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { t: "Communications", d: "Records of calls, chats, emails and letters between you and us.", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { t: "Information you choose to share", d: "For example, details about your health or circumstances so we can give you extra support.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
];

const USES = [
  { t: "To run your accounts", d: "Opening accounts, making payments, sending statements and providing the services you ask for." },
  { t: "To keep you and your money safe", d: "Checking your identity, preventing fraud and spotting unusual activity." },
  { t: "To meet our legal obligations", d: "Following laws on money laundering, tax reporting and keeping records." },
  { t: "To decide on lending", d: "Assessing whether credit is affordable and suitable for you." },
  { t: "To improve our services", d: "Understanding how our app and website are used so we can make them better." },
  { t: "To tell you about products", d: "Only if you've agreed, and you can stop at any time." },
];

const SHARING: [string, string, string][] = [
  ["Payment networks and other banks", "To make and receive payments you ask for", "No"],
  ["Credit reference agencies", "To check your identity and assess applications for credit", "No"],
  ["Fraud prevention agencies", "To prevent fraud and money laundering", "No"],
  ["Our service providers", "Companies that run IT, printing and customer support for us, under strict contracts", "No"],
  ["Regulators, courts and law enforcement", "When the law requires us to", "No"],
  ["Marketing partners", "We don't share your information with others for their marketing", "—"],
];

const RETENTION: [string, string][] = [
  ["Account and transaction records", "7 years after your account closes"],
  ["Unsuccessful applications", "2 years from the date of application"],
  ["Call recordings", "Up to 5 years"],
  ["Marketing preferences", "Until you change them or close your account"],
  ["Website cookies", "Up to 13 months, depending on the cookie"],
];

const RIGHTS = [
  { t: "See your data", d: "Ask for a copy of the personal information we hold about you, free of charge.", icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { t: "Correct it", d: "Ask us to fix anything that's wrong or incomplete.", icon: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { t: "Delete it", d: "Ask us to delete your information when we no longer need to keep it.", icon: "M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" },
  { t: "Limit how we use it", d: "Ask us to pause using your information while a concern is looked into.", icon: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" },
  { t: "Object", d: "Object to us using your information for marketing or certain other purposes.", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Take it with you", d: "Get your information in a format you can give to another provider.", icon: "M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" },
];

const COOKIES = [
  { t: "Essential cookies", d: "Needed to keep you logged in securely and make the website work. These are always on." },
  { t: "Performance cookies", d: "Help us understand how the website is used so we can improve it. Only with your consent." },
  { t: "Marketing cookies", d: "Used to show you relevant information about our products. Only with your consent." },
];

const SECURITY = [
  { t: "Encryption", d: "Your information is encrypted when it's sent to us and when it's stored." },
  { t: "Strict access", d: "Only staff who need your information to do their job can see it." },
  { t: "Regular testing", d: "Independent experts test our systems for weaknesses." },
  { t: "Secure suppliers", d: "Anyone who handles data for us must meet the same standards." },
];

const FAQS = [
  { q: "How do I get a copy of my data?", a: "Contact our privacy team by email, by mail or in any branch. We'll respond within one month, and there's no charge for most requests." },
  { q: "How do I stop marketing messages?", a: "Change your preferences in the app or online banking, use the unsubscribe link in any email, or contact us. We'll still send messages we need to about your accounts." },
  { q: "Do you transfer my data outside the U.S.?", a: "Some of our service providers process data in other countries. When they do, we make sure your information is protected to the same standard, using approved contract terms." },
  { q: "Do you use automated decisions?", a: "Some decisions, like fraud alerts and initial credit checks, use automated systems. You can ask for a person to review any automated decision that affects you." },
  { q: "What if I'm not happy with how you've used my data?", a: "Tell our privacy team and we'll look into it. If you're still not satisfied, you can complain to the data protection regulator." },
];

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Privacy notice"
        title="How we look after your personal information"
        subtitle="This notice explains what information we collect, why we collect it, who we share it with and the choices you have."
        primary={{ label: "Your privacy rights", href: "#rights" }}
        secondary={{ label: "Contact our privacy team", href: "#contact" }}
        highlights={[
          { v: "Never", l: "Sold to anyone" },
          { v: "1 month", l: "To answer data requests" },
          { v: "Oct 2026", l: "Last updated" },
        ]}
      />

      {/* Promises */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {PROMISES.map((c, i) => (
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

      {/* What we collect */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What we collect" title="The information we hold about you" mb={14} />
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 760 }}>
            We collect information when you apply for a product, use your accounts, contact us or visit our website. We may also receive information from credit reference and fraud prevention agencies.
          </p>
          <IconCards items={COLLECT} />
        </div>
      </section>

      {/* How we use it */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="How we use it" title="Why we use your information" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              We only use your information when we have a good reason to: to provide the products you&apos;ve asked for, to meet our legal duties, when it&apos;s in our legitimate interests and doesn&apos;t override yours, or when you&apos;ve given us permission.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "32px 30px" }}>
            <CheckList items={USES} />
          </div>
        </div>
      </section>

      {/* Sharing */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionTitle eyebrow="Sharing" title="Who we share your information with" mb={14} />
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 28px" }}>
            We only share your information when we need to, and everyone we share it with must keep it safe.
          </p>
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
            <div className="mob-table-wrap">
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr .9fr", padding: "14px 24px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", gap: 16 }}>
                <div>Who</div>
                <div>Why</div>
                <div>Can you opt out?</div>
              </div>
              {SHARING.map(([who, why, opt], i) => (
                <div key={who} style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr .9fr", padding: "16px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none", gap: 16, background: i % 2 ? TINT : "#fff" }}>
                  <div style={{ fontWeight: 600, color: DARK }}>{who}</div>
                  <div style={{ color: GRAY, lineHeight: 1.55 }}>{why}</div>
                  <div style={{ color: DARK }}>{opt}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
            You can&apos;t opt out of sharing that&apos;s needed to run your account or that the law requires.
          </p>
        </div>
      </section>

      {/* Retention */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Keeping your data" title="How long we keep your information" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              We keep your information only for as long as we need it, or as long as the law requires. After that, we securely delete or anonymize it.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "8px 28px" }}>
            {RETENTION.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "16px 0", borderTop: i ? "1px solid rgba(17,24,39,.08)" : "none", fontSize: 14.5 }}>
                <span style={{ color: DARK, fontWeight: 600 }}>{k}</span>
                <span style={{ color: GRAY, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rights */}
      <section id="rights" className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Your rights" title="You're in control of your information" mb={14} />
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 760 }}>
            You have rights over the personal information we hold about you. To use any of them, contact our privacy team. We&apos;ll respond within one month.
          </p>
          <IconCards items={RIGHTS} />
        </div>
      </section>

      {/* Cookies + security */}
      <section id="cookies" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Cookies" title="How we use cookies" mb={28} />
            <CheckList items={COOKIES} />
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, margin: "22px 0 0" }}>
              You can change your cookie choices at any time by clearing your cookie preferences in your browser, which brings back the cookie banner.
            </p>
          </div>
          <div>
            <SectionTitle eyebrow="Security" title="How we protect your information" mb={28} />
            <CheckList items={SECURITY} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Contact us</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 20px", letterSpacing: "-.01em" }}>Questions about your privacy?</h3>
            {[
              ["Email", "privacy@sgginv.com"],
              ["Phone", "(555) 302-1900"],
              ["Mail", "Privacy Team, 102 Main Street, Downtown, ST 00001"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "13px 0", borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 15 }}>
                <span style={{ color: "rgba(255,255,255,.72)" }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 12 }}>Complaints</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 16px", color: DARK, letterSpacing: "-.01em" }}>Not happy with how we&apos;ve used your data?</h3>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.7, margin: "0 0 16px" }}>
              Please tell us first so we can put things right. We&apos;ll acknowledge your complaint within 2 business days.
            </p>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              If you&apos;re still not satisfied, you have the right to complain to the data protection regulator.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
          <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 28 }}>
            This notice was last updated in October 2026. See also our <Link href="/terms" style={{ color: BLUE, fontWeight: 600 }}>terms of use</Link>.
          </p>
        </div>
      </section>

      <ClosingCTA
        title="Manage your privacy settings"
        text="Change your marketing and cookie preferences in the app or online banking."
        primary={{ label: "Log in", href: "/login" }}
        secondary={{ label: "Contact us", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
