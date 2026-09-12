import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import meetingsRoutes from './routes/meetings.js';
import decisionsRoutes from './routes/decisions.js';
import tasksRoutes from './routes/tasks.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import approvalsRoutes from './routes/approvals.js';
import integrationsRoutes from './routes/integrations.js';
import sharedRoutes from './routes/shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger for transparent audit visibility
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/decisions', decisionsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/approvals', approvalsRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api', sharedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    service: 'MeetFlow AI Execution Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve static assets if client build exists
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send(`MeetFlow AI Server running. Start Vite dev server for client.`);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ MeetFlow AI Execution Backend listening on http://localhost:${PORT}`);
});
