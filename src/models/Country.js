// src/models/Country.js
const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  flag: {
    type: String, // Path or URL to the flag image
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Country', CountrySchema);
