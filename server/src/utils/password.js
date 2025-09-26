// server/src/utils/password.js
import bcrypt from 'bcryptjs';

const saltRounds = 10;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, saltRounds);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
