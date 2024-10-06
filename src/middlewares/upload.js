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
    let resourceType = 'auto'; // Automatically detect resource type

    if (fileType === 'image') {
      folder = 'profile_photos';
      return {
        folder: folder,
        public_id: Date.now() + '-' + file.originalname.split('.')[0], // Filename without extension
        resource_type: 'image', // Specify 'image' resource type for images
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'], // Allow common image formats
        transformation: [{ quality: 'auto', fetch_format: 'auto' }], // Auto-optimize the image
      };
    } else if (fileType === 'audio') {
      folder = 'audio_files';
      return {
        folder: folder,
        public_id: Date.now() + '-' + file.originalname.split('.')[0], // Filename without extension
        resource_type: 'video', // Specify 'video' resource type for audio to support audio uploads
        allowed_formats: ['mp3', 'wav', 'mpeg', 'mp4', 'm4a', 'ogg'], // Allow various audio formats
      };
    } else {
      throw new Error('Invalid file type');
    }
  },
});

// Multer middleware configuration for handling file uploads
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB file size limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/webp', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/ogg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  },
});

module.exports = upload;
