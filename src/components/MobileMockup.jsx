import { useState } from "react";

export function MobileMockup({ screen }) {
  return (
    <div className="mobile-frame">
      <div className="mobile-notch"><div className="notch-pill" /></div>
      <div className="mobile-content">
        {screen === "guide-home" && <GuideHomeScreen />}
        {screen === "quiz" && <QuizScreenMobile />}
        {screen === "broadcast" && <BroadcastScreen />}
      </div>
    </div>
  );
}

function GuideHomeScreen() {
  const t = window.__T;
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${t.green},${t.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌿</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>Welcome, User 01</div>
          <div style={{ fontSize: 10, color: t.textMuted }}>Park Guide · Bako NP</div>
        </div>
      </div>
      <div style={{ background: t.bgPanel, borderRadius: 10, padding: 12, marginBottom: 12, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 6, fontFamily: "Space Mono, monospace" }}>CERTIFICATION PROGRESS</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: t.text }}>Overall Progress</span>
          <span style={{ fontSize: 11, color: t.greenLight, fontWeight: 700 }}>60%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: "60%" }} /></div>
      </div>
      {[
        { icon: "🦎", name: "Biodiversity & Wildlife", pct: 100, status: "complete" },
        { icon: "⚖️", name: "Conservation Legislation", pct: 45, status: "active" },
        { icon: "🛡️", name: "Safety Protocols", pct: 0, status: "locked" },
      ].map((m, i) => (
        <div key={i} className="module-card" style={{ padding: "10px 12px", marginBottom: 6 }}>
          <div className="module-icon-wrap" style={{ width: 32, height: 32, fontSize: 14, background: m.status === "locked" ? t.border : "rgba(46,204,113,.15)" }}>
            {m.status === "locked" ? "🔒" : m.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.status === "locked" ? t.textMuted : t.text }}>{m.name}</div>
            {m.status !== "locked" && (
              <div className="progress-bar" style={{ marginTop: 4 }}>
                <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.pct === 100 ? t.green : t.orange }} />
              </div>
            )}
          </div>
          {m.status === "complete" && <span style={{ fontSize: 14 }}>✅</span>}
        </div>
      ))}
    </>
  );
}

function QuizScreenMobile() {
  const t = window.__T;
  const [sel, setSel] = useState(null);
  return (
    <>
      <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "Space Mono, monospace", marginBottom: 12 }}>QUIZ · Q3 OF 10</div>
      <div style={{ background: t.bgPanel, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.text, lineHeight: 1.4 }}>What is the minimum safe distance from a Saltwater Crocodile in Bako?</div>
      </div>
      {["5 meters", "10 meters", "50 meters", "100 meters"].map((opt, i) => (
        <div key={i} onClick={() => setSel(i)} style={{ padding: "10px 12px", borderRadius: 8, border: `1px solid ${sel === i ? t.green : t.border}`, background: sel === i ? "rgba(46,204,113,.1)" : t.bgPanel, marginBottom: 8, cursor: "pointer", fontSize: 11, color: sel === i ? t.greenLight : t.text, fontWeight: sel === i ? 700 : 400, transition: "all .2s" }}>
          {String.fromCharCode(65 + i)}. {opt}
        </div>
      ))}
      <div className="progress-bar" style={{ marginTop: 12 }}>
        <div className="progress-fill" style={{ width: "30%", background: t.orange }} />
      </div>
      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4, fontFamily: "Space Mono, monospace", textAlign: "center" }}>3 / 10 ANSWERED</div>
    </>
  );
}

function BroadcastScreen() {
  const t = window.__T;
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>Active Tour</div>
        <div style={{ fontSize: 11, color: t.textMuted }}>Bako National Park Trail</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(239,68,68,.1)", borderRadius: 8, border: "1px solid rgba(239,68,68,.25)", marginBottom: 12 }}>
        <div className="rec-dot" />
        <span style={{ fontSize: 10, color: "#fca5a5", fontFamily: "Space Mono, monospace", fontWeight: 700 }}>LIVE BROADCAST</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: t.textMuted }}>34:15</span>
      </div>
      <div style={{ background: "#020504", borderRadius: 10, padding: 20, textAlign: "center", marginBottom: 12, border: "1px solid rgba(239,68,68,.3)" }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
        <div style={{ fontSize: 10, color: "#fca5a5", fontFamily: "Space Mono, monospace" }}>CAM-GT2 · BODY CAM ACTIVE</div>
        <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2 }}>Trail Point 7</div>
      </div>
      <div style={{ padding: "10px 12px", background: "rgba(239,68,68,.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 11, color: "#fca5a5", fontWeight: 700 }}>Alert Detected · 2 min ago</span>
        </div>
        <div style={{ fontSize: 10, color: t.textMuted }}>Wildlife spotted near trail – Maintain safe distance</div>
      </div>
    </>
  );
}
