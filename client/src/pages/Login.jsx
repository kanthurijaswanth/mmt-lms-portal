import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setAuth, heartbeatStart } from '../api.js';

const roles = ['admin','student','faculty'];

export default function Login(){
  const [role,setRole] = useState('student');
  const [email,setEmail] = useState('rahul@mmt.local');
  const [password,setPassword] = useState('rahulmmt@123');
  const [error,setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setError('');
    try{
      const res = await login({email,password,role});
      setAuth(res.token, res.audit_id);
      heartbeatStart();
      nav('/' + role);
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div className="row align-items-center" style={{minHeight:'60vh'}}>
      <div className="col-12 text-center mb-4">
        <h2>Welcome to MMT LMS</h2>
        <p className="text-muted">Choose your role and sign in</p>
      </div>
      <div className="col-md-4 offset-md-2 mb-3">
        <div className={"card card-ghost " + (role==='admin'?'border-primary':'')} onClick={()=>setRole('admin')}>
          <div className="card-body">
            <h5 className="card-title">Admin Login</h5>
            <p className="card-text small text-muted">Manage students, verify submissions, and assign marks.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className={"card card-ghost " + (role==='student'?'border-primary':'')} onClick={()=>setRole('student')}>
          <div className="card-body">
            <h5 className="card-title">Student Login</h5>
            <p className="card-text small text-muted">See your experiments, open the .grc file, and upload results.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 offset-md-2 mb-3">
        <div className={"card card-ghost " + (role==='faculty'?'border-primary':'')} onClick={()=>setRole('faculty')}>
          <div className="card-body">
            <h5 className="card-title">Faculty Login</h5>
            <p className="card-text small text-muted">Create student access (name + email).</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <form className="card" onSubmit={onSubmit}>
          <div className="card-body">
            <div className="mb-2">
              <label className="form-label">Role</label>
              <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
              <div className="form-text">Initial password format: <code>{'<name>mmt@123'}</code></div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button className="btn btn-primary w-100">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
