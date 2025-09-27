import React from 'react';
import { Link } from 'react-router-dom';

export default function RoleSelect() {
    return (
        <div className="container" style={{ maxWidth: 1050 }}>
            <div className="row g-4 mt-2">
                <div className="col-12">
                    <div className="d-flex align-items-center gap-3 mb-1">
                        <img src="/app-logo.png" width="40" height="40" alt="MMT" style={{ borderRadius: 8 }} />
                        <h3 className="m-0">MMT LMS Portal</h3>
                    </div>
                    <div className="text-muted">
                        MakeMyTechnology (MMT) — India’s own 5G Lab & Railway Safety innovators.
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm card-ghost">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-dark">Admin</span>
                                <h5 className="m-0">Admin Console</h5>
                            </div>
                            <p className="text-muted flex-grow-1">
                                Manage students, experiments, telemetry, and approvals.
                            </p>
                            <Link to="/login/admin" className="btn btn-primary w-100 mt-auto">Admin Login</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm card-ghost">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-info text-dark">Faculty</span>
                                <h5 className="m-0">Faculty Portal</h5>
                            </div>
                            <p className="text-muted flex-grow-1">
                                Review submissions, assign marks, verify experiments.
                            </p>
                            <Link to="/login/faculty" className="btn btn-primary w-100 mt-auto">Faculty Login</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm card-ghost">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-success">Student</span>
                                <h5 className="m-0">Student Portal</h5>
                            </div>
                            <p className="text-muted flex-grow-1">
                                View assigned experiments, upload results, and track progress.
                            </p>
                            <Link to="/login/student" className="btn btn-primary w-100 mt-auto">Student Login</Link>
                        </div>
                    </div>
                </div>

                {/* About MMT strip */}
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-2">About MMT (MakeMyTechnology)</h5>
                            <p className="mb-0 text-muted">
                                MMT builds indigenous 5G infrastructure (Core, gNBs) and safety systems like
                                a drone-enabled Kavach PoC for railways. Colleges use this LMS to run practical
                                RF/Photonics and GNU Radio labs—hands-on, industry-aligned, and Made-in-India.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
