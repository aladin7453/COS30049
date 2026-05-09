import { useEffect } from "react";
import { apiFetch } from "../api/index";
import { useApi } from "../api/useApi";
import { StatCard, BarChart, LineChart, DonutChart, LoadingCard, ErrorBanner } from "../components/UI";
import { MobileMockup } from "../components/MobileMockup";

export default function DashboardPage() {
  const t = window.__T;

  const { data: stats, loading: statsLoading, error: statsError, reload: reloadStats } = useApi(() => apiFetch("/dashboard/stats"));
  const { data: alertsData, loading: alertsLoading, error: alertsError, reload: reloadAlerts } = useApi(() => apiFetch("/alerts?limit=2&sort=desc"));
  const { data: certsData, loading: certsLoading } = useApi(() => apiFetch("/certifications/recent?limit=4"));

  // Poll alerts every 15 seconds
  useEffect(() => {
    const iv = setInterval(reloadAlerts, 15000);
    return () => clearInterval(iv);
  }, [reloadAlerts]);

  const s = stats || { activeGuides: 51, certified: 28, alertsToday: 7, activeTours: 3, pendingApproval: 4, alertsYTD: 159 };
  const liveAlerts = alertsData || [
    { alert_id: 1, anomaly_type: "Wildlife Interaction", cam: "CAM-03", location: "Bako National Park, Sarawak", timestamp: "14:32:18" },
    { alert_id: 2, anomaly_type: "Off-trail Movement", cam: "CAM-01", location: "Gunung Mulu NP", timestamp: "13:58:44" },
  ];
  const recentCerts = certsData || [
    { name: "Nurul Aisyah binti Ahmad", module_title: "Biodiversity & Wildlife", score_achieved: 94, color: "#2ecc71" },
    { name: "Muhammad Hafiz bin Hassan", module_title: "Conservation Legislation", score_achieved: 87, color: "#a78bfa" },
    { name: "Siti Aminah binti Rahman", module_title: "Safety Protocols", score_achieved: 91, color: "#f59e0b" },
    { name: "Arjun a/l Subramaniam", module_title: "Biodiversity & Wildlife", score_achieved: 83, color: "#60a5fa" },
  ];

  const barData = [{ label: "Mar", val: 12 }, { label: "Apr", val: 28 }, { label: "May", val: 19 }, { label: "Jun", val: 34 }, { label: "Jul", val: 25 }, { label: "Aug", val: s.alertsYTD ? Math.round(s.alertsYTD / 5) : 41 }];
  const completionData = [{ label: "W1", val: 18 }, { label: "W2", val: 24 }, { label: "W3", val: 31 }, { label: "W4", val: 28 }, { label: "W5", val: 35 }, { label: "W6", val: 42 }];
  const donutCert = [{ label: "Certified", val: s.certified, color: t.green }, { label: "In Progress", val: s.activeGuides - s.certified - (s.pendingApproval || 4), color: t.orange }, { label: "Pending", val: s.pendingApproval || 4, color: t.textMuted }];
  const tourStatus = [{ label: "Active", val: s.activeTours, color: t.green }, { label: "Scheduled", val: 7, color: t.blue }, { label: "Completed", val: 41, color: t.textMuted }];

  return (
    <>
      {statsError && <ErrorBanner message={statsError} onRetry={reloadStats} />}

      <div className="stats-grid">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card"><LoadingCard /></div>
        )) : <>
          <StatCard icon="👥" label="Active Guides" value={s.activeGuides} sub={`${s.pendingApproval} pending approval`} />
          <StatCard icon="✅" label="Certified" value={s.certified} sub={`out of ${s.activeGuides} guides`} accent={t.greenLight} />
          <StatCard icon="⚠️" label="Alerts Today" value={s.alertsToday} sub="2 critical, 5 warnings" accent="#fbbf24" />
          <StatCard icon="🎥" label="Active Tours" value={s.activeTours} sub="Live monitoring" accent={t.blue} />
        </>}
      </div>

      <div className="panel section-gap">
        <div className="panel-header">
          <div className="panel-title">🚨 Live Security Alerts</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {alertsLoading && <span style={{ fontSize: 11, color: t.textMuted }}>Refreshing…</span>}
            <span className="badge badge-red">{liveAlerts.length} ACTIVE</span>
          </div>
        </div>
        <div className="panel-body">
          {alertsError && <ErrorBanner message={alertsError} onRetry={reloadAlerts} />}
          {liveAlerts.map((a) => (
            <div className="alert-banner" key={a.alert_id}>
              <div className="alert-dot" />
              <div className="alert-text">Anomaly Detected: {a.anomaly_type} — {a.cam} | {a.location}</div>
              <div className="alert-time">{a.timestamp}</div>
              <button className="alert-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>

      <div className="three-col">
        <div className="panel">
          <div className="panel-header"><div className="panel-title">📊 Alert Frequency</div><span className="badge badge-red">BAR</span></div>
          <div className="panel-body">
            <BarChart data={barData} />
            <div style={{ marginTop: 10, fontSize: 11, color: t.textMuted }}>Total YTD: <strong style={{ color: t.greenLight }}>{s.alertsYTD || 159}</strong></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">📈 Completion Rate</div><span className="badge badge-blue">LINE</span></div>
          <div className="panel-body">
            <LineChart data={completionData} color={t.blue} />
            <div style={{ marginTop: 10, fontSize: 11, color: t.textMuted }}>Weekly modules completed</div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">🗺️ Tour Status</div><span className="badge badge-green">DONUT</span></div>
          <div className="panel-body"><DonutChart data={tourStatus} /></div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><div className="panel-title">🏅 Guide Certification Status</div></div>
          <div className="panel-body"><DonutChart data={donutCert} /></div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">🌿 Recent Certifications</div></div>
          <div className="panel-body">
            {certsLoading ? <LoadingCard /> : recentCerts.map((g, i) => (
              <div className="guide-card" key={i}>
                <div className="guide-avatar" style={{ background: g.color || "#2ecc71" }}>{(g.name || "?")[0]}</div>
                <div style={{ flex: 1 }}><div className="guide-name">{g.name}</div><div className="guide-meta">{g.module_title}</div></div>
                <span className="badge badge-green">{g.score_achieved}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><div className="panel-title">🎥 Live Camera Feeds</div><span className="badge badge-green">3 ONLINE</span></div>
          <div className="panel-body">
            <div className="camera-grid">
              {["CAM-01", "CAM-02", "CAM-03", "CAM-04"].map((cam, i) => (
                <div key={i} className={`camera-feed ${i === 2 ? "active" : ""}`}>
                  <div className="camera-label">{cam}</div>
                  {i < 3 && <div className="camera-rec"><div className="rec-dot" />REC</div>}
                  {i === 2 ? <div className="camera-alert-overlay">⚠️</div> : i < 3 ? <div className="camera-icon">📷</div> : <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>OFFLINE</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">📱 Mobile App Preview</div></div>
          <div className="panel-body" style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <MobileMockup screen="guide-home" />
            <MobileMockup screen="broadcast" />
          </div>
        </div>
      </div>
    </>
  );
}
