import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { hashPassword } from '../utils/password.js';

function toInitialPassword(name) {
  return name.toLowerCase().replace(/\s+/g, '') + 'mmt@123';
}

const router = Router();
router.use(authRequired, requireRole('faculty'));

router.post('/students', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const initial = toInitialPassword(name);
  const hash = await hashPassword(initial);
  try {
    const ins = await query('INSERT INTO users (role, name, email, phone, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email',
      ['student', name, email, phone || null, hash]);
    res.json({ ok: true, student: ins.rows[0], initial_password: initial });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists?' });
  }
});

export default router;
