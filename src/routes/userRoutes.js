const express = require('express');
const { updateProfile } = require('../controllers/userController');
const protectRoute = require('../middlewares/auth');
const router = express.Router();

// Add middleware for authentication if needed
router.put('/profile', updateProfile,protectRoute);

module.exports = router;
