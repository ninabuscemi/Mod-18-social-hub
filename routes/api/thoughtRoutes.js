// Import the express router
const router = require('express').Router();

// Import necessary controllers from thoughtController
const {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController.js');

// Routes for handling GET and POST requests to /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// Routes for handling GET, PUT, and DELETE requests to /api/thoughts/:id
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

// Routes for handling POST requests to /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// Routes for handling DELETE requests to /api/thoughts/:thoughtId/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

// Export the router
module.exports = router;
