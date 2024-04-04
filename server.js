// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Import models
const { User, Thought, Reaction } = require('./models');

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Social Network API!');
});

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Add other user routes: POST, PUT, DELETE

// Thought routes
app.get('/api/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Add other thought routes: GET single thought, POST, PUT, DELETE

// Reaction routes
app.post('/api/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const { reactionBody, username } = req.body;
    const newReaction = { reactionBody, username, createdAt: new Date() };
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: newReaction } },
      { new: true }
    );
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
