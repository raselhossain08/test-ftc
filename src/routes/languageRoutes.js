const express = require('express');
const { addLanguage, getAllLanguage, getLanguageById, editLanguage } = require('../controllers/languageController');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads
const router = express.Router();

router.post('/add', upload.single('file'), addLanguage);
router.get('/', getAllLanguage);
router.get('/:id', getLanguageById);
router.put('/:id', upload.single('file'), editLanguage);

module.exports = router;
