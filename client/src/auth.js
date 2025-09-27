import { getToken } from './api';

export function getRoleFromToken() {
    const t = getToken();
    if (!t) return null;
    try {
        const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.role || null;
    } catch { return null; }
}
