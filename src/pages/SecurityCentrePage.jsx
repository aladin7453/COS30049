import { useState } from "react";
import { Toggle } from "../components/UI";

export default function SecurityCentrePage({ onShowRBAC }) {
  const t = window.__T;
  const [activeTab, setActiveTab] = useState("overview");
  const [twoFA, setTwoFA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [encryptionAt, setEncryptionAt] = useState(true);
  const [rateLimiting, setRateLimiting] = useState(true);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "audit", label: "Audit Log" },
    { id: "vulns", label: "Vulnerability Report" },
    { id: "settings", label: "Security Settings" },
  ];

  const auditLogs = [
    { icon: "🔐", color: t.green, action: "Login Successful", user: "User 01 (Admin)", ip: "192.168.1.10", time: "14:32:05", type: "auth" },
    { icon: "🚫", color: t.red, action: "403 Forbidden — Guide tried Admin endpoint", user: "Lee Wei Xian (Guide)", ip: "192.168.1.22", time: "14:28:41", type: "rbac" },
    { icon: "🔒", color: t.orange, action: "Account Locked — 3 failed attempts", user: "unknown@test.com", ip: "192.168.1.99", time: "14:15:03", type: "lockout" },
    { icon: "📄", color: t.blue, action: "CV Uploaded — PDF validated, stored", user: "Fatimah binti Osman (Guide)", ip: "192.168.1.31", time: "13:58:12", type: "upload" },
    { icon: "✅", color: t.green, action: "CV Approved — Access tier granted", user: "User 01 (Admin)", ip: "192.168.1.10", time: "13:55:00", type: "auth" },
    { icon: "⚠️", color: t.orange, action: "Login Failed — Wrong password (2/3)", user: "hafiz@sfc.com", ip: "192.168.1.45", time: "13:40:22", type: "auth" },
    { icon: "🎓", color: t.purple, action: "Quiz Submitted — Score 94% (PASS)", user: "Nurul Aisyah (Guide)", ip: "192.168.1.18", time: "13:30:10", type: "training" },
    { icon: "🔑", color: t.green, action: "JWT Token Issued — Session started", user: "Steve Nge (Guide)", ip: "192.168.1.25", time: "13:20:00", type: "auth" },
    { icon: "🔓", color: t.textMuted, action: "Session Expired — Auto logout", user: "Tan Chang Yee (Guide)", ip: "192.168.1.33", time: "12:55:48", type: "auth" },
    { icon: "🚫", color: t.red, action: "SQL Injection Attempt Blocked", user: "Unknown", ip: "10.0.0.55", time: "11:02:14", type: "threat" },
  ];

  const vulns = [
    { sev: "RESOLVED", sevColor: t.green, icon: "🔐", title: "Plaintext Password Storage", desc: "All passwords are now hashed using bcrypt (cost factor 12) before storage. Plaintext credentials are never retained in the database.", method: "bcrypt hashing" },
    { sev: "RESOLVED", sevColor: t.green, icon: "💉", title: "SQL Injection Risk", desc: "All database queries use parameterized statements (prepared queries) in Node.js/PHP. No raw user input is concatenated into SQL strings.", method: "Prepared statements" },
    { sev: "RESOLVED", sevColor: t.green, icon: "📂", title: "Directory Traversal via File Upload", desc: "Uploaded files (PDFs/MP4s) are stored outside the web root with randomised filenames. Only authenticated API routes can retrieve them.", method: "Restricted storage + auth gate" },
    { sev: "RESOLVED", sevColor: t.green, icon: "🎭", title: "Privilege Escalation (RBAC bypass)", desc: "JWT middleware enforces role checks on every protected route. Guide tokens receive HTTP 403 on all Admin endpoints. Tested across 15 consecutive penetration attempts.", method: "JWT + RBAC middleware" },
    { sev: "RESOLVED", sevColor: t.green, icon: "🌐", title: "MITM on Video Stream", desc: "The local WLAN router connecting the ESP32-CAM to the XAMPP server uses WPA2/WPA3 encryption. Future cloud sync uses TLS/HTTPS.", method: "WPA3 + TLS/HTTPS" },
    { sev: "MONITORED", sevColor: t.orange, icon: "🔁", title: "CORS Misconfiguration (Sprint 2 Risk)", desc: "CORS headers need to be configured on the XAMPP server before the React web dashboard can communicate. Currently flagged for Sprint 2 resolution.", method: "Pending: CORS policy config" },
  ];

  const typeBadge = (type) => {
    const map = { auth: ["badge-blue", "AUTH"], rbac: ["badge-red", "RBAC"], lockout: ["badge-yellow", "LOCKOUT"], upload: ["badge-purple", "UPLOAD"], training: ["badge-green", "TRAINING"], threat: ["badge-red", "THREAT"] };
    const [cls, label] = map[type] || ["badge-blue", type.toUpperCase()];
    return <span className={`badge ${cls}`} style={{ fontSize: 9 }}>{label}</span>;
  };

  return (
    <>
      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, background: t.bgPanel, padding: 4, borderRadius: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, minWidth: 80, padding: "8px 12px", borderRadius: 7, border: "none", background: activeTab === tab.id ? t.bgCard : "transparent", color: activeTab === tab.id ? t.greenLight : t.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif", transition: "all .2s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/*  Overview  */}
      {activeTab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[{ val: "0", label: "Critical Vulns", color: t.green }, { val: "1", label: "Monitored Risks", color: t.orange }, { val: "10", label: "Audit Events Today", color: t.blue }, { val: "100%", label: "Bcrypt Coverage", color: t.green }].map((s, i) => (
              <div key={i} className="sec-stat">
                <div className="sec-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="sec-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="two-col">
            <div className="panel">
              <div className="panel-header"><div className="panel-title">🛡️ SSDLC Security Checklist</div><span className="badge badge-green">5/6 PASSED</span></div>
              <div className="panel-body">
                {[["🔐", "bcrypt Password Hashing", true], ["🎭", "JWT + RBAC Access Control", true], ["💉", "SQL Injection Prevention", true], ["📂", "Secure File Upload (PDF/MP4)", true], ["🌐", "WPA3 + TLS Encryption", true], ["🔁", "CORS Configuration", false]].map(([icon, label, done]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: done ? t.text : t.textMuted }}>{label}</span>
                    <span className={`badge ${done ? "badge-green" : "badge-yellow"}`} style={{ fontSize: 10 }}>{done ? "✓ PASS" : "PENDING"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><div className="panel-title">🔑 Authentication Events (24h)</div></div>
              <div className="panel-body">
                {[{ icon: "✅", label: "Successful Logins", val: 18, color: t.green }, { icon: "❌", label: "Failed Attempts", val: 4, color: t.red }, { icon: "🔒", label: "Accounts Locked", val: 1, color: t.orange }, { icon: "🚫", label: "RBAC Violations", val: 2, color: t.red }, { icon: "🔑", label: "JWT Tokens Issued", val: 18, color: t.blue }, { icon: "⏱", label: "Session Timeouts", val: 5, color: t.textMuted }].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${t.border}` }}>
                    <span>{row.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: t.text }}>{row.label}</span>
                    <strong style={{ fontSize: 15, color: row.color, fontFamily: "Space Mono, monospace" }}>{row.val}</strong>
                  </div>
                ))}
                <div style={{ marginTop: 14 }}>
                  <button className="btn btn-danger btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={onShowRBAC}>
                    🔬 Simulate RBAC 403 Response
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="panel section-gap">
            <div className="panel-header"><div className="panel-title">📂 Secure File Upload Validation</div><span className="badge badge-green">ACTIVE</span></div>
            <div className="panel-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
                {[{ label: "Allowed Types", val: "PDF only", icon: "📄", color: t.green }, { label: "Max File Size", val: "5 MB cap", icon: "⚖️", color: t.blue }, { label: "Storage Location", val: "Outside web root", icon: "🔒", color: t.green }].map((item, i) => (
                  <div key={i} style={{ background: t.bgPanel, borderRadius: 10, padding: 14, border: `1px solid ${t.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3, fontFamily: "Space Mono, monospace", textTransform: "uppercase" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ file: "cv_fatimah.pdf", size: "2.3 MB", status: "accepted", msg: "Valid PDF · Stored securely" }, { file: "malware.exe", size: "0.8 MB", status: "rejected", msg: "Rejected: Invalid file type (.exe)" }, { file: "large_file.pdf", size: "8.1 MB", status: "rejected", msg: "Rejected: Exceeds 5MB size limit" }, { file: "cv_arjun.pdf", size: "1.7 MB", status: "accepted", msg: "Valid PDF · Stored securely" }].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: f.status === "accepted" ? "rgba(46,204,113,.06)" : "rgba(239,68,68,.06)", border: `1px solid ${f.status === "accepted" ? "rgba(46,204,113,.2)" : "rgba(239,68,68,.2)"}` }}>
                    <span style={{ fontSize: 16 }}>{f.status === "accepted" ? "📄" : "🚫"}</span>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color: t.text, flex: 1 }}>{f.file}</span>
                    <span style={{ fontSize: 11, color: t.textMuted }}>{f.size}</span>
                    <span style={{ fontSize: 11, color: f.status === "accepted" ? t.greenLight : t.red, fontWeight: 600 }}>{f.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/*  Audit Log  */}
      {activeTab === "audit" && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">📋 Access & Audit Log</div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge badge-green">{auditLogs.length} EVENTS</span>
              <button className="btn btn-outline btn-sm">Export CSV</button>
            </div>
          </div>
          <div>
            {auditLogs.map((log, i) => (
              <div key={i} className="audit-row">
                <div className="audit-icon" style={{ background: `${log.color}20` }}>
                  <span style={{ fontSize: 13 }}>{log.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{log.action}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>{log.user} · {log.ip}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  {typeBadge(log.type)}
                  <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*  Vulnerability Report  */}
      {activeTab === "vulns" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
            {[{ val: "5", label: "Resolved", color: t.green }, { val: "1", label: "Monitored", color: t.orange }, { val: "0", label: "Critical Open", color: t.textMuted }].map((s, i) => (
              <div key={i} className="sec-stat">
                <div className="sec-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="sec-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div>
            {vulns.map((v, i) => (
              <div key={i} className="vuln-row">
                <div className="vuln-icon" style={{ background: `${v.sevColor}15`, border: `1px solid ${v.sevColor}30` }}>{v.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <div className="vuln-title">{v.title}</div>
                    <span className={`badge ${v.sev === "RESOLVED" ? "badge-green" : "badge-yellow"}`} style={{ fontSize: 9 }}>{v.sev}</span>
                  </div>
                  <div className="vuln-desc">{v.desc}</div>
                  <div style={{ marginTop: 6, fontSize: 11, color: t.greenLight, fontFamily: "Space Mono, monospace" }}>✓ {v.method}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/*  Security Settings  */}
      {activeTab === "settings" && (
        <div className="two-col">
          <div className="panel">
            <div className="panel-header"><div className="panel-title">🔐 Authentication Settings</div></div>
            <div className="panel-body">
              {[[twoFA, setTwoFA, "Two-Factor Authentication (2FA)", "Require OTP code for all Admin logins"],
                [loginAlerts, setLoginAlerts, "Failed Login Alerts", "Notify admin on 3+ consecutive failures"],
                [rateLimiting, setRateLimiting, "Rate Limiting (3 attempts)", "Lock account after 3 failed login attempts"]].map(([val, setter, label, sub]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{label}</div><div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{sub}</div></div>
                  <Toggle on={val} onChange={setter} />
                </div>
              ))}
              <div style={{ paddingTop: 14 }}>
                <div className="form-label">JWT Session Timeout</div>
                <select className="form-input">
                  <option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>8 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel">
              <div className="panel-header"><div className="panel-title">🗄️ Data Protection</div></div>
              <div className="panel-body">
                {[[auditLogging, setAuditLogging, "Audit Logging", "Log all authentication and access events"],
                  [encryptionAt, setEncryptionAt, "Encryption at Rest", "AES-256 for stored files and database"],
                  [sessionTimeout, setSessionTimeout, "Session Timeout Warning", "Warn user 60s before session expires"]].map(([val, setter, label, sub]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{label}</div><div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{sub}</div></div>
                    <Toggle on={val} onChange={setter} />
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><div className="panel-title">🔑 Encryption Summary</div></div>
              <div className="panel-body">
                {[["Passwords", "bcrypt (cost 12)"], ["API Auth", "JWT RS256"], ["File Storage", "Restricted directory"], ["Network", "WPA3 / TLS 1.3"], ["Database", "Parameterized queries"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}`, fontSize: 12 }}>
                    <span style={{ color: t.textMuted }}>{k}</span>
                    <span style={{ fontFamily: "Space Mono, monospace", color: t.greenLight, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
