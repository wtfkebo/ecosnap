import express from 'express';
import { supabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { analyzeImage } from '../services/gemini.js';
import { checkBadges } from '../services/badgeEngine.js';

const router = express.Router();

// 1. Detect: Send image to Gemini Vision API
router.post('/detect', authMiddleware, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const detection = await analyzeImage(imageBase64);
  res.json(detection);
});

// 2. Action: User chooses reuse/recycle/dispose after detection
router.post('/action', authMiddleware, async (req, res) => {
  const { item_label, action, co2_saved_kg = 0.4 } = req.body;

  if (!item_label || !action) {
    return res.status(400).json({ error: 'item_label and action are required' });
  }

  // Points Logic
  const pointMap = { reuse: 30, recycle: 10, dispose: 0 };
  const points_earned = pointMap[action] ?? 0;

  // A. Record the scan history
  const { error: scanError } = await supabase
    .from('scans')
    .insert([{
      user_id: req.user.id,
      item_label,
      action,
      points_earned,
      co2_saved_kg
    }]);

  if (scanError) return res.status(500).json({ error: scanError.message });

  // B. Update User Points
  const { data: user, error: userError } = await supabase.rpc('increment_user_points', { 
    uid: req.user.id, 
    pts: points_earned 
  });

  if (userError) return res.status(500).json({ error: userError.message });

  // C. Execute Badge Engine
  const new_badges = await checkBadges(req.user.id);

  res.json({
    message: 'Action recorded successfully',
    points_earned,
    total_points: user?.[0]?.total_points || 0,
    new_badges 
  });
});

// 3. History: Get last 20 scans
router.get('/history', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('scans')
    .orderBy('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ scans: data });
});

export default router;
