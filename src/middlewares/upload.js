const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dirdbnxe1",
  api_key: "424511362532329",
  api_secret: "pcuAYMOb9rJ0wC2uhbDDGkjE3Mc",
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split('/')[0]; // Get the type (image, audio)
    let folder;
    let allowedFormats;

    if (fileType === 'image') {
      folder = 'profile_photos'; // Folder for images
      allowedFormats = ['jpg', 'jpeg', 'png'];
    } else if (fileType === 'audio') {
      folder = 'audio_files'; // Folder for audio files
      allowedFormats = ['mp3', 'wav'];
    } else {
      throw new Error('Invalid file type');
    }

    return {
      folder: folder,
      allowed_formats: allowedFormats,
      public_id: Date.now() + '-' + file.originalname,
    };
  },
});

// Multer middleware configuration for handling file uploads
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
});

module.exports = upload;
