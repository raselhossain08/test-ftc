const Language = require('../models/Language');

// Add Language Controller
const addLanguage = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const { translatorName,writtenTitle,writtenDescription, listLanguage,langType } = req.body;
  const baseURL = process.env.BASE_URL || 'http://localhost:5000';
  const audio = req.file ? `${baseURL}/uploads/${req.file.filename}` : '';

  // if (!translatorName || !listOfLanguage) {
  //   return res.status(400).json({ error: 'Name and languages are required fields.' });
  // }

  try {
    const newLanguage = new Language({
      translatorName,
      writtenTitle,writtenDescription,
      audio, 
      listLanguage, // 
      langType
    });
    await newLanguage.save();
    res.status(201).json({ message: 'Language added successfully'});
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
