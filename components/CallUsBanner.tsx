"use client";

const FONT = "var(--font-montserrat), 'Libre Franklin', sans-serif";

export default function CallUsBanner() {
  return (
    <section className="resp-pad mob-px" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px 84px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(17,24,39,.07)",
          borderRadius: 22,
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, margin: "0 0 8px" }}>
            Give us a call
          </h3>
          <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            Have a question about an account, a product, or anything else? Our
            U.S.-based contact center is happy to help.
          </p>
        </div>

        <a
          href="tel:18007233473"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#8C1D25",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: 14.5,
            fontWeight: 700,
            padding: "13px 26px",
            borderRadius: 999,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background .2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6B151C"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#8C1D25"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          1-800-SAFEGRD
        </a>
      </div>
    </section>
  );
}
