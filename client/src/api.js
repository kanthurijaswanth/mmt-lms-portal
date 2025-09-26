const API = import.meta.env.VITE_API || 'http://localhost:4000';

export function setAuth(token, auditId) {
  localStorage.setItem('token', token);
  if (auditId) localStorage.setItem('audit_id', String(auditId));
}
export function getToken() { return localStorage.getItem('token'); }
export function getAuditId() { return localStorage.getItem('audit_id'); }
export function clearAuth() { localStorage.removeItem('token'); localStorage.removeItem('audit_id'); }

export async function api(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  // ✅ prevent cached/conditional requests that cause 304
  const res = await fetch(API + path, {
    cache: 'no-store',
    ...opts,
    headers
  });

  if (!res.ok) {
    // Try to parse JSON error; if no body (e.g., 304), fallback to generic
    let msg = 'Request failed';
    try { msg = (await res.json()).error || msg; } catch { }
    throw new Error(msg);
  }
  // Some endpoints may be 204
  if (res.status === 204) return null;
  return res.json();
}

export async function login({ email, password, role }) {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  return res;
}

export async function logout() {
  clearAuth();
}

export async function beat(audit_id) {
  return fetch(API + '/api/auth/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ audit_id })
  });
}

export function heartbeatStart() {
  const audit_id = getAuditId();
  if (!audit_id) return;
  setInterval(() => {
    fetch(API + '/api/auth/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ audit_id })
    });
  }, 60_000);
}
