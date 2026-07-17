const express = require('express');
const router = express.Router();
const {protect, isAdmin} = require('../middleware/authMiddleware'); // you need this for /me
const { 
    getAllPersons, 
    getMe, 
    getClients,
    upgradeToCustomer,
    editPerson,
    deactivatePerson,
    reactivatePerson
    } = require('../controllers/personController');

// Public: Get all persons or filter by role ?role=stylist
router.get('/', getAllPersons);

// Protected: Get current logged in user
router.get('/me', protect, getMe); // <-- added authMiddleware here

// Clients for booking
router.get('/clients', getClients);





// @route   PUT /api/persons/:id
// @desc    Edit client details
router.put('/:id', protect,isAdmin,editPerson);
//Router for upgrading from walk-in to customer role 

router.post('/upgrade',protect,upgradeToCustomer)

// 2 separate routes now instead of toggle
router.patch('/:id/deactivate',protect, deactivatePerson); 
router.patch('/:id/reactivate', protect,reactivatePerson);

module.exports = router;