const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dj78wvkmf",
  api_key: "311213775718542",
  api_secret: "8tqZGGneJfKQiPcP1nkDvF34ZFU",
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split('/')[0]; // Get the file type (image, audio, video, etc.)
    let folder;

    if (fileType === 'image') {
      folder = 'profile_photos';
    } else if (fileType === 'audio') {
      folder = 'audio_files';
    } else {
      throw new Error('Invalid file type');
    }

    return {
      folder: folder,
      public_id: Date.now() + '-' + file.originalname,
      resource_type: 'video',  // Use 'video' resource type to include all media types, including audio
      allowed_formats: ['mp3', 'wav', 'mpeg', 'mp4', 'm4a', 'ogg'], // Allow various audio formats
    };
  },
});


// Multer middleware configuration for handling file uploads
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // Increase file size limit to 1 GB
});


module.exports = upload;
