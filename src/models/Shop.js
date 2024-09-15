// src/models/Country.js
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String, // Path or URL to the flag image
    required: true,
  },
  price: {
    type: String,
    required: true,
  },  
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Shop', ShopSchema);
