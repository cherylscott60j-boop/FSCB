import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  AccountCards, BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards, Icon,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

const ACCOUNTS = [
  {
    name: "Everyday Checking",
    tagline: "Simple, fee-free banking for day-to-day spending.",
    rows: [
      ["Monthly fee", "£0"],
      ["Minimum balance", "None"],
      ["Opening deposit", "Any amount"],
      ["Early pay", "Up to 2 days"],
      ["Contactless debit card", "Included"],
    ] as [string, string][],
    href: "/open-account?account=free-checking",
    cta: "Open Everyday Checking",
  },
  {
    name: "Premium Checking",
    tagline: "Extra perks for people who bank with us for everything.",
    featured: true,
    rows: [
      ["Monthly fee", "£0 with qualifying balance*"],
      ["Minimum balance", "£500 average daily"],
      ["Opening deposit", "£25"],
      ["ATM fee refunds", "Up to £15 / month"],
      ["Foreign card fees", "2 free each month"],
    ] as [string, string][],
    href: "/open-account?account=premium-checking",
    cta: "Open Premium Checking",
  },
];

const FEATURES = [
  { t: "No monthly fees", d: "No maintenance fees and no minimum balance on Everyday Checking.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Get paid early", d: "Set up direct deposit and receive your pay up to 2 days early.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { t: "Card controls", d: "Freeze and unfreeze your debit card instantly in the app.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
  { t: "Send money fast", d: "Pay friends and family in seconds using just their phone number or email.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { t: "Fee-free ATMs", d: "Withdraw cash for free at thousands of ATMs in our partner network.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" },
  { t: "Overdraft cover", d: "Link a savings account to cover payments when your balance runs low.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
];

const APP_BENEFITS = [
  { t: "Spending insights", d: "See where your money goes, with purchases sorted into categories automatically." },
  { t: "Instant notifications", d: "Get an alert every time your card is used or money arrives." },
  { t: "Mobile check deposit", d: "Snap a photo of a check to deposit it without visiting a branch." },
  { t: "Bill pay", d: "Schedule one-off or recurring payments to any company or person." },
];

const STEPS = [
  { t: "Apply online", d: "It takes about 5 minutes. Have your ID and Social Security number ready." },
  { t: "Add money", d: "Transfer from another bank or deposit a check in the app." },
  { t: "Start spending", d: "Use your digital card straight away. Your physical card arrives in 5–7 days." },
];

const FAQS = [
  { q: "Is there a minimum opening deposit?", a: "You can open Everyday Checking with any amount. Premium Checking needs £25 to open." },
  { q: "How does early pay work?", a: "When your employer sends pay electronically, we make it available as soon as we receive notice, up to 2 business days before payday." },
  { q: "What happens if I go overdrawn?", a: "If you've linked a savings account, we move money across automatically. Without it, payments that would overdraw your account are declined, so you're never charged an overdraft fee." },
  { q: "How is the Premium Checking fee waived?", a: "The monthly fee is waived when you keep a £500 average daily balance or receive £1,500 in direct deposits that month." },
  { q: "Can I use my debit card abroad?", a: "Yes, your card works wherever card payments are accepted. Premium Checking customers get two foreign transaction fees waived each month." },
  { q: "Can I open a joint account?", a: "Yes. You can add a joint owner when you apply or at any time afterwards. Both owners have full access to the account." },
];

export default function CheckingPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Checking accounts"
        title="Everyday banking that doesn't cost you a thing"
        subtitle="No monthly fees, no minimum balance and your pay up to 2 days early. Open an account online in minutes."
        primary={{ label: "Open an account", href: "/open-account" }}
        secondary={{ label: "Compare accounts", href: "#accounts" }}
        highlights={[
          { v: "£0", l: "Monthly fees" },
          { v: "2 days", l: "Early pay" },
          { v: "5 min", l: "To apply online" },
        ]}
      />

      <OverlapSection id="accounts">
        <AccountCards accounts={ACCOUNTS} />
        <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
          * Monthly fee waived with a £500 average daily balance or £1,500 in monthly direct deposits. Otherwise £9.
        </p>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="What's included" title="Everything you need, nothing you don't" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* App */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Bank on the go" title="Your account in your pocket" mb={28} />
            <CheckList items={APP_BENEFITS} />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, background: "#fff", borderRadius: 28, padding: 14, border: "1px solid rgba(17,24,39,.06)" }}>
              <div style={{ background: BLUE, color: "#fff", borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Everyday Checking</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, margin: "4px 0 2px" }}>£2,418.60</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Available balance</div>
              </div>
              <div style={{ padding: "16px 8px 6px" }}>
                {[
                  ["Payroll deposit", "+£1,850.00", "Today"],
                  ["Grocery store", "−£64.21", "Yesterday"],
                  ["Coffee shop", "−£4.75", "Yesterday"],
                  ["Electric bill", "−£92.40", "Mon"],
                ].map(([n, a, d]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{n}</div>
                      <div style={{ fontSize: 11.5, color: GRAY }}>{d}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: a.startsWith("+") ? BLUE : DARK }}>{a}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 0 4px", color: BLUE }}>
                <Icon d="M3 12l9-8 9 8M5 10v10h14V10" size={20} />
                <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={20} />
                <Icon d="M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" size={20} />
                <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StepsSection title="Open an account in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Ready to switch your everyday banking?"
        text="Open a checking account online in about 5 minutes."
        primary={{ label: "Open an account", href: "/open-account" }}
        secondary={{ label: "Talk to us", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
