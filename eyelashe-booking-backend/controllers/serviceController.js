const Service = require('../models/Service');

// @desc    Get staff's own services
// @route   GET /api/services/my
const getMyServices = async (req, res) => {
    try {
        if (req.user.role !== 'staff') {
            return res.status(403).json({ error: "Access denied, Staff only!" });
        }

        const services = await Service.find({ createdBy: req.user.id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all approved active services - public
// @route   GET /api/services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ approved: true, active: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Staff creates new service
// @route   POST /api/services
const createService = async (req, res) => {
    try {
        if (req.user.role !== 'staff') {
            return res.status(403).json({ error: "Staff only" });
        }

        const service = await Service.create({
            ...req.body,
            createdBy: req.user.id,
            stylistIds: [req.user.id],
            approved: false
        });

        console.log('Created service:', service._id);
        res.status(201).json(service);
    } catch (error) {
        console.log('Create error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get pending services for admin
// @route   GET /api/services/pending
const getPendingServices = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const pending = await Service.find({ approved: false })
            .populate('createdBy', 'FirstName LastName');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin approves service
// @route   PATCH /api/services/:id/approve
const approveService = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const { stylistIds } = req.body;

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { approved: true, approvedBy: req.user.id, stylistIds, active: true },
            { new: true }
        );

        if (!service) return res.status(404).json({ error: "Service not found" });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin deactivate service
// @route   PATCH /api/services/:id/deactivate
const deactivateService = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Admin only" });
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin activate service
// @route   PATCH /api/services/:id/activate
const activateService = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Admin only" });
        }
        
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { active: true },
            { new: true }
        );
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin get all services with filter
// @route   GET /api/services/admin
const getAdminServices = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin Only' });
        }

        const filter = JSON.parse(req.query.filter || '{}');
        const services = await Service.find(filter)
            .populate('createdBy', 'FirstName LastName')
            .sort({ createdAt: -1 });

        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMyServices,
    getAllServices,
    createService,
    getPendingServices,
    approveService,
    deactivateService,
    activateService,
    getAdminServices
};