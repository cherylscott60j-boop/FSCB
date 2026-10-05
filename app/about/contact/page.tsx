import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const ICONS = {
  phone: "M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  mail: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
  card: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z",
  pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  clock: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  key: "M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z",
  plus: "M12 4v16m8-8H4",
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  phoneApp: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  coins: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z",
};

const CHANNELS = [
  { title: "Call us", detail: "(555) 302-1900", sub: "Mon–Fri 8am–8pm · Sat 9am–4pm", icon: ICONS.phone },
  { title: "Chat in the app", detail: "Secure messaging", sub: "Available 24/7 for digital banking help", icon: ICONS.chat },
  { title: "Email us", detail: "help@sgginv.com", sub: "We reply within 1 business day", icon: ICONS.mail },
  { title: "Lost or stolen card", detail: "(555) 302-1999", sub: "24 hours a day, 7 days a week", icon: ICONS.card },
];

const QUICK_HELP = [
  { t: "Reset your password", d: "Get back into online banking in a few minutes.", href: "/forgot-password", icon: ICONS.key },
  { t: "Open an account", d: "Apply online for checking or savings in about 5 minutes.", href: "/open-account", icon: ICONS.plus },
  { t: "Personal loans", d: "Check rates and estimate your monthly payment.", href: "/loans/personal", icon: ICONS.coins },
  { t: "Mortgages", d: "Get pre-approved or estimate what you could borrow.", href: "/loans/mortgage", icon: ICONS.home },
  { t: "Online & mobile banking", d: "Set up the app, alerts and bill pay.", href: "/personal/online-banking", icon: ICONS.phoneApp },
  { t: "Fees & disclosures", d: "Read our account terms, fees and policies.", href: "/disclosures", icon: ICONS.doc },
];

const DIRECTORY = [
  ["General banking", "(555) 302-1900", "Mon–Fri 8am–8pm · Sat 9am–4pm"],
  ["Lost or stolen cards", "(555) 302-1999", "24/7"],
  ["Fraud & suspicious activity", "(555) 302-1911", "24/7"],
  ["Online banking support", "(555) 302-1920", "Mon–Sat 7am–10pm"],
  ["Personal loans", "(555) 302-1930", "Mon–Fri 9am–6pm"],
  ["Mortgages", "(555) 302-1935", "Mon–Fri 9am–6pm · Sat 10am–2pm"],
  ["Business banking", "(555) 302-1950", "Mon–Fri 8am–6pm"],
  ["Hearing or speech impaired", "Dial 711 (relay)", "Mon–Fri 8am–8pm"],
];

const BRANCHES = [
  {
    name: "Main Street",
    addr: ["102 Main Street", "Downtown, ST 00001"],
    phone: "(555) 302-1900",
    hours: [["Mon–Fri", "9am – 5pm"], ["Saturday", "9am – 12pm"], ["Sunday", "Closed"]],
    services: ["Full-service banking", "Mortgage center", "Safe deposit boxes", "Drive-through"],
  },
  {
    name: "Westside",
    addr: ["4520 West Oak Avenue", "Westside, ST 00002"],
    phone: "(555) 302-1940",
    hours: [["Mon–Fri", "9am – 6pm"], ["Saturday", "9am – 2pm"], ["Sunday", "Closed"]],
    services: ["Full-service banking", "Drive-through", "Extended hours", "24/7 ATM"],
  },
  {
    name: "Northpark",
    addr: ["8800 Northpark Plaza", "North District, ST 00003"],
    phone: "(555) 302-1960",
    hours: [["Mon–Fri", "9am – 5pm"], ["Saturday", "9am – 12pm"], ["Sunday", "Closed"]],
    services: ["Full-service banking", "Business banking", "Investment advice", "24/7 ATM"],
  },
];

const MESSAGE_POINTS = [
  { t: "A real person reads every message", d: "Your message goes straight to our customer care team." },
  { t: "Routed to the right team", d: "Loan and mortgage questions go directly to our lending specialists." },
  { t: "Already a customer?", d: "Log in and use secure messaging for anything about your account." },
];

const SECURITY = [
  { t: "We'll never ask for your password or PIN", d: "Not by phone, email, text or in the app." },
  { t: "We'll never ask for a one-time code", d: "Codes we send are for you to enter yourself. Never read them out to anyone." },
  { t: "We'll never ask you to move money to keep it safe", d: "Anyone asking you to transfer money to a 'safe account' is a scammer." },
  { t: "We'll never ask you to pay a fee to release funds", d: "Hang up and call us on a number you trust if anyone asks." },
];

