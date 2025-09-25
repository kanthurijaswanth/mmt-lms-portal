import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { Link } from 'react-router-dom';

export default function StudentDashboard(){
  const [data,setData] = useState(null);
  const [err,setErr] = useState('');

  useEffect(()=>{
    api('/api/student/me').then(setData).catch(e=>setErr(e.message));
  },[]);

  if (err) return <div className="alert alert-danger">{err}</div>;
  if (!data) return <div>Loading…</div>;

  return (
    <div>
      <div className="row mb-3">
        <div className="col"><h4>Hello, {data.profile.name}</h4></div>
        <div className="col text-end">
          <span className="badge text-bg-success me-2">Completed {data.summary.completed}</span>
          <span className="badge text-bg-warning me-2">Ongoing {data.summary.ongoing}</span>
          <span className="badge text-bg-secondary">Pending {data.summary.pending}</span>
        </div>
      </div>
      <div className="row">
        {data.experiments.map(e => (
          <div key={e.id} className="col-md-6 mb-3">
            <div className="card card-ghost">
              <div className="card-body">
                <h5 className="card-title">{e.title}</h5>
                <div className="mb-2"><span className="badge text-bg-light">{e.status}</span></div>
                <Link to={`/student/experiment/${e.id}`} className="btn btn-primary btn-sm">Open</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
