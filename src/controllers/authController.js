const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('cloudinary').v2;
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `https://test-ftc.vercel.app/api/auth/reset/password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${resetUrl}`,
    });

    res.json({ message: 'Reset link sent to email',resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by decoded ID, matching resetToken and ensuring the token is not expired
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password and clear the reset token fields
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    // Save the updated user document
    await user.save();

    // Respond with success message
    res.json({ message: 'Password reset successful' });
    
  } catch (error) {
    // Catch any errors during the process and respond with an error message
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// update profile

// Update user profile (name, email, password)

const updateProfile = async (req, res) => {
  const userId = req.params.id; // Ensure you get the authenticated user's ID
  const { name, email, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email; // Update email if not in use
    }

    // Update the name if provided
    if (name) {
      user.name = name;
    }

    // Update the password if provided (hash the new password)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user profile
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  profile photo upload
cloudinary.config({
  cloud_name: "dj78wvkmf",
  api_key: "311213775718542",
  api_secret: "8tqZGGneJfKQiPcP1nkDvF34ZFU",
});
const uploadOrGetProfilePhoto = async (req, res) => {
  const userId = req.params.id; // Ensure the user ID is available from the authenticated session or token

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.method === 'POST') {
      // Handle POST request for uploading profile photo
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_photos',
        public_id: `${userId}-profile-photo`, // Optional: name the file with the user ID
        overwrite: true,
      });
      user.profilePhoto = result.secure_url;
      await user.save();

    res.json({
        message: 'Profile photo uploaded successfully',
        profilePhoto: user.profilePhoto,
      });
    } else if (req.method === 'GET') {
      // Handle GET request to retrieve the profile photo URL
      if (!user.profilePhoto) {
        return res.status(404).json({ message: 'No profile photo found' });
      }

      res.json({
        message: 'Profile photo retrieved successfully',
        profilePhoto: user.profilePhoto,
      });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword,updateProfile,uploadOrGetProfilePhoto };
