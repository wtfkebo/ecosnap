import express from 'express';
import { supabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 1. Register: Sign up in Supabase Auth and then create a local profile
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Bad Request', message: 'email, password, and username are required' });
  }

  // A. Supabase Auth signup
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  // 💡 FORGIVING LOGIC: If user already exists, just log them in instead of erroring
  if (authError) {
    if (authError.message.toLowerCase().includes('already registered')) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) return res.status(401).json({ error: loginError.message });
      return res.json({ message: 'Welcome back!', session: loginData.session, user: loginData.user });
    }
    return res.status(400).json({ error: authError.message });
  }

  // B. Local profile creation in public.users
  await supabase.from('users').insert([{ id: authData.user.id, username }]);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: authData.user.id, email: authData.user.email, username },
    session: authData.session
  });
});

// 2. Login: Authenticate via Supabase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  // Fetch local profile data (total_points, level)
  const { data: profile } = await supabase
    .from('users')
    .select('username, total_points, level')
    .eq('id', data.user.id)
    .single();

  res.json({
    session: data.session,
    user: { ...data.user, ...profile }
  });
});

// 3. Me: Get current user profile (Protected)
router.get('/me', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(404).json({ error: 'User profile not found' });

  res.json({ user: data });
});

export default router;
