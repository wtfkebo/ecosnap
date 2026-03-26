import { supabase } from '../db.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Verify the JWT with Supabase Auth
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }

  // Attach user to request object
  req.user = data.user;
  next();
};
