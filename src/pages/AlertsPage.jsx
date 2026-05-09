import { useEffect, useState } from "react";
import { apiFetch } from "../api/index";
import { useApi } from "../api/useApi";
import { StatCard, LoadingRows, ErrorBanner } from "../components/UI";
import { VideoModal } from "../components/Modals";

export default function AlertsPage() {
  const t = window.__T;
  const [videoAlert, setVideoAlert] = useState(null);
  const [filter, setFilter] = useState("all");

  const { data, loading, error, reload } = useApi(() => apiFetch("/alerts?sort=desc&limit=50"));

  // Poll every 15 seconds
  useEffect(() => {
    const iv = setInterval(reload, 15000);
    return () => clearInterval(iv);
  }, [reload]);

  const fallback = [
    { alert_id: 1, cam: "CAM-03", location: "Bako National Park, Sarawak", anomaly_type: "Wildlife Interaction", timestamp: "14:32:18", guide: "User 01", severity: "high", video_evidence_path: "vid_cam03_143218.mp4" },
    { alert_id: 2, cam: "CAM-01", location: "Gunung Mulu NP", anomaly_type: "Off-trail Movement", timestamp: "13:58:44", guide: "Steve Nge", severity: "medium", video_evidence_path: "vid_cam01_135844.mp4" },
    { alert_id: 3, cam: "CAM-02", location: "Kubah NP", anomaly_type: "Wildlife Interaction", timestamp: "12:14:09", guide: "Tan Chang Yee", severity: "high", video_evidence_path: "vid_cam02_121409.mp4" },
    { alert_id: 4, cam: "CAM-04", location: "Niah NP", anomaly_type: "Unauthorized Area", timestamp: "11:30:00", guide: "Wee Yang Lim", severity: "low", video_evidence_path: null },
    { alert_id: 5, cam: "CAM-01", location: "Bako National Park", anomaly_type: "Wildlife Interaction", timestamp: "09:07:21", guide: "User 01", severity: "medium", video_evidence_path: "vid_cam01_090721.mp4" },
  ];

  const allAlerts = data || fallback;
  const alerts = filter === "all" ? allAlerts : allAlerts.filter((a) => a.severity === filter);
  const counts = {
    high: allAlerts.filter((a) => a.severity === "high").length,
    medium: allAlerts.filter((a) => a.severity === "medium").length,
    resolved: 38,
  };

  return (
    <>
      {videoAlert && <VideoModal alert={videoAlert} onClose={() => setVideoAlert(null)} />}

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard icon="🔴" label="Critical" value={counts.high} sub="Wildlife interactions" accent={t.red} />
        <StatCard icon="🟡" label="Warnings" value={counts.medium} sub="Movement violations" accent={t.orange} />
        <StatCard icon="✅" label="Resolved" value={counts.resolved} sub="This month" accent={t.greenLight} />
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} />}

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">⚠️ Alert Log</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {loading && <span style={{ fontSize: 11, color: t.textMuted }}>Refreshing…</span>}
            <select className="form-input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 120, padding: "5px 10px", fontSize: 12 }}>
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="btn btn-outline btn-sm">Export CSV</button>
            <button className="btn btn-primary btn-sm" onClick={reload}>↻ Refresh</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Camera</th><th>Location</th><th>Anomaly Type</th><th>Guide</th><th>Time</th><th>Severity</th><th>Video</th></tr>
          </thead>
          {loading ? <LoadingRows cols={7} rows={5} /> : (
            <tbody>
              {alerts.map((a, i) => (
                <tr key={a.alert_id || i}>
                  <td><span style={{ fontFamily: "Space Mono, monospace", fontSize: 12 }}>{a.cam}</span></td>
                  <td>{a.location}</td>
                  <td>{a.anomaly_type}</td>
                  <td>{a.guide}</td>
                  <td><span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: t.textMuted }}>{a.timestamp}</span></td>
                  <td>
                    {a.severity === "high" && <span className="badge badge-red">HIGH</span>}
                    {a.severity === "medium" && <span className="badge badge-yellow">MEDIUM</span>}
                    {a.severity === "low" && <span className="badge badge-blue">LOW</span>}
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setVideoAlert(a)} disabled={!a.video_evidence_path} style={{ opacity: a.video_evidence_path ? 1 : 0.4 }}>
                      ▶ Play
                    </button>
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
