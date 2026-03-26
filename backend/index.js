import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { supabase } from './db.js';
import authRoutes from './routes/auth.js';
import scanRoutes from './routes/scan.js';
import rewardsRoutes from './routes/rewards.js';
import marketRoutes from './routes/market.js';
import profileRoutes from './routes/profile.js';


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🔐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/profile', profileRoutes);

// 🩺 Health Check (Verifies DB connection)
app.get('/health', async (req, res) => {
  const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
  
  res.json({ 
    status: error ? 'Degraded' : 'Healthy', 
    database: error ? 'Disconnected' : 'Connected',
    timestamp: new Date().toISOString(),
    service: 'EcoSnap Backend'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`🚀 EcoSnap backend running at http://localhost:${port}`);
});
