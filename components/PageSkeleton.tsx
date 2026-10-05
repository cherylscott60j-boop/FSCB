/* Skeleton loader for SiteLayout-wrapped dynamic pages */
export default function PageSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F5FB" }}>

      {/* TopBar skeleton */}
      <div style={{ height: 36, background: "#111827", display: "flex", alignItems: "center", padding: "0 32px", gap: 16 }}>
        <div className="sgginv-skeleton-dark" style={{ width: 200, height: 12 }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
          <div className="sgginv-skeleton-dark" style={{ width: 100, height: 12 }} />
          <div className="sgginv-skeleton-dark" style={{ width: 80, height: 12 }} />
        </div>
      </div>

      {/* Nav skeleton */}
      <div style={{ height: 68, background: "#fff", borderBottom: "1px solid rgba(17,24,39,.08)", display: "flex", alignItems: "center", padding: "0 32px", gap: 40 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0800FF", opacity: 0.15 }} />
          <div className="sgginv-skeleton" style={{ width: 60, height: 14 }} />
        </div>
        {/* Nav links */}
        <div style={{ display: "flex", gap: 28, flex: 1 }}>
          {[80, 100, 72, 90, 88].map((w, i) => (
            <div key={i} className="sgginv-skeleton" style={{ width: w, height: 13 }} />
          ))}
        </div>
        {/* CTAs */}
        <div style={{ display: "flex", gap: 10 }}>
          <div className="sgginv-skeleton" style={{ width: 72, height: 36, borderRadius: 8 }} />
          <div style={{ width: 128, height: 36, borderRadius: 8, background: "rgba(8,0,255,.12)" }} />
        </div>
      </div>

      {/* Hero skeleton */}
      <div style={{ background: "#0800FF", padding: "88px 32px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="sgginv-skeleton-dark" style={{ width: 120, height: 11, marginBottom: 20 }} />
          <div className="sgginv-skeleton-dark" style={{ width: "55%", height: 56, marginBottom: 14 }} />
          <div className="sgginv-skeleton-dark" style={{ width: "40%", height: 56, marginBottom: 24 }} />
          <div className="sgginv-skeleton-dark" style={{ width: "45%", height: 18, marginBottom: 8 }} />
          <div className="sgginv-skeleton-dark" style={{ width: "38%", height: 18, marginBottom: 44 }} />
          <div className="sgginv-skeleton-dark" style={{ width: 168, height: 48, borderRadius: 12, marginBottom: 56 }} />
          {/* Stats row */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 32, paddingBottom: 40, display: "flex", gap: 40 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: "1 1 140px" }}>
                <div className="sgginv-skeleton-dark" style={{ width: 80, height: 34, marginBottom: 8 }} />
                <div className="sgginv-skeleton-dark" style={{ width: 110, height: 13 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview section skeleton */}
      <div style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div>
            <div className="sgginv-skeleton" style={{ width: 80, height: 11, marginBottom: 14 }} />
            <div className="sgginv-skeleton" style={{ width: "85%", height: 34, marginBottom: 10 }} />
            <div className="sgginv-skeleton" style={{ width: "70%", height: 34, marginBottom: 20 }} />
            <div className="sgginv-skeleton" style={{ width: "100%", height: 16, marginBottom: 8 }} />
            <div className="sgginv-skeleton" style={{ width: "100%", height: 16, marginBottom: 8 }} />
            <div className="sgginv-skeleton" style={{ width: "80%", height: 16 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: "rgba(8,0,255,.03)", borderRadius: 14, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(8,0,255,.12)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="sgginv-skeleton" style={{ width: "60%", height: 14, marginBottom: 8 }} />
                  <div className="sgginv-skeleton" style={{ width: "90%", height: 13 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid skeleton */}
      <div style={{ background: "#F4F5FB", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="sgginv-skeleton" style={{ width: 90, height: 11, margin: "0 auto 14px" }} />
            <div className="sgginv-skeleton" style={{ width: 320, height: 32, margin: "0 auto" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.07)", borderRadius: 18, padding: "28px 26px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(8,0,255,.06)", marginBottom: 18 }} />
                <div className="sgginv-skeleton" style={{ width: "70%", height: 16, marginBottom: 10 }} />
                <div className="sgginv-skeleton" style={{ width: "100%", height: 13, marginBottom: 6 }} />
                <div className="sgginv-skeleton" style={{ width: "85%", height: 13 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account options skeleton */}
      <div style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="sgginv-skeleton" style={{ width: 130, height: 11, marginBottom: 14 }} />
          <div className="sgginv-skeleton" style={{ width: 280, height: 32, marginBottom: 36 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ border: `2px solid ${i === 1 ? "rgba(8,0,255,.2)" : "rgba(17,24,39,.08)"}`, borderRadius: 20, padding: "32px 30px" }}>
                <div className="sgginv-skeleton" style={{ width: "60%", height: 22, marginBottom: 28 }} />
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                    <div className="sgginv-skeleton" style={{ width: 120, height: 14 }} />
                    <div className="sgginv-skeleton" style={{ width: 90, height: 14 }} />
                  </div>
                ))}
                <div className="sgginv-skeleton" style={{ width: "100%", height: 46, borderRadius: 12, marginTop: 24 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section skeleton */}
      <div style={{ background: "#0800FF", padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="sgginv-skeleton-dark" style={{ width: 300, height: 38, margin: "0 auto 16px" }} />
          <div className="sgginv-skeleton-dark" style={{ width: 420, height: 18, margin: "0 auto 10px" }} />
          <div className="sgginv-skeleton-dark" style={{ width: 360, height: 18, margin: "0 auto 36px" }} />
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <div style={{ width: 160, height: 52, borderRadius: 12, background: "rgba(255,255,255,.25)" }} />
            <div className="sgginv-skeleton-dark" style={{ width: 160, height: 52, borderRadius: 12 }} />
          </div>
        </div>
      </div>

    </div>
  );
}
