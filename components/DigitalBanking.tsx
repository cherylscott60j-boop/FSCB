"use client";

const APP_FEATURES = [
  { label: "Instant transfers", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h13l-4-4M21 16H8l4 4"/></svg> },
  { label: "Savings goals",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg> },
  { label: "Virtual cards",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg> },
  { label: "Bill pay",         icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2V2z"/><path d="M9 7h6M9 11h6"/></svg> },
  { label: "Spending insights",icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5M4 19h16M8 16l3-3 3 1 4-5"/></svg> },
  { label: "Card freeze",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M5 7l14 10M19 7L5 17M3 12h18"/></svg> },
];

export default function DigitalBanking() {
  return (
    <section
      style={{
        background: "linear-gradient(160deg,#6B151C,#4A0E14)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 80% 30%, rgba(212,175,55,.15), transparent 42%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="g-digital mob-section"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "84px 32px",
          position: "relative",
          gap: 60,
        }}
      >
        {/* Copy */}
        <div>
          <span
            style={{
              fontSize: 13,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#D4AF37",
              fontWeight: 700,
            }}
          >
            Digital Banking
          </span>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-.02em",
              margin: "14px 0 18px",
            }}
          >
            Bank from anywhere with Safeguard Global&apos;s digital tools
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,.8)",
              lineHeight: 1.6,
              margin: "0 0 32px",
              maxWidth: 440,
            }}
          >
            Stay connected to seamless transactions, intuitive interfaces, and 24/7 access. For your personal or business use, all at your fingertips.
          </p>

          <div
            className="g-features"
            style={{
              gap: 14,
              maxWidth: 480,
              marginBottom: 34,
            }}
          >
            {APP_FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 13,
                  padding: "13px 15px",
                }}
              >
                <span style={{ color: "#D4AF37" }}>{f.icon}</span>
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 13 }}>
            {/* App Store */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                color: "#4A0E14",
                border: "none",
                borderRadius: 13,
                padding: "12px 20px",
                cursor: "pointer",
                transition: "transform .2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#6B151C">
                <path d="M16.5 1c.1 1.2-.4 2.4-1.1 3.2-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.1.8-.9 2.1-1.5 3.1-1.6zM20 17c-.6 1.4-.9 2-1.7 3.2-1.1 1.7-2.6 3.8-4.5 3.8-1.7 0-2.1-1.1-4.4-1.1s-2.8 1.1-4.4 1.1c-1.9 0-3.4-1.9-4.5-3.6C-.4 16.7-.7 11.2 1.3 8.3c1-1.5 2.7-2.4 4.3-2.4 1.7 0 2.8 1.1 4.2 1.1 1.4 0 2.2-1.1 4.2-1.1 1.4 0 2.9.8 4 2.1-3.5 1.9-2.9 6.9 2 9z" />
              </svg>
              <div style={{ textAlign: "left", lineHeight: 1.1 }}>
                <div style={{ fontSize: 9, fontWeight: 500 }}>Download on the</div>
                <div style={{ fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif", fontWeight: 700, fontSize: 15 }}>App Store</div>
              </div>
            </button>
            {/* Google Play */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                color: "#4A0E14",
                border: "none",
                borderRadius: 13,
                padding: "12px 20px",
                cursor: "pointer",
                transition: "transform .2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              <svg width="20" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 2.5v19l11-9.5L3 2.5z" fill="#6B151C" />
                <path d="M3 2.5l11 9.5 3.5-3L5 2c-.8-.5-1.6-.3-2 .5z" fill="#8C1D25" />
              </svg>
              <div style={{ textAlign: "left", lineHeight: 1.1 }}>
                <div style={{ fontSize: 9, fontWeight: 500 }}>Get it on</div>
                <div style={{ fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif", fontWeight: 700, fontSize: 15 }}>Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="phone-wrap">
          <div
            style={{
              width: 300,
              height: 600,
              borderRadius: 42,
              background: "#0a0a0a",
              padding: 11,
              boxShadow: "0 40px 80px -24px rgba(0,0,0,.6)",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 22,
                left: "50%",
                transform: "translateX(-50%)",
                width: 96,
                height: 26,
                background: "#0a0a0a",
                borderRadius: 14,
                zIndex: 3,
              }}
            />
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 32,
                background: "#F8F9FA",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* App header */}
              <div
                style={{
                  background: "linear-gradient(150deg,#8C1D25,#6B151C)",
                  padding: "52px 22px 26px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 22,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>Good morning,</div>
                    <div style={{ fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif", fontWeight: 700, fontSize: 17 }}>Sarah</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.18)" }} />
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.72)" }}>Available balance</div>
                <div style={{ fontFamily: "var(--font-montserrat), 'Libre Franklin', sans-serif", fontWeight: 800, fontSize: 32, margin: "4px 0 16px" }}>
                  $12,840<span style={{ fontSize: 18, color: "rgba(255,255,255,.7)" }}>.20</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Send", "Request", "Add"].map((label, i) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        background: i === 2 ? "#D4AF37" : "rgba(255,255,255,.14)",
                        color: i === 2 ? "#4A0E14" : "#fff",
                        borderRadius: 11,
                        padding: 10,
                        textAlign: "center",
                        fontSize: 11.5,
                        fontWeight: i === 2 ? 700 : 600,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "18px 20px" }}>
                {/* Savings progress */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: "0 6px 18px -10px rgba(17,24,39,.18)",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Emergency fund</span>
                    <span style={{ fontSize: 12, color: "#8C1D25", fontWeight: 700 }}>72%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 5, background: "#f3eded", overflow: "hidden" }}>
                    <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg,#8C1D25,#A52430)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginTop: 8 }}>
                    <span>$7,200 saved</span>
                    <span>$10,000 goal</span>
                  </div>
                </div>

                {/* Recent activity */}
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#6B7280", margin: "4px 0 10px" }}>Recent activity</div>
                {[
                  { label: "Direct deposit", sub: "Today", amount: "+$2,400", positive: true, bg: "rgba(140,29,37,.12)" },
                  { label: "Grocery store", sub: "Yesterday", amount: "-$87.00", positive: false, bg: "rgba(17,24,39,.06)" },
                  { label: "Roundup to savings", sub: "Yesterday", amount: "-$3.20", positive: false, bg: "rgba(212,175,55,.16)" },
                ].map((tx, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: tx.bg, flex: "none" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{tx.label}</div>
                      <div style={{ fontSize: 10.5, color: "#6B7280" }}>{tx.sub}</div>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: tx.positive ? "#8C1D25" : "#111827" }}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
