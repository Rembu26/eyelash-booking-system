const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const {
    getMyServices,
    getAllServices,
    createService,
    getPendingServices,
    approveService,
    deactivateService,
    activateService,
    getAdminServices
} = require('../controllers/serviceController');

// Staff routes
router.get('/my', protect, getMyServices);
router.post('/', protect, createService);

// Public routes
router.get('/', getAllServices);

// Admin routes
router.get('/pending', protect, getPendingServices);
router.get('/admin', protect, getAdminServices);
router.patch('/:id/approve', protect, approveService);
router.patch('/:id/deactivate', protect, deactivateService);
router.patch('/:id/activate', protect, activateService); // fixed missing /

module.exports = router;