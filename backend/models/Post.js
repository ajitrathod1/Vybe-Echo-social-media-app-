const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String
}, { _id: false });

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  email: String,
  title: { type: String, default: '' }, // New: Title of the Echo
  text: { type: String, default: '' }, // Description/Thought
  audioUrl: { type: String, default: '' }, // New: Base64 or URL of audio
  duration: { type: String, default: '0:00' }, // New: Duration string
  category: { type: String, default: 'General' }, // New: Category tag
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
