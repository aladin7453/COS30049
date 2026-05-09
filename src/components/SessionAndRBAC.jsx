//  Session Timeout Banner 
export function SessionTimeoutBanner({ onExtend, secondsLeft }) {
  const t = window.__T;
  if (secondsLeft > 60) return null;
  const pct = (secondsLeft / 60) * 100;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000, background: secondsLeft <= 20 ? "rgba(239,68,68,.95)" : "rgba(245,158,11,.95)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div className="session-bar" style={{ flex: 1 }}>
        <div className="session-bar-fill" style={{ width: `${pct}%`, background: secondsLeft <= 20 ? "#fca5a5" : "#fde68a" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>
        ⏱ Session expires in {secondsLeft}s
      </span>
      <button className="btn btn-sm" style={{ background: "white", color: secondsLeft <= 20 ? "#dc2626" : "#d97706", fontWeight: 700, flexShrink: 0 }} onClick={onExtend}>
        Extend Session
      </button>
    </div>
  );
}

//  RBAC 403 Screen 
export function RBACScreen({ onBack }) {
  const t = window.__T;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: 40 }}>
      <div style={{ background: t.bgCard, border: "1px solid rgba(239,68,68,.4)", borderRadius: 20, padding: "48px 40px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 0 60px rgba(239,68,68,.08)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 48, fontWeight: 800, color: t.red, marginBottom: 8 }}>403</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 12 }}>Access Forbidden</div>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
          Your current role <strong style={{ color: t.orange }}>PARK_GUIDE</strong> does not have permission to access this resource. This attempt has been logged.
        </div>
        <div style={{ background: t.bgPanel, borderRadius: 10, padding: 14, marginBottom: 20, border: `1px solid ${t.border}`, textAlign: "left" }}>
          {[
            ["Endpoint", "POST /api/admin/cv/approve"],
            ["Required Role", "ADMIN"],
            ["Your Role", "PARK_GUIDE"],
            ["Status", "HTTP 403 Forbidden"],
            ["Logged at", new Date().toLocaleTimeString()],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${t.border}`, fontSize: 11 }}>
              <span style={{ color: t.textMuted, fontFamily: "Space Mono, monospace" }}>{k}</span>
              <span style={{ color: k === "Status" ? t.red : k === "Required Role" ? t.orange : t.text, fontFamily: "Space Mono, monospace", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={onBack}>← Go Back</button>
      </div>
    </div>
  );
}
