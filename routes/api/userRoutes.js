const router = require('express').Router();
// Import functions from userController.js
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController');

// Route to get all users
router.get('/', getAllUsers);

// Route to get a user by ID
router.get('/:id', getUserById);

// Route to create a new user
router.post('/', createUser);

// Route to update a user by ID
router.put('/:id', updateUser);

// Route to delete a user by ID
router.delete('/:id', deleteUser);

// Route to add a friend to a user's friend list
router.post('/:userId/friends/:friendId', addFriend);

// Route to delete a friend from a user's friend list
router.delete('/:userId/friends/:friendId', deleteFriend);

//Export the router for use in other parts of the app
module.exports = router;