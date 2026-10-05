import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { notFound } from "next/navigation";

const FONT = "var(--font-poppins), sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const GRAY = "#6B7280";

/* ─── Story ─────────────────────────────────────────────────────────────── */

function StoryPage() {
  const TIMELINE = [
    { year: "1902", title: "Founded", desc: "A group of community leaders pooled resources to charter Safeguard Global Investment Bank, serving local farmers and tradespeople." },
    { year: "1935", title: "Through the Depression", desc: "While larger banks closed their doors, SGGINV remained open — never missing a single day of service to account holders." },
    { year: "1968", title: "New Headquarters", desc: "Moved into our landmark Main Street building, which remains our primary branch and community hub to this day." },
    { year: "1997", title: "Online Banking Launched", desc: "Among the first community banks in the region to offer internet banking — a commitment to innovation that continues today." },
    { year: "2010", title: "£500M in Assets", desc: "Crossed half a billion pounds in assets while remaining independently owned and community-focused." },
    { year: "2024", title: "120+ Years Strong", desc: "Now serving 17,000+ account holders with expanded digital tools, multiple branches, and deeper community investment than ever." },
  ];
  const VALUES = [
    { title: "People First", desc: "Every decision we make — from loan approvals to product design — starts with one question: is this good for our customers and community?", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" },
    { title: "Deeply Local", desc: "We live here. We shop here. We raise our families here. Our investment in this community is personal, not just professional.", icon: "M3 21h18M5 21V9l7-6 7 6v12M9 13h2M9 17h2" },
    { title: "Built on Trust", desc: "Over 120 years, trust is the most valuable thing we have built. We never compromise it — not for a quick profit, not for growth.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  ];
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: "linear-gradient(145deg,#2C0A10,#8C1D25)", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>About SGGINV</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>Our Story</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 44px" }}>Over 120 years of serving our community — built on trust, guided by values, and proud to still be independently owned.</p>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[{ v: "1902", l: "Founded" }, { v: "120+", l: "Years of service" }, { v: "17K+", l: "Account holders" }].map((s, i) => (
              <div key={i} style={{ paddingRight: 40, borderRight: i < 2 ? "1px solid rgba(255,255,255,.15)" : "none" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Who We Are</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 22px", color: DARK }}>Community banking the way it was meant to be</h2>
            <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.78, margin: "0 0 20px" }}>
              SGGINV was founded in 1902 by local community leaders who believed that banking should serve people — not the other way around. More than a century later, that belief hasn&apos;t changed.
            </p>
            <p style={{ fontSize: 16.5, color: GRAY, lineHeight: 1.78, margin: 0 }}>
              We are independently owned, locally operated, and deeply committed to reinvesting in the families and businesses that make this community thrive. Every loan decision happens here. Every banker knows your name.
            </p>
          </div>
          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 26px 56px -24px rgba(140,29,37,.28)",
              aspectRatio: "5/4",
              backgroundImage: "url('/31-RibbonCuttingConfetti.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Our History</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>120 years of milestones</h2>
          </div>
          <div className="mob-tl-wrap" style={{ position: "relative" }}>
            <div className="mob-tl-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "rgba(140,29,37,.12)", transform: "translateX(-50%)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} className="mob-tl-item" style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 24, alignItems: "flex-start" }}>
                  {i % 2 === 0 ? (
                    <>
                      <div className="mob-tl-card" style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 18, padding: "28px 28px 28px 32px", boxShadow: "0 4px 20px -8px rgba(0,0,0,.1)" }}>
                        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: RED, marginBottom: 6 }}>{item.title}</div>
                        <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{item.desc}</div>
                      </div>
                      <div className="mob-tl-circle" style={{ display: "flex", justifyContent: "center", paddingTop: 28 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 12, zIndex: 1, flexShrink: 0 }}>{item.year}</div>
                      </div>
                      <div className="mob-tl-empty" />
                    </>
                  ) : (
                    <>
                      <div className="mob-tl-empty" />
                      <div className="mob-tl-circle" style={{ display: "flex", justifyContent: "center", paddingTop: 28 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 12, zIndex: 1, flexShrink: 0 }}>{item.year}</div>
                      </div>
                      <div className="mob-tl-card" style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 18, padding: "28px 32px 28px 28px", boxShadow: "0 4px 20px -8px rgba(0,0,0,.1)" }}>
                        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: RED, marginBottom: 6 }}>{item.title}</div>
                        <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65 }}>{item.desc}</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>What Guides Us</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>Our core values</h2>
          </div>
          <div className="g-3col" style={{ gap: 24 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ border: "1px solid rgba(17,24,39,.07)", borderRadius: 20, padding: "36px 32px" }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 22 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={v.icon} /></svg>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 12 }}>{v.title}</div>
                <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "linear-gradient(145deg,#2C0A10,#8C1D25)", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 38px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Bank with people who know you</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Open an account today or visit any branch to meet the team in person.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>Open an Account</button>
            <Link href="/about/contact" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, textDecoration: "none" }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ─── Community ─────────────────────────────────────────────────────────── */

