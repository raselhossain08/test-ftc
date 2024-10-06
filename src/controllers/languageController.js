const Language = require('../models/Language');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('cloudinary').v2;
//  upload
cloudinary.config({
  cloud_name: "dj78wvkmf",
  api_key: "311213775718542",
  api_secret: "8tqZGGneJfKQiPcP1nkDvF34ZFU",
});
// Add Language Controller
const addLanguage = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const { translatorName, writtenTitle, writtenDescription, listLanguage, langType } = req.body;

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'language_audio',
      resource_type: 'auto',  // Ensure Cloudinary auto-detects the file type (for audio)
      overwrite: true,
    });

    // Create new language document and save the Cloudinary URL
    const newLanguage = new Language({
      translatorName,
      writtenTitle,
      writtenDescription,
      audio: result.secure_url, // secure URL from Cloudinary upload
      listLanguage,
      langType
    });

    await newLanguage.save();
    res.status(201).json({ message: 'Language added successfully', audioUrl: result.secure_url });
  } catch (error) {
    console.error('Error while adding Language:', error);
    res.status(400).json({ error: 'Failed to add Language', details: error.message });
  }
};
// Get All Language
const getAllLanguage = async (req, res) => {
  try {
    const language = await Language.find();
    res.status(200).json(language);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve countries', details: error.message });
  }
};

// Get Language by ID
const getLanguageById = async (req, res) => {
  const { id } = req.params;

  try {
    const language = await Language.findById(id);
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    res.status(200).json(language);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve Language', details: error.message });
  }
};

// Edit Language
const editLanguage = async (req, res) => {
  const { id } = req.params;
  const { translatorName,writtenTitle,writtenDescription, listLanguage,langType } = req.body;
  const baseURL = process.env.BASE_URL || 'http://localhost:5000';
  const audio = req.file ? `${baseURL}/uploads/${req.file.filename}` : '';

  try {
    const language = await Language.findById(id);
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }

    language.translatorName = translatorName || language.translatorName;

    language.writtenTitle = writtenTitle || language.writtenTitle;

    language.writtenDescription = writtenDescription || language.writtenDescription;
    language.langType = langType || language.langType;

    language.audio = audio || language.audio;
    language.listLanguage = listLanguage || language.listLanguage;
    await language.save();
    res.status(200).json({ message: 'Language updated successfully', Language });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update Language', details: error.message });
  }
};

module.exports = { addLanguage, getAllLanguage, getLanguageById, editLanguage };
