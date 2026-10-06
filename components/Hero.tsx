import Link from "next/link";

const BLUE = "#0800FF";
const RED = "#E31E24";
const NAVY = "6,10,46";
const FONT = "var(--font-poppins), sans-serif";

const HIGHLIGHTS = ["$0 monthly fees", "Paid up to 2 days early", "24/7 support"];

export default function Hero() {
  return (
    <section
      className="sg-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLUE,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%)",
        fontFamily: FONT,
      }}
    >
      {/* Photo: right side on desktop, top on phones */}
      <div className="sg-hero-photo" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-photo.jpg"
          alt="A customer checking their accounts in the mobile app"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 45%", display: "block" }}
        />
        {/* Blend into the blue text side, with dark navy at the outer edges */}
        <div
          aria-hidden
          className="sg-hero-photo-fade"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${BLUE} 0%, rgba(8,0,255,.6) 12%, rgba(8,0,255,0) 32%), radial-gradient(ellipse at 55% 45%, rgba(${NAVY},0) 55%, rgba(${NAVY},.5) 100%)`,
          }}
        />

        {/* Floating app notification */}
        <div
          aria-hidden
          className="sg-hero-float"
          style={{
            position: "absolute",
            left: "18%",
            bottom: "30%",
            background: "#fff",
            borderRadius: 8,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 230,
            boxShadow: "0 14px 32px rgba(6,10,46,.3)",
          }}
        >
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 12, color: "#6B7280" }}>Salary received · Today</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 17, color: "#111827" }}>+$1,850.00</span>
          </span>
        </div>

        {/* Available balance */}
        <div
          aria-hidden
          className="sg-hero-float"
          style={{ position: "absolute", top: "9%", right: "7%", background: "#fff", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 210, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}
        >
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20M17 15h.01" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 12, color: "#6B7280" }}>Available balance</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 17, color: "#111827" }}>$12,480.16</span>
          </span>
        </div>

        {/* Card status */}
        <div
          aria-hidden
          className="sg-hero-float sg-hero-float-extra"
          style={{ position: "absolute", top: "9%", left: "8%", background: "#fff", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 11, minWidth: 180, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}
        >
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 11.5, color: "#6B7280" }}>Card •••• 4821</span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#111827" }}>Active</span>
          </span>
        </div>

        {/* Savings goal progress */}
        <div
          aria-hidden
          className="sg-hero-float sg-hero-float-extra"
          style={{ position: "absolute", bottom: "8%", right: "6%", background: "#fff", borderRadius: 8, padding: "16px 18px", minWidth: 220, boxShadow: "0 14px 32px rgba(6,10,46,.3)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Vacation fund</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>68%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(17,24,39,.08)", overflow: "hidden", marginBottom: 9 }}>
            <div style={{ width: "68%", height: "100%", background: BLUE, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>$3,400 of $5,000</div>
        </div>
      </div>

      <div className="sg-hero-content" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "60px 32px 150px" }}>
        <div className="sg-hero-copy" style={{ maxWidth: 620 }}>
          <div style={{ display: "inline-block", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,.14)", padding: "6px 12px", borderRadius: 4, marginBottom: 16 }}>
            Personal banking
          </div>
          <h1
            className="sg-hero-h1"
            style={{ fontWeight: 600, fontSize: "clamp(30px, 3.1vw, 44px)", lineHeight: 1.25, letterSpacing: "-.02em", color: "#fff", margin: "0 0 20px" }}
          >
            <span className="sg-hero-line">Grow more with banking</span> <span className="sg-hero-line">and investing in one place</span>
          </h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.7, color: "rgba(255,255,255,.88)", margin: "0 0 26px", maxWidth: 500 }}>
            Whether you&apos;re opening your first account, switching banks, or starting to invest, see how we can help you
            move forward. Eligibility criteria and terms apply.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
            <Link href="/open-account" style={{ background: RED, color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 30px", borderRadius: 4, textDecoration: "none" }}>
              Open an account
            </Link>
            <Link href="/personal/checking" style={{ color: "#fff", fontWeight: 600, fontSize: 15, padding: "13px 26px", borderRadius: 4, border: "1.5px solid rgba(255,255,255,.55)", textDecoration: "none" }}>
              Compare accounts
            </Link>
          </div>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.2)" }}>
            {HIGHLIGHTS.map((h) => (
              <span key={h} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#fff" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sg-hero-line { display: block; white-space: nowrap; }
        @media (max-width: 1100px) {
          .sg-hero-line { display: inline; white-space: normal; }
        }
        @media (max-width: 960px) {
          .sg-hero-photo { width: 46% !important; }
          .sg-hero-copy { max-width: 420px !important; }
          /* Narrower photo column makes the left/right cards collide */
          .sg-hero-float-extra { display: none !important; }
        }
        @media (max-width: 760px) {
          .sg-hero {
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%) !important;
            display: flex; flex-direction: column;
          }
          .sg-hero-photo { position: relative !important; width: 100% !important; aspect-ratio: 3 / 2; }
          .sg-hero-photo-fade { background: linear-gradient(180deg, rgba(8,0,255,0) 60%, #0800FF 100%) !important; }
          .sg-hero-content { padding: 4px 20px 80px !important; }
          .sg-hero-copy { max-width: none !important; }
          .sg-hero-h1 { font-size: 28px !important; }
        }
        @media (max-width: 420px) {
          .sg-hero-float { padding: 10px 14px !important; min-width: 0 !important; }
        }
      `}</style>
    </section>
  );
}
