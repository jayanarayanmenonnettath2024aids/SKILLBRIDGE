import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  state: String,
  district: String,
  
  // Face recognition data
  faceImage: {
    type: String, // Base64 encoded image
    required: true
  },
  faceDescriptor: {
    type: [Number], // Face-api.js descriptor array
    default: []
  },
  
  // Identity verification
  aadhaar: {
    number: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // Education and Skills
  education: {
    level: String,
    field: String,
    institution: String,
    year: String
  },
  skills: [String],
  jobRoles: [String],
  
  // Documents
  resume: String, // Base64 or file path
  certificates: [{
    name: String,
    data: String, // Base64
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User role
  role: {
    type: String,
    enum: ['candidate', 'employer'],
    default: 'candidate'
  },
  
  // Employer-specific fields
  companyName: {
    type: String,
    required: function() { return this.role === 'employer'; }
  },
  designation: String,
  companyWebsite: String,
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
