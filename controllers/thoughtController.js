const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate({ path: 'reactions', select: '-__v' });
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Get a single thought
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.id })
        .populate({ path: 'reactions', select: '-__v' });
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Create a new thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: 'Thought created, but found no user with that ID',
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete a thought
async deleteThought(req, res) {
  try {
    console.log('Deleting thought...');
    
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });
    console.log('Thought:', thought);
    
    if (!thought) {
      console.log('No thought found with this id:', req.params.id);
      return res.status(404).json({ message: 'No thought with this id!' });
    }
    
    const user = await User.findOneAndUpdate(
      { thoughts: req.params.id },
      { $pull: { thoughts: req.params.id } },
      { new: true }
    );
    console.log('User:', user);
    
    if (!user) {
      console.log('Thought deleted but no user found with this id:', req.params.id);
      return res.status(404).json({
        message: 'Thought deleted but no user with this id!',
      });
    }
    
    console.log('Thought successfully deleted!');
    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    console.error('Error deleting thought:', err);
    res.status(500).json(err);
  }
},
  
  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  
  // Add a reaction to a thought.
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a reaction from a thought.
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};