const Shop = require('../models/Shop');

// Add product Controller
const addShop = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const { productName, price,link } = req.body;
  const baseURL = process.env.BASE_URL || 'http://localhost:5000';
  const productImage = req.file ? `${baseURL}/uploads/${req.file.filename}` : '';


  try {
    const newShop = new Shop({
    productName,
    productImage,
    price,
    link,
    });
    await newShop.save();
    res.status(201).json({ message: 'Product added successfully', shop: newShop });
  } catch (error) {
    console.error('Error while adding Product:', error);
    res.status(400).json({ error: 'Failed to add Product', details: error.message });
  }
};

// Get All products
const getAllShop = async (req, res) => {
  try {
    const shop = await Shop.find();
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve products', details: error.message });
  }
};

// Get product by ID
const getShopById = async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve shop', details: error.message });
  }
};

// Edit product
const editShop = async (req, res) => {
  const { id } = req.params;
  const {    
    productName,
    price,
    link, } = req.body;
  const baseURL = process.env.BASE_URL || 'http://localhost:5000';
  const productImage = req.file ? `${baseURL}/uploads/${req.file.filename}` : '';

  try {
    const product = await Shop.findById(id);

    product.productName = productName || product.productName;
    product.productImage = productImage || product.productImage;
    product.price = price || product.price;
    product.link = link || product.link;

    await shop.save();
    res.status(200).json({ message: 'Shop updated successfully', product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update Shop', details: error.message });
  }
};

module.exports = { addShop, getAllShop, getShopById, editShop };
