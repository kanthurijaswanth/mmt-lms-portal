import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { login, setAuth, heartbeatStart } from '../api.js';

export default function Login() {
  // role is fixed by the URL (admin | faculty | student)
  const { role } = useParams();
  const nav = useNavigate();

  // sensible defaults per role
  const [email, setEmail] = useState('rahul@mmt.local');
  const [password, setPassword] = useState('rahulmmt@123');
  const [error, setError] = useState('');

  useMemo(() => {
    if (role === 'admin') setEmail('admin@mmt.local');
    if (role === 'faculty') setEmail('faculty@mmt.local');
    if (role === 'student') setEmail('rahul@mmt.local');
  }, [role]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await login({ email, password, role });
      setAuth(res.token, res.audit_id);
      heartbeatStart();
      // replace history so Back doesn't go to login again
      nav('/' + role, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="row align-items-center" style={{ minHeight: '60vh' }}>
      <div className="col-12 text-center mb-4">
        <h2>Welcome to MMT LMS Portal</h2>
        <p className="text-muted mb-1">Sign in to your {role} account</p>
        <span className="badge bg-secondary text-uppercase">{role}</span>
      </div>

      {/* Simple login form (role is fixed, no dropdown here) */}
      <div className="col-md-6 col-lg-4 mx-auto">
        <form className="card shadow-sm" onSubmit={onSubmit}>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="form-text">
                Initial password format: <code>{'<name>mmt@123'}</code>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button className="btn btn-primary w-100">Sign In</button>
          </div>
        </form>

        <div className="text-center mt-3">
          <Link to="/select-role" className="text-decoration-none">
            ← Choose a different role
          </Link>
        </div>
      </div>
    </div>
  );
}
