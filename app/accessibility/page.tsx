import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, Icon, IconCards,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const ICONS = {
  phone: "M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z",
  mail: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
};

const CONTACT = [
  { title: "Accessibility team", detail: "(555) 302-1975", sub: "Mon–Fri 8am–8pm · Sat 9am–4pm", icon: ICONS.phone },
  { title: "TTY / relay", detail: "Dial 711", sub: "Then ask for (555) 302-1975", icon: ICONS.chat },
  { title: "Email", detail: "support@sgginv.com", sub: "We reply within 2 business days", icon: ICONS.mail },
  { title: "At a branch", detail: "Any of our branches", sub: "Staff trained to help with access needs", icon: ICONS.pin },
];

const WEBSITE = [
  { t: "Screen reader friendly", d: "Clear headings, landmarks and text descriptions for meaningful images so screen readers can navigate easily.", icon: "M15.536 8.464a5 5 0 0 1 0 7.072M18.364 5.636a9 9 0 0 1 0 12.728M11 5L6 9H2v6h4l5 4V5z" },
  { t: "Keyboard navigation", d: "Menus, forms and buttons work with a keyboard alone, with a visible focus outline.", icon: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm3 4h.01M11 10h.01M15 10h.01M7 14h10" },
  { t: "Readable colors", d: "Text and buttons are designed with strong color contrast for people with low vision or color blindness.", icon: "M12 3a9 9 0 1 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" },
  { t: "Zoom and resize", d: "Pages reflow when you zoom up to 400%, so you don't need to scroll sideways.", icon: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM10 7v6m-3-3h6" },
  { t: "Clear forms", d: "Every field has a label, and error messages explain exactly what needs fixing.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" },
  { t: "Accessible app", d: "Our app works with VoiceOver on iPhone and TalkBack on Android, and supports larger text settings.", icon: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
];

const SERVICES = [
  { t: "Statements and letters in other formats", d: "Large print, braille, audio or accessible PDF, free of charge." },
  { t: "Sign language video calls", d: "Talk to us through a sign language interpreter, Monday to Friday." },
  { t: "Talking ATMs", d: "Headphone sockets and spoken instructions at all our ATMs." },
  { t: "Accessible branches", d: "Step-free access, hearing loops and quieter appointment times on request." },
  { t: "Assistance dogs welcome", d: "In all our branches, at any time." },
  { t: "Signature alternatives", d: "If signing is difficult, we can agree another way to confirm it's you." },
];

const TIPS = [
  { t: "Make text bigger", d: "Hold Ctrl (or Cmd on a Mac) and press + to zoom in, or − to zoom out." },
  { t: "Have pages read aloud", d: "Use your device's built-in screen reader: Narrator on Windows, VoiceOver on Apple devices or TalkBack on Android." },
  { t: "Change colors", d: "Turn on high contrast or dark mode in your device's display settings." },
  { t: "Control with your voice", d: "Voice Access on Android, Voice Control on Apple devices and Voice Access on Windows let you navigate by speaking." },
];

const LIMITATIONS = [
  ["Older PDF documents", "Some older account agreements and rate sheets aren't fully tagged for screen readers. We're replacing them, and can send any document in another format on request."],
  ["Some third-party tools", "A few embedded tools from other providers may not meet our standards yet. We're working with those providers to fix this."],
  ["Video captions", "Some older videos don't have captions or audio description yet. We're adding them."],
];

const FEEDBACK = [
  { t: "What the problem was", d: "A short description of what you were trying to do and what went wrong." },
  { t: "Where it happened", d: "The web page address, or the screen in the app." },
  { t: "What you were using", d: "Your device, browser and any assistive technology, if you know them." },
  { t: "How to reply to you", d: "Your preferred way for us to get back to you." },
];

const NEEDS = [
  { t: "Vision", points: ["Large print, braille and audio statements", "Notched debit cards to tell them apart by touch", "Screen reader support on our website and app", "Talking ATMs with headphone sockets"] },
  { t: "Hearing", points: ["Hearing loops in every branch", "Sign language video calls", "TTY and 711 relay calls", "Contact by email, chat or letter instead of phone"] },
  { t: "Mobility and dexterity", points: ["Step-free access and lowered counters", "Home visits for customers who can't get to a branch", "Signature alternatives", "Voice control support in the app"] },
  { t: "Cognitive and learning", points: ["Plain-English letters and statements", "Extra time in appointments", "Written summaries after calls", "A named contact so you don't have to repeat yourself"] },
  { t: "Mental health", points: ["Specially trained extra support team", "Choose when and how we contact you", "Spending controls and gambling blocks in the app", "Breathing space on repayments when you need it"] },
  { t: "Speech", points: ["Contact us in writing by email, chat or letter", "TTY and 711 relay calls", "Take the time you need on calls", "Nominate a trusted person to speak for you"] },
];

const CARDS = [
  { t: "Notched debit cards", d: "A notch on the short edge helps you put your card in the right way round." },
  { t: "Large-print PIN reminders", d: "Your PIN letter in large print, braille or as an audio message." },
  { t: "Choose an easier PIN", d: "Change your PIN at any of our ATMs to one you can remember." },
  { t: "Contactless and phone payments", d: "Pay without entering a PIN for everyday amounts, or with your phone." },
];

const BRANCHES: [string, boolean, boolean, boolean, boolean, boolean][] = [
  ["Main Street", true, true, true, true, true],
  ["Westside", true, true, false, true, true],
  ["Northpark", true, true, true, true, false],
];
const BRANCH_COLS = ["Step-free access", "Hearing loop", "Accessible toilet", "Quiet room", "Disabled parking"];

const TESTING = [
  { t: "Automated checks", d: "Every update to our website and app is checked automatically for common accessibility problems." },
  { t: "Manual testing", d: "Our team tests key journeys with screen readers, keyboard only and screen magnification." },
  { t: "Testing with customers", d: "Disabled customers help us test new features before they launch." },
  { t: "Independent review", d: "An independent accessibility specialist reviews our website and app every year." },
];

const FAQS = [
  { q: "What accessibility standard do you follow?", a: "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across our website and app. We test with assistive technology and fix issues as we find them." },
  { q: "How do I get my statements in large print or braille?", a: "Call our accessibility team or ask in any branch. Once we've recorded your preference, all your statements and letters will arrive in that format automatically, free of charge." },
  { q: "Can someone help me bank if I find it difficult?", a: "Yes. You can add a trusted person to speak to us on your behalf, or set up a power of attorney. Our extra support team can talk you through the options." },
  { q: "I found a problem with your website. What happens next?", a: "We'll acknowledge your message within 2 business days, tell you how we plan to fix it and, where we can, give you another way to do what you were trying to do in the meantime." },
  { q: "Can I bring someone with me to a branch appointment?", a: "Yes. You're welcome to bring a friend, family member, carer or interpreter to any appointment." },
  { q: "Can you visit me at home?", a: "If you can't get to a branch because of a disability or illness, we can arrange a home visit for things like opening an account or arranging a power of attorney." },
  { q: "Do I have to tell you about my disability?", a: "No, it's entirely your choice. If you do, we'll record only what you agree to, use it only to support you, and you can ask us to update or delete it at any time." },
  { q: "Can I get documents in another language?", a: "We can arrange a telephone interpreter for most languages, and translate key documents on request." },
];

export default function AccessibilityPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Accessibility"
        title="Banking that works for everyone"
        subtitle="We want everyone to be able to use our website, app and branches with ease. Find out how we make banking accessible and how to get help."
        primary={{ label: "Contact our accessibility team", href: "#contact" }}
        secondary={{ label: "Services we offer", href: "#services" }}
        highlights={[
          { v: "WCAG 2.2 AA", l: "The standard we aim for" },
          { v: "Free", l: "Large print, braille & audio" },
          { v: "2 days", l: "To respond to feedback" },
        ]}
      />

      {/* Contact options */}
      <OverlapSection id="contact" maxWidth={1240}>
        <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          {CONTACT.map((c, i) => (
            <div key={c.title} style={{ padding: "30px 28px", borderLeft: i ? "1px solid rgba(17,24,39,.08)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={c.icon} size={22} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 6 }}>{c.detail}</div>
              <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </OverlapSection>

      {/* Website & app */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Our website & app" title="Designed to be easy for everyone to use" />
          <IconCards items={WEBSITE} />
        </div>
      </section>

      {/* Support by need */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Support for your needs" title="Help that fits the way you bank" />
          <div className="g-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {NEEDS.map((n) => (
              <div key={n.t} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "28px 26px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, color: DARK, marginBottom: 14 }}>{n.t}</div>
                {n.points.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 10, padding: "9px 0", borderTop: "1px solid rgba(17,24,39,.08)", fontSize: 14.5, color: GRAY, lineHeight: 1.5 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="3" style={{ flex: "none", marginTop: 3 }}><path d="M5 12l5 5L20 7" /></svg>
                    {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services + tips */}
      <section id="services" className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Services" title="Support at a branch, by phone and by mail" mb={28} />
            <CheckList items={SERVICES} />
          </div>
          <div style={{ background: TINT, borderRadius: 8, padding: "34px 32px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 8 }}>Make your device easier to use</div>
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65, margin: "0 0 22px" }}>
              Most phones and computers have built-in accessibility settings that work with our website and app.
            </p>
            <CheckList items={TIPS} />
          </div>
        </div>
      </section>

      {/* Cards & branches */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Cards & PINs" title="Accessible card options" mb={28} />
            <CheckList items={CARDS} />
          </div>
          <div>
            <SectionTitle eyebrow="Our branches" title="Branch accessibility" mb={28} />
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.08)" }}>
              <div className="mob-table-wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr repeat(5, 1fr)", padding: "14px 18px", background: BLUE, color: "#fff", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", gap: 8, alignItems: "end" }}>
                  <div>Branch</div>
                  {BRANCH_COLS.map((c) => <div key={c} style={{ textAlign: "center" }}>{c}</div>)}
                </div>
                {BRANCHES.map(([name, ...vals], i) => (
                  <div key={name} style={{ display: "grid", gridTemplateColumns: "1.3fr repeat(5, 1fr)", padding: "15px 18px", fontSize: 14.5, borderTop: i ? "1px solid rgba(17,24,39,.06)" : "none", gap: 8, alignItems: "center" }}>
                    <div style={{ fontWeight: 600, color: DARK }}>{name}</div>
                    {vals.map((on, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "center", color: on ? BLUE : "#C4C7D0" }} aria-label={on ? "Yes" : "No"}>
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
            <p style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.6, marginTop: 12 }}>
              All branches welcome assistance dogs and have hearing loops. Call ahead and we&apos;ll make sure everything&apos;s ready for your visit.
            </p>
          </div>
        </div>
      </section>

      {/* How we test */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="How we test" title="Checking accessibility at every step" />
          <div className="g-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {TESTING.map((t, i) => (
              <div key={t.t} style={{ background: TINT, borderRadius: 8, padding: "26px 24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, marginBottom: 16 }}>{i + 1}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: DARK, marginBottom: 8 }}>{t.t}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6 }}>{t.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Known limitations */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionTitle eyebrow="Being open" title="Where we still have work to do" mb={14} />
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 28px" }}>
            We know some parts of our website aren&apos;t fully accessible yet. Here&apos;s what we&apos;re working on.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {LIMITATIONS.map(([t, d]) => (
              <div key={t} className="mob-stack" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "22px 26px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, color: BLUE, fontSize: 16 }}>{t}</div>
                <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Feedback</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 16px", letterSpacing: "-.01em" }}>Found something that doesn&apos;t work for you?</h3>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,.8)", lineHeight: 1.7, margin: "0 0 24px" }}>
              Tell us and we&apos;ll fix it. We&apos;ll reply within 2 business days and help you do what you need in the meantime.
            </p>
            <Link href="/about/contact#message" style={{ display: "inline-block", background: "#E31E24", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 4, textDecoration: "none" }}>
              Send us feedback
            </Link>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 22 }}>It helps if you can tell us</div>
            <CheckList items={FEEDBACK} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
          <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 28 }}>This statement was last reviewed in October 2026.</p>
        </div>
      </section>

      <ClosingCTA
        title="Need extra help with your banking?"
        text="Our extra support team can help with money worries, bereavement, illness and more."
        primary={{ label: "Extra support", href: "/extra-support" }}
        secondary={{ label: "Contact us", href: "/about/contact" }}
      />
    </SiteLayout>
  );
}
