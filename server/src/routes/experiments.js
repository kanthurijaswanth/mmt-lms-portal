import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

// Get details (for student or admin)
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await query('SELECT id, title, slug, description, instructions_md, knowledge_md, grc_filename, max_marks FROM experiments WHERE id=$1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// Download the GRC file
router.get('/:id/download-grc', async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await query('SELECT grc_filename, title FROM experiments WHERE id=$1', [id]);
  const exp = rows[0];
  if (!exp?.grc_filename) return res.status(404).json({ error: 'No GRC for this experiment' });
  const baseDir = process.env.EXPERIMENT_DIR || 'experiments';
  const fpath = path.join(process.cwd(), 'src', baseDir, exp.grc_filename);
  res.download(fpath, exp.grc_filename);
});

export default router;
