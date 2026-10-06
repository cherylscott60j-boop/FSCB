import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const TOP_TASKS = [
  { t: "Check balances", d: "See every account and recent transaction at a glance.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
  { t: "Deposit checks", d: "Take a photo of a check and deposit it in seconds.", icon: "M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Pay bills", d: "Pay any company or person, once or on a schedule.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
  { t: "Send money", d: "Move money between accounts or pay friends instantly.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
];

const FEATURES = [
  { t: "Real-time alerts", d: "Get notified about purchases, deposits, low balances and anything unusual.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 0 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" },
  { t: "Card controls", d: "Freeze your card, set spending limits and turn off online or overseas payments.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Spending insights", d: "Purchases are sorted into categories so you can see where your money goes.", icon: "M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" },
  { t: "Budgets and goals", d: "Set monthly budgets and savings goals and track your progress.", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
  { t: "Statements and documents", d: "Download statements, tax forms and letters whenever you need them.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" },
  { t: "Secure messaging", d: "Chat with our team inside the app, any time of day.", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

const SECURITY = [
  { t: "Fingerprint and face login", d: "Sign in to the app quickly and securely with your phone's biometrics." },
  { t: "Two-step verification", d: "New devices and large payments are confirmed with a one-time code." },
  { t: "Encrypted connection", d: "Everything you send and receive is encrypted between your device and us." },
  { t: "Automatic sign-out", d: "You're signed out after a few minutes of inactivity." },
];

const COMPARE: [string, boolean, boolean][] = [
  ["Check balances & transactions", true, true],
  ["Transfers & bill pay", true, true],
  ["Download statements", true, true],
  ["Secure messaging", true, true],
  ["Mobile check deposit", false, true],
  ["Fingerprint & face login", false, true],
  ["Instant card freeze", true, true],
  ["Push notifications", false, true],
];

const STEPS = [
  { t: "Download the app or go online", d: "The app is free for iPhone and Android. You can also sign up on our website." },
  { t: "Verify your identity", d: "Enter your account number, date of birth and the last 4 digits of your Social Security number." },
  { t: "Create your login", d: "Choose a username and password, then turn on fingerprint or face login." },
];

const FAQS = [
  { q: "Is online and mobile banking free?", a: "Yes. There's no charge to use online banking or the app, and no fee for bill pay or transfers between your accounts." },
  { q: "Which phones does the app work on?", a: "The app works on iPhones running iOS 16 or later and Android phones running Android 10 or later." },
  { q: "How long do mobile check deposits take?", a: "Checks deposited before 8pm ET on a business day are usually available the next business day. Keep the paper check for 14 days, then destroy it." },
  { q: "Is there a limit on mobile deposits?", a: "You can deposit up to $5,000 a day and $15,000 over 30 days using the app. Limits may be higher for long-standing customers." },
  { q: "What should I do if I forget my password?", a: "Tap 'Forgot password' on the login screen. We'll verify your identity and let you set a new password in a few minutes." },
  { q: "What if I lose my phone?", a: "Call us on (555) 302-1920 and we'll block app access from that device. Your accounts are still protected by your password and two-step verification." },
];

export default function OnlineBankingPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Online & mobile banking"
        title="Your bank in your pocket, whenever you need it"
        subtitle="Check balances, deposit checks, pay bills and control your cards from your phone or computer, all for free."
        primary={{ label: "Log in or sign up", href: "/login" }}
        secondary={{ label: "See what you can do", href: "#features" }}
        highlights={[
          { v: "24/7", l: "Access to your accounts" },
          { v: "$0", l: "To use" },
          { v: "2 min", l: "To sign up" },
        ]}
      />

      {/* Top tasks */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {TOP_TASKS.map((c, i) => (
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

      {/* Features */}
      <section id="features" className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Everything you need to manage your money" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* App preview */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 290, background: "#fff", borderRadius: 28, padding: 14, border: "1px solid rgba(17,24,39,.1)" }}>
              <div style={{ padding: "8px 8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, color: DARK }}>Good morning, Alex</div>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
              </div>
              {[
                ["Everyday Checking", "$2,418.60"],
                ["Everyday Savings", "$8,205.12"],
              ].map(([n, v], i) => (
                <div key={n} style={{ background: i ? TINT : BLUE, color: i ? DARK : "#fff", borderRadius: 14, padding: "16px 16px", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{n}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24 }}>{v}</div>
                </div>
              ))}
              <div style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: ".06em", margin: "14px 8px 4px" }}>Notifications</div>
              {[
                ["Card used at Grocery store", "$64.21 · 2 min ago"],
                ["Paycheck received", "$1,850.00 · Today"],
                ["Electric bill paid", "$92.40 · Mon"],
              ].map(([t, s]) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderTop: "1px solid rgba(17,24,39,.06)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE, flex: "none" }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{t}</div>
                    <div style={{ fontSize: 11.5, color: GRAY }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="Security" title="Protected every time you log in" mb={28} />
            <CheckList items={SECURITY} />
          </div>
        </div>
      </section>

      <StepsSection title="Get set up in three steps" steps={STEPS} />

      {/* Compare */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="Compare" title="Online banking or the app?" />
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)", background: "#fff" }}>
            <div className="mob-table-wrap">
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 24px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                <div>Feature</div>
                <div style={{ textAlign: "center" }}>Online</div>
                <div style={{ textAlign: "center" }}>App</div>
              </div>
              {COMPARE.map(([f, web, app], i) => (
                <div key={f} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, color: DARK }}>{f}</div>
                  {[web, app].map((on, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "center", color: on ? BLUE : "#C4C7D0" }}>
                      {on ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Start banking from anywhere"
        text="Sign up for online and mobile banking in about 2 minutes."
        primary={{ label: "Log in or sign up", href: "/login" }}
        secondary={{ label: "Need help? Contact us", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
