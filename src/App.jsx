import { useState, useEffect } from "react";
import { darkTheme, lightTheme, buildCss } from "./utils/theme";
import { SettingsModal } from "./components/Modals";
import { SessionTimeoutBanner, RBACScreen } from "./components/SessionAndRBAC";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import { TrainingPage, ModuleEditorPage } from "./pages/TrainingPage";
import AlertsPage from "./pages/AlertsPage";
import SecurityCentrePage from "./pages/SecurityCentrePage";
import { CVUploadPage, CourseCatalogPage, QuizPage, ProfilePage } from "./pages/GuidePages";

//  Nav config 
const adminPages = [
  { id: "dashboard", label: "Overview",          icon: "⬡" },
  { id: "guides",    label: "Park Guides",        icon: "👥", badge: "4" },
  { id: "training",  label: "Training Modules",   icon: "📚" },
  { id: "alerts",    label: "Security Alerts",    icon: "🚨", badge: "7" },
  { id: "security",  label: "Security Centre",    icon: "🛡️" },
];

const guidePages = [
  { id: "cv-upload", label: "CV Upload",          icon: "📄" },
  { id: "courses",   label: "My Training",        icon: "📚" },
  { id: "alerts",    label: "Security Alerts",    icon: "🚨" },
];

//  App Shell
export default function App() {
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [userRole,       setUserRole]       = useState("admin");
  const [activePage,     setActivePage]     = useState("dashboard");
  const [themeMode,      setThemeMode]      = useState("dark");
  const [showSettings,   setShowSettings]   = useState(false);
  const [showProfile,    setShowProfile]    = useState(false);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [editingModule,  setEditingModule]  = useState(undefined); // undefined = not editing, null = new, obj = edit
  const [quizCourse,     setQuizCourse]     = useState(null);
  const [showRBAC,       setShowRBAC]       = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(3600);

  const theme = themeMode === "dark" ? darkTheme : lightTheme;
  window.__T = theme;

  // Session countdown
  useEffect(() => {
    const iv = setInterval(() => setSessionSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);

  // Expose logout for 401 auto-trigger in apiFetch
  const handleLogout = () => {
    window.__JWT = null;
    window.__USER = null;
    setLoggedIn(false);
  };
  useEffect(() => { window.__LOGOUT = handleLogout; }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setLoggedIn(true);
    setActivePage(role === "admin" ? "dashboard" : "cv-upload");
    setSessionSeconds(3600);
  };

  const handleNav = (id) => {
    setActivePage(id);
    setShowProfile(false);
    setSidebarOpen(false);
    setEditingModule(undefined);
    setQuizCourse(null);
    setShowRBAC(false);
  };

  const pages = userRole === "admin" ? adminPages : guidePages;

  const pageTitle =
    showProfile      ? "My Profile"
    : showRBAC       ? "403 — Access Forbidden"
    : editingModule !== undefined ? (editingModule === null ? "New Module" : "Edit Module")
    : quizCourse     ? `${quizCourse.name} — Quiz`
    : pages.find((p) => p.id === activePage)?.label;

  const renderPage = () => {
    if (showRBAC)                  return <RBACScreen onBack={() => setShowRBAC(false)} />;
    if (showProfile)               return <ProfilePage onBack={() => setShowProfile(false)} />;
    if (editingModule !== undefined) return <ModuleEditorPage module={editingModule} onBack={() => setEditingModule(undefined)} />;
    if (quizCourse)                return <QuizPage course={quizCourse} onBack={() => setQuizCourse(null)} />;

    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "guides":    return <AdminPage />;
      case "training":  return <TrainingPage onEditModule={(m) => setEditingModule(m)} />;
      case "alerts":    return <AlertsPage />;
      case "security":  return <SecurityCentrePage onShowRBAC={() => setShowRBAC(true)} />;
      case "cv-upload": return <CVUploadPage />;
      case "courses":   return <CourseCatalogPage onStartQuiz={(c) => setQuizCourse(c)} />;
      default:          return <DashboardPage />;
    }
  };

  //  Login screen (no sidebar) 
  if (!loggedIn) return (
    <div style={{ width: "100%", minHeight: "100vh", overflowY: "auto", background: theme.bg }}>
      <style>{buildCss(theme)}</style>
      <LoginPage onLogin={handleLogin} />
    </div>
  );

  //  Main app shell 
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: theme.bg }}>
      <style>{buildCss(theme)}</style>

      <SessionTimeoutBanner secondsLeft={sessionSeconds} onExtend={() => setSessionSeconds(3600)} />

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          themeMode={themeMode}
          onThemeChange={(m) => setThemeMode(m)}
        />
      )}

      <div className="app" style={{ marginTop: sessionSeconds <= 60 ? 43 : 0, transition: "margin-top .3s" }}>

        {/* Sidebar overlay (mobile) */}
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/*  Sidebar  */}
        <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-badge">
              <div className="logo-icon">🌿</div>
              <div>
                <div className="logo-text">ParkGuide</div>
                <div className="logo-sub">SFC · Sarawak</div>
              </div>
            </div>
          </div>

          {/* Role badge */}
          <div style={{ margin: "0 16px 12px", padding: "6px 12px", borderRadius: 8, background: userRole === "admin" ? "rgba(239,68,68,.08)" : "rgba(46,204,113,.08)", border: `1px solid ${userRole === "admin" ? "rgba(239,68,68,.25)" : "rgba(46,204,113,.25)"}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: userRole === "admin" ? theme.red : theme.greenLight, fontWeight: 700 }}>
              {userRole === "admin" ? "🛡️ ADMIN MODE" : "🎒 GUIDE MODE"}
            </div>
          </div>

          {/* Nav items */}
          {pages.map((p) => (
            <div
              key={p.id}
              className={`nav-item ${activePage === p.id && !showProfile && editingModule === undefined && !quizCourse && !showRBAC ? "active" : ""}`}
              onClick={() => handleNav(p.id)}
            >
              <span className="nav-icon">{p.icon}</span>
              <span>{p.label}</span>
              {p.badge && <span className="nav-badge">{p.badge}</span>}
            </div>
          ))}

          {/* Bottom: session + user */}
          <div style={{ marginTop: "auto", padding: "20px 24px 0", borderTop: `1px solid ${theme.border}` }}>
            {/* Session timer */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, fontFamily: "Space Mono, monospace", color: theme.textMuted }}>
                <span>SESSION</span>
                <span style={{ color: sessionSeconds < 300 ? theme.orange : theme.greenLight }}>
                  {Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s
                </span>
              </div>
              <div style={{ height: 3, background: theme.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: sessionSeconds < 300 ? theme.orange : theme.green, width: `${(sessionSeconds / 3600) * 100}%`, transition: "width 1s linear, background .3s" }} />
              </div>
            </div>

            {/* User card */}
            <div className="guide-card" style={{ paddingTop: 8 }}>
              <div className="guide-avatar" style={{ background: `linear-gradient(135deg,${theme.green},${theme.purple})`, cursor: "pointer" }} onClick={() => { setShowProfile(true); setSidebarOpen(false); }}>
                SA
              </div>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => { setShowProfile(true); setSidebarOpen(false); }}>
                <div className="guide-name" style={{ fontSize: 12 }}>User 01</div>
                <div className="guide-meta">{userRole === "admin" ? "Administrator" : "Park Guide"}</div>
              </div>
            </div>

            <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </nav>

        {/*  Main content  */}
        <main className="main">
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="topbar-title">{pageTitle}</div>
            <span className="topbar-tag">COS30049 · Swinburne Sarawak</span>
            <div className="status-pill"><div className="status-dot" />System Online</div>
            <button className="topbar-icon-btn" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
            <div className="avatar" onClick={() => setShowProfile(true)} title="View Profile">SA</div>
          </div>

          <div className="content">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
