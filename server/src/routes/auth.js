import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { query } from '../db.js';
import { comparePassword } from '../utils/password.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'email, password, role required' });

  const { rows } = await query('SELECT * FROM users WHERE email=$1 AND role=$2', [email, role]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  // insert login audit
  const audit = await query('INSERT INTO login_audit (user_id, login_at, last_seen) VALUES ($1, NOW(), NOW()) RETURNING id', [user.id]);

  return res.json({
    token,
    user: { id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone },
    audit_id: audit.rows[0].id
  });
});

router.post('/logout', async (req, res) => {
  const { audit_id } = req.body;
  if (!audit_id) return res.json({ ok: true });
  await query('UPDATE login_audit SET logout_at=NOW(), duration_seconds=EXTRACT(EPOCH FROM (NOW() - login_at))::int WHERE id=$1', [audit_id]);
  return res.json({ ok: true });
});

router.post('/heartbeat', async (req, res) => {
  const { audit_id } = req.body;
  if (audit_id) {
    await query('UPDATE login_audit SET last_seen=NOW() WHERE id=$1', [audit_id]);
  }
  return res.json({ ok: true });
});

export default router;
