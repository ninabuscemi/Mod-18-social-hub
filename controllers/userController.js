const User = require('../models/User');

module.exports = {
  // Retrieve all users from the database
  async getUsers(req, res) {
    try {
      // Find all users and populate their friends
      const users = await User.find().populate({ path: 'friends', select: '-__v' });
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Retrieve a single user by ID
  async getUserById(req, res) {
    try {
      // Find a user by ID and populate their friends
      const user = await User.findOne({ _id: req.params.id }).populate({ path: 'friends', select: '-__v' });

      // If no user found with the given ID, return a 404 response
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      // Create a new user using the request body
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user by ID
  async deleteUser(req, res) {
    try {
      // Find and delete a user by ID
      const user = await User.findOneAndDelete({ _id: req.params.id });

      // If no user found with the given ID, return a 404 response
      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      // Delete thoughts associated with the deleted user
      await User.deleteMany({ _id: { $in: user.thoughts } });

      // Respond with a success message
      res.json({ message: 'Thoughts and user deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      // Find and update a user by ID with the provided request body
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      // If no user found with the given ID, return a 404 response
      if (!user) {
        res.status(404).json({ message: 'No user with this ID' });
      }

      // Respond with the updated user
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      // Find a user by ID and add a friend to their friend list
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      // If no user found with the given ID, return a 404 response
      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      // Respond with the updated user
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      // Find a user by ID and remove a friend from their friend list
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      // If no user found with the given ID, return a 404 response
      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      // Respond with the updated user
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
