import express from 'express';
import multer from 'multer';
import { supabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadImage } from '../services/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. Get Items: List active items with pagination and category filter
router.get('/items', async (req, res) => {
  const { category, page = 1 } = req.query;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('market_items')
    .select('*, users(username)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category && category !== 'All Items') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json({ items: data });
});

// 2. Post Item: Create new listing with image upload
router.post('/items', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, condition, points_cost, category } = req.body;

  if (!req.file) return res.status(400).json({ error: 'Image file is required' });

  // A. Upload to Cloudinary
  const image_url = await uploadImage(req.file.buffer);

  // B. Save to DB
  const { data, error } = await supabase
    .from('market_items')
    .insert([{
      user_id: req.user.id,
      title,
      description,
      condition,
      points_cost: parseInt(points_cost),
      category,
      image_url
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ item: data });
});

// 3. Delete/Sold: Mark item as sold (only by owner)
router.delete('/items/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const { data: item } = await supabase
    .from('market_items')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!item || item.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden', message: 'Not the owner of this item' });
  }

  const { error } = await supabase
    .from('market_items')
    .update({ status: 'sold' })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Item marked as sold' });
});

export default router;
