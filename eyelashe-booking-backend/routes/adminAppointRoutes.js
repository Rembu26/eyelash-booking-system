import express from 'express';
import {getAdminAppointments, cancelAdminAppointment } from '../controllers/adminAppointController.js';
import {authMiddleware,requireRole} from '../middleware/authMiddleware.js'

const router= express.Router();


// All admin routes need admin role
router.use(authMiddleware, requireRole('admin'));
router.get('/admin', getAdminAppointments);
router.patch('/admin/:id/cancel', cancelAdminAppointment);
// router.patch('/admin/:id', updateAppointment);
// router.delete('/admin/:id', deleteAppointment);

export default router;