import { useState, useRef } from "react";
import { apiUpload, apiFetch, DEMO_MODE } from "../api/index";


// PAGE: CV Upload (Guide Onboarding)
export function CVUploadPage() {
  const t = window.__T;
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState("none"); // none | uploading | pending | approved
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const simulateUpload = async (f) => {
    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
      alert("❌ Invalid file type. Only PDF files are accepted."); return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("❌ File too large. Maximum size is 5MB."); return;
    }
    setFile(f); setStatus("uploading"); setProgress(0);
    if (DEMO_MODE) {
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 25;
        if (p >= 100) { clearInterval(iv); setProgress(100); setTimeout(() => setStatus("pending"), 400); }
        else setProgress(Math.min(p, 95));
      }, 300);
      return;
    }
    let p = 0;
    const iv = setInterval(() => { p += Math.random() * 20; if (p < 90) setProgress(Math.min(p, 90)); }, 200);
    try {
      const fd = new FormData();
      fd.append("cv_file", f);
      fd.append("user_id", window.__USER?.user_id || "current");
      await apiUpload("/cv/upload", fd);
      clearInterval(iv); setProgress(100);
      setTimeout(() => setStatus("pending"), 400);
    } catch (e) {
      clearInterval(iv); setStatus("none"); setProgress(0);
      alert(`❌ Upload failed: ${e.message}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    if (e.dataTransfer.files[0]) simulateUpload(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 6 }}>📄 CV Upload & Onboarding</div>
        <div style={{ fontSize: 13, color: t.textMuted }}>Upload your CV for administrator review. Access to training modules will be granted based on your qualifications.</div>
      </div>

      {/* Progress Steps */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {[["1", "Upload CV"], ["2", "Admin Review"], ["3", "Access Granted"]].map(([num, label], i) => {
          const done = (status === "pending" && i < 1) || (status === "approved" && i < 2);
          const active = (i === 0 && (status === "uploading" || status === "none")) || (i === 1 && status === "pending") || (i === 2 && status === "approved");
          return (
            <div key={num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: active ? t.green : done ? t.greenDark : t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: active || done ? (t.mode === "dark" ? "#0a0f0d" : "white") : t.textMuted, transition: "background .3s" }}>
                  {done && i < 2 ? "✓" : num}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: active ? t.greenLight : t.textMuted, whiteSpace: "nowrap" }}>{label}</div>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: i === 0 && status !== "none" ? t.green : t.border, margin: "0 8px", marginBottom: 22, transition: "background .3s" }} />}
            </div>
          );
        })}
      </div>

      {(status === "none" || status === "uploading") && (
        <div>
          <div
            className={`upload-zone ${drag ? "drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files[0] && simulateUpload(e.target.files[0])} />
            <div className="upload-zone-icon">📎</div>
            <div className="upload-zone-title">Drop your CV here or click to browse</div>
            <div className="upload-zone-sub">PDF only · Maximum 5MB · Secure upload</div>
          </div>
          {status === "uploading" && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Uploading {file?.name}…</span>
                <span style={{ fontSize: 12, color: t.greenLight, fontFamily: "Space Mono, monospace" }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>
      )}

      {file && status !== "none" && (
        <div className="file-preview">
          <div className="file-preview-icon">📄</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{file.name}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{(file.size / 1024 / 1024).toFixed(1)} MB · Submitted {new Date().toLocaleDateString()}</div>
          </div>
          {status === "pending" && <span className="badge badge-yellow">UNDER REVIEW</span>}
          {status === "approved" && <span className="badge badge-green">APPROVED</span>}
        </div>
      )}

      {status === "pending" && (
        <div style={{ marginTop: 20 }}>
          <div className="status-card pending">
            <div className="status-card-icon">⏳</div>
            <div>
              <div className="status-card-title">Pending Admin Approval</div>
              <div className="status-card-sub">Your CV has been submitted. An administrator will review your qualifications and grant access to the relevant training modules.</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[{ icon: "🦎", name: "Biodiversity & Wildlife" }, { icon: "⚖️", name: "Conservation Legislation" }, { icon: "🛡️", name: "Safety Protocols" }].map((m) => (
              <div key={m.name} style={{ background: t.bgPanel, borderRadius: 10, padding: 14, border: `1px solid ${t.border}`, textAlign: "center", opacity: 0.6 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted }}>{m.name}</div>
                <span className="badge badge-yellow" style={{ marginTop: 8, fontSize: 9 }}>PENDING ACCESS</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button className="btn btn-primary" onClick={() => setStatus("approved")}>🔄 Simulate: Admin Approves</button>
          </div>
        </div>
      )}

      {status === "approved" && (
        <div style={{ marginTop: 20 }}>
          <div className="status-card approved">
            <div className="status-card-icon">🎉</div>
            <div>
              <div className="status-card-title">Access Granted! You're cleared to begin training.</div>
              <div className="status-card-sub">Your qualifications have been verified. Training modules are now unlocked based on your CV tier.</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[{ icon: "🦎", name: "Biodiversity & Wildlife", unlocked: true }, { icon: "⚖️", name: "Conservation Legislation", unlocked: true }, { icon: "🛡️", name: "Safety Protocols", unlocked: false }].map((m) => (
              <div key={m.name} style={{ background: t.bgPanel, borderRadius: 10, padding: 14, border: `1px solid ${m.unlocked ? t.green : t.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{m.unlocked ? m.icon : "🔒"}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.unlocked ? t.text : t.textMuted }}>{m.name}</div>
                <span className={`badge ${m.unlocked ? "badge-green" : "badge-yellow"}`} style={{ marginTop: 8, fontSize: 9 }}>{m.unlocked ? "UNLOCKED" : "TIER 2 REQUIRED"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// PAGE: Course Catalog 
export function CourseCatalogPage({ onStartQuiz }) {
  const t = window.__T;
  const courses = [
    { icon: "🦎", name: "Biodiversity & Wildlife", desc: "Flora, fauna, and ecosystem interactions in Sarawak national parks", quizzes: 5, progress: 100, status: "completed", color: "#2ecc71", score: 94 },
    { icon: "⚖️", name: "Conservation Legislation", desc: "Sarawak wildlife laws, enforcement procedures and penalties", quizzes: 4, progress: 45, status: "active", color: "#60a5fa" },
    { icon: "🛡️", name: "Safety Protocols", desc: "Emergency response, hazard management and first aid basics", quizzes: 6, progress: 0, status: "locked", color: "#f59e0b" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 6 }}>📚 My Training Modules</div>
        <div style={{ fontSize: 13, color: t.textMuted }}>Complete all modules to achieve full Park Guide certification · Pass score: 80%</div>
      </div>

      <div className="panel section-gap">
        <div className="panel-body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Overall Certification Progress</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>1 of 3 modules completed</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.greenLight }}>60%</div>
          </div>
          <div className="progress-bar" style={{ height: 10 }}><div className="progress-fill" style={{ width: "60%" }} /></div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {courses.map((c, i) => (
          <div key={i} className={`course-card ${c.status === "locked" ? "locked" : ""}`}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div className="course-icon-badge" style={{ background: `${c.color}20`, border: `1px solid ${c.color}30` }}>
                {c.status === "locked" ? "🔒" : c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: c.status === "locked" ? t.textMuted : t.text }}>{c.name}</div>
                  {c.status === "completed" && <span className="badge badge-green">✓ CERTIFIED — {c.score}%</span>}
                  {c.status === "active" && <span className="badge badge-blue">IN PROGRESS</span>}
                  {c.status === "locked" && <span className="badge badge-yellow">🔒 LOCKED — Tier 2 Required</span>}
                </div>
                <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 12 }}>{c.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: c.status !== "locked" ? 12 : 0 }}>
                  <span style={{ fontSize: 12, color: t.textMuted }}>❓ {c.quizzes} quizzes</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>⏱ ~45 min</span>
                </div>
                {c.status !== "locked" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: t.textMuted }}>Progress</span>
                      <span style={{ fontSize: 11, color: t.greenLight, fontFamily: "Space Mono, monospace", fontWeight: 700 }}>{c.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${c.progress}%`, background: c.status === "completed" ? t.green : t.orange }} />
                    </div>
                  </div>
                )}
              </div>
              {c.status !== "locked" && (
                <button className={`btn btn-sm ${c.status === "completed" ? "btn-outline" : "btn-primary"}`} onClick={() => onStartQuiz(c)} style={{ flexShrink: 0 }}>
                  {c.status === "completed" ? "Review" : "Continue →"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// PAGE: Quiz
export function QuizPage({ course, onBack }) {
  const t = window.__T;
  const questions = [
    { q: "What is the minimum safe distance a guide must maintain from a Saltwater Crocodile?", opts: ["5 meters", "10 meters", "50 meters", "100 meters"], correct: 2 },
    { q: "Which legislation governs wildlife protection in Sarawak national parks?", opts: ["Wildlife Conservation Ordinance 1998", "National Parks Ordinance 1956", "Forest Ordinance 1954", "Environment Quality Act 1974"], correct: 0 },
    { q: "What should a guide do FIRST upon detecting unusual wildlife behavior near tourists?", opts: ["Take photographs for documentation", "Calmly move the group away from the area", "Alert HQ via radio immediately", "Approach the animal to assess the threat"], correct: 1 },
    { q: "What is the maximum PDF file size allowed for CV submission on the platform?", opts: ["1 MB", "2 MB", "5 MB", "10 MB"], correct: 2 },
    { q: "The AI detection system sends an automated alert to the admin dashboard within:", opts: ["5 seconds", "15 seconds", "30 seconds", "1 minute"], correct: 1 },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const selected = answers[current];
  const totalAnswered = Object.keys(answers).length;

  const handleSelect = (i) => { if (!revealed) setAnswers((a) => ({ ...a, [current]: i })); };
  const handleNext = () => { setRevealed(false); if (current < questions.length - 1) setCurrent((c) => c + 1); };

  const handleSubmit = async () => {
    const localScore = Math.round(
      (Object.entries(answers).filter(([qi, ai]) => questions[Number(qi)].correct === Number(ai)).length / questions.length) * 100
    );
    setSubmitted(true);
    if (!DEMO_MODE) {
      try {
        await apiFetch("/quiz/submit", {
          method: "POST",
          body: JSON.stringify({ module_id: course.module_id || course.name, answers, score: localScore, passed: localScore >= 80 }),
        });
      } catch (e) { console.warn("Quiz submit failed:", e.message); }
    }
  };

  const score = submitted
    ? Math.round((Object.entries(answers).filter(([qi, ai]) => questions[Number(qi)].correct === Number(ai)).length / questions.length) * 100)
    : 0;
  const passed = score >= 80;

  if (submitted) {
    return (
      <div className="cert-result">
        <div className={`cert-badge ${passed ? "pass" : "fail"}`}>{passed ? "🏅" : "📚"}</div>
        <div className={`cert-score ${passed ? "pass" : "fail"}`}>{score}%</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 8 }}>
          {passed ? "Congratulations! Module Certified." : "Not quite there yet."}
        </div>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 28, lineHeight: 1.6 }}>
          {passed
            ? `You passed the ${course.name} module with a score of ${score}%. A certification record has been added to your profile.`
            : `You scored ${score}% — a minimum of 80% is required. Review the module content and try again.`}
        </div>
        {passed && (
          <div style={{ background: "rgba(46,204,113,.08)", border: "1px solid rgba(46,204,113,.3)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.greenLight, marginBottom: 12, textAlign: "center" }}>🏆 New Badge Earned!</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `${course.color}20`, border: `1px solid ${course.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                {course.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>{course.name} Expert</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>+50 XP · Certified {new Date().toLocaleDateString()}</div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: "auto" }}>NEW ✓</span>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {!passed && (
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); setRevealed(false); }}>
              🔄 Retake Quiz
            </button>
          )}
          <button className="btn btn-outline" onClick={onBack}>← Back to Modules</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Exit Quiz</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{course.name}</div>
            <span className="badge badge-blue" style={{ fontSize: 9 }}>{course.quizzes} QUESTIONS</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(totalAnswered / questions.length) * 100}%`, background: t.orange }} />
          </div>
        </div>
        <div style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: t.textMuted, flexShrink: 0 }}>
          {totalAnswered}/{questions.length} answered
        </div>
      </div>

      {/* Question number tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {questions.map((_, i) => (
          <div key={i} onClick={() => { setRevealed(false); setCurrent(i); }} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, cursor: "pointer", background: i === current ? t.green : answers[i] !== undefined ? "rgba(46,204,113,.15)" : t.bgPanel, color: i === current ? (t.mode === "dark" ? "#0a0f0d" : "white") : answers[i] !== undefined ? t.greenLight : t.textMuted, border: `1px solid ${i === current ? t.green : t.border}`, fontFamily: "Space Mono, monospace", transition: "all .2s" }}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="quiz-question-card">
        <div className="quiz-q-num">Question {current + 1} of {questions.length}</div>
        <div className="quiz-q-text">{q.q}</div>
      </div>

      <div>
        {q.opts.map((opt, i) => {
          let cls = "quiz-option";
          if (revealed) { cls += i === q.correct ? " correct" : i === selected ? " wrong" : ""; }
          else if (selected === i) cls += " selected";
          return (
            <div key={i} className={cls} onClick={() => handleSelect(i)}>
              <div className="quiz-option-letter">{String.fromCharCode(65 + i)}</div>
              {opt}
              {revealed && i === q.correct && <span style={{ marginLeft: "auto" }}>✓</span>}
              {revealed && i === selected && i !== q.correct && <span style={{ marginLeft: "auto" }}>✗</span>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
        <button className="btn btn-outline" onClick={() => { if (current > 0) { setRevealed(false); setCurrent((c) => c - 1); } }} style={{ opacity: current === 0 ? 0.4 : 1 }}>
          ← Previous
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          {selected !== undefined && !revealed && (
            <button className="btn btn-outline" onClick={() => setRevealed(true)}>Check Answer</button>
          )}
          {current < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={selected === undefined} style={{ opacity: selected === undefined ? 0.5 : 1 }}>
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={totalAnswered < questions.length} style={{ opacity: totalAnswered < questions.length ? 0.5 : 1 }}>
              Submit Quiz ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// PAGE: Profile 
export function ProfilePage({ onBack }) {
  const t = window.__T;
  const user = {
    name: "User 01", role: "Administrator", initials: "SA",
    email: "user01@gmail.com", phone: "+60 12-345 6789",
    department: "Park Management & Security", location: "Kuching, Sarawak",
    joined: "March 2021", parkZone: "Bako National Park HQ", employeeId: "ADM-0042",
    certs: [
      { icon: "🦎", name: "Biodiversity & Wildlife Management", date: "Certified Jan 2022", color: "#2ecc71" },
      { icon: "🛡️", name: "Safety & Emergency Response", date: "Certified Apr 2022", color: "#f59e0b" },
      { icon: "⚖️", name: "Conservation Legislation", date: "Certified Jul 2022", color: "#60a5fa" },
      { icon: "🎥", name: "Security & Surveillance Operations", date: "Certified Nov 2023", color: "#a78bfa" },
    ],
  };

  return (
    <div className="profile-page">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
        <div style={{ fontSize: 13, color: t.textMuted }}>User Profile</div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-lg">{user.initials}</div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-role">{user.role}</div>
          <div className="profile-tags">
            <span className="profile-tag">🛡️ Admin Access</span>
            <span className="profile-tag">✅ Verified</span>
            <span className="profile-tag">🌿 Active</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace", marginBottom: 4 }}>EMPLOYEE ID</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: t.text, fontFamily: "Space Mono, monospace" }}>{user.employeeId}</div>
        </div>
      </div>

      <div className="profile-grid" style={{ marginBottom: 20 }}>
        {[{ val: "4", label: "Certifications" }, { val: "3", label: "Active Tours" }, { val: "51", label: "Guides Managed" }, { val: "38", label: "Alerts Resolved" }].map((s, i) => (
          <div className="profile-stat-card" key={i}>
            <div className="profile-stat-val">{s.val}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="profile-info-grid">
        <div className="profile-info-title">👤 Personal Information</div>
        {[
          ["📧", "Email Address", user.email],
          ["📱", "Phone Number", user.phone],
          ["🏢", "Department", user.department],
          ["📍", "Location", user.location],
          ["🌿", "Primary Park Zone", user.parkZone],
          ["📅", "Member Since", user.joined],
        ].map(([icon, label, val]) => (
          <div className="profile-field" key={label}>
            <div className="profile-field-icon">{icon}</div>
            <div>
              <div className="profile-field-label">{label}</div>
              <div className="profile-field-value">{val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <div className="panel-title">🏅 Certifications</div>
          <span className="badge badge-green">4 ACTIVE</span>
        </div>
        <div className="panel-body">
          <div className="profile-cert-list">
            {user.certs.map((c, i) => (
              <div className="profile-cert-item" key={i}>
                <div className="profile-cert-icon" style={{ background: `${c.color}20` }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{c.date}</div>
                </div>
                <span className="badge badge-green">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
