const express = require('express');
const { addLanguage, getAllLanguage, getLanguageById, editLanguage } = require('../controllers/languageController');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads
const router = express.Router();

router.post('/add', upload.single('audio'), addLanguage);
router.get('/', getAllLanguage);
router.get('/:id', getLanguageById);
router.put('/:id', upload.single('audio'), editLanguage);

module.exports = router;
