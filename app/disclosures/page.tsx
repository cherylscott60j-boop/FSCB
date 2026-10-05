import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";

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
            Required regulatory disclosures for Safeguard Global Investment Bank. Please review these disclosures carefully as they affect your rights as a depositor, borrower, and consumer.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", margin: 0 }}>Last updated: January 1, 2026</p>
        </div>
      </div>

      {/* Jump links */}
      <div className="mob-px" style={{ background: "rgba(140,29,37,.04)", borderBottom: "1px solid rgba(140,29,37,.1)", padding: "16px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            ["FDIC Insurance", "#fdic"],
            ["Equal Housing Lender", "#ehl"],
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
            <Card title="FDIC Deposit Insurance" badge="Required Notice">
              <p>
                Safeguard Global Investment Bank is a member of the Federal Deposit Insurance Corporation (FDIC). FDIC deposit insurance protects depositors at FDIC-insured banks in the unlikely event of bank failure. Deposits are insured up to at least <strong>$250,000 per depositor, per insured bank, for each account ownership category</strong>.
              </p>
              <p style={{ marginTop: 12 }}>
                Coverage is based on the ownership category of the account. Common ownership categories include:
              </p>
              <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                {[
                  ["Single Accounts", "Up to $250,000 per owner"],
                  ["Joint Accounts", "Up to $250,000 per co-owner"],
                  ["Retirement Accounts (IRAs)", "Up to $250,000 per owner"],
                  ["Trust Accounts", "Up to $250,000 per unique beneficiary"],
                  ["Business Accounts", "Up to $250,000 per corporation or partnership"],
                  ["Government Accounts", "Up to $250,000 per official custodian"],
                ].map(([cat, limit]) => (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(248,249,250,.8)", borderRadius: 10, border: "1px solid rgba(17,24,39,.07)" }}>
                    <span style={{ color: DARK, fontWeight: 500 }}>{cat}</span>
                    <span style={{ color: RED, fontWeight: 700 }}>{limit}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                FDIC deposit insurance is automatic — you do not need to apply. There is no cost to you for this coverage. To learn more, visit{" "}
                <a href="https://www.fdic.gov" target="_blank" rel="noopener noreferrer" style={{ color: RED }}>fdic.gov</a> or call the FDIC at 1-877-275-3342.
              </p>
            </Card>
          </div>

          <div id="ehl">
            <Card title="Equal Housing Lender" badge="Required Notice">
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.6">
                    <path d="M3 11h18M5 11V8h4v3M5 21h14M4 21V11M20 21V11M9 21v-5h6v5" />
                  </svg>
                </div>
                <div>
                  <p>
                    Safeguard Global Investment Bank is an Equal Housing Lender. We make loans without regard to race, color, religion, national origin, sex, handicap, or familial status. As required by law, the federal Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age (provided the applicant has the capacity to enter into a binding contract), or because the applicant receives income from any public assistance program.
                  </p>
                  <p style={{ marginTop: 12 }}>
                    If you believe you have been discriminated against in a credit transaction, you may contact your federal or state regulatory agency. For credit extended by Safeguard Global, you may contact the{" "}
                    <strong>Consumer Financial Protection Bureau (CFPB)</strong> at{" "}
                    <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" style={{ color: RED }}>consumerfinance.gov</a>{" "}
                    or 1-855-411-2372.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div id="investments">
            <Card title="Investment Products Disclosure" badge="Important">
              <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#92400E", marginBottom: 6 }}>
                  Investment products offered through Safeguard Global are:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    "NOT FDIC Insured",
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
                Investment and insurance products, including annuities, mutual funds, stocks, bonds, and brokerage accounts, are offered through Safeguard Global Investment Services, which is not a registered broker-dealer. Investment advisory services are provided by registered investment advisers who are not employees of Safeguard Global Investment Bank.
              </p>
              <p style={{ marginTop: 12 }}>
                Securities accounts are protected by the Securities Investor Protection Corporation (SIPC) up to $500,000 (including $250,000 for cash claims) against broker-dealer failure. SIPC does not protect against market loss. For more information, visit{" "}
                <a href="https://www.sipc.org" target="_blank" rel="noopener noreferrer" style={{ color: RED }}>sipc.org</a>.
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
                All loans are subject to credit approval. Safeguard Global complies with all applicable federal and state lending laws, including the Truth in Lending Act (TILA), the Real Estate Settlement Procedures Act (RESPA), and the Home Mortgage Disclosure Act (HMDA).
              </p>
            </Card>
          </div>

          <div id="routing">
            <Card title="Routing Number &amp; Account Information">
              <p style={{ marginBottom: 18 }}>
                Use the following information when setting up direct deposit, ACH transfers, or wire transfers to your Safeguard Global account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "ABA Routing Number (ACH / Direct Deposit)", value: "081024376", note: "For electronic transfers and direct deposit" },
                  { label: "Wire Transfer Routing Number", value: "081024376", note: "Same routing number; include your full account number and Safeguard Global's address" },
                  { label: "Bank Name", value: "Safeguard Global Investment Bank", note: null },
                  { label: "Bank Address (for wire transfers)", value: "102 Main Street, Hometown, ST 00000", note: null },
                  { label: "SWIFT / BIC Code", value: "SGIBUS33", note: "For international wire transfers only" },
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
                For your security, Safeguard Global will never ask you to share your full account number by email or text. If you receive a suspicious request, call us at{" "}
                <a href="tel:18002372669" style={{ color: RED }}>1-800-SAFEGRD</a> to verify.
              </p>
            </Card>
          </div>

          <div id="licensing">
            <Card title="State Licensing &amp; Regulatory Information">
              <p>
                Safeguard Global Investment Bank is chartered and regulated under state banking law. We are supervised by state and federal banking regulators, including the Federal Deposit Insurance Corporation (FDIC) and the Consumer Financial Protection Bureau (CFPB).
              </p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { agency: "FDIC", role: "Primary federal deposit insurance regulator", contact: "fdic.gov · 1-877-275-3342" },
                  { agency: "CFPB", role: "Consumer financial protection oversight", contact: "consumerfinance.gov · 1-855-411-2372" },
                  { agency: "State Banking Department", role: "State charter and examination authority", contact: "Contact Safeguard Global for state-specific regulatory information" },
                ].map((r) => (
                  <div key={r.agency} style={{ display: "flex", gap: 16, padding: "14px 18px", background: "rgba(248,249,250,.8)", borderRadius: 12, border: "1px solid rgba(17,24,39,.07)" }}>
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 14, color: RED, width: 80, flexShrink: 0 }}>{r.agency}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{r.role}</div>
                      <div style={{ fontSize: 13, color: GRAY, marginTop: 3 }}>{r.contact}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 20 }}>
                To file a complaint or inquiry with Safeguard Global directly, contact our Customer Service team at{" "}
                <a href="tel:18002372669" style={{ color: RED }}>1-800-SAFEGRD</a> or write to us at 102 Main Street, Hometown, ST 00000. We are committed to resolving all concerns promptly and fairly.
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
