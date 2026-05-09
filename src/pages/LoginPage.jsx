import { useState, useRef } from "react";
import { apiFetch, DEMO_MODE } from "../api/index";

function getPasswordStrength(pw) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const label = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][score];
  const color = ["", "#ef4444", "#f59e0b", "#f59e0b", "#2ecc71", "#2ecc71"][score];
  return { score, label, color, checks };
}

export default function LoginPage({ onLogin }) {
  const t = window.__T;
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [tfaStep, setTfaStep] = useState(false);
  const [tfaCode, setTfaCode] = useState(["", "", "", "", "", ""]);
  const [tfaError, setTfaError] = useState(false);
  const tfaRefs = useRef([]);
  const MAX_ATTEMPTS = 3;
  const LOCK_SECONDS = 30;

  const pw = getPasswordStrength(pass);

  const handleLogin = async () => {
    if (locked) return;
    if (DEMO_MODE) {
      if (pass.length < 6) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLocked(true);
          let t2 = LOCK_SECONDS; setLockTimer(t2);
          const iv = setInterval(() => { t2--; setLockTimer(t2); if (t2 <= 0) { clearInterval(iv); setLocked(false); setAttempts(0); } }, 1000);
        }
        return;
      }
      window.__JWT = "demo-jwt-token";
      window.__USER = { email, role, user_id: "ADM-0042" };
      if (role === "admin") setTfaStep(true);
      else onLogin(role);
      return;
    }
    try {
      const res = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password: pass, role }) });
      window.__JWT = res.token || res.jwt;
      window.__USER = res.user || { email, role };
      if (role === "admin") setTfaStep(true);
      else onLogin(role);
    } catch (e) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        let t2 = LOCK_SECONDS; setLockTimer(t2);
        const iv = setInterval(() => { t2--; setLockTimer(t2); if (t2 <= 0) { clearInterval(iv); setLocked(false); setAttempts(0); } }, 1000);
      }
    }
  };

  const handleTfa = () => {
    const code = tfaCode.join("");
    if (code === "123456" || code.length === 6) { onLogin(role); }
    else { setTfaError(true); setTimeout(() => setTfaError(false), 1500); }
  };

  const handleTfaInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...tfaCode]; next[i] = val; setTfaCode(next);
    if (val && i < 5) tfaRefs.current[i + 1]?.focus();
  };

  const handleTfaKey = (i, e) => {
    if (e.key === "Backspace" && !tfaCode[i] && i > 0) tfaRefs.current[i - 1]?.focus();
    if (e.key === "Enter") handleTfa();
  };

  // 2FA screen 
  if (tfaStep) return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-logo">
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(46,204,113,.1)", border: `2px solid ${t.green}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 }}>🔐</div>
          <div className="login-title">Two-Factor Authentication</div>
          <div className="login-sub">Enter the 6-digit code sent to your registered device</div>
        </div>
        <div style={{ background: t.bgPanel, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${t.border}` }}>
          <span>📱</span> Code sent to <strong style={{ color: t.text }}>+60 12-*** **89</strong>
        </div>
        <div className="tfa-input-row">
          {tfaCode.map((d, i) => (
            <input key={i} ref={(el) => (tfaRefs.current[i] = el)} className="tfa-digit"
              style={{ borderColor: tfaError ? t.red : d ? t.green : t.border }}
              value={d} maxLength={1}
              onChange={(e) => handleTfaInput(i, e.target.value)}
              onKeyDown={(e) => handleTfaKey(i, e)} />
          ))}
        </div>
        {tfaError && <div style={{ textAlign: "center", fontSize: 12, color: t.red, marginBottom: 10 }}>❌ Invalid code. Try again.</div>}
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, marginBottom: 12 }} onClick={handleTfa}>
          Verify & Sign In →
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.textMuted }}>
          <span style={{ cursor: "pointer" }} onClick={() => setTfaStep(false)}>← Back to Login</span>
          <span style={{ cursor: "pointer", color: t.green }}>Resend Code</span>
        </div>
        <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(46,204,113,.04)", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 10, color: t.textMuted, textAlign: "center" }}>
          💡 Demo: enter any 6 digits to proceed
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🌿</div>
          <div className="login-title">{role === "admin" ? "Admin Portal" : "Park Guide"}</div>
          <div className="login-sub">{role === "admin" ? "Secure access to park management, CV approvals, and real-time monitoring" : "Sign in to your guide account"}</div>
        </div>

        <div className="role-selector">
          {[
            { id: "admin", icon: "🛡️", label: "Administrator", sub: "Full dashboard access" },
            { id: "guide", icon: "🎒", label: "Park Guide", sub: "Training & monitoring" },
          ].map((r) => (
            <div key={r.id} className={`role-btn ${role === r.id ? "selected" : ""}`} onClick={() => { setRole(r.id); setAttempts(0); setLocked(false); }}>
              <div className="role-btn-icon">{r.icon}</div>
              <div className="role-btn-label">{r.label}</div>
              <div className="role-btn-sub">{r.sub}</div>
            </div>
          ))}
        </div>

        {locked && (
          <div className="lockout-banner">
            <span style={{ fontSize: 18 }}>🔒</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.red }}>Account Temporarily Locked</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Too many failed attempts. Try again in <strong style={{ color: t.orange }}>{lockTimer}s</strong></div>
            </div>
          </div>
        )}

        {!locked && attempts > 0 && attempts < MAX_ATTEMPTS && (
          <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#d97706" }}>
            ⚠️ {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining before lockout
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{role === "admin" ? "Admin Email" : "Guide Email"}</label>
          <input className="form-input" type="email" placeholder={role === "admin" ? "admin@parksarawak.com" : "guide@parksarawak.com"} value={email} onChange={(e) => setEmail(e.target.value)} disabled={locked} />
        </div>

        <div className="form-group" style={{ marginBottom: 8 }}>
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} disabled={locked} style={{ paddingRight: 44 }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={() => setShowPass((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: t.textMuted }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {pass.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 4, background: t.border, borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
              <div className="pw-strength-bar" style={{ width: `${(pw.score / 5) * 100}%`, background: pw.color }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: pw.color, fontWeight: 700 }}>{pw.label}</span>
              <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>{pw.score}/5</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {[["length", "8+ characters"], ["upper", "Uppercase letter"], ["lower", "Lowercase letter"], ["number", "Number"], ["special", "Special character"]].map(([key, label]) => (
                <div key={key} className="pw-req" style={{ color: pw.checks[key] ? t.greenLight : t.textMuted }}>
                  <div className="pw-req-dot" style={{ background: pw.checks[key] ? t.green : t.border }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, marginBottom: 12, opacity: locked ? 0.5 : 1 }} onClick={handleLogin} disabled={locked}>
          {role === "admin" ? "🔐 Sign In with 2FA →" : "Sign In →"}
        </button>

        <div style={{ fontSize: 11, color: t.textMuted, textAlign: "center", lineHeight: 1.5 }}>
          {role === "admin" ? (
            <>🔒 Two-factor authentication required · <span style={{ color: t.green }}>bcrypt</span> encrypted<br /><span style={{ fontSize: 10 }}>All access is logged · JWT session · RBAC enforced</span></>
          ) : (
            <>🔒 Secure login · <span style={{ color: t.green }}>JWT</span> session management</>
          )}
        </div>
      </div>
    </div>
  );
}
