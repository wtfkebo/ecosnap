import express from 'express';
import { supabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Level Configuration
const LEVELS = [
  { min: 0,    max: 499,   label: 'Eco Starter'     },
  { min: 500,  max: 999,   label: 'Green Learner'   },
  { min: 1000, max: 1999,  label: 'Eco Conscious'   },
  { min: 2000, max: 4999,  label: 'Eco Warrior'     },
  { min: 5000, max: Infinity, label: 'Earth Guardian' }
];

// 1. Summary: Calculate levels and progress
router.get('/summary', authMiddleware, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('total_points')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const pts = user.total_points;
  const currentLevel = LEVELS.find(l => pts >= l.min && pts <= l.max);
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const pointsToNext = nextLevel ? nextLevel.min - pts : 0;

  res.json({
    total_points: pts,
    level: LEVELS.indexOf(currentLevel) + 1,
    level_label: currentLevel.label,
    points_to_next: pointsToNext,
  });
});

// 2. Badges: Return unlocked vs locked
router.get('/badges', authMiddleware, async (req, res) => {
  const { data: unlocked, error } = await supabase
    .from('badges')
    .select('badge_key')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  // Badge list definitions (mirroring frontend structure)
  const BADGE_LIST = [
    { key: 'master_sorter',  label: 'Master Sorter',  icon: 'recycling' },
    { key: 'streak_7',       label: '7 Day Streak',   icon: 'local_fire_department' },
    { key: 'tree_planter',   label: 'Tree Planter',   icon: 'forest' },
    { key: 'early_adopter',  label: 'Early Adopter',  icon: 'emoji_events' }
  ];

  const unlockedSet = new Set(unlocked.map(b => b.badge_key));
  
  const results = BADGE_LIST.map(badge => ({
    ...badge,
    locked: !unlockedSet.has(badge.key)
  }));

  res.json({ badges: results });
});

// 3. Leaderboard: Top 10 by points in the last 7 days
router.get('/leaderboard', async (req, res) => {
  // Aggregate sum(points_earned) from scans table in the last week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // We use Supabase RPC or raw query via .rpc to get aggregated ranking if needed,
  // but for simplicity, let's query the top users by total_points for MVP.
  const { data, error } = await supabase
    .from('users')
    .select('id, username, total_points')
    .order('total_points', { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });

  const leaderboard = data.map((u, idx) => ({
    rank: idx + 1,
    name: u.username,
    points: `${u.total_points} pts`,
    isCurrentUser: u.id === req.headers['x-user-id'], // Placeholder detection
    subtitle: idx === 0 ? 'Top Recycler' : idx === 1 ? 'Eco Advocate' : 'Eco Contributor'
  }));

  res.json({ leaderboard });
});

// 4. Pledge: Stake points for environmental goals (stub)
router.post('/pledge', authMiddleware, async (req, res) => {
  const { goal_id, points } = req.body;
  
  if (!points || points <= 0) return res.status(400).json({ error: 'Points must be positive' });

  // TODO: Implement points deduction logic
  res.json({ message: 'Points pledged successfully', points_deducted: points });
});

export default router;
