const API = import.meta.env.VITE_API || 'http://localhost:4000';

export function setAuth(token, auditId) {
  localStorage.setItem('token', token);
  if (auditId) localStorage.setItem('audit_id', String(auditId));
}
export function getToken() { return localStorage.getItem('token'); }
export function getAuditId() { return localStorage.getItem('audit_id'); }
export function clearAuth() { localStorage.removeItem('token'); localStorage.removeItem('audit_id'); }

export async function api(path, opts={}) {
  const token = getToken();
  const headers = { 'Content-Type':'application/json', ...(opts.headers||{}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export async function login({email,password,role}) {
  const res = await fetch(API + '/api/auth/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, password, role })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  return res.json();
}

export async function logout() {
  const audit_id = getAuditId();
  clearAuth();
  return fetch(API + '/api/auth/logout', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ audit_id })
  });
}

export function heartbeatStart() {
  const audit_id = getAuditId();
  if (!audit_id) return;
  setInterval(() => {
    fetch(API + '/api/auth/heartbeat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ audit_id })
    });
  }, 60_000);
}
