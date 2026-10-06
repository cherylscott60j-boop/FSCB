import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, TINT,
} from "@/components/product/ui";

const SITUATIONS = [
  { t: "Money worries", d: "If you're struggling with bills or repayments, talk to us early. We can pause, reduce or spread payments.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 14C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" },
  { t: "Bereavement", d: "Our bereavement team will guide you through closing or transferring accounts when someone dies.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
  { t: "Illness and mental health", d: "Tell us what you're going through and we'll adjust how we communicate and support you.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { t: "Domestic and financial abuse", d: "Confidential help to separate your finances and keep your money safe.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Managing for someone else", d: "Set up power of attorney or third-party access so someone you trust can help.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  { t: "Victims of scams", d: "If you think you've been scammed, call us straight away. We'll act fast to try to recover your money.", icon: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" },
];

const ACCESSIBILITY = [
  { t: "Statements in other formats", d: "Large print, braille or audio statements and letters, free of charge." },
  { t: "Sign language video calls", d: "Talk to us through a sign language interpreter by video, Monday to Friday." },
  { t: "TTY and 711 relay", d: "Dial 711 to reach us through a relay service if you're deaf, hard of hearing or have a speech impairment." },
  { t: "Talking ATMs", d: "All our ATMs have headphone sockets and audio guidance." },
  { t: "Quieter branch appointments", d: "Book a time when the branch is quieter, or ask for a private room." },
  { t: "Accessible app and website", d: "Built to work with screen readers, magnifiers and voice control." },
];

const RECORD = [
  { t: "Tell us once", d: "Let us know about your needs and we'll record them so you don't have to repeat yourself." },
  { t: "Choose how we contact you", d: "By letter, email, phone or text, at times that suit you." },
  { t: "Add a trusted person", d: "Nominate someone we can talk to on your behalf." },
  { t: "Change it any time", d: "Update or remove the information whenever you like." },
];

const FAQS = [
  { q: "Will telling you about my situation affect my credit score?", a: "No. Sharing information about your health or circumstances with us doesn't affect your credit score. We only use it to support you better." },
  { q: "I can't make my loan or card repayment this month. What should I do?", a: "Contact us as soon as you can, ideally before the payment is due. We'll talk through your options, which could include a payment break or a lower payment for a while." },
  { q: "How do I tell you someone has died?", a: "Call our bereavement team on (555) 302-1970, visit a branch or use the contact form. You'll need the person's name, address and, if you have it, their account details." },
  { q: "Can someone else manage my account for me?", a: "Yes. You can add a trusted person to talk to us on your behalf, or register a power of attorney if they need to make decisions for you." },
];

export default function ExtraSupportPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Extra support"
        title="We're here for you when life gets difficult"
        subtitle="Whether it's money worries, a bereavement, illness or a disability, we can adapt how we work to give you the support you need."
        primary={{ label: "Talk to us", href: "/about/contact" }}
        secondary={{ label: "Accessibility services", href: "#accessibility" }}
        highlights={[
          { v: "(555) 302-1970", l: "Extra support line" },
          { v: "Free", l: "Accessible formats" },
        ]}
      />

      <OverlapSection maxWidth={1040}>
        <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(17,24,39,.1)" }}>
          <div style={{ padding: "32px 34px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: DARK, marginBottom: 8 }}>Call our extra support team</div>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: 0 }}>
              Our specially trained team takes the time to understand your situation and find the right way to help. There&apos;s no time limit on calls.
            </p>
          </div>
          <div style={{ background: BLUE, color: "#fff", padding: "32px 34px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 4 }}>Extra support line</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, marginBottom: 6 }}>(555) 302-1970</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>Mon–Fri 8am–8pm · Sat 9am–4pm</div>
          </div>
        </div>
      </OverlapSection>

      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Support for you" title="Help with life's challenges" />
          <IconCards items={SITUATIONS} />
        </div>
      </section>

      <section id="accessibility" className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="Accessibility" title="Banking that works for you" mb={28} />
            <CheckList items={ACCESSIBILITY} />
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "34px 32px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 8 }}>Record your needs with us</div>
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65, margin: "0 0 22px" }}>
              Share anything that affects how you bank, and we&apos;ll make sure everyone you deal with knows how to help.
            </p>
            <CheckList items={RECORD} />
          </div>
        </div>
      </section>

      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Need to talk?"
        text="Call our extra support team, visit a branch or send us a message."
        primary={{ label: "Contact us", href: "/about/contact" }}
        secondary={{ label: "Find a branch", href: "/about/contact#branches" }}
      />
    </SiteLayout>
  );
}
