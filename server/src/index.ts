import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import tendersRoutes from './routes/tenders.routes.js';
import approvalsRoutes from './routes/approvals.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import newsRoutes from './routes/news.routes.js';
import careersRoutes from './routes/careers.routes.js';
import inquiriesRoutes from './routes/inquiries.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import auditRoutes from './routes/audit.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import usersRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads directly from local server disk (zero third-party cloud)
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    entity: 'Mpumalanga Nkomazi SEZ Bespoke Core API',
    popiaCompliant: true,
    jurisdiction: 'Republic of South Africa'
  });
});

// Mount modular REST routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/tenders', tendersRoutes);
app.use('/api/approvals', approvalsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Mpumalanga Nkomazi SEZ Bespoke API running on port ${PORT}`);
  console.log(`📁 Local file storage active at: ${uploadsDir}`);
  console.log(`🔒 100% Self-Hosted & POPIA Compliant (Zero 3rd-party SaaS)`);
  console.log(`================================================================`);
});
