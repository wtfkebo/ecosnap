import { supabase } from '../db.js';

const BADGE_RULES = [
  { 
    key: 'master_sorter', 
    check: async (stats) => stats.total_scans >= 50 
  },
  { 
    key: 'streak_7', 
    check: async (stats) => stats.current_streak >= 7 
  },
  { 
    key: 'tree_planter', 
    check: async (stats) => stats.total_points >= 5000 
  },
  { 
    key: 'early_adopter', 
    check: async (stats) => {
      const joinDate = new Date(stats.created_at);
      const cutoff = new Date('2024-12-31');
      return joinDate <= cutoff;
    }
  }
];

export const checkBadges = async (userId) => {
  // 1. Fetch current stats
  const { data: user } = await supabase
    .from('users')
    .select('total_points, created_at')
    .eq('id', userId)
    .single();

  const { count: totalScans } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 2. Mock streak (in real app, compare scan dates)
  const currentStreak = 1; 

  const stats = {
    ...user,
    total_scans: totalScans || 0,
    current_streak: currentStreak
  };

  // 3. Get existing badges to avoid duplicates
  const { data: existing } = await supabase
    .from('badges')
    .select('badge_key')
    .eq('user_id', userId);

  const existingKeys = new Set(existing?.map(b => b.badge_key) || []);
  const newBadges = [];

  // 4. Evaluate each rule
  for (const rule of BADGE_RULES) {
    if (!existingKeys.has(rule.key)) {
      const earned = await rule.check(stats);
      if (earned) {
        // Insert badge
        await supabase.from('badges').insert([{ user_id: userId, badge_key: rule.key }]);
        newBadges.push(rule.key);
      }
    }
  }

  return newBadges;
};