const FAQS = [
  { q: "What's the fastest way to reach you?", a: "For account questions, secure messaging in the app is quickest and available 24/7. For urgent issues like a lost card or suspected fraud, call our 24/7 lines." },
  { q: "I think someone has used my card. What should I do?", a: "Freeze your card straight away in the app, then call our fraud team on (555) 302-1911. We'll cancel the card, send a replacement and look into any transactions you don't recognize." },
  { q: "Do I need an appointment to visit a branch?", a: "No appointment is needed for everyday banking. For mortgages, loans or investment advice, booking ahead means a specialist will be ready to see you." },
  { q: "How do I make a complaint?", a: "Tell us by phone, in branch, through the form on this page or by writing to us. We'll acknowledge your complaint within 2 business days and aim to resolve it within 15." },
  { q: "Where should I send post?", a: "Write to Customer Care, Safeguard Global Investment Bank, 102 Main Street, Downtown, ST 00001." },
  { q: "Can someone else contact you on my behalf?", a: "Yes, as long as you've added them as an authorized contact or they hold power of attorney. Visit a branch or call us to set this up." },
];

export default function ContactPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Contact us"
        title="We're here to help, however you'd like to reach us"
        subtitle="Call, chat, email or visit a branch. Find the right team below, or send us a message and we'll get back to you within one business day."
        primary={{ label: "Send us a message", href: "#message" }}
        secondary={{ label: "Find a branch", href: "#branches" }}
        highlights={[
          { v: "24/7", l: "Card & fraud lines" },
          { v: "1 day", l: "Email response" },
          { v: "3", l: "Branches" },
        ]}
      />

      {/* Channels */}
      <OverlapSection maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {CHANNELS.map((c, i) => (
            <div key={c.title} style={{ padding: "30px 28px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={c.icon} size={22} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 6 }}>{c.detail}</div>
              <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Quick help */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Quick help" title="Find what you need fast" />
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {QUICK_HELP.map((q) => (
              <Link key={q.t} href={q.href} style={{ display: "flex", gap: 16, alignItems: "flex-start", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "22px 22px", textDecoration: "none" }}>
                <div style={{ color: BLUE, flex: "none", marginTop: 2 }}>
                  <Icon d={q.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 4 }}>{q.t}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{q.d}</div>
                </div>
                <div style={{ color: BLUE, flex: "none", alignSelf: "center" }}>
                  <Icon d="M9 5l7 7-7 7" size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Message form */}
      <section id="message" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Send a message" title="We'll reply within one business day" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 30px" }}>
              Have a question about an account, a loan or one of our services? Fill in the form and the right person will get back to you.
            </p>
            <CheckList items={MESSAGE_POINTS} />
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Phone directory */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionTitle eyebrow="Phone directory" title="Call the right team first time" />
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
            <div className="mob-table-wrap">
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.4fr", padding: "14px 24px", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                <div>Team</div>
                <div>Number</div>
                <div>Hours</div>
              </div>
              {DIRECTORY.map(([team, num, hours], i) => (
                <div key={team} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.4fr", padding: "16px 24px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none", background: i % 2 ? TINT : "#fff" }}>
                  <div style={{ fontWeight: 600, color: DARK }}>{team}</div>
                  <div style={{ color: BLUE, fontWeight: 600 }}>{num}</div>
                  <div style={{ color: GRAY }}>{hours}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>All times are Eastern Time. Calls may be recorded for training and quality purposes.</p>
        </div>
      </section>

      {/* Branches */}
      <section id="branches" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our branches" title="Visit us in person" />
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {BRANCHES.map((b) => (
              <div key={b.name} style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
                <div style={{ background: BLUE, color: "#fff", padding: "20px 26px" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20 }}>{b.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>Branch</div>
                </div>
                <div style={{ padding: "22px 26px 26px" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12, color: GRAY, fontSize: 14.5, lineHeight: 1.55 }}>
                    <span style={{ color: BLUE, flex: "none" }}><Icon d={ICONS.pin} size={18} /></span>
                    <span>{b.addr[0]}<br />{b.addr[1]}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18, color: GRAY, fontSize: 14.5 }}>
                    <span style={{ color: BLUE, flex: "none" }}><Icon d={ICONS.phone} size={18} /></span>
                    <span>{b.phone}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: DARK, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Opening hours</div>
                  {b.hours.map(([day, h]) => (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid rgba(17,24,39,.06)", fontSize: 14 }}>
                      <span style={{ color: GRAY }}>{day}</span>
                      <span style={{ color: DARK, fontWeight: 600 }}>{h}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
                    {b.services.map((s) => (
                      <span key={s} style={{ fontSize: 12, fontWeight: 600, color: BLUE, background: "rgba(8,0,255,.07)", padding: "4px 10px", borderRadius: 4 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionTitle eyebrow="Stay safe" title="How to know it's really us" mb={18} />
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              Scammers often pretend to be from a bank. If you get a call, text or email that doesn&apos;t feel right, hang up and contact us using the numbers on this page.
            </p>
          </div>
          <div style={{ background: BLUE, borderRadius: 8, padding: "36px 34px" }}>
            {SECURITY.map((s, i) => (
              <div key={s.t} style={{ padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,.18)" : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
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
        title="Not a customer yet?"
        text="Open an account online in minutes, or visit any branch to talk to our team."
        primary={{ label: "Open an account", href: "/open-account" }}
        secondary={{ label: "Find a branch", href: "#branches" }}
      />
    </SiteLayout>
  );
}
