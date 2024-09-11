// src/app.js
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!'); // This will send a response to the client
});
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
