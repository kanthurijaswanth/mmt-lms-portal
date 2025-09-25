import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { marked } from 'marked';

export default function ExperimentDetail(){
  const { id } = useParams();
  const [data,setData] = useState(null);
  const [err,setErr] = useState('');
  const [file,setFile] = useState(null);
  const [busy,setBusy] = useState(false);
  const API = import.meta.env.VITE_API || 'http://localhost:4000';

  useEffect(()=>{
    api('/api/student/experiments/'+id).then(setData).catch(e=>setErr(e.message));
  },[id]);

  async function uploadZip(e){
    e.preventDefault(); if (!file) return;
    setBusy(true);
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('zip', file);
    const res = await fetch(API + '/api/student/experiments/'+id+'/upload', {
      method:'POST', headers:{ 'Authorization':'Bearer '+token },
      body: fd
    });
    setBusy(false);
    if (!res.ok) { alert('Upload failed'); return; }
    alert('Uploaded!');
    setFile(null);
  }

  if (err) return <div className="alert alert-danger">{err}</div>;
  if (!data) return <div>Loading…</div>;

  const openHref = API + '/api/experiments/' + data.id + '/download-grc';
  const mmtgrc = 'mmtgrc://open?file=' + encodeURIComponent('C:\\Users\\Public\\Downloads\\' + (data.grc_filename||''));

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-3">
          <div className="card-body">
            <h4 className="mb-2">{data.title}</h4>
            <p className="text-muted">Max Marks: {data.max_marks}</p>
            <h6>Description</h6>
            <p>{data.description}</p>
            <h6>How to do</h6>
            <div dangerouslySetInnerHTML={{__html: marked.parse(data.instructions_md||'')}} />
            <h6>Background knowledge</h6>
            <div dangerouslySetInnerHTML={{__html: marked.parse(data.knowledge_md||'')}} />
          </div>
        </div>
        <div className="d-flex gap-2">
          <a className="btn btn-primary" href={openHref}>Download .grc</a>
          <a className="btn btn-outline-primary" href={mmtgrc} title="Requires optional Windows helper">Open in GNU Radio</a>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6>Upload Results (.zip)</h6>
            <form onSubmit={uploadZip}>
              <input type="file" accept=".zip" className="form-control mb-2" onChange={e=>setFile(e.target.files?.[0]||null)} />
              <button disabled={busy || !file} className="btn btn-success w-100">{busy?'Uploading…':'Upload ZIP'}</button>
            </form>
            <div className="form-text mt-2">Include screenshots and result notes inside the ZIP.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
