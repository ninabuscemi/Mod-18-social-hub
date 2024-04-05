const res = require('express/lib/response');
const { User, Thought } = require('../models');

const userController = {
    // GET all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}).select('-__v');
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // GET one user by id
    getUserById: async ({ params }, res) => {
        try {
            const user = await User.findOne({ _id: params.id })
                .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
                .populate({
                    path: 'friends',
                    select: '-__v'
                })
                .select('-__v');

            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },

    // POST create a new user
    createUser: async ({ body }, res) => {
        try {
            const newUser = await User.create(body);
            res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },

    // PUT update a user by id
    updateUser: async ({ params, body }, res) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: params.id },
                body,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            res.json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },

    // DELETE remove user by id
    deleteUser: async ({ params }, res) => {
        try {
            const deletedUser = await User.findOneAndDelete({ _id: params.id });

            if (!deletedUser) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            await User.updateMany(
                { _id: { $in: deletedUser.friends } },
                { $pull: { friends: params.id } }
            );

            await Thought.deleteMany({ username: deletedUser.username });

            res.json({ message: 'Successfully deleted user' });
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },

    // POST add a new friend to user's friend list
    addFriend: async ({ params }, res) => {
        try {
            const { userId, friendId } = params;

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { friends: friendId } },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }

            const updatedFriend = await User.findOneAndUpdate(
                { _id: friendId },
                { $addToSet: { friends: userId } },
                { new: true, runValidators: true }
            );

            if (!updatedFriend) {
                res.status(404).json({ message: 'No user found with this friendId' });
                return;
            }

            res.json(updatedUser);
        } catch (err) {
            console.error(err);
            res.json(err);
        }
    },

    // DELETE remove a friend from user's friend list
    deleteFriend: async ({ params }, res) => {
        try {
            const { userId, friendId } = params;

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { friends: friendId } },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }

            const updatedFriend = await User.findOneAndUpdate(
                { _id: friendId },
                { $pull: { friends: userId } },
                { new: true, runValidators: true }
            );

            if (!updatedFriend) {
                res.status(404).json({ message: 'No user found with this friendId' });
                return;
            }

            res.json({ message: 'Successfully deleted the friend' });
        } catch (err) {
            console.error(err);
            res.json(err);
        }
    }
};

module.exports = userController;