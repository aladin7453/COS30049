//  Theme Definitions 
export const darkTheme = {
  bg: "#0a0f0d", bgCard: "#111a15", bgPanel: "#0d1510",
  green: "#2ecc71", greenDark: "#1a8a4a", greenLight: "#4ade80",
  orange: "#f59e0b", red: "#ef4444", blue: "#60a5fa", purple: "#a78bfa",
  text: "#e8f5e9", textMuted: "#6b8f72", border: "#1e3a28", mode: "dark",
};

export const lightTheme = {
  bg: "#f0faf3", bgCard: "#ffffff", bgPanel: "#e8f5ed",
  green: "#16a34a", greenDark: "#14532d", greenLight: "#15803d",
  orange: "#d97706", red: "#dc2626", blue: "#2563eb", purple: "#7c3aed",
  text: "#0f2d18", textMuted: "#4a7a55", border: "#bbdfc8", mode: "light",
};

//  CSS Builder 
export function buildCss(t) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; }
  body { background: ${t.bg}; color: ${t.text}; font-family: 'Syne', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${t.bgPanel}; }
  ::-webkit-scrollbar-thumb { background: ${t.greenDark}; border-radius: 3px; }

  .app { display: flex; width: 100%; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar { width:240px; min-width:240px; background:${t.bgPanel}; border-right:1px solid ${t.border}; display:flex; flex-direction:column; padding:24px 0; z-index:10; transition:transform .3s ease; }
  .sidebar-logo { padding:0 24px 28px; border-bottom:1px solid ${t.border}; margin-bottom:20px; }
  .logo-badge { display:flex; align-items:center; gap:10px; }
  .logo-icon { width:36px; height:36px; background:linear-gradient(135deg,${t.green},${t.greenDark}); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .logo-text { font-family:'Space Mono',monospace; font-size:13px; font-weight:700; color:${t.green}; line-height:1.2; }
  .logo-sub { font-size:10px; color:${t.textMuted}; font-family:'Space Mono',monospace; }
  .nav-section-label { font-size:10px; font-family:'Space Mono',monospace; color:${t.textMuted}; letter-spacing:2px; text-transform:uppercase; padding:0 24px; margin:16px 0 8px; }
  .nav-item { display:flex; align-items:center; gap:12px; padding:11px 24px; cursor:pointer; font-size:14px; font-weight:600; color:${t.textMuted}; transition:all .2s; border-left:3px solid transparent; }
  .nav-item:hover { color:${t.text}; background:rgba(46,204,113,.05); }
  .nav-item.active { color:${t.greenLight}; background:rgba(46,204,113,.08); border-left-color:${t.green}; }
  .nav-icon { font-size:16px; width:20px; text-align:center; }
  .nav-badge { margin-left:auto; background:${t.red}; color:white; font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px; font-family:'Space Mono',monospace; }

  /* Main */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .topbar { height:60px; min-height:60px; background:${t.bgPanel}; border-bottom:1px solid ${t.border}; display:flex; align-items:center; padding:0 28px; gap:12px; }
  .topbar-title { font-size:18px; font-weight:800; color:${t.text}; flex:1; }
  .topbar-tag { font-family:'Space Mono',monospace; font-size:11px; color:${t.textMuted}; }
  .status-pill { display:flex; align-items:center; gap:6px; background:rgba(46,204,113,.1); border:1px solid rgba(46,204,113,.3); border-radius:20px; padding:5px 12px; font-size:12px; font-weight:600; color:${t.greenLight}; }
  .status-dot { width:7px; height:7px; background:${t.green}; border-radius:50%; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.9} }
  .avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,${t.green},${t.purple}); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:white; cursor:pointer; border:2px solid transparent; transition:border-color .2s,transform .2s; }
  .avatar:hover { border-color:${t.green}; transform:scale(1.08); }
  .topbar-icon-btn { width:34px; height:34px; border-radius:8px; background:transparent; border:1px solid ${t.border}; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${t.textMuted}; font-size:16px; transition:all .2s; }
  .topbar-icon-btn:hover { border-color:${t.green}; color:${t.text}; background:rgba(46,204,113,.06); }
  .hamburger { display:none; width:34px; height:34px; border-radius:8px; background:transparent; border:1px solid ${t.border}; align-items:center; justify-content:center; cursor:pointer; font-size:18px; color:${t.textMuted}; }
  .content { flex:1; overflow-y:auto; padding:28px; }

  /* Cards & Panels */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
  .stat-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; padding:20px; position:relative; overflow:hidden; transition:transform .2s,border-color .2s; }
  .stat-card:hover { transform:translateY(-2px); border-color:${t.greenDark}; }
  .stat-card::before { content:''; position:absolute; top:0; right:0; width:80px; height:80px; border-radius:50%; opacity:.05; background:var(--accent,${t.green}); transform:translate(30px,-30px); }
  .stat-label { font-size:11px; color:${t.textMuted}; text-transform:uppercase; letter-spacing:1px; font-family:'Space Mono',monospace; margin-bottom:8px; }
  .stat-value { font-size:32px; font-weight:800; color:var(--accent,${t.greenLight}); line-height:1; }
  .stat-sub { font-size:12px; color:${t.textMuted}; margin-top:6px; }
  .stat-icon { font-size:22px; margin-bottom:10px; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
  .three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:24px; }
  .panel { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; overflow:hidden; }
  .panel-header { padding:16px 20px; border-bottom:1px solid ${t.border}; display:flex; align-items:center; justify-content:space-between; }
  .panel-title { font-size:14px; font-weight:700; color:${t.text}; }
  .panel-body { padding:20px; }

  /* Alert banner */
  .alert-banner { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.3); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px; margin-bottom:16px; animation:slideIn .3s ease; }
  @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .alert-dot { width:8px; height:8px; background:${t.red}; border-radius:50%; animation:pulse 1s infinite; min-width:8px; }
  .alert-text { font-size:13px; font-weight:600; color:#fca5a5; flex:1; }
  .alert-time { font-size:11px; color:${t.textMuted}; font-family:'Space Mono',monospace; white-space:nowrap; }
  .alert-btn { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.3); color:#fca5a5; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; cursor:pointer; font-family:'Space Mono',monospace; white-space:nowrap; }

  /* Table */
  .data-table { width:100%; border-collapse:collapse; }
  .data-table th { text-align:left; font-size:10px; font-family:'Space Mono',monospace; color:${t.textMuted}; text-transform:uppercase; letter-spacing:1px; padding:10px 16px; border-bottom:1px solid ${t.border}; }
  .data-table td { padding:12px 16px; font-size:13px; color:${t.text}; border-bottom:1px solid ${t.mode==="dark"?"rgba(30,58,40,.5)":t.border}; vertical-align:middle; }
  .data-table tr:last-child td { border-bottom:none; }
  .data-table tr:hover td { background:rgba(46,204,113,.03); }

  /* Badges */
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Space Mono',monospace; }
  .badge-green { background:rgba(46,204,113,.12); color:${t.greenLight}; border:1px solid rgba(46,204,113,.25); }
  .badge-yellow { background:rgba(245,158,11,.12); color:#d97706; border:1px solid rgba(245,158,11,.25); }
  .badge-red { background:rgba(239,68,68,.12); color:#dc2626; border:1px solid rgba(239,68,68,.25); }
  .badge-blue { background:rgba(96,165,250,.12); color:#2563eb; border:1px solid rgba(96,165,250,.25); }
  .badge-purple { background:rgba(167,139,250,.12); color:#7c3aed; border:1px solid rgba(167,139,250,.25); }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .2s; font-family:'Syne',sans-serif; }
  .btn-primary { background:${t.green}; color:${t.mode==="dark"?"#0a0f0d":"#fff"}; }
  .btn-primary:hover { background:${t.greenLight}; transform:translateY(-1px); }
  .btn-outline { background:transparent; border:1px solid ${t.border}; color:${t.textMuted}; }
  .btn-outline:hover { border-color:${t.green}; color:${t.text}; }
  .btn-danger { background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.3); color:#dc2626; }
  .btn-danger:hover { background:rgba(239,68,68,.2); }
  .btn-sm { padding:5px 11px; font-size:11px; border-radius:6px; }

  /* Progress */
  .progress-bar { height:6px; background:${t.border}; border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,${t.green},${t.greenLight}); transition:width 1s ease; }

  /* Camera grid */
  .camera-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .camera-feed { background:#050a07; border:1px solid ${t.border}; border-radius:10px; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; cursor:pointer; transition:border-color .2s; }
  .camera-feed:hover { border-color:${t.greenDark}; }
  .camera-feed.active { border-color:${t.red}; box-shadow:0 0 0 2px rgba(239,68,68,.2); }
  .camera-label { position:absolute; top:8px; left:8px; font-family:'Space Mono',monospace; font-size:10px; color:rgba(255,255,255,.7); background:rgba(0,0,0,.5); padding:2px 7px; border-radius:4px; }
  .camera-rec { position:absolute; top:8px; right:8px; display:flex; align-items:center; gap:4px; font-family:'Space Mono',monospace; font-size:9px; color:#fca5a5; }
  .rec-dot { width:6px; height:6px; background:${t.red}; border-radius:50%; animation:pulse 1s infinite; }
  .camera-icon { font-size:28px; opacity:.15; }
  .camera-alert-overlay { position:absolute; inset:0; background:rgba(239,68,68,.15); display:flex; align-items:center; justify-content:center; font-size:36px; }

  /* Mobile mockup */
  .mobile-frame { width:220px; min-width:220px; background:#050a07; border:2px solid ${t.border}; border-radius:28px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.5); }
  .mobile-notch { height:28px; background:#030805; display:flex; align-items:center; justify-content:center; }
  .notch-pill { width:60px; height:14px; background:#020504; border-radius:7px; }
  .mobile-content { padding:16px; }

  /* Chart bars */
  .chart-bars { display:flex; align-items:flex-end; gap:8px; height:100px; padding:0 4px; }
  .chart-bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
  .chart-bar { width:100%; background:linear-gradient(to top,${t.greenDark},${t.green}); border-radius:4px 4px 0 0; transition:height 1s ease; min-height:4px; }
  .chart-bar-label { font-size:9px; color:${t.textMuted}; font-family:'Space Mono',monospace; }

  /* Donut */
  .donut-wrap { display:flex; align-items:center; gap:20px; }
  .donut-legend { flex:1; display:flex; flex-direction:column; gap:10px; }
  .legend-item { display:flex; align-items:center; gap:8px; font-size:12px; }
  .legend-dot { width:10px; height:10px; border-radius:50%; min-width:10px; }

  /* Form */
  .form-group { margin-bottom:16px; }
  .form-label { font-size:11px; font-family:'Space Mono',monospace; color:${t.textMuted}; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block; }
  .form-input { width:100%; background:${t.bgPanel}; border:1px solid ${t.border}; border-radius:8px; padding:10px 14px; color:${t.text}; font-size:13px; font-family:'Syne',sans-serif; outline:none; transition:border-color .2s; }
  .form-input:focus { border-color:${t.green}; }
  .form-input::placeholder { color:${t.textMuted}; }
  select.form-input option { background:${t.bgPanel}; }

  /* Guide card */
  .guide-card { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid ${t.mode==="dark"?"rgba(30,58,40,.5)":t.border}; }
  .guide-card:last-child { border-bottom:none; padding-bottom:0; }
  .guide-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:white; flex-shrink:0; }
  .guide-name { font-size:13px; font-weight:600; color:${t.text}; }
  .guide-meta { font-size:11px; color:${t.textMuted}; margin-top:1px; }

  /* Module card */
  .module-card { background:${t.bgPanel}; border:1px solid ${t.border}; border-radius:10px; padding:14px; margin-bottom:10px; display:flex; align-items:center; gap:12px; transition:border-color .2s; cursor:pointer; }
  .module-card:hover { border-color:${t.greenDark}; }
  .module-icon-wrap { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }

  /* Login */
  .login-page { width:100%; min-height:100vh; display:flex; align-items:center; justify-content:center; background:${t.bg}; position:relative; overflow-y:auto; padding:20px 0; }
  .login-bg { position:absolute; inset:0; background:radial-gradient(ellipse at 20% 50%,rgba(46,204,113,.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(167,139,250,.05) 0%,transparent 50%); }
  .login-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:40px; width:420px; max-width:92vw; position:relative; z-index:1; }
  .login-logo { text-align:center; margin-bottom:32px; }
  .login-logo-icon { width:60px; height:60px; background:linear-gradient(135deg,${t.green},${t.greenDark}); border-radius:16px; display:inline-flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:16px; }
  .login-title { font-size:24px; font-weight:800; color:${t.text}; margin-bottom:4px; }
  .login-sub { font-size:13px; color:${t.textMuted}; }
  .divider { height:1px; background:${t.border}; margin:20px 0; }
  .role-selector { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
  .role-btn { padding:12px; border-radius:10px; border:1px solid ${t.border}; background:${t.bgPanel}; cursor:pointer; text-align:center; transition:all .2s; font-family:'Syne',sans-serif; }
  .role-btn.selected { border-color:${t.green}; background:rgba(46,204,113,.08); }
  .role-btn-icon { font-size:20px; margin-bottom:4px; }
  .role-btn-label { font-size:13px; font-weight:700; color:${t.text}; }
  .role-btn-sub { font-size:10px; color:${t.textMuted}; }

  /* Settings Modal */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:32px; width:480px; max-width:92vw; max-height:90vh; overflow-y:auto; position:relative; animation:slideUp .25s ease; }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .modal-title { font-size:18px; font-weight:800; color:${t.text}; margin-bottom:6px; }
  .modal-sub { font-size:12px; color:${t.textMuted}; margin-bottom:24px; }
  .modal-close { position:absolute; top:16px; right:16px; width:28px; height:28px; border-radius:50%; background:${t.bgPanel}; border:1px solid ${t.border}; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; color:${t.textMuted}; transition:all .2s; }
  .modal-close:hover { color:${t.text}; border-color:${t.green}; }
  .theme-options { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .theme-option { padding:16px; border-radius:12px; border:2px solid ${t.border}; cursor:pointer; transition:all .2s; text-align:center; }
  .theme-option:hover { border-color:${t.green}; }
  .theme-option.selected { border-color:${t.green}; background:rgba(46,204,113,.08); }
  .theme-option-preview { width:100%; height:56px; border-radius:8px; margin-bottom:10px; display:flex; overflow:hidden; }
  .theme-option-label { font-size:13px; font-weight:700; color:${t.text}; }
  .theme-option-sub { font-size:10px; color:${t.textMuted}; margin-top:2px; }

  /* Profile */
  .profile-page { max-width:800px; margin:0 auto; }
  .profile-hero { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:32px; margin-bottom:20px; display:flex; align-items:center; gap:24px; position:relative; overflow:hidden; }
  .profile-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,${t.green},${t.purple},${t.blue}); }
  .profile-avatar-lg { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,${t.green},${t.purple}); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:white; flex-shrink:0; box-shadow:0 0 0 4px ${t.bgCard},0 0 0 6px ${t.green}; }
  .profile-info { flex:1; }
  .profile-name { font-size:22px; font-weight:800; color:${t.text}; margin-bottom:4px; }
  .profile-role { font-size:13px; color:${t.greenLight}; font-weight:600; margin-bottom:8px; }
  .profile-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .profile-tag { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Space Mono',monospace; background:rgba(46,204,113,.1); color:${t.greenLight}; border:1px solid rgba(46,204,113,.25); }
  .profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
  .profile-stat-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; padding:20px; text-align:center; }
  .profile-stat-val { font-size:28px; font-weight:800; color:${t.greenLight}; }
  .profile-stat-label { font-size:11px; color:${t.textMuted}; font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
  .profile-info-grid { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; padding:24px; margin-bottom:20px; }
  .profile-info-title { font-size:14px; font-weight:700; color:${t.text}; margin-bottom:16px; }
  .profile-field { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid ${t.border}; }
  .profile-field:last-child { border-bottom:none; padding-bottom:0; }
  .profile-field-icon { font-size:16px; width:24px; text-align:center; flex-shrink:0; margin-top:1px; }
  .profile-field-label { font-size:10px; color:${t.textMuted}; font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:1px; }
  .profile-field-value { font-size:13px; font-weight:600; color:${t.text}; margin-top:2px; }
  .profile-cert-list { display:flex; flex-direction:column; gap:10px; }
  .profile-cert-item { display:flex; align-items:center; gap:12px; padding:12px; border-radius:10px; background:${t.bgPanel}; border:1px solid ${t.border}; }
  .profile-cert-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }

  /* CV Upload */
  .upload-zone { border:2px dashed ${t.border}; border-radius:14px; padding:40px 24px; text-align:center; cursor:pointer; transition:all .2s; background:${t.bgPanel}; }
  .upload-zone:hover, .upload-zone.drag { border-color:${t.green}; background:rgba(46,204,113,.04); }
  .upload-zone-icon { font-size:40px; margin-bottom:12px; }
  .upload-zone-title { font-size:15px; font-weight:700; color:${t.text}; margin-bottom:6px; }
  .upload-zone-sub { font-size:12px; color:${t.textMuted}; }
  .file-preview { display:flex; align-items:center; gap:12px; padding:14px; border-radius:10px; background:rgba(46,204,113,.06); border:1px solid rgba(46,204,113,.25); margin-top:16px; }
  .file-preview-icon { width:40px; height:40px; border-radius:8px; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .status-card { border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:14px; }
  .status-card.pending { background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.3); }
  .status-card.approved { background:rgba(46,204,113,.08); border:1px solid rgba(46,204,113,.3); }
  .status-card.rejected { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.3); }
  .status-card-icon { font-size:28px; }
  .status-card-title { font-size:14px; font-weight:700; color:${t.text}; }
  .status-card-sub { font-size:12px; color:${t.textMuted}; margin-top:2px; }

  /* Module Editor */
  .editor-layout { display:grid; grid-template-columns:1fr 280px; gap:20px; height:calc(100vh - 140px); }
  .editor-canvas { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:14px; }
  .editor-sidebar { display:flex; flex-direction:column; gap:14px; }
  .editor-block { background:${t.bgPanel}; border:1px solid ${t.border}; border-radius:10px; padding:16px; position:relative; }
  .editor-block:hover { border-color:${t.greenDark}; }
  .editor-block-label { font-size:10px; font-family:'Space Mono',monospace; color:${t.textMuted}; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; }
  .editor-block-del { cursor:pointer; color:${t.red}; font-size:14px; padding:2px 6px; border-radius:4px; }
  .editor-block-del:hover { background:rgba(239,68,68,.1); }
  .add-content-btn { display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:10px; background:${t.bgPanel}; border:1px solid ${t.border}; cursor:pointer; font-size:13px; font-weight:600; color:${t.textMuted}; transition:all .2s; width:100%; font-family:'Syne',sans-serif; }
  .add-content-btn:hover { border-color:${t.green}; color:${t.text}; background:rgba(46,204,113,.04); }
  .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid ${t.border}; }
  .toggle-row:last-child { border-bottom:none; }
  .toggle-label { font-size:13px; font-weight:600; color:${t.text}; }
  .toggle { width:36px; height:20px; border-radius:10px; cursor:pointer; position:relative; transition:background .2s; flex-shrink:0; }
  .toggle.on { background:${t.green}; }
  .toggle.off { background:${t.border}; }
  .toggle-thumb { width:14px; height:14px; border-radius:50%; background:white; position:absolute; top:3px; transition:left .2s; }
  .toggle.on .toggle-thumb { left:19px; }
  .toggle.off .toggle-thumb { left:3px; }
  .quiz-option-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
  .quiz-option-row input[type=radio] { accent-color:${t.green}; flex-shrink:0; }

  /* Guide Training UI */
  .course-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:14px; padding:24px; cursor:pointer; transition:transform .2s,border-color .2s; }
  .course-card:hover { transform:translateY(-3px); border-color:${t.greenDark}; }
  .course-card.locked { opacity:.6; cursor:not-allowed; }
  .course-card.locked:hover { transform:none; border-color:${t.border}; }
  .course-icon-badge { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; }

  /* Quiz UI */
  .quiz-page { max-width:680px; margin:0 auto; }
  .quiz-question-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:16px; padding:28px; margin-bottom:20px; }
  .quiz-q-num { font-size:11px; color:${t.textMuted}; font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
  .quiz-q-text { font-size:16px; font-weight:700; color:${t.text}; line-height:1.5; }
  .quiz-option { display:flex; align-items:center; gap:14px; padding:14px 18px; border-radius:10px; border:2px solid ${t.border}; background:${t.bgPanel}; cursor:pointer; margin-bottom:10px; transition:all .2s; font-size:13px; font-weight:600; color:${t.text}; }
  .quiz-option:hover { border-color:${t.greenDark}; }
  .quiz-option.selected { border-color:${t.green}; background:rgba(46,204,113,.08); color:${t.greenLight}; }
  .quiz-option.correct { border-color:${t.green}; background:rgba(46,204,113,.12); color:${t.greenLight}; }
  .quiz-option.wrong { border-color:${t.red}; background:rgba(239,68,68,.08); color:${t.red}; }
  .quiz-option-letter { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; font-family:'Space Mono',monospace; flex-shrink:0; border:2px solid currentColor; }

  /* Cert Result */
  .cert-result { max-width:560px; margin:0 auto; text-align:center; padding:40px 0; }
  .cert-badge { width:120px; height:120px; border-radius:50%; margin:0 auto 24px; display:flex; align-items:center; justify-content:center; font-size:50px; position:relative; }
  .cert-badge.pass { background:radial-gradient(circle,rgba(46,204,113,.2),rgba(46,204,113,.05)); border:3px solid ${t.green}; box-shadow:0 0 40px rgba(46,204,113,.3); }
  .cert-badge.fail { background:radial-gradient(circle,rgba(239,68,68,.2),rgba(239,68,68,.05)); border:3px solid ${t.red}; }
  .cert-score { font-size:64px; font-weight:800; line-height:1; margin-bottom:8px; }
  .cert-score.pass { color:${t.greenLight}; }
  .cert-score.fail { color:${t.red}; }

  /* Video Modal */
  .video-modal-card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; width:700px; max-width:95vw; position:relative; overflow:hidden; animation:slideUp .25s ease; }
  .video-player { background:#000; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer; }
  .video-controls { padding:16px 20px; background:${t.bgPanel}; border-top:1px solid ${t.border}; display:flex; align-items:center; gap:12px; }
  .video-scrubber { flex:1; height:4px; background:${t.border}; border-radius:2px; cursor:pointer; position:relative; }
  .video-scrubber-fill { height:100%; border-radius:2px; background:${t.green}; pointer-events:none; }

  /* Security styles */
  .pw-strength-bar { height:4px; border-radius:2px; transition:width .4s,background .4s; }
  .pw-req { display:flex; align-items:center; gap:6px; font-size:11px; margin-bottom:4px; transition:color .2s; }
  .pw-req-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; transition:background .2s; }
  .lockout-banner { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.4); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:10px; margin-bottom:14px; animation:slideIn .3s ease; }
  .tfa-input-row { display:flex; gap:10px; justify-content:center; margin:20px 0; }
  .tfa-digit { width:48px; height:56px; border-radius:10px; border:2px solid ${t.border}; background:${t.bgPanel}; color:${t.text}; font-size:22px; font-weight:800; text-align:center; font-family:'Space Mono',monospace; outline:none; transition:border-color .2s; }
  .tfa-digit:focus { border-color:${t.green}; }
  .session-bar { height:3px; background:${t.border}; border-radius:2px; overflow:hidden; }
  .session-bar-fill { height:100%; border-radius:2px; transition:width 1s linear; }
  .audit-row { display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:1px solid ${t.mode==="dark"?"rgba(30,58,40,.4)":t.border}; font-size:12px; }
  .audit-row:last-child { border-bottom:none; }
  .audit-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:13px; flex-shrink:0; }
  .vuln-row { display:flex; align-items:flex-start; gap:14px; padding:14px; border-radius:10px; border:1px solid ${t.border}; background:${t.bgPanel}; margin-bottom:10px; }
  .vuln-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; margin-top:1px; }
  .vuln-title { font-size:13px; font-weight:700; color:${t.text}; margin-bottom:3px; }
  .vuln-desc { font-size:11px; color:${t.textMuted}; line-height:1.5; }
  .sec-stat { background:${t.bgPanel}; border:1px solid ${t.border}; border-radius:12px; padding:16px; text-align:center; }
  .sec-stat-val { font-size:26px; font-weight:800; line-height:1; margin-bottom:4px; }
  .sec-stat-label { font-size:10px; color:${t.textMuted}; font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:1px; }

  /* Sidebar overlay */
  .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:9; }

  /* Responsive */
  @media (max-width:1100px) {
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .three-col { grid-template-columns:1fr 1fr; }
    .editor-layout { grid-template-columns:1fr; height:auto; }
  }
  @media (max-width:768px) {
    .sidebar { position:fixed; top:0; left:0; bottom:0; transform:translateX(-100%); z-index:100; overflow-y:auto; }
    .sidebar.open { transform:translateX(0); }
    .sidebar-overlay.open { display:block; }
    .hamburger { display:flex; }
    .topbar { padding:0 16px; gap:8px; }
    .topbar-tag,.status-pill { display:none; }
    .topbar-title { font-size:15px; }
    .content { padding:16px; }
    .stats-grid { grid-template-columns:1fr 1fr; gap:10px; }
    .two-col,.three-col { grid-template-columns:1fr; }
    .login-card { width:92vw; padding:24px; }
    .profile-hero { flex-direction:column; text-align:center; }
    .profile-grid { grid-template-columns:1fr 1fr; }
    .data-table th:nth-child(3),.data-table td:nth-child(3),
    .data-table th:nth-child(4),.data-table td:nth-child(4) { display:none; }
  }
  @media (max-width:480px) {
    .stats-grid { grid-template-columns:1fr; }
    .stat-value { font-size:24px; }
    .panel-body { padding:14px; }
  }
  .section-gap { margin-bottom:24px; }
`;
}
