import React, { useState } from 'react';
import { api } from '../../api.js';

export default function FacultyDashboard(){
  const [name,setName] = useState('Asha');
  const [email,setEmail] = useState('asha@mmt.local');
  const [phone,setPhone] = useState('');
  const [msg,setMsg] = useState('');

  async function onSubmit(e){
    e.preventDefault(); setMsg('');
    try{
      const res = await api('/api/faculty/students', {
        method:'POST',
        body: JSON.stringify({ name, email, phone })
      });
      setMsg('Created: ' + res.student.email + ' | initial password: ' + res.initial_password);
    }catch(e){ setMsg('Error: ' + e.message); }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5>Create Student Access</h5>
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label className="form-label">Full name</label>
                <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input className="form-control" value={phone} onChange={e=>setPhone(e.target.value)} />
              </div>
              <button className="btn btn-primary">Create</button>
            </form>
            {msg && <div className="alert alert-info mt-3">{msg}</div>}
            <div className="form-text mt-2">Initial password format: <code>{'<name>mmt@123'}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
