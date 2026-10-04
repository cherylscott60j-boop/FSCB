import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, margin: "0 0 14px", letterSpacing: "-.01em", display: "flex", gap: 12, alignItems: "baseline" }}>
        <span style={{ color: RED, fontWeight: 900, fontSize: 16 }}>{n}.</span>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.78 }}>{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-px" style={{ background: "linear-gradient(145deg,#0d1a1a,#1a3333)", padding: "72px 32px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 14 }}>
            Legal &amp; Privacy
          </div>
          <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px, 5vw, 46px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.06, letterSpacing: "-.02em" }}>
            Terms of Use
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, margin: "0 0 20px" }}>
            These Terms govern your use of the Safeguard Global Investment Bank website and digital services. Please read them carefully.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", margin: 0 }}>Effective date: January 1, 2026 &middot; Last revised: January 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="mob-px" style={{ background: "#fff", padding: "56px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Intro */}
          <div style={{ background: "rgba(140,29,37,.04)", border: "1.5px solid rgba(140,29,37,.12)", borderRadius: 16, padding: "24px 28px", marginBottom: 48, fontSize: 14.5, color: DARK, lineHeight: 1.7 }}>
            By accessing or using the Safeguard Global Investment Bank website located at sgginv.com (the &ldquo;Site&rdquo;) and any associated digital services, mobile applications, or online banking portals (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree, please discontinue your use of the Site immediately. These Terms apply to all visitors, users, and account holders.
          </div>

          <Section n="1" title="Acceptance of Terms">
            <p>
              These Terms constitute a legally binding agreement between you and Safeguard Global Investment Bank (&ldquo;SGGINV,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using the Site, you represent that you are at least 18 years of age or the legal age of majority in your jurisdiction, and that you have the authority to enter into this agreement. If you are using the Site on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
            </p>
            <p style={{ marginTop: 14 }}>
              SGGINV reserves the right to modify these Terms at any time. Changes become effective immediately upon posting to the Site. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms. We will note the &ldquo;Last revised&rdquo; date at the top of this page whenever updates are made.
            </p>
          </Section>

          <Section n="2" title="Permitted Use">
            <p>
              The Site and its content are provided for your personal, non-commercial use in connection with SGGINV banking products and services. You may use the Site to:
            </p>
            <ul style={{ paddingLeft: 20, margin: "12px 0", display: "flex", flexDirection: "column", gap: 7 }}>
              <li>Learn about SGGINV products and services</li>
              <li>Apply for accounts, loans, and other financial products</li>
              <li>Access and manage your SGGINV accounts through our online banking portal</li>
              <li>Contact SGGINV for customer service</li>
              <li>Access financial tools and calculators</li>
            </ul>
            <p style={{ marginTop: 14 }}>
              You agree not to use the Site to: (a) engage in any unlawful activity; (b) transmit any material that is defamatory, offensive, or harmful; (c) impersonate any person or entity; (d) attempt to gain unauthorized access to SGGINV systems or another user&apos;s account; (e) use automated tools to scrape, crawl, or extract data from the Site; or (f) interfere with or disrupt the integrity or performance of the Site.
            </p>
          </Section>

          <Section n="3" title="Online Banking &amp; Account Security">
            <p>
              If you enroll in SGGINV Online Banking or the SGGINV mobile application, additional terms and conditions apply as set forth in the Online Banking Agreement provided at enrollment. You are responsible for maintaining the confidentiality of your username, password, and any other account credentials.
            </p>
            <p style={{ marginTop: 14 }}>
              You agree to notify SGGINV immediately of any unauthorized use of your account or any other breach of security by calling{" "}
              <a href="tel:18002372669" style={{ color: RED }}>1-800-SGGINV-NOW</a> or visiting any branch. SGGINV will not be liable for any loss or damage resulting from your failure to maintain the security of your credentials.
            </p>
          </Section>

          <Section n="4" title="Intellectual Property">
            <p>
              All content on this Site, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Safeguard Global Investment Bank or its content suppliers and is protected by applicable United States and international copyright, trademark, and other intellectual property laws.
            </p>
            <p style={{ marginTop: 14 }}>
              You may print or download a single copy of pages from the Site for your own personal, non-commercial use, provided you do not modify the content and you retain all copyright and proprietary notices. Any other reproduction, distribution, republication, or retransmission of any content without the prior written consent of SGGINV is strictly prohibited.
            </p>
          </Section>

          <Section n="5" title="Third-Party Links &amp; Services">
            <p>
              The Site may contain links to third-party websites, including payment processors, financial calculators, government agencies, and other resources. These links are provided solely for your convenience. SGGINV does not control, endorse, or assume responsibility for any third-party websites or their content, privacy practices, or availability.
            </p>
            <p style={{ marginTop: 14 }}>
              When you click a link to a third-party site, you leave the SGGINV website and are subject to that site&apos;s terms and privacy policies. SGGINV is not responsible for any losses or damages arising from your use of third-party sites or services.
            </p>
          </Section>

          <Section n="6" title="No Financial Advice">
            <p>
              The information provided on this Site, including financial tools, calculators, rates, and general content, is for informational purposes only and does not constitute financial, legal, tax, or investment advice. You should consult with a qualified professional before making any financial decisions.
            </p>
            <p style={{ marginTop: 14 }}>
              Rates, terms, and product availability are subject to change without notice and may vary based on individual creditworthiness. Published rates are not guaranteed and are subject to approval.
            </p>
          </Section>

          <Section n="7" title="Disclaimer of Warranties">
            <p>
              THE SITE AND ALL CONTENT, PRODUCTS, AND SERVICES AVAILABLE THROUGH THE SITE ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p style={{ marginTop: 14 }}>
              SGGINV does not warrant that the Site will be uninterrupted, error-free, free of viruses or other harmful components, or that defects will be corrected. We reserve the right to modify, suspend, or discontinue any part of the Site at any time without notice.
            </p>
          </Section>

          <Section n="8" title="Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SGGINV AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE OR ITS CONTENT, EVEN IF SGGINV HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p style={{ marginTop: 14 }}>
              This limitation of liability does not apply to claims arising from SGGINV&apos;s gross negligence, willful misconduct, or as otherwise required by law. Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitation may not apply to you.
            </p>
          </Section>

          <Section n="9" title="Electronic Communications">
            <p>
              By using the Site or communicating with us electronically, you consent to receive electronic communications from SGGINV. These communications may include notices about your account, security alerts, product announcements, and other information. You agree that all agreements, notices, disclosures, and other communications we send you electronically satisfy any legal requirement that such communications be in writing.
            </p>
          </Section>

          <Section n="10" title="Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State in which SGGINV is chartered, without regard to its conflict of law provisions. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in that jurisdiction.
            </p>
            <p style={{ marginTop: 14 }}>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.
            </p>
          </Section>

          <Section n="11" title="Contact Us">
            <p>If you have questions about these Terms, please contact us:</p>
            <div style={{ background: "rgba(140,29,37,.04)", border: "1px solid rgba(140,29,37,.1)", borderRadius: 12, padding: "20px 24px", marginTop: 16, display: "flex", flexDirection: "column", gap: 8, fontSize: 14.5 }}>
              <span><strong>Safeguard Global Investment Bank</strong> — Legal Department</span>
              <span>102 Main Street, Hometown, ST 00000</span>
              <span>Phone: <a href="tel:18002372669" style={{ color: RED }}>1-800-SGGINV-NOW</a></span>
              <span>Email: <a href="mailto:legal@sgginv.com" style={{ color: RED }}>legal@sgginv.com</a></span>
            </div>
          </Section>

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
