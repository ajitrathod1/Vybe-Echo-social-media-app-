const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// GET /api/posts  -> get all posts (latest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts -> create post (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { text, image, video, title, audioUrl, duration, category } = req.body;
    const newPost = new Post({
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      title: title || '',
      text: text || '',
      audioUrl: audioUrl || '',
      duration: duration || '0:00',
      category: category || 'General',
      image: image || '',
      video: video || '',
      timestamp: new Date()
    });
    const saved = await newPost.save();
    res.json(saved);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/posts/:id -> edit post (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    const { text, image, video } = req.body;
    post.text = text ?? post.text;
    post.image = image ?? post.image;
    post.video = video ?? post.video;
    post.timestamp = new Date();
    await post.save();
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/posts/:id -> delete (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts/:id/comment -> add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user.name, text, time: new Date().toLocaleString() });
    await post.save();
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts/:id/like -> increment like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
