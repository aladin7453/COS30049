
// ── API LAYER
export const API_BASE = "http://localhost/parkguide/api";

// Set to false when backend is running
// true  = use hardcoded mock data
// false = call real backend
export const DEMO_MODE = true;

// Central fetch wrapper — attaches JWT, handles 401 auto-logout
export async function apiFetch(path, options = {}) {
  if (DEMO_MODE) throw new Error("DEMO_MODE");
  const token = window.__JWT;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    window.__LOGOUT?.();
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Multipart upload (no Content-Type header — browser sets boundary)
export async function apiUpload(path, formData) {
  if (DEMO_MODE) throw new Error("DEMO_MODE");
  const token = window.__JWT;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", headers, body: formData });
  if (res.status === 401) {
    window.__LOGOUT?.();
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}
