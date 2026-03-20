const express = require('express');
const router = express.Router();

// Import your controller functions
const { register, login } = require('../controllers/controller');

// Route for registering a new user
router.post('/register', register);

// Route for logging in
router.post('/login', login);

// Export the router
module.exports = router;