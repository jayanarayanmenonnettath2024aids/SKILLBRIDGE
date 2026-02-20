# SkillBridge Backend API

Backend server for SkillBridge platform with MongoDB Atlas integration and face recognition authentication.

## Features

- User registration with face capture
- Login with email/phone + password
- Face verification for secure login
- MongoDB Atlas database storage
- JWT token-based authentication

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

The `.env` file is already configured with:
- MongoDB Atlas URI
- JWT Secret
- Port configuration

### 3. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "fullName": "string",
  "phoneNumber": "string",
  "email": "string",
  "password": "string",
  "dateOfBirth": "date",
  "gender": "string",
  "state": "string",
  "district": "string",
  "faceImage": "base64_string",
  "aadhaar": "string",
  "education": {},
  "skills": [],
  "jobRoles": [],
  "resume": "base64_string",
  "certificates": []
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "role": "candidate"
  }
}
```

#### Login (Step 1: Credentials)
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "identifier": "email_or_phone",
  "password": "string"
}

Response:
{
  "message": "Login successful",
  "token": "temporary_jwt_token",
  "requiresFaceVerification": true,
  "user": {
    "id": "user_id",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "role": "candidate"
  }
}
```

#### Face Verification (Step 2)
```
POST /api/auth/verify-face
Content-Type: application/json

Body:
{
  "userId": "user_id",
  "capturedFaceImage": "base64_string"
}

Response:
{
  "message": "Face verification successful",
  "verified": true,
  "confidence": 85
}
```

#### Get User Profile
```
GET /api/auth/profile/:userId

Response:
{
  "user": {
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "dateOfBirth": "date",
    "gender": "string",
    "state": "string",
    "district": "string",
    "education": {},
    "skills": [],
    "jobRoles": [],
    "role": "candidate",
    "verified": false
  }
}
```

## Database Schema

### User Model

```javascript
{
  fullName: String (required),
  phoneNumber: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  dateOfBirth: Date (required),
  gender: Enum ['male', 'female', 'other'] (required),
  state: String,
  district: String,
  faceImage: String (base64),
  faceDescriptor: [Number],
  aadhaar: {
    number: String,
    verified: Boolean
  },
  education: Object,
  skills: [String],
  jobRoles: [String],
  resume: String,
  certificates: [Object],
  role: Enum ['candidate', 'employer'],
  isActive: Boolean,
  verified: Boolean,
  timestamps: true
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Face Verification**: Base64 image comparison for login security
4. **CORS Enabled**: Cross-origin requests allowed for frontend integration

## Face Recognition

Currently using a simplified image comparison algorithm. For production:

- **Recommended**: Integrate face-api.js with face descriptors
- **Alternative**: Use Azure Face API or AWS Rekognition
- **Best Practice**: Store face descriptors, not full images

## Development Notes

- Server runs on port 5000
- MongoDB Atlas is configured and ready
- Large payloads (50MB) are supported for image uploads
- All passwords are automatically hashed before storage

## Troubleshooting

### Cannot connect to MongoDB
- Check your internet connection
- Verify MongoDB Atlas credentials
- Ensure IP address is whitelisted in MongoDB Atlas

### CORS errors
- Ensure frontend is running on expected port
- Check CORS configuration in server.js

### Face verification fails
- Images must be in base64 format
- Current algorithm is simplified for MVP
- Consider upgrading to proper face recognition library

## Next Steps for Production

1. Implement proper face recognition (face-api.js)
2. Add rate limiting for API endpoints
3. Implement refresh tokens
4. Add email verification
5. Set up file storage (AWS S3) for images
6. Add API documentation (Swagger)
7. Implement logging (Winston/Morgan)
8. Add unit and integration tests
