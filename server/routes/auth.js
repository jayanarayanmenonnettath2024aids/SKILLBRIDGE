import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { compareFaces } from '../utils/faceRecognition.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      password,
      dateOfBirth,
      gender,
      state,
      district,
      faceImage,
      aadhaar,
      education,
      skills,
      jobRoles,
      resume,
      certificates,
      role,
      companyName,
      designation,
      companyWebsite
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or phone number already exists' 
      });
    }

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !password || !faceImage) {
      return res.status(400).json({ 
        message: 'Please provide all required fields (name, phone, email, password, and face image)' 
      });
    }

    // Prepare user data - handle optional fields
    const userData = {
      fullName,
      phoneNumber,
      email,
      password,
      dateOfBirth,
      gender,
      state,
      district,
      faceImage,
      role: role || 'candidate', // Default to candidate if not specified
      aadhaar: {
        number: aadhaar || '',
        verified: false
      },
      education: education || {},
      skills: Array.isArray(skills) ? skills : [],
      jobRoles: Array.isArray(jobRoles) ? jobRoles : [],
      resume: (resume && typeof resume === 'string') ? resume : null,
      certificates: Array.isArray(certificates) ? certificates : []
    };

    // Add employer-specific fields if role is employer
    if (role === 'employer') {
      userData.companyName = companyName;
      userData.designation = designation;
      userData.companyWebsite = companyWebsite;
    }

    // Create new user
    const user = new User(userData);

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ User registered successfully:', user.email, 'Role:', user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        companyName: user.companyName
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// Login with email/phone and password
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({ 
        message: 'Please provide login credentials' 
      });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }]
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // For employers, skip face verification
    if (user.role === 'employer') {
      return res.json({
        message: 'Login successful',
        token,
        requiresFaceVerification: false,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          companyName: user.companyName
        }
      });
    }

    // For candidates, require face verification
    res.json({
      message: 'Login successful',
      token,
      requiresFaceVerification: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
});

// Face verification for login
router.post('/verify-face', async (req, res) => {
  try {
    const { userId, capturedFaceImage } = req.body;

    if (!userId || !capturedFaceImage) {
      return res.status(400).json({ 
        message: 'User ID and face image are required' 
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Compare faces
    const faceMatch = await compareFaces(user.faceImage, capturedFaceImage);
    
    console.log(`🔍 Face verification for ${user.email}:`);
    console.log(`   Match: ${faceMatch.isMatch ? '✅ Yes' : '❌ No'}`);
    console.log(`   Confidence: ${faceMatch.confidence}%`);
    console.log(`   Message: ${faceMatch.message}`);

    if (!faceMatch.isMatch) {
      return res.status(401).json({ 
        message: 'Face verification failed - Face does not match',
        confidence: faceMatch.confidence
      });
    }

    res.json({
      message: 'Face verification successful',
      verified: true,
      confidence: faceMatch.confidence
    });
  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({ 
      message: 'Error during face verification', 
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -faceImage -faceDescriptor');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

export default router;
