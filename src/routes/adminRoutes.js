// routes/adminRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');

const router = express.Router();

// Register route
router.post('/register', registerAdmin);

// Login route
router.post('/login', loginAdmin);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id',  updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
