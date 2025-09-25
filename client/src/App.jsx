import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from './api.js';

export default function App(){
  const nav = useNavigate();
  return (
    <div className="container py-4">
      <header className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src="/mmt-logo.svg" width="40" height="40" alt="MMT"/>
          <h4 className="m-0">MMT LMS Portal</h4>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={async()=>{ await logout(); nav('/login'); }}>Logout</button>
      </header>
      <Outlet/>
    </div>
  );
}
