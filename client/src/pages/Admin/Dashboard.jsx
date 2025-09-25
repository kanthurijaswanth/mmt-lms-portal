import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const [items,setItems] = useState([]);
  const [err,setErr] = useState('');
  const nav = useNavigate();

  useEffect(()=>{
    api('/api/admin/students').then(setItems).catch(e=>setErr(e.message));
  },[]);

  return (
    <div>
      <h4 className="mb-3">All Students</h4>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Last login</th><th>Total time</th><th>Completed</th><th>Ongoing</th><th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id} style={{cursor:'pointer'}} onClick={()=>nav('/admin?student='+s.id)}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.last_login ? dayjs(s.last_login).format('DD MMM, HH:mm') : '-'}</td>
                <td>{Math.round((s.total_seconds||0)/60)} min</td>
                <td><span className="badge text-bg-success">{s.completed_count}</span></td>
                <td><span className="badge text-bg-warning">{s.ongoing_count}</span></td>
                <td><span className="badge text-bg-secondary">{s.pending_count}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminStudentDetail/>
    </div>
  );
}

function AdminStudentDetail(){
  const [detail,setDetail] = useState(null);
  const [err,setErr] = useState('');
  const search = new URLSearchParams(location.search);
  const sid = search.get('student');

  useEffect(()=>{
    setDetail(null); setErr('');
    if (!sid) return;
    api('/api/admin/students/'+sid).then(setDetail).catch(e=>setErr(e.message));
  },[sid]);

  if (!sid) return null;
  if (err) return <div className="alert alert-danger mt-3">{err}</div>;
  if (!detail) return <div className="mt-3">Loading student details…</div>;

  return (
    <div className="row mt-4">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-2">{detail.profile.name}</h5>
            <div className="small text-muted">{detail.profile.email}</div>
            <div className="small text-muted">{detail.profile.phone}</div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <h6>Recent logins</h6>
            <ul className="list-unstyled small">
              {detail.audits.map(a => (
                <li key={a.id} className="mb-2">
                  <div>{dayjs(a.login_at).format('DD MMM, HH:mm')} → {a.logout_at ? dayjs(a.logout_at).format('HH:mm') : '—'}</div>
                  <div className="text-muted">{a.duration_seconds ? Math.round(a.duration_seconds/60)+' min' : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h6>Experiments</h6>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead><tr><th>Title</th><th>Status</th><th>Marks</th><th>Verified</th></tr></thead>
                <tbody>
                  {detail.experiments.map(e => (
                    <tr key={e.experiment_id}>
                      <td>{e.title}</td>
                      <td>{e.status}</td>
                      <td>{e.marks ?? '-'}</td>
                      <td>{e.verified_by_admin ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-muted small">To assign marks, open Submissions (coming in a next pass) or run SQL on `submissions`.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
