const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
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
router.get('/my', authMiddleware, getMyServices);
router.post('/', authMiddleware, createService);

// Public routes
router.get('/', getAllServices);

// Admin routes
router.get('/pending', authMiddleware, getPendingServices);
router.get('/admin', authMiddleware, getAdminServices);
router.patch('/:id/approve', authMiddleware, approveService);
router.patch('/:id/deactivate', authMiddleware, deactivateService);
router.patch('/:id/activate', authMiddleware, activateService); // fixed missing /

module.exports = router;