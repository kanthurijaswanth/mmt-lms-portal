import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'src', uploadDir)),
  filename: (req, file, cb) => {
    const stamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${req.user.id}_${stamp}_${safe}`);
  }
});
const upload = multer({ storage });

router.use(authRequired, requireRole('student'));

router.get('/me', async (req, res) => {
  const userId = req.user.id;
  const user = await query('SELECT id, name, email, phone FROM users WHERE id=$1', [userId]);
  const exps = await query(`
    SELECT e.id, e.title, e.slug, se.status, se.marks, se.verified_by_admin
    FROM student_experiments se
    JOIN experiments e ON e.id=se.experiment_id
    WHERE se.student_id=$1
    ORDER BY e.title;
  `, [userId]);
  const summary = {
    completed: exps.rows.filter(r => r.status==='completed').length,
    ongoing: exps.rows.filter(r => r.status==='ongoing').length,
    pending: exps.rows.filter(r => r.status==='pending').length
  };
  res.json({ profile: user.rows[0], experiments: exps.rows, summary });
});

router.get('/experiments/:id', async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { rows } = await query(`
    SELECT e.id, e.title, e.slug, e.description, e.instructions_md, e.knowledge_md, e.grc_filename, e.max_marks, se.status, se.marks, se.verified_by_admin
    FROM student_experiments se
    JOIN experiments e ON e.id=se.experiment_id
    WHERE se.student_id=$1 AND e.id=$2
  `, [userId, id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not assigned' });
  res.json(rows[0]);
});

router.post('/experiments/:id/status', async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { status } = req.body; // 'pending' | 'ongoing' | 'completed'
  if (!['pending','ongoing','completed'].includes(status)) return res.status(400).json({ error: 'bad status' });
  await query('UPDATE student_experiments SET status=$1, updated_at=NOW() WHERE student_id=$2 AND experiment_id=$3', [status, userId, id]);
  res.json({ ok: true });
});

router.post('/experiments/:id/upload', upload.single('zip'), async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: 'zip required' });

  await query('INSERT INTO submissions (student_id, experiment_id, file_path) VALUES ($1,$2,$3)',
    [userId, id, path.basename(req.file.path)]);

  // mark ongoing (at least) to make progress visible
  await query('UPDATE student_experiments SET status=$1, updated_at=NOW() WHERE student_id=$2 AND experiment_id=$3 AND status <> $1',
    ['ongoing', userId, id]);

  res.json({ ok: true, file: req.file.filename });
});

export default router;
