REPO STRUCTURE
All API config is in: src/api/index.js
- Change API_BASE to your XAMPP IP
- Set DEMO_MODE = false when the backend is ready

ENDPOINTS THE FRONTEND EXPECTS

Auth
  POST   /auth/login               { email, password, role } → { token, user }

Dashboard
  GET    /dashboard/stats           → { activeGuides, certified, alertsToday, activeTours, pendingApproval, alertsYTD }

Guides (Admin)
  GET    /admin/guides              → [ { user_id, username, cv_status, modules_completed } ]
  PUT    /admin/cv/:user_id/approve { approval_tier } → 200 OK
  PUT    /admin/cv/:user_id/reject  → 200 OK

CV Upload (Guide)
  POST   /cv/upload                 multipart/form-data: cv_file (PDF), user_id

Alerts
  GET    /alerts?sort=desc&limit=50 → [ { alert_id, cam, location, anomaly_type, timestamp, guide, severity, video_evidence_path } ]

Training Modules (Admin)
  POST   /admin/modules             { title, blocks, settings } → 201
  PUT    /admin/modules/:id         { title, blocks, settings } → 200

Quiz
  POST   /quiz/submit               { module_id, answers, score, passed } → 200

Certifications
  GET    /certifications/recent?limit=4 → [ { name, module_title, score_achieved } ]

AUTH HEADERS
All protected routes expect:
  Authorization: Bearer <jwt_token>
Return HTTP 401 if token is missing/expired — the frontend will auto-logout.
Return HTTP 403 for role violations (RBAC).

FILE STORAGE
- CV PDFs: store outside web root, return cv_path in guide object
- Frontend builds download link as: /files/cv/:cv_path
- Only accept .pdf, max 5MB (frontend validates client-side too but backend must also validate)

CORS
Add these headers to every response from the XAMPP server:
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Headers: Authorization, Content-Type
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
(Change the origin to the actual frontend IP/port when deploying)
