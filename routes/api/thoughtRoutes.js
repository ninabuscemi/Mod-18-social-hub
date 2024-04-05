// Exports express and creates instance of router
const router = require('express').Router();
// Imports necessary controller functions from thoughtController.js
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// Define thought routes (GET, POST, PUT, DELETE)
router.route('/')
  .get(getAllThoughts)
  .post(createThought);

router.route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
  .post(addReaction);

router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

// Exports the router for use in other parts of the app
module.exports = router;
