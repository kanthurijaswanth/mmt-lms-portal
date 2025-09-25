import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(authRequired, requireRole('admin'));

router.get('/students', async (req, res) => {
  const sql = `
    SELECT u.id, u.name, u.email, u.phone,
      (SELECT MAX(login_at) FROM login_audit la WHERE la.user_id=u.id) AS last_login,
      COALESCE((SELECT SUM(duration_seconds) FROM login_audit la WHERE la.user_id=u.id),0) AS total_seconds,
      (SELECT COUNT(*) FROM student_experiments se WHERE se.student_id=u.id AND se.status='completed') AS completed_count,
      (SELECT COUNT(*) FROM student_experiments se WHERE se.student_id=u.id AND se.status='ongoing') AS ongoing_count,
      (SELECT COUNT(*) FROM student_experiments se WHERE se.student_id=u.id AND se.status='pending') AS pending_count
    FROM users u
    WHERE u.role='student'
    ORDER BY u.name;
  `;
  const { rows } = await query(sql);
  res.json(rows);
});

router.get('/students/:id', async (req, res) => {
  const id = Number(req.params.id);
  const stu = await query('SELECT id, name, email, phone FROM users WHERE id=$1 AND role=$2', [id, 'student']);
  if (!stu.rows[0]) return res.status(404).json({ error: 'Not found' });

  const audits = await query('SELECT id, login_at, last_seen, logout_at, duration_seconds FROM login_audit WHERE user_id=$1 ORDER BY login_at DESC LIMIT 50', [id]);
  const exps = await query(`
    SELECT se.id as student_exp_id, e.id as experiment_id, e.title, e.slug, se.status, se.marks, se.verified_by_admin,
      (SELECT COUNT(*) FROM submissions s WHERE s.student_id=$1 AND s.experiment_id=e.id) AS submissions
    FROM student_experiments se
    JOIN experiments e ON e.id=se.experiment_id
    WHERE se.student_id=$1
    ORDER BY e.title;
  `, [id]);
  res.json({ profile: stu.rows[0], audits: audits.rows, experiments: exps.rows });
});

router.get('/experiments', async (req, res) => {
  const { rows } = await query('SELECT id, title, slug, max_marks FROM experiments ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/submissions/:submissionId/verify', async (req, res) => {
  const sid = Number(req.params.submissionId);
  const { marks } = req.body;
  // fetch submission
  const sub = await query('SELECT * FROM submissions WHERE id=$1', [sid]);
  if (!sub.rows[0]) return res.status(404).json({ error: 'Submission not found' });

  const exp = await query('SELECT max_marks FROM experiments WHERE id=$1', [sub.rows[0].experiment_id]);
  const max = exp.rows[0]?.max_marks ?? 20;
  const m = Math.max(0, Math.min(Number(marks || 0), max));

  // set verified flag and marks in student_experiments
  await query('UPDATE student_experiments SET verified_by_admin=true, marks=$1, status=$2, updated_at=NOW() WHERE student_id=$3 AND experiment_id=$4',
    [m, 'completed', sub.rows[0].student_id, sub.rows[0].experiment_id]);

  res.json({ ok: true, marks: m });
});

export default router;
