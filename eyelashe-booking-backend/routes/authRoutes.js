
const express = require('express');
const router = express.Router();
const {protect,isAdmin}= require('../middleware/authMiddleware');
const {getMe} = require('../controllers/userController');
const {upgradeToCustomer,createWalkIn} = require ('../controllers/authController');



// Import your controller functions
const { register, login } = require('../controllers/controller');

// Route for registering a new user
router.post('/register', register);

// Route for logging in
router.post('/login', login);


// Route for getting the authenticated user's information
router.get('/me', protect, getMe);



//ADmin route to create a walk-in
router.post('/admin/create-walk-in',protect,isAdmin,createWalkIn)




// Export the router
module.exports = router;