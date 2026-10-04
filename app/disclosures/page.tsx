import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { BANK } from "@/lib/bankConstants";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

function Card({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid rgba(17,24,39,.08)", borderRadius: 18, padding: "28px 30px", marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, color: DARK, margin: 0, letterSpacing: "-.01em" }}>{title}</h2>
        {badge && (
          <span style={{ background: "rgba(140,29,37,.08)", color: RED, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 999 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.78 }}>{children}</div>
    </div>
  );
}

export default function DisclosuresPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-px" style={{ background: "linear-gradient(145deg,#1a1a2e,#2d2d4e)", padding: "72px 32px 64px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 14 }}>
            Legal &amp; Regulatory
          </div>
          <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px, 5vw, 46px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.06, letterSpacing: "-.02em" }}>
            Disclosures
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, margin: "0 0 20px", maxWidth: 600 }}>
            Regulatory disclosures for Safeguard Global Investment Bank. The specific figures, agency names, and contact details below are placeholders — this page has not yet been completed or reviewed by legal/compliance and does not describe any real regulatory relationship.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.4)", borderRadius: 999, padding: "6px 14px", fontSize: 12.5, fontWeight: 700, color: "#FBBF24" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v4m0 4h.01M12 3l9.5 16.5H2.5L12 3z" /></svg>
            DRAFT — placeholder content, not legally reviewed
          </div>
        </div>
      </div>

      {/* Jump links */}
      <div className="mob-px" style={{ background: "rgba(140,29,37,.04)", borderBottom: "1px solid rgba(140,29,37,.1)", padding: "16px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            ["Deposit Protection", "#fdic"],
            ["Fair Lending", "#ehl"],
            ["Investment Products", "#investments"],
            ["Loan Rates", "#loans"],
            ["Routing Number", "#routing"],
            ["State Licensing", "#licensing"],
          ].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 13.5, fontWeight: 600, color: RED, textDecoration: "none" }}>{label}</a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mob-px" style={{ background: "#fff", padding: "56px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div id="fdic">
            <Card title="Deposit Protection" badge="Placeholder">
              <p>
                [This section will name the specific deposit protection / insurance scheme Safeguard Global Investment Bank actually participates in, if any, once that is confirmed. Do not rely on the figures below — they are unfilled placeholders.]
              </p>
              <p style={{ marginTop: 12 }}>
                Coverage, if any, would typically depend on the ownership category of the account. Illustrative categories:
              </p>
              <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                {[
                  ["Single Accounts", "Up to [$LIMIT] per owner"],
                  ["Joint Accounts", "Up to [$LIMIT] per co-owner"],
                  ["Retirement Accounts (IRAs)", "Up to [$LIMIT] per owner"],
                  ["Trust Accounts", "Up to [$LIMIT] per unique beneficiary"],
                  ["Business Accounts", "Up to [$LIMIT] per corporation or partnership"],
                  ["Government Accounts", "Up to [$LIMIT] per official custodian"],
                ].map(([cat, limit]) => (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(248,249,250,.8)", borderRadius: 10, border: "1px solid rgba(17,24,39,.07)" }}>
                    <span style={{ color: DARK, fontWeight: 500 }}>{cat}</span>
                    <span style={{ color: RED, fontWeight: 700 }}>{limit}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                [Add the real deposit-protection scheme's name, website, and contact number here once confirmed.]
              </p>
            </Card>
          </div>

          <div id="ehl">
            <Card title="Fair Lending" badge="Placeholder">
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.6">
                    <path d="M3 11h18M5 11V8h4v3M5 21h14M4 21V11M20 21V11M9 21v-5h6v5" />
                  </svg>
                </div>
                <div>
                  <p>
                    [Confirm Safeguard Global Investment Bank&apos;s actual fair-lending commitments and any applicable certification — e.g. Equal Housing Lender status — before publishing this section. Until then, treat this as unverified placeholder text.] Lending decisions should never be made on the basis of race, color, religion, national origin, sex, disability, or familial status.
                  </p>
                  <p style={{ marginTop: 12 }}>
                    [Add the real complaint/escalation contact — your own compliance team and/or the applicable regulator in your jurisdiction — once confirmed.]
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div id="investments">
            <Card title="Investment Products Disclosure" badge="Important">
              <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#92400E", marginBottom: 6 }}>
                  Investment products offered through SGGINV are:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    "NOT [Deposit Protection]",
                    "NOT bank guaranteed",
                    "May lose value — including possible loss of the amount invested",
                    "NOT deposits or obligations of Safeguard Global Investment Bank",
                    "NOT insured by any federal government agency",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: 14, color: "#92400E", display: "flex", gap: 8, alignItems: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5"><path d="M12 9v4m0 4h.01M12 3l9.5 16.5H2.5L12 3z" /></svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <p>
                [Name the actual entity through which investment and insurance products are offered, and confirm it is properly registered/licensed to do so, before publishing this section.]
              </p>
              <p style={{ marginTop: 12 }}>
                [If securities accounts are genuinely protected by a real investor-protection scheme (e.g. SIPC in the US), name it and its real coverage limits here. Do not state a specific scheme or dollar limit until that membership is confirmed.]
              </p>
            </Card>
          </div>

          <div id="loans">
            <Card title="Loan Rate &amp; APR Disclosures">
              <p>
                All interest rates, Annual Percentage Rates (APRs), and loan terms shown on this website are illustrative and subject to change without notice. Actual rates and terms depend on your individual creditworthiness, income, loan amount, loan-to-value ratio, and other factors evaluated at the time of your application.
              </p>
              <ul style={{ paddingLeft: 20, margin: "14px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <li><strong>Mortgage rates</strong> are based on a 30-day lock for purchase transactions with a 20% down payment and 740+ credit score. Rates for other loan types, terms, or credit profiles will differ.</li>
                <li><strong>Auto loan rates</strong> are for new vehicles financed for 60 months with a 720+ credit score. Used vehicles, longer terms, or lower credit scores will carry higher rates.</li>
                <li><strong>Personal loan rates</strong> reflect the range available to well-qualified applicants. Individual rates may be higher based on credit profile and loan term.</li>
                <li><strong>APR</strong> includes interest and applicable fees. Where no fees apply, APR equals the interest rate.</li>
              </ul>
              <p>
                All loans are subject to credit approval. [Confirm and list the specific lending laws and regulations Safeguard Global Investment Bank is actually subject to in its operating jurisdiction before publishing this claim.]
              </p>
            </Card>
          </div>

          <div id="routing">
            <Card title="Routing Number &amp; Account Information">
              <p style={{ marginBottom: 18 }}>
                Use the following information when setting up direct deposit, ACH transfers, or wire transfers to your SGGINV account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "ABA Routing Number (ACH / Direct Deposit)", value: BANK.achRouting, note: "For electronic transfers and direct deposit" },
                  { label: "Wire Transfer Routing Number", value: BANK.wireRouting, note: "Include your full account number and the bank's address" },
                  { label: "Bank Name", value: BANK.name, note: null },
                  { label: "Bank Address (for wire transfers)", value: BANK.address, note: null },
                  { label: "SWIFT / BIC Code", value: BANK.swiftCode, note: "For international wire transfers only" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 18px", background: "rgba(248,249,250,.8)", borderRadius: 12, border: "1px solid rgba(17,24,39,.07)", gap: 20 }}>
                    <div>
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13.5, color: DARK }}>{row.label}</div>
                      {row.note && <div style={{ fontSize: 12, color: GRAY, marginTop: 3 }}>{row.note}</div>}
                    </div>
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: RED, whiteSpace: "nowrap", flexShrink: 0 }}>{row.value}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 18, fontSize: 13, color: GRAY }}>
                For your security, SGGINV will never ask you to share your full account number by email or text. If you receive a suspicious request, call us at{" "}
                <a href="tel:18002372669" style={{ color: RED }}>1-800-SGGINV-NOW</a> to verify.
              </p>
            </Card>
          </div>

          <div id="licensing">
            <Card title="State Licensing &amp; Regulatory Information">
              <p>
                [This section must name Safeguard Global Investment Bank&apos;s actual charter type, licensing jurisdiction, and real supervising regulator(s) before publishing — none of that is confirmed yet. The rows below are unfilled placeholders, not real regulatory relationships.]
              </p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { agency: "[Regulator]", role: "[Role / jurisdiction to confirm]", contact: "[website · phone]" },
                  { agency: "[Regulator]", role: "[Role / jurisdiction to confirm]", contact: "[website · phone]" },
                  { agency: "[Regulator]", role: "[Role / jurisdiction to confirm]", contact: "[website · phone]" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "14px 18px", background: "rgba(248,249,250,.8)", borderRadius: 12, border: "1px solid rgba(17,24,39,.07)" }}>
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 14, color: RED, width: 80, flexShrink: 0 }}>{r.agency}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{r.role}</div>
                      <div style={{ fontSize: 13, color: GRAY, marginTop: 3 }}>{r.contact}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 20 }}>
                [Add a real customer-service contact channel here once one exists.]
              </p>
            </Card>
          </div>

          <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 28, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Privacy Notice →</Link>
            <Link href="/terms" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Terms of Use →</Link>
            <Link href="/about/contact" style={{ fontSize: 14, color: RED, fontWeight: 600, textDecoration: "none" }}>Contact Us →</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
