const Country = require('../models/Country');
const cloudinary = require('cloudinary').v2;
//  upload
cloudinary.config({
  cloud_name: "dj78wvkmf",
  api_key: "311213775718542",
  api_secret: "8tqZGGneJfKQiPcP1nkDvF34ZFU",
});
// Add Country Controller
const addCountry = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const { name, languages } = req.body;
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'country_photo',
    overwrite: true,
  });
  if (!name || !languages) {
    return res.status(400).json({ error: 'Name and languages are required fields.' });
  }

  try {
    const newCountry = new Country({
      name,
      flag:result.secure_url,
      languages // Assuming languages are passed as a comma-separated string
    });

    await newCountry.save();
    res.status(201).json({ message: 'Country added successfully', country: newCountry });
  } catch (error) {
    console.error('Error while adding country:', error);
    res.status(400).json({ error: 'Failed to add country', details: error.message });
  }
};

// Get All Countries
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve countries', details: error.message });
  }
};

// Get Country by ID
const getCountryById = async (req, res) => {
  const { id } = req.params;

  try {
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.status(200).json(country);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve country', details: error.message });
  }
};

// Edit Country
const editCountry = async (req, res) => {
  const { id } = req.params;
  const { name, languages } = req.body;
  const baseURL = process.env.BASE_URL || 'http://localhost:5000';
  const flag = req.file ? `${baseURL}/uploads/${req.file.filename}` : '';

  try {
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    country.name = name || country.name;
    country.flag = flag || country.flag;
    country.languages = languages || country.languages;

    await country.save();
    res.status(200).json({ message: 'Country updated successfully', country });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update country', details: error.message });
  }
};

module.exports = { addCountry, getAllCountries, getCountryById, editCountry };
