import React, { useEffect, useState } from 'react';
import { api, getToken } from '../../api.js';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  // Ensures we refetch when token changes / page is restored from history
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        const me = await api('/api/student/me', { method: 'GET', cache: 'no-store' });
        if (!cancelled) setData(me);
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [getToken()]); // re-run when token changes (Back/Forward restores)

  if (loading) return <div className="text-center py-5">Loading…</div>;
  if (err) return <div className="alert alert-danger">{err}</div>;

  const profile = data?.profile;
  const exps = data?.experiments || [];
  const none = exps.length === 0;

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-1">Welcome, {profile?.name || 'Student'}</h4>
              <div className="text-muted">Email: {profile?.email}</div>
            </div>
          </div>
        </div>

        {none ? (
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-2">No experiments assigned yet</h5>
                <p className="mb-0">
                  Ask your faculty/admin to assign experiments. For demo content, run the seed script from
                  the README or use the <code>/extras/sql/seed_demo.sql</code>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          exps.map((e) => (
            <div className="col-md-6" key={e.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="mb-1">{e.title}</h5>
                  <div className="text-muted small mb-2">Status: {e.status || 'pending'}</div>
                  <p className="flex-grow-1">{e.slug?.replace(/-/g, ' ')}</p>
                  <div className="d-flex gap-2 mt-auto">
                    <Link to={`/student/experiment/${e.id}`} className="btn btn-primary">Open</Link>
                    {e.verified_by_admin ? (
                      <span className="badge bg-success align-self-center">Verified</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
