const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  uploadOrGetProfilePhoto,
  updateProfile
} = require('../controllers/authController');
const upload = require('../middlewares/upload');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot/password', forgotPassword);
router.put('/reset/password/:token', resetPassword);
router.put('/update/profile/:id', updateProfile);
// profile photo 
router.post('/profile/:id',upload.single('profilePhoto'), uploadOrGetProfilePhoto);



module.exports = router;
