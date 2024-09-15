const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Update Profile
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id; // Assuming the user is authenticated

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle profile picture upload
    if (req.files && req.files.profileImage) {
      const profileImage = req.files.profileImage;
      const uploadPath = path.join(__dirname, '../uploads', profileImage.name);

      profileImage.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to upload image' });
        }
        user.profileImage = `/uploads/${profileImage.name}`;
      });
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile };
