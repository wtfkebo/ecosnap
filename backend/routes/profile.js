import express from 'express';
import { supabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 1. Get Profile Detail (Protected)
router.get('/', authMiddleware, async (req, res) => {
  // A. Profile data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (userError) return res.status(500).json({ error: userError.message });

  // B. Recent History
  const { data: scans } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // C. Badges
  const { data: badges } = await supabase
    .from('badges')
    .select('badge_key, unlocked_at')
    .eq('user_id', req.user.id);

  res.json({
    user,
    scans: scans || [],
    badges: badges || []
  });
});

// 2. Update Profile (Protected)
router.patch('/', authMiddleware, async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username is required' });

  const { data, error } = await supabase
    .from('users')
    .update({ username })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Profile updated successfully', user: data });
});

export default router;
