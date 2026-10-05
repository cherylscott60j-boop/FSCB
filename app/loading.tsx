export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "rgba(140,29,37,.1)",
          overflow: "hidden",
        }}
      >
        <div className="sgginv-progress-bar" />
      </div>

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,29,37,.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "linear-gradient(145deg,#8C1D25,#6B151C)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          boxShadow: "0 12px 40px rgba(140,29,37,.25)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M4 19V8.5L12 4l8 4.5V19" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 900,
          fontSize: 26,
          color: "#111827",
          letterSpacing: "-.01em",
          lineHeight: 1,
        }}
      >
        SGGINV
      </div>
      <div
        style={{
          fontSize: 9.5,
          letterSpacing: ".38em",
          color: "#9CA3AF",
          marginTop: 5,
          fontWeight: 600,
        }}
      >
        COMMUNITY BANK
      </div>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
        <span className="sgginv-dot" />
        <span className="sgginv-dot" />
        <span className="sgginv-dot" />
      </div>
    </div>
  );
}
