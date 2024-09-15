// src/models/Country.js
const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    translatorName: {
    type: String,
    required: true,
  },
  writtenTitle: {
    type: String, // Path or URL to the flag image
    required: true,
  },
  writtenDescription: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
  listLanguage: {
    type: String,
    required: true,
  },
  langType: {
    type: String,
    required: true,
  },
});



module.exports = mongoose.model('Language', LanguageSchema);
