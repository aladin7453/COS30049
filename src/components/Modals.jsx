import { useState } from "react";

// Settings Modal 
export function SettingsModal({ onClose, themeMode, onThemeChange }) {
  const t = window.__T;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">⚙️ Settings</div>
        <div className="modal-sub">Customize your dashboard appearance</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 12, fontFamily: "Space Mono, monospace", textTransform: "uppercase", letterSpacing: 1 }}>Color Theme</div>
        <div className="theme-options">
          {[
            { id: "dark", emoji: "🌙", label: "Dark", sub: "Forest night mode", bg: "#0a0f0d", sidebar: "#0d1510", accent: "#2ecc71" },
            { id: "light", emoji: "☀️", label: "Light", sub: "Daylight forest view", bg: "#f0faf3", sidebar: "#e8f5ed", accent: "#16a34a" },
          ].map((opt) => (
            <div key={opt.id} className={`theme-option ${themeMode === opt.id ? "selected" : ""}`} onClick={() => onThemeChange(opt.id)}>
              <div className="theme-option-preview" style={{ background: opt.bg }}>
                <div style={{ width: "30%", background: opt.sidebar, borderRight: `1px solid ${opt.id === "dark" ? "#1e3a28" : "#bbdfc8"}`, display: "flex", flexDirection: "column", gap: 4, padding: 6 }}>
                  {[1, 2, 3].map((i) => <div key={i} style={{ height: 6, borderRadius: 3, background: opt.id === "dark" ? "#1e3a28" : "#bbdfc8" }} />)}
                </div>
                <div style={{ flex: 1, padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ height: 8, borderRadius: 3, background: opt.accent, width: "60%" }} />
                  <div style={{ height: 5, borderRadius: 3, background: opt.id === "dark" ? "#1e3a28" : "#bbdfc8", width: "80%" }} />
                  <div style={{ height: 5, borderRadius: 3, background: opt.id === "dark" ? "#1e3a28" : "#bbdfc8", width: "50%" }} />
                </div>
              </div>
              <div className="theme-option-label">{opt.emoji} {opt.label}</div>
              <div className="theme-option-sub">{opt.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//  Video Playback Modal 
export function VideoModal({ alert: a, onClose }) {
  const t = window.__T;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>🎥 Video Evidence — {a.cam}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{a.location} · {a.type} · {a.time}</div>
          </div>
          <button className="modal-close" style={{ position: "static" }} onClick={onClose}>✕</button>
        </div>

        {/* Player */}
        <div className="video-player" onClick={() => setPlaying(!playing)}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#020a04,#050f07)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 48, opacity: 0.15 }}>🎥</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontFamily: "Space Mono, monospace" }}>
              wildlife-interaction-{a.cam.toLowerCase()}-{a.time?.replace(/:/g, "-")}.mp4
            </div>
          </div>
          <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "Space Mono, monospace", fontSize: 11, color: "rgba(255,255,255,.7)", background: "rgba(0,0,0,.5)", padding: "3px 8px", borderRadius: 4 }}>{a.time}</div>
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,.2)", border: "1px solid rgba(239,68,68,.4)", padding: "3px 8px", borderRadius: 4 }}>
            <div className="rec-dot" />
            <span style={{ fontSize: 10, color: "#fca5a5", fontFamily: "Space Mono, monospace", fontWeight: 700 }}>ANOMALY DETECTED</span>
          </div>
          <div style={{ position: "absolute", width: 56, height: 56, borderRadius: "50%", background: "rgba(46,204,113,.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", boxShadow: "0 4px 20px rgba(46,204,113,.4)" }}>
            {playing ? "⏸" : "▶"}
          </div>
        </div>

        {/* Controls */}
        <div className="video-controls">
          <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textMuted, minWidth: 36 }}>0:{String(progress).padStart(2, "0")}</span>
          <div className="video-scrubber" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProgress(Math.round((e.clientX - r.left) / r.width * 55)); }}>
            <div className="video-scrubber-fill" style={{ width: `${(progress / 55) * 100}%` }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textMuted }}>0:55</span>
          <button className="btn btn-sm btn-outline" style={{ fontSize: 10 }}>⬇ Save</button>
        </div>

        {/* Meta */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 24 }}>
          {[["📍 Location", a.location], ["👤 Guide", a.guide], ["⚠️ Type", a.type], ["🕐 Time", a.time]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
