// Import the express router
const router = require('express').Router();

// Import necessary controllers from userController
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController.js');

// Routes for handling GET and POST requests to /api/users
router.route('/').get(getUsers).post(createUser);

// Routes for handling GET, PUT, and DELETE requests to /api/users/:id
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// Routes for handling POST and DELETE requests to /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

// Export the router
module.exports = router;