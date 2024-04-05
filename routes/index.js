// Imports the express file
const router = require('express').Router()

// Imports the api routes from api directory
const apiRoutes = require('./api')

// Mounts api routes so the routes are accessible under /api
router.use('/api', apiRoutes)

// Fallback route for handling errors
router.use((req, res) => {
  return res.send('404 Error!')
})

// Exports the main router for other parts of the app
module.exports = router