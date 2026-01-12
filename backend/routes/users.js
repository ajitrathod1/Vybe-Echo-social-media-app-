const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users - Get all users (for networking)
router.get('/', auth, async (req, res) => {
  try {
    // Return all users except the current one
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id - Get specific user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/me - Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, headline, profilePic } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (headline) user.headline = headline;
    if (profilePic) user.profilePic = profilePic;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/request/:id - Send connection request
router.post('/request/:id', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Check if already connected or requested
    if (targetUser.requests.includes(currentUserId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }
    if (targetUser.connections.includes(currentUserId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    // Add to target's requests
    targetUser.requests.push(currentUserId);
    // Add to current user's sent requests
    currentUser.sentRequests.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Connection request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/accept/:id - Accept connection request
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const requesterId = req.params.id;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!currentUser.requests.includes(requesterId)) {
      return res.status(400).json({ message: 'No request from this user' });
    }

    // Add to connections
    currentUser.connections.push(requesterId);
    requester.connections.push(currentUserId);

    // Remove from requests/sentRequests
    currentUser.requests = currentUser.requests.filter(id => id.toString() !== requesterId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await requester.save();

    res.json({ message: 'Connection accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
