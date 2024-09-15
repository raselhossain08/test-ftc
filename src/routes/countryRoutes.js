const express = require('express');
const { addCountry, getAllCountries, getCountryById, editCountry } = require('../controllers/countryController');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads
const router = express.Router();

router.post('/add', upload.single('file'), addCountry);
router.get('/', getAllCountries);
router.get('/:id', getCountryById);
router.put('/:id', upload.single('file'), editCountry);

module.exports = router;
