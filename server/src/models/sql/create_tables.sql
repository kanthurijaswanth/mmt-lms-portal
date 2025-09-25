-- PostgreSQL schema for MMT LMS
CREATE TYPE user_role AS ENUM ('admin','student','faculty');
CREATE TYPE exp_status AS ENUM ('pending','ongoing','completed');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_audit (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  login_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMP,
  logout_at TIMESTAMP,
  duration_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS experiments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  instructions_md TEXT NOT NULL,
  knowledge_md TEXT NOT NULL,
  grc_filename TEXT,
  max_marks INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_experiments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  experiment_id INTEGER REFERENCES experiments(id) ON DELETE CASCADE,
  status exp_status NOT NULL DEFAULT 'pending',
  marks INTEGER,
  verified_by_admin BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, experiment_id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  experiment_id INTEGER REFERENCES experiments(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
