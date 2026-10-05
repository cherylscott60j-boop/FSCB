import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

/* ─── GLB Privacy Notice sharing table ──────────────────────────────────── */

const SHARING_ROWS = [
  {
    reason: "For our everyday business purposes — such as to process your transactions, maintain your account(s), respond to court orders and legal investigations, or report to credit bureaus",
    shared: "Yes",
    canLimit: "No",
  },
  {
    reason: "For our marketing purposes — to offer our products and services to you",
    shared: "Yes",
    canLimit: "No",
  },
  {
    reason: "For joint marketing with other financial companies",
    shared: "No",
    canLimit: "We don't share",
  },
  {
    reason: "For our affiliates' everyday business purposes — information about your transactions and experiences",
    shared: "No",
    canLimit: "We don't share",
  },
  {
    reason: "For our affiliates' everyday business purposes — information about your creditworthiness",
    shared: "No",
    canLimit: "We don't share",
  },
  {
    reason: "For nonaffiliates to market to you",
    shared: "No",
    canLimit: "We don't share",
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, margin: "0 0 14px", letterSpacing: "-.01em" }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.78 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-px" style={{ background: "linear-gradient(145deg,#1a1200,#3d2c00)", padding: "72px 32px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 14 }}>
            Legal &amp; Privacy
          </div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(28px, 5vw, 46px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.06, letterSpacing: "-.02em" }}>
            Privacy Notice
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, margin: "0 0 20px" }}>
            Safeguard Global Investment Bank &mdash; Annual Privacy Notice required by the Gramm-Leach-Bliley Act (15 U.S.C. § 6801).
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", margin: 0 }}>Last updated: January 1, 2026</p>
        </div>
      </div>

      {/* Quick facts box */}
      <div className="mob-px" style={{ background: "#fff", padding: "56px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ background: "rgba(140,29,37,.04)", border: "1.5px solid rgba(140,29,37,.12)", borderRadius: 18, padding: "32px 36px", marginBottom: 52 }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 14 }}>
              FACTS — What does Safeguard Global Investment Bank do with your personal information?
            </div>
            <div className="g-3col" style={{ gap: 28 }}>
              {[
                { q: "Why?", a: "Financial companies choose how they share your personal information. Federal law gives consumers the right to limit some but not all sharing. Federal law also requires us to tell you how we collect, share, and protect your personal information. Please read this notice carefully to understand what we do." },
                { q: "What?", a: "The types of personal information we collect and share depend on the product or service you have with us. This information can include Social Security number and account balances; payment history and credit history; checking account information and wire transfer instructions." },
                { q: "How?", a: "All financial companies need to share customers' personal information to run their everyday business. In the section below, we list the reasons financial companies can share their customers' personal information; the reasons SGGINV chooses to share; and whether you can limit this sharing." },
              ].map((item) => (
                <div key={item.q}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: RED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{item.q}</div>
                  <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.65 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharing table */}
          <Section title="Reasons we can share your personal information">
            <div className="mob-table-wrap" style={{ marginTop: 8 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(17,24,39,.09)", minWidth: 500 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 140px", background: RED, padding: "13px 20px" }}>
                {["Reasons we can share your personal information", "Does SGGINV share?", "Can you limit this sharing?"].map((h) => (
                  <div key={h} style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: ".06em", textTransform: "uppercase" }}>{h}</div>
                ))}
              </div>
              {SHARING_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 140px",
                    padding: "16px 20px",
                    borderTop: "1px solid rgba(17,24,39,.07)",
                    background: i % 2 === 0 ? "#fff" : "rgba(248,249,250,.7)",
                    alignItems: "start",
                  }}
                >
                  <div style={{ fontSize: 13.5, color: DARK, lineHeight: 1.6, paddingRight: 16 }}>{row.reason}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: row.shared === "Yes" ? RED : "#10B981" }}>{row.shared}</div>
                  <div style={{ fontSize: 13.5, color: GRAY }}>{row.canLimit}</div>
                </div>
              ))}
            </div>
            </div>
          </Section>

          <Section title="To limit our sharing">
            <p>
              Please note: If you are a <em>new</em> customer, we can begin sharing your information 30 days from the date we sent this notice. When you are <em>no longer</em> our customer, we continue to share your information as described in this notice. However, you can contact us at any time to limit our sharing.
            </p>
            <div style={{ background: "rgba(140,29,37,.04)", border: "1px solid rgba(140,29,37,.1)", borderRadius: 12, padding: "20px 24px", marginTop: 16 }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14.5, color: DARK, marginBottom: 10 }}>Contact us to limit sharing:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14.5 }}>
                <span><strong>Phone:</strong> Call <a href="tel:18002372669" style={{ color: RED }}>1-800-SGGINV-NOW</a> Mon–Fri 8am–7pm</span>
                <span><strong>Mail:</strong> Safeguard Global Investment Bank, Privacy Officer, 102 Main Street, Hometown, ST 00000</span>
                <span><strong>In person:</strong> Visit any SGGINV branch and speak with a banker</span>
              </div>
            </div>
          </Section>

          <Section title="Who we are">
            <p>
              <strong>Who is providing this notice?</strong> Safeguard Global Investment Bank. [Chartering jurisdiction and regulator/deposit-protection-scheme membership to be added here.]
            </p>
          </Section>

          <Section title="What we do">
            <p style={{ marginBottom: 16 }}><strong>How does SGGINV protect my personal information?</strong></p>
            <p>
              To protect your personal information from unauthorized access and use, we use security measures that comply with federal law. These measures include computer safeguards and secured files and buildings. We restrict access to your personal information to those employees who need it to provide products or services to you. Employees who violate our privacy policies are subject to disciplinary action, including termination of employment.
            </p>
            <p style={{ marginTop: 16, marginBottom: 16 }}><strong>How does SGGINV collect my personal information?</strong></p>
            <p>We collect your personal information, for example, when you:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0", display: "flex", flexDirection: "column", gap: 6 }}>
              <li>Open an account or apply for a loan</li>
              <li>Make deposits or withdrawals from your account</li>
              <li>Pay your bills or apply for a credit card</li>
              <li>Tell us about your investment or retirement portfolio</li>
              <li>Give us your income information</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              We also collect your personal information from others, such as credit bureaus, affiliates, or other companies.
            </p>
            <p style={{ marginTop: 16, marginBottom: 16 }}><strong>Why can't I limit all sharing?</strong></p>
            <p>
              Federal law gives you the right to limit only certain sharing — sharing for affiliates' everyday business purposes (information about your creditworthiness); affiliates from using your information to market to you; sharing for nonaffiliates to market to you. State laws and individual companies may give you additional rights to limit sharing. See below for more on your rights under state law.
            </p>
          </Section>

          <Section title="Definitions">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { term: "Affiliates", def: "Companies related by common ownership or control. They can be financial and nonfinancial companies. SGGINV does not share with affiliates." },
                { term: "Nonaffiliates", def: "Companies not related by common ownership or control. They can be financial and nonfinancial companies. SGGINV does not share with nonaffiliates so they can market to you." },
                { term: "Joint marketing", def: "A formal agreement between nonaffiliated financial companies that together market financial products or services to you. SGGINV does not jointly market." },
              ].map((d) => (
                <div key={d.term} style={{ display: "flex", gap: 12 }}>
                  <div style={{ flexShrink: 0, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: DARK, width: 140 }}>{d.term}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65 }}>{d.def}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Other important information">
            <p>
              <strong>California residents:</strong> California law gives you additional rights to limit sharing of your personal information. For more information, contact us using the information in the "To limit our sharing" section above.
            </p>
            <p style={{ marginTop: 14 }}>
              <strong>Vermont residents:</strong> Vermont law gives you the right to opt out of certain disclosures of your personal information to nonaffiliates. We will not disclose information about you to nonaffiliates without your authorization.
            </p>
            <p style={{ marginTop: 14 }}>
              Questions? Contact our Privacy Officer at{" "}
              <a href="mailto:privacy@sgginv.com" style={{ color: RED }}>privacy@sgginv.com</a> or call{" "}
              <a href="tel:18002372669" style={{ color: RED }}>1-800-SGGINV-NOW</a>.
            </p>
          </Section>

          <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 28, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/disclosures" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Full Disclosures →</Link>
            <Link href="/terms" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Terms of Use →</Link>
            <Link href="/about/contact" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Contact a Banker →</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
