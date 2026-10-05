const TESTIMONIALS = [
  {
    quote:
      "We went from a small farm to a thriving business. SGGINV's local lending team understood our needs when no one else would.",
    name: "Marcus & Joan Whitfield",
    role: "Small Business Owners",
    initials: "MW",
    bg: "#8C1D25",
  },
  {
    quote:
      "The savings goals feature actually changed my behavior. I bought my first home two years ahead of plan.",
    name: "Danielle Reyes",
    role: "First-Time Homebuyer",
    initials: "DR",
    bg: "#6B151C",
  },
  {
    quote:
      "Switching our whole company over took an afternoon. The business banking team made it effortless.",
    name: "Priya Anand",
    role: "COO, Hearth & Co.",
    initials: "PA",
    bg: "#A52430",
  },
];

const StarRow = ({ size = 16 }: { size?: number }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#D4AF37">
        <path d="M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section>
      {/* ── Upper band: dark maroon ── */}
      <div style={{ background: "linear-gradient(135deg, #2C0A10, #8C1D25)" }}>
        <div
          className="trust-band resp-pad"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Rating block */}
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.55)",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Customer Reviews
            </p>
            <div
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: "clamp(64px, 9vw, 96px)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-.04em",
              }}
            >
              4.9
            </div>
            <div style={{ marginTop: 12 }}>
              <StarRow size={22} />
            </div>
            <p
              style={{
                color: "rgba(255,255,255,.6)",
                fontSize: 14,
                margin: "10px 0 0",
              }}
            >
              Based on 2,800+ Google reviews
            </p>
          </div>

          {/* Divider — hidden on mobile via flex-wrap */}
          <div
            style={{
              width: 1,
              alignSelf: "stretch",
              background: "rgba(255,255,255,.15)",
              flexShrink: 0,
            }}
          />

          {/* Heading + stats */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(26px, 3.5vw, 44px)",
                lineHeight: 1.08,
                letterSpacing: "-.025em",
                color: "#fff",
                margin: "0 0 32px",
              }}
            >
              Real members,<br />real results.
            </h2>

            {/* Key stats row */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                { value: "18,000+", label: "Members served" },
                { value: "120+",    label: "Years in the community" },
                { value: "12",      label: "Local branches" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      color: "#D4AF37",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Lower band: testimonial cards ── */}
      <div style={{ background: "#fff" }}>
        <div
          className="trust-band trust-cards resp-pad"
          style={{ maxWidth: 1240, margin: "0 auto" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                border: "1px solid rgba(17,24,39,.08)",
                borderRadius: 20,
                padding: "28px 28px 24px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StarRow size={14} />

              <p
                style={{
                  fontSize: 15.5,
                  lineHeight: 1.65,
                  color: "#111827",
                  fontWeight: 500,
                  margin: "16px 0 0",
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(17,24,39,.07)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: t.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "var(--font-poppins), sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
