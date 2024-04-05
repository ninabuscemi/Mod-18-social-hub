// Import the express router
const router = require('express').Router();

// Import userRoutes and thoughtRoutes
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Set up routes for users and thoughts
router.use('/users', userRoutes); // Routes for handling user-related operations
router.use('/thoughts', thoughtRoutes); // Routes for handling thought-related operations

// Export the router
module.exports = router;