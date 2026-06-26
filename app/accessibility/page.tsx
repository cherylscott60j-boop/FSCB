import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

export default function AccessibilityPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg,#0f1e0f,#1e3d20)", padding: "72px 32px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 14 }}>
            Legal &amp; Accessibility
          </div>
          <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px, 5vw, 46px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.06, letterSpacing: "-.02em" }}>
            Accessibility Statement
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, margin: "0 0 20px" }}>
            First State Community Bank is committed to ensuring that everyone — regardless of ability — can access our financial services, website, and branches.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", margin: 0 }}>Last updated: January 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "#fff", padding: "56px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Our commitment */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: DARK, margin: "0 0 18px", letterSpacing: "-.01em" }}>
              Our Commitment to Accessibility
            </h2>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.78, margin: "0 0 16px" }}>
              At FSCB, we believe that banking should be accessible to everyone. We are committed to making our website, mobile application, and in-branch services usable by all people, including those with visual, hearing, motor, or cognitive disabilities.
            </p>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.78, margin: 0 }}>
              This statement reflects our ongoing effort to conform to the{" "}
              <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards published by the World Wide Web Consortium (W3C), and to comply with applicable federal laws including the Americans with Disabilities Act (ADA) and Section 508 of the Rehabilitation Act.
            </p>
          </div>

          {/* What we're doing */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 18px", letterSpacing: "-.01em" }}>
              What We Are Doing
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "Website accessibility", body: "Our website is built with semantic HTML, ARIA landmark roles, and descriptive alternative text for all meaningful images. We test regularly with screen readers and keyboard-only navigation." },
                { title: "Color and contrast", body: "We design with sufficient color contrast ratios to meet or exceed WCAG 2.1 AA standards, ensuring that text is readable by users with low vision or color blindness." },
                { title: "Keyboard navigation", body: "All interactive elements on our website — including forms, menus, and buttons — are fully operable using a keyboard alone, without requiring a mouse." },
                { title: "Forms and error handling", body: "Account applications and contact forms include clearly labeled fields, error messages that identify the issue specifically, and helpful instructions for completing the form." },
                { title: "Mobile accessibility", body: "Our mobile application is designed to work with iOS VoiceOver and Android TalkBack. We follow platform-specific accessibility guidelines for both operating systems." },
                { title: "In-branch accommodations", body: "All FSCB branch locations are accessible in accordance with ADA requirements, including accessible parking, ramps, wide doorways, and accessible countertop heights. Large-print documents, alternative formats, and sign language interpretation are available by request." },
                { title: "Ongoing review", body: "We conduct periodic accessibility audits of our website and digital tools. When issues are identified, we prioritize their resolution based on impact to users." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "18px 20px", border: "1px solid rgba(17,24,39,.07)", borderRadius: 14 }}>
                  <div style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.68 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Known limitations */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 16px", letterSpacing: "-.01em" }}>
              Known Limitations
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.78, margin: "0 0 14px" }}>
              We are committed to transparency. While we strive for full accessibility, some areas of our website or digital services may not yet fully conform to WCAG 2.1 AA standards. Known areas under active improvement include:
            </p>
            <ul style={{ paddingLeft: 20, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: 8, fontSize: 14.5, color: GRAY, lineHeight: 1.7 }}>
              <li>Some older PDF documents (account agreements, rate sheets) may not be fully tagged for screen reader access. We are converting these to accessible formats on a rolling basis.</li>
              <li>Third-party widgets, including certain embedded financial calculators, may have accessibility limitations that we do not fully control. We actively work with vendors to improve this.</li>
              <li>Some video content may not yet have captions or audio descriptions. We are adding these incrementally.</li>
            </ul>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.78 }}>
              If you encounter an accessibility barrier not listed here, please tell us using the contact information below. Your feedback directly informs our improvement roadmap.
            </p>
          </div>

          {/* Formal accommodations request */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 16px", letterSpacing: "-.01em" }}>
              Requesting Accommodations
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.78, margin: "0 0 14px" }}>
              If you need a specific accommodation to access our services — including large-print account statements, Braille correspondence, sign language interpretation for branch visits, or an alternative format for any FSCB document — please contact us. We will respond within two business days and provide the accommodation at no charge.
            </p>
            <div style={{ background: "rgba(140,29,37,.04)", border: "1.5px solid rgba(140,29,37,.12)", borderRadius: 16, padding: "26px 30px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 18 }}>
                Contact our Accessibility Team
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: DARK }}>Phone</div>
                    <a href="tel:18002372669" style={{ color: RED, textDecoration: "none" }}>1-800-FSCB-NOW</a>
                    <span style={{ color: GRAY }}> · Mon–Fri 8am–7pm, Sat 8am–4pm</span>
                    <div style={{ fontSize: 13, color: GRAY, marginTop: 3 }}>TTY users: dial 711 (Telecommunications Relay Service)</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: DARK }}>Email</div>
                    <a href="mailto:accessibility@fscb.com" style={{ color: RED, textDecoration: "none" }}>accessibility@fscb.com</a>
                    <div style={{ fontSize: 13, color: GRAY, marginTop: 3 }}>We respond within 2 business days</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" /><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: DARK }}>Mail</div>
                    <span style={{ color: GRAY }}>First State Community Bank, Attn: Accessibility Services<br />102 Main Street, Hometown, ST 00000</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: DARK }}>In person</div>
                    <span style={{ color: GRAY }}>Visit any FSCB branch. Staff are trained to assist customers with accessibility needs.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, margin: "0 0 16px", letterSpacing: "-.01em" }}>
              Feedback &amp; Complaints
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.78, margin: "0 0 14px" }}>
              We welcome feedback on the accessibility of our website and digital services. If you experience a barrier that prevents you from accessing any part of our site, please let us know using the contact information above. Please include:
            </p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 14.5, color: GRAY, lineHeight: 1.7 }}>
              <li>A description of the barrier or issue you encountered</li>
              <li>The web address (URL) or location where the issue occurred</li>
              <li>The device and assistive technology you were using (if applicable)</li>
              <li>Your preferred contact method for our response</li>
            </ul>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.78, marginTop: 14 }}>
              If you are not satisfied with our response, you may file a complaint with the U.S. Department of Justice (ADA) at{" "}
              <a href="https://www.ada.gov" target="_blank" rel="noopener noreferrer" style={{ color: RED }}>ada.gov</a> or the Consumer Financial Protection Bureau at{" "}
              <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" style={{ color: RED }}>consumerfinance.gov</a>.
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 28, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Privacy Notice →</Link>
            <Link href="/disclosures" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Disclosures →</Link>
            <Link href="/about/contact" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Contact Us →</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
