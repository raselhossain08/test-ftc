const express = require('express');
const { addShop, getAllShop, getShopById, editShop } = require('../controllers/shopController');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads
const router = express.Router();

router.post('/add', upload.single('file'), addShop);
router.get('/', getAllShop);
router.get('/:id', getShopById);
router.put('/:id', upload.single('file'), editShop);

module.exports = router;
