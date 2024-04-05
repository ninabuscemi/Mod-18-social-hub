// Imports express and creates instance of the router
const router = require('express').Router();
// Imports necessary controller functions from userController.js
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController');

// Define user routes
// Each route is associated with a specific controller function
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

// Exports the router for use in other parts of the application
module.exports = router;