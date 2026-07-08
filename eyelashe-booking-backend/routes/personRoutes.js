const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // you need this for /me
const { getAllPersons, getMe, getClients,toggleClientStatus,upgradeWalkIn } = require('../controllers/personController');

// Public: Get all persons or filter by role ?role=stylist
router.get('/', getAllPersons);

// Protected: Get current logged in user
router.get('/me', authMiddleware, getMe); // <-- added authMiddleware here

// Clients for booking
router.get('/clients', getClients);


router.patch('/:id/toggle-status',authMiddleware,toggleClientStatus);

router.patch('/:id/upgrade',authMiddleware,upgradeWalkIn);


module.exports = router;