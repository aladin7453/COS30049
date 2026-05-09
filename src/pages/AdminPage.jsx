import { useState, useEffect } from "react";
import { apiFetch, API_BASE, DEMO_MODE } from "../api/index";
import { useApi } from "../api/useApi";
import { LoadingRows, ErrorBanner } from "../components/UI";

export default function GuidesPage() {
  const t = window.__T;
  const { data, loading, error, reload } = useApi(() => apiFetch("/admin/guides"));
  const [guides, setGuides] = useState(null);
  const [search, setSearch] = useState("");
  const [viewCV, setViewCV] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => { if (data) setGuides(data); }, [data]);

  const COLORS = ["#2ecc71", "#a78bfa", "#f59e0b", "#60a5fa", "#ef4444", "#34d399"];
  const displayGuides = guides || [
    { user_id: "G-001", username: "Nurul Aisyah binti Ahmad", cv_status: "Certified", modules_completed: 3 },
    { user_id: "G-002", username: "Muhammad Hafiz bin Hassan", cv_status: "In Progress", modules_completed: 2 },
    { user_id: "G-003", username: "Siti Aminah binti Rahman", cv_status: "Certified", modules_completed: 3 },
    { user_id: "G-004", username: "Arjun a/l Subramaniam", cv_status: "Certified", modules_completed: 3 },
    { user_id: "G-005", username: "Lee Wei Xian", cv_status: "Pending", modules_completed: 0 },
    { user_id: "G-006", username: "Fatimah binti Osman", cv_status: "In Progress", modules_completed: 1 },
  ];

  const filtered = displayGuides.filter((g) => (g.username || g.name || "").toLowerCase().includes(search.toLowerCase()));

  const approveGuide = async (guide) => {
    setActionLoading(guide.user_id); setActionError("");
    try {
      await apiFetch(`/admin/cv/${guide.user_id}/approve`, { method: "PUT", body: JSON.stringify({ approval_tier: "standard" }) });
      setGuides((gs) => (gs || displayGuides).map((g) => g.user_id === guide.user_id ? { ...g, cv_status: "In Progress" } : g));
      setViewCV(null);
    } catch (e) { setActionError(e.message); }
    finally { setActionLoading(null); }
  };

  const rejectGuide = async (guide) => {
    setActionLoading(guide.user_id + "_reject"); setActionError("");
    try {
      await apiFetch(`/admin/cv/${guide.user_id}/reject`, { method: "PUT" });
      setGuides((gs) => (gs || displayGuides).map((g) => g.user_id === guide.user_id ? { ...g, cv_status: "Rejected" } : g));
      setViewCV(null);
    } catch (e) { setActionError(e.message); }
    finally { setActionLoading(null); }
  };

  const badge = (s) => {
    if (s === "Certified") return <span className="badge badge-green">CERTIFIED</span>;
    if (s === "In Progress") return <span className="badge badge-yellow">IN PROGRESS</span>;
    if (s === "Rejected") return <span className="badge badge-red">REJECTED</span>;
    return <span className="badge badge-red">PENDING</span>;
  };

  return (
    <>
      {viewCV && (
        <div className="modal-overlay" onClick={() => setViewCV(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewCV(null)}>✕</button>
            <div className="modal-title">📄 CV — {viewCV.username || viewCV.name}</div>
            <div className="modal-sub" style={{ marginBottom: 20 }}>Guide ID: {viewCV.user_id} · Submitted 3 days ago</div>
            {actionError && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: t.red }}>⚠️ {actionError}</div>}
            <div style={{ background: t.bgPanel, borderRadius: 10, padding: 20, border: `1px solid ${t.border}`, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📄</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>cv_{(viewCV.username || viewCV.name || "").split(" ")[0].toLowerCase()}.pdf</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>PDF · Stored securely</div>
                  {viewCV.cv_path && <a href={`${API_BASE}/files/cv/${viewCV.cv_path}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: t.green, display: "block", marginTop: 4 }}>⬇ Download PDF</a>}
                </div>
              </div>
              {[
                ["🎓 Qualifications", viewCV.qualifications || "Diploma in Ecotourism, UNIMAS (2019)"],
                ["🌿 Experience", viewCV.experience || "3 years as field naturalist, Kubah NP"],
                ["🌐 Languages", viewCV.languages || "Bahasa Malaysia, English, Iban"],
                ["🏅 Prior Certs", viewCV.prior_certs || "Wilderness First Aid, Fire Safety Level 2"],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: t.text }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", opacity: actionLoading === viewCV.user_id ? 0.6 : 1 }} onClick={() => approveGuide(viewCV)} disabled={!!actionLoading}>
                {actionLoading === viewCV.user_id ? "Approving…" : "✓ Approve Access"}
              </button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: "center", opacity: actionLoading === viewCV.user_id + "_reject" ? 0.6 : 1 }} onClick={() => rejectGuide(viewCV)} disabled={!!actionLoading}>
                {actionLoading === viewCV.user_id + "_reject" ? "Rejecting…" : "✕ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: t.textMuted }}>{filtered.length} total guides registered</div>
        <button className="btn btn-primary btn-sm">+ Invite Guide</button>
      </div>
      {error && <ErrorBanner message={error} onRetry={reload} />}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">👥 All Park Guides</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {loading && <span style={{ fontSize: 11, color: t.textMuted }}>Loading…</span>}
            <input className="form-input" placeholder="Search guides…" style={{ width: 200, padding: "6px 12px", fontSize: 12 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Guide</th><th>Guide ID</th><th>Modules Completed</th><th>Certification Status</th><th>Actions</th></tr></thead>
          {loading ? <LoadingRows cols={5} rows={5} /> : (
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.user_id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="guide-avatar" style={{ background: COLORS[i % COLORS.length] }}>{(g.username || g.name || "?")[0]}</div>
                      {g.username || g.name}
                    </div>
                  </td>
                  <td><span style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color: t.textMuted }}>{g.user_id}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${((g.modules_completed || 0) / 3) * 100}%` }} /></div>
                      <span style={{ fontSize: 12, color: t.textMuted }}>{g.modules_completed || 0}/3</span>
                    </div>
                  </td>
                  <td>{badge(g.cv_status)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setViewCV(g)}>View CV</button>
                      {g.cv_status === "Pending" && (
                        <button className="btn btn-primary btn-sm" onClick={() => approveGuide(g)} disabled={actionLoading === g.user_id}>
                          {actionLoading === g.user_id ? "…" : "Approve"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
