import { useState } from "react";
import { apiFetch, DEMO_MODE } from "../api/index";
import { Toggle } from "../components/UI";

//  PAGE: Training Modules (Admin view)
export function TrainingPage({ onEditModule }) {
  const t = window.__T;
  const modules = [
    { icon: "🦎", name: "Biodiversity & Wildlife", desc: "Flora, fauna, and ecosystem interactions", quizzes: 5, enrolled: 42, color: "#2ecc71", published: true },
    { icon: "⚖️", name: "Conservation Legislation", desc: "Sarawak wildlife laws and enforcement", quizzes: 4, enrolled: 38, color: "#60a5fa", published: true },
    { icon: "🛡️", name: "Safety Protocols", desc: "Emergency response and hazard management", quizzes: 6, enrolled: 35, color: "#f59e0b", published: false },
  ];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: t.textMuted }}>3 modules · 80% pass threshold</div>
        <button className="btn btn-primary btn-sm" onClick={() => onEditModule(null)}>+ New Module</button>
      </div>
      <div className="three-col">
        {modules.map((m, i) => (
          <div className="panel" key={i}>
            <div className="panel-body">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${m.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{m.icon}</div>
                <span className={`badge ${m.published ? "badge-green" : "badge-yellow"}`}>{m.published ? "PUBLISHED" : "DRAFT"}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 6 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{m.desc}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ textAlign: "center", background: t.bgPanel, borderRadius: 8, padding: "10px 6px", border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.quizzes}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>QUIZZES</div>
                </div>
                <div style={{ textAlign: "center", background: t.bgPanel, borderRadius: 8, padding: "10px 6px", border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: t.greenLight }}>{m.enrolled}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>ENROLLED</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => onEditModule(m)}>✏️ Edit</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>👁 Preview</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// PAGE: Module Editor 
export function ModuleEditorPage({ module: initMod, onBack }) {
  const t = window.__T;
  const isNew = !initMod;
  const [title, setTitle] = useState(initMod?.name || "");
  const [blocks, setBlocks] = useState(isNew ? [] : [
    { type: "image", id: 1, src: "wildlife-safety-intro.jpg" },
    { type: "text", id: 2, content: "Section 2: Key Guidelines\n• Maintain safe distance: minimum 50 meters\n• Never feed or approach wildlife\n• Report aggressive behavior immediately\n• Use designated trails only" },
    { type: "video", id: 3, filename: "emergency-procedures.mp4", duration: "5:32" },
  ]);
  const [settings, setSettings] = useState({ published: initMod?.published ?? false, mandatory: true, quizRequired: true, passScore: 80 });

  const addBlock = (type) => setBlocks((bs) => [...bs, { type, id: Date.now(), content: type === "text" ? "Add your content here..." : "" }]);
  const removeBlock = (id) => setBlocks((bs) => bs.filter((b) => b.id !== id));

  const handleSave = async () => {
    if (!DEMO_MODE) {
      try {
        const payload = { title, blocks, settings };
        if (isNew) await apiFetch("/admin/modules", { method: "POST", body: JSON.stringify(payload) });
        else await apiFetch(`/admin/modules/${initMod.module_id || initMod.name}`, { method: "PUT", body: JSON.stringify(payload) });
      } catch (e) { alert(`❌ Save failed: ${e.message}`); return; }
    }
    onBack();
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>{isNew ? "New Training Module" : `Edit — ${initMod.name}`}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Module Editor · Pass Score: {settings.passScore}%</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline btn-sm">👁 Preview</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>💾 Save Changes</button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Canvas */}
        <div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Module Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Biodiversity & Wildlife Management" style={{ fontSize: 15, fontWeight: 700 }} />
          </div>
          <div className="editor-canvas">
            {blocks.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: t.textMuted }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>No content blocks yet</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Add content using the panel on the right</div>
              </div>
            )}
            {blocks.map((b) => (
              <div className="editor-block" key={b.id}>
                <div className="editor-block-label">
                  <span>{b.type === "text" ? "📝 Text Block" : b.type === "image" ? "🖼 Image" : b.type === "video" ? "🎥 Video" : "❓ Quiz Question"}</span>
                  <span className="editor-block-del" onClick={() => removeBlock(b.id)}>🗑</span>
                </div>
                {b.type === "text" && (
                  <textarea value={b.content} onChange={(e) => setBlocks((bs) => bs.map((x) => x.id === b.id ? { ...x, content: e.target.value } : x))} className="form-input" rows={4} style={{ resize: "vertical", fontFamily: "Syne, sans-serif" }} />
                )}
                {b.type === "image" && (
                  <div style={{ border: `2px dashed ${t.border}`, borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🖼</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{b.src || "Click to upload image"}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>PNG, JPG up to 10MB</div>
                  </div>
                )}
                {b.type === "video" && (
                  <div style={{ border: `2px dashed ${t.border}`, borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{b.filename || "Click to upload video"}</div>
                    {b.duration && <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Duration: {b.duration}</div>}
                  </div>
                )}
                {b.type === "quiz" && (
                  <div>
                    <input className="form-input" placeholder="Question text..." style={{ marginBottom: 10 }} defaultValue={b.question} />
                    {["A", "B", "C", "D"].map((l, i) => (
                      <div key={l} className="quiz-option-row">
                        <input type="radio" name={`q${b.id}`} defaultChecked={i === 0} />
                        <input className="form-input" placeholder={`Option ${l}`} style={{ flex: 1 }} defaultValue={b.options?.[i] || ""} />
                      </div>
                    ))}
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 6 }}>Select the correct answer (radio button)</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          <div className="panel">
            <div className="panel-header"><div className="panel-title">➕ Add Content</div></div>
            <div className="panel-body" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {[["📝", "Text Block"], ["🖼", "Upload Image"], ["🎬", "Upload Video"], ["❓", "Quiz Question"]].map(([icon, label], i) => (
                <button key={label} className="add-content-btn" onClick={() => addBlock(["text", "image", "video", "quiz"][i])}>
                  <span style={{ fontSize: 16 }}>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title">⚙️ Settings</div></div>
            <div className="panel-body" style={{ padding: "8px 16px" }}>
              {[["Published", "published"], ["Mandatory", "mandatory"], ["Quiz Required", "quizRequired"]].map(([label, key]) => (
                <div className="toggle-row" key={key}>
                  <span className="toggle-label">{label}</span>
                  <Toggle on={settings[key]} onChange={(v) => setSettings((s) => ({ ...s, [key]: v }))} />
                </div>
              ))}
              <div style={{ paddingTop: 12 }}>
                <div className="form-label">Pass Score (%)</div>
                <input className="form-input" type="number" value={settings.passScore} onChange={(e) => setSettings((s) => ({ ...s, passScore: e.target.value }))} min="0" max="100" />
              </div>
            </div>
          </div>

          <div style={{ background: t.bgPanel, borderRadius: 10, padding: 14, border: `1px solid ${t.border}`, fontSize: 12, color: t.textMuted }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>Content Blocks</span><strong style={{ color: t.text }}>{blocks.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>Quiz Questions</span><strong style={{ color: t.text }}>{blocks.filter((b) => b.type === "quiz").length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Status</span>
              <span className={`badge ${settings.published ? "badge-green" : "badge-yellow"}`} style={{ fontSize: 10 }}>{settings.published ? "PUBLISHED" : "DRAFT"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
