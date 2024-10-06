const express = require('express');
const connectDB = require('./src/config/db'); // Adjust path as needed
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const countryRoutes = require('./src/routes/countryRoutes');
const languageRoutes = require('./src/routes/languageRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Basic response to verify server setup
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/product', shopRoutes);

// Error handling middleware for catching errors
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'An internal server error occurred', details: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
