import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { query } from '../db.js';
import { comparePassword } from '../utils/password.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Check if email, password, and role are provided
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password, role required' });
  }

  // Trim any extra whitespace from email and password before querying
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  // Query to fetch the user from the database
  const { rows } = await query('SELECT * FROM users WHERE email=$1 AND role=$2', [trimmedEmail, role]);
  const user = rows[0];

  // If no user is found, log it and return a 401 error
  if (!user) {
    console.log(`LOGIN FAILED: User not found for email: ${trimmedEmail} and role: ${role}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Log the entered password and the stored password hash for debugging
  console.log(`Entered password (trimmed): ${trimmedPassword}`);
  console.log(`Stored password hash: ${user.password_hash}`);

  // Compare the entered password with the stored hash
  const ok = await comparePassword(trimmedPassword, user.password_hash);

  // Log the result of password comparison for debugging
  console.log(`Password match result: ${ok}`);

  // If the password doesn't match, log it and return a 401 error
  if (!ok) {
    console.log(`LOGIN FAILED: Password mismatch for email: ${trimmedEmail} and role: ${role}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token if credentials are valid
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token });
});

export default router;
