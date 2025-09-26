import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import facultyRoutes from './routes/faculty.js';
import expRoutes from './routes/experiments.js';

const app = express();

// ✅ Disable ETag so Express won’t emit 304 for identical bodies
app.set('etag', false);

// Optional but recommended: no-cache headers for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store');   // don’t cache API
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const expDir = process.env.EXP_DIR || 'experiments';

app.use('/static/uploads', express.static(path.join(process.cwd(), 'src', uploadDir)));
app.use('/static/experiments', express.static(path.join(process.cwd(), 'src', expDir)));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/experiments', expRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'MMT LMS Server' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MMT LMS Server listening on :${PORT}`);
});
