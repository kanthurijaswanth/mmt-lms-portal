import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from './api.js';

export default function App() {
  const nav = useNavigate();
  const loc = useLocation();
  const onAuthScreen = loc.pathname.startsWith('/login') || loc.pathname === '/select-role';

  return (
    <div className="container py-4">
      <header className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src="/app-logo.png" width="40" height="40" alt="MMT" style={{ borderRadius: 8 }} />
          <h4 className="m-0">MMT LMS Portal</h4>
        </div>
        {!onAuthScreen && (
          <button className="btn btn-outline-secondary btn-sm"
            onClick={async () => { await logout(); nav('/select-role', { replace: true }); }}>
            Logout
          </button>
        )}
      </header>
      <Outlet />
    </div>
  );
}
