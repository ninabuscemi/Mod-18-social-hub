const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Get a thought by its ID
  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a new thought
  createThought: async (req, res) => {
    try {
      const newThought = await Thought.create(req.body);
      // Update associated user's thoughts array
      await User.findByIdAndUpdate(newThought.userId, { $push: { thoughts: newThought._id } });
      res.status(201).json(newThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Update a thought by its ID
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true, runValidators: true });
      if (!updatedThought) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Delete a thought by its ID
  deleteThought: async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!deletedThought) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      // Remove thought ID from associated user's thoughts array
      await User.findByIdAndUpdate(deletedThought.userId, { $pull: { thoughts: req.params.thoughtId } });
      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Add a reaction to a thought
  addReaction: async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Delete a reaction from a thought
  deleteReaction: async (req, res) => {
    try {
      const { thoughtId, reactionId } = req.params;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { reactionId: reactionId } } },
        { new: true, runValidators: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

module.exports = thoughtController;