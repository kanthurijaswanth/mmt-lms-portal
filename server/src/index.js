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
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.ALLOW_ORIGIN?.split(',') || '*' }));

// Static for uploads and experiments assets
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const expDir = process.env.EXPERIMENT_DIR || 'experiments';
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