function CommunityPage() {
  const METRICS = [
    { v: "£1M+", l: "Donated locally", sub: "Grants, sponsorships, and direct giving" },
    { v: "200+", l: "Projects funded", sub: "Neighborhood revitalization initiatives" },
    { v: "17K+", l: "Volunteer hours", sub: "Logged by SGGINV staff and partners" },
    { v: "5K+", l: "Students reached", sub: "Through financial literacy programs" },
  ];
  const PROGRAMS = [
    { title: "Financial Literacy Initiative", desc: "Free workshops for students, adults, and seniors covering budgeting, credit, homeownership, and retirement — held at schools, libraries, and community centers year-round.", icon: "M3 7l9-4 9 4-9 4-9-4zM21 7v6M7 9v5c0 1.5 2.2 3 5 3s5-1.5 5-3V9" },
    { title: "Small Business Accelerator", desc: "Grants, low-interest starter loans, and mentorship for entrepreneurs overlooked by traditional banks — especially women-owned, minority-owned, and rural businesses.", icon: "M3 7h18M3 11h18M3 15h18" },
    { title: "First-Time Homebuyer Program", desc: "Down payment assistance, below-market mortgage rates, and personalized guidance for families purchasing their first home in our community.", icon: "M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" },
    { title: "Annual Scholarship Program", desc: "Each year, SGGINV awards academic scholarships to graduating seniors pursuing higher education — investing in the next generation of community leaders.", icon: "M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" },
  ];
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: "linear-gradient(145deg,#0d1f0d,#1e4020)", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>About SGGINV</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>Community Impact</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 40px" }}>We measure our success by the strength of the community around us — £1M+ reinvested and counting.</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>See Our Impact Report</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>By the Numbers</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>Impact we can measure</h2>
          </div>
          <div className="g-4col" style={{ gap: 24 }}>
            {METRICS.map((m, i) => (
              <div key={i} style={{ border: "1.5px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "36px 28px", textAlign: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: RED, lineHeight: 1, marginBottom: 10 }}>{m.v}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8 }}>{m.l}</div>
                <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.5 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Our Programs</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>How we give back</h2>
          </div>
          <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {PROGRAMS.map((p, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 20, padding: "32px 30px" }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(140,29,37,.09)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 20 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={p.icon} /></svg>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, color: DARK, marginBottom: 12 }}>{p.title}</div>
                <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.72 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteer / Get Involved */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Get Involved</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px", color: DARK }}>Join us in building a stronger community</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.78, margin: "0 0 32px" }}>
              Community impact doesn&apos;t happen alone. We partner with nonprofits, local schools, city programs, and individual volunteers to amplify what we can do together.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["Sponsor a community event", "Nominate a scholarship recipient", "Partner with our financial literacy team", "Apply for a small business grant"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                  </div>
                  <span style={{ fontSize: 15, color: DARK, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(140,29,37,.04)", borderRadius: 22, padding: "44px 40px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 10 }}>Request our Impact Report</div>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: "0 0 30px" }}>Get a full breakdown of our community investments, volunteer hours, and program outcomes over the past year.</p>
            <button style={{ width: "100%", background: RED, color: "#fff", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: 16, borderRadius: 12, cursor: "pointer", marginBottom: 12 }}>Download Impact Report</button>
            <button style={{ width: "100%", background: "none", border: "1.5px solid rgba(17,24,39,.14)", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, padding: 14, borderRadius: 12, cursor: "pointer", color: GRAY }}>Contact Community Team</button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "linear-gradient(145deg,#0d1f0d,#1e4020)", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 38px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Banking that gives back</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>When you bank with SGGINV, your money stays in the community and helps it grow.</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>Open an Account</button>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ─── Careers ────────────────────────────────────────────────────────────── */

function CareersPage() {
  const BENEFITS = [
    { title: "Competitive Salary", desc: "Market-rate compensation reviewed annually with performance-based increases.", icon: "M12 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" },
    { title: "Health, Dental & Vision", desc: "Comprehensive medical coverage for you and your family, with SGGINV covering a majority of premiums.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
    { title: "401(k) with Match", desc: "Save for retirement with up to 4% employer match — fully vested after just two years.", icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6" },
    { title: "Paid Volunteer Time", desc: "Dedicated paid hours each year to volunteer with local nonprofits and causes you care about.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7" },
    { title: "Tuition Assistance", desc: "Up to £5,000 per year toward continuing education, certifications, and degree programs.", icon: "M3 7l9-4 9 4-9 4-9-4z" },
    { title: "Work-Life Balance", desc: "Flexible scheduling, generous PTO starting at 3 weeks, and 11 paid holidays per year.", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  ];
  const ROLES = [
    { dept: "Branch Banking", roles: ["Personal Banker", "Head Teller", "Branch Manager", "Member Services Rep"] },
    { dept: "Lending", roles: ["Mortgage Loan Officer", "Commercial Banker", "Consumer Loan Processor", "Underwriter"] },
    { dept: "Technology", roles: ["Core Banking Analyst", "Digital Product Manager", "Cybersecurity Specialist", "IT Support"] },
    { dept: "Finance & Operations", roles: ["Staff Accountant", "Compliance Officer", "BSA Analyst", "Operations Specialist"] },
  ];
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: "linear-gradient(145deg,#0d1f3c,#1a3a6b)", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>About SGGINV</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>Careers at SGGINV</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 40px" }}>Join a team where your work has real impact. We&apos;re looking for people who care about their community as much as they do their career.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>View Open Positions</button>
            <button style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, cursor: "pointer" }}>Learn About Culture</button>
          </div>
        </div>
      </div>

      {/* Why SGGINV */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Why SGGINV</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 22px", color: DARK }}>A career with purpose right here at home</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.78, margin: "0 0 28px" }}>
              At SGGINV, you&apos;re not a number. You&apos;re a banker who knows their customers by name, makes local decisions, and sees the direct impact of their work in the community every single day.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.78, margin: 0 }}>
              We invest in our team with competitive pay, strong benefits, and real opportunities for growth — because we believe that a great team builds a great community bank.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944", t: "Local decisions, real impact", d: "Every employee sees how their work directly affects customers and the community." },
              { icon: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6", t: "Career advancement paths", d: "Many of our senior leaders started as tellers. We promote from within whenever possible." },
              { icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7", t: "A team that feels like family", d: "Low turnover, strong culture, and colleagues who genuinely support each other." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "18px 20px", background: "rgba(140,29,37,.04)", borderRadius: 14 }}>
                <div style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "rgba(140,29,37,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: RED }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14.5, color: DARK, marginBottom: 3 }}>{item.t}</div>
                  <div style={{ fontSize: 13.5, color: GRAY }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Benefits</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>We take care of our team</h2>
          </div>
          <div className="g-3col" style={{ gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(140,29,37,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: RED, marginBottom: 18 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={b.icon} /></svg>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8 }}>{b.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Roles */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 12 }}>Open Positions</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 38px)", letterSpacing: "-.02em", margin: 0, color: DARK }}>We&apos;re currently hiring in</h2>
          </div>
          <div className="g-4col" style={{ gap: 20 }}>
            {ROLES.map((r, i) => (
              <div key={i} style={{ border: "1px solid rgba(17,24,39,.08)", borderRadius: 18, padding: "28px 24px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: RED, marginBottom: 18 }}>{r.dept}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {r.roles.map((role, j) => (
                    <div key={j} style={{ fontSize: 14, color: DARK, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button style={{ background: RED, color: "#fff", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 36px", borderRadius: 12, cursor: "pointer" }}>View All Open Positions</button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "linear-gradient(145deg,#0d1f3c,#1a3a6b)", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 38px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Ready to make a difference?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Explore open roles or send your resume to our HR team — we&apos;d love to meet you.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>View Open Positions</button>
            <button style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "15px 28px", borderRadius: 12, cursor: "pointer" }}>Send Your Resume</button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ─── News ───────────────────────────────────────────────────────────────── */

function NewsPage() {
  const FEATURED = {
    date: "June 10, 2026",
    tag: "Community",
    title: "SGGINV Awards £120,000 in Small Business Grants to 12 Local Entrepreneurs",
    excerpt: "In our largest grant cycle to date, SGGINV's Community Investment Fund awarded £120,000 to twelve local small businesses — including a family-owned bakery, a minority-owned construction firm, and a nonprofit childcare center serving working families.",
  };
  const NEWS = [
    { date: "May 28, 2026", tag: "Products", title: "SGGINV Launches New High-Yield Savings Account with 5.10% APY", excerpt: "Starting June 1st, new and existing SGGINV customers can open our new Premium Savings account featuring one of the most competitive yields in the region." },
    { date: "May 14, 2026", tag: "Community", title: "SGGINV Volunteers Log 2,400 Hours During Spring Community Day", excerpt: "Over 180 SGGINV employees across all branches participated in our annual community day, partnering with local nonprofits on cleanup, renovation, and food drive projects." },
    { date: "April 22, 2026", tag: "Awards", title: "SGGINV Named Best Community Bank in the Region for 4th Consecutive Year", excerpt: "The regional business journal honored SGGINV with the Best Community Bank award, citing customer satisfaction scores, local reinvestment, and digital banking innovation." },
    { date: "April 5, 2026", tag: "Technology", title: "New Mobile App Update Brings Budgeting Tools and Instant Card Controls", excerpt: "The latest version of the SGGINV mobile app includes real-time spending insights, custom budget categories, and the ability to instantly freeze or unfreeze your debit card." },
    { date: "March 18, 2026", tag: "Lending", title: "SGGINV Expands SBA Lending Program Following £50M in Business Loans", excerpt: "After crossing £50 million in SBA loan originations, SGGINV has expanded its business lending team and added new SBA 504 program capabilities for commercial real estate." },
    { date: "February 28, 2026", tag: "Community", title: "Financial Literacy Program Reaches 1,000th Student This Semester", excerpt: "SGGINV's school-based financial education program hit a milestone this spring, with volunteer bankers reaching students at 14 local schools across the district." },
  ];
  const tagColor = (tag: string) => {
    const map: Record<string, string> = { Community: "#1e4020", Products: "#0d1f3c", Awards: "#3d2e00", Technology: "#1a1a2e", Lending: "#2d1b4e" };
    return map[tag] ?? "#2C0A10";
  };
  return (
    <SiteLayout>
      {/* Hero */}
      <div className="mob-hero" style={{ background: "linear-gradient(145deg,#1a1a2e,#2d2d4e)", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(212,175,55,.9)", fontWeight: 700, marginBottom: 16 }}>About SGGINV</div>
          <h1 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(30px, 5.5vw, 58px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.04, letterSpacing: "-.025em", maxWidth: 700 }}>Press &amp; News</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>Stay up to date with the latest news, announcements, partnerships, and community stories from SGGINV.</p>
        </div>
      </div>

      {/* Featured story */}
      <div className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 24 }}>Featured Story</div>
          <div className="mob-stack" style={{ border: "1.5px solid rgba(17,24,39,.09)", borderRadius: 22, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div
              style={{
                backgroundImage: "url('/31-RibbonCuttingConfetti.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: 360,
              }}
            />
            <div style={{ padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ background: tagColor(FEATURED.tag), color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999 }}>{FEATURED.tag}</span>
                <span style={{ fontSize: 13, color: GRAY }}>{FEATURED.date}</span>
              </div>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: DARK, lineHeight: 1.22, margin: "0 0 18px", letterSpacing: "-.01em" }}>{FEATURED.title}</h2>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.72, margin: "0 0 28px" }}>{FEATURED.excerpt}</p>
              <button style={{ alignSelf: "flex-start", background: RED, color: "#fff", border: "none", fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "12px 24px", borderRadius: 11, cursor: "pointer" }}>Read Full Story</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent news grid */}
      <div className="mob-section" style={{ background: "#F8F9FA", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 36 }}>Recent News</div>
          <div className="g-3col" style={{ gap: 20 }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ background: tagColor(n.tag), color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 999 }}>{n.tag}</span>
                  <span style={{ fontSize: 12, color: GRAY }}>{n.date}</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15.5, color: DARK, lineHeight: 1.35, marginBottom: 12 }}>{n.title}</div>
                <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.65, flex: 1 }}>{n.excerpt}</div>
                <button style={{ marginTop: 20, alignSelf: "flex-start", background: "none", border: "none", color: RED, fontFamily: "inherit", fontSize: 13.5, fontWeight: 700, padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  Read more
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button style={{ background: "none", border: "1.5px solid rgba(140,29,37,.3)", color: RED, fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "13px 32px", borderRadius: 12, cursor: "pointer" }}>Load More Stories</button>
          </div>
        </div>
      </div>

      {/* Press contact */}
      <div className="mob-section" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: 14 }}>Media Inquiries</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", margin: "0 0 18px", color: DARK }}>Members of the press</h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.72, margin: "0 0 36px" }}>For interview requests, press releases, financial data, or media assets, please contact our communications team directly. We aim to respond to all media inquiries within one business day.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: RED, color: "#fff", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 32px", borderRadius: 12, cursor: "pointer" }}>Contact Press Team</button>
            <button style={{ background: "none", border: "1.5px solid rgba(17,24,39,.14)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "14px 28px", borderRadius: 12, cursor: "pointer", color: GRAY }}>Download Press Kit</button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mob-section" style={{ background: "linear-gradient(145deg,#1a1a2e,#2d2d4e)", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight:600, fontSize: "clamp(22px, 3.5vw, 38px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>Stay connected with SGGINV</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Sign up for our newsletter and be the first to hear about new products, community events, and local news.</p>
          <button style={{ background: GOLD, color: "#4A0E14", border: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "15px 34px", borderRadius: 12, cursor: "pointer" }}>Subscribe to Newsletter</button>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────── */

/* ─── Router ─────────────────────────────────────────────────────────────── */

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "story")     return <StoryPage />;
  if (slug === "community") return <CommunityPage />;
  if (slug === "careers")   return <CareersPage />;
  if (slug === "news")      return <NewsPage />;

  notFound();
}
