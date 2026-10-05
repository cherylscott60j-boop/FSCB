import { LogoMark } from "@/components/Logo";

const BLUE = "#0800FF";

/* Full-screen loading state: animated logo mark on the brand blue. */
export default function BrandLoader({ message }: { message?: string }) {
  return (
    <div
      role="status"
      aria-label={message ?? "Loading"}
      style={{
        minHeight: "100vh",
        background: BLUE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-poppins), sans-serif",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div className="sg-loader-mark" style={{ marginBottom: 22 }}>
        <LogoMark size={76} animated />
      </div>

      <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-.01em", lineHeight: 1 }}>
        SAFEGUARD GLOBAL
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".18em", color: "rgba(255,255,255,.72)", marginTop: 6 }}>
        INVESTMENT BANK
      </div>

      {message && (
        <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.88)", marginTop: 28 }}>{message}</div>
      )}

      <div style={{ width: 160, height: 3, borderRadius: 2, background: "rgba(255,255,255,.2)", overflow: "hidden", marginTop: message ? 16 : 36 }}>
        <div className="sgginv-progress-bar" />
      </div>
    </div>
  );
}
