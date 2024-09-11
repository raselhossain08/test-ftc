const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot/password', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
