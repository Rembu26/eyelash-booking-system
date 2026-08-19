const express = require('express');
const router = express.Router();
const {getSettings, updateSettings} = require('../controllers/settingsController');
const { protect,isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, getSettings);//public -booking page can access settings but not update them
router.put('/', protect, isAdmin, updateSettings); // Only admin can update settings

module.exports = router;