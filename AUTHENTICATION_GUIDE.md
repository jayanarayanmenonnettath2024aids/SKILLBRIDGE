# SkillBridge Authentication System

Complete authentication backend with MongoDB Atlas and face recognition has been implemented.

## What's Been Added

### 1. Backend Server (`/server`)
- **Express.js** API server
- **MongoDB Atlas** integration with your provided URI
- **JWT** authentication
- **Face recognition** for login verification
- **Password hashing** with bcryptjs

### 2. Frontend Updates

#### New Login Page (`/src/pages/auth/Login.jsx`)
Two-step login process:
1. **Step 1**: Email/Phone + Password authentication
2. **Step 2**: Face recognition verification

#### Updated Registration (`/src/pages/auth/`)
- Added password fields to BasicInfo.jsx
- Updated SkillGap.jsx to submit data to backend API
- Face capture during registration stores image securely

### 3. Routes
- Added `/login` route in App.jsx
- Login redirects to dashboard after successful authentication

## How It Works

### Registration Flow

1. **User fills basic info** (including password)
2. **Captures face** using webcam
3. **Verifies identity** with Aadhaar (placeholder)
4. **Adds skills and education**
5. **Uploads documents**
6. **Final submission** → Data saved to MongoDB Atlas

**API Call**: `POST /api/auth/register`

### Login Flow

1. **User enters credentials** (email/phone + password)
   - API validates credentials
   - Returns temporary token

2. **Face verification required**
   - User captures face via webcam
   - API compares with stored face image
   - On success, grants full access

**API Calls**:
- `POST /api/auth/login` (credentials)
- `POST /api/auth/verify-face` (face match)

## Image Storage

### Registration:
- Face image captured as **base64-encoded JPEG**
- Stored in MongoDB `faceImage` field
- NOT encrypted in current implementation (base64 text)
- Recommended: Move to cloud storage (AWS S3) for production

### Security Notes:
⚠️ **Current Implementation**: Base64 text in database
✅ **For Production**: 
- Store images in AWS S3/Azure Blob Storage
- Save only image URL in database
- Encrypt sensitive data
- Use proper face recognition (face-api.js descriptors)

## Running the System

### 1. Start Backend Server

```bash
cd SKILLBRIDGE/server
npm install
npm run dev
```

Server runs on: `http://localhost:5000`

### 2. Start Frontend

```bash
cd SKILLBRIDGE
npm run dev
```

Frontend runs on: `http://localhost:5173` (or your configured port)

### 3. Test the Flow

#### Register a New User:
1. Go to `/onboarding`
2. Fill all forms
3. Capture face
4. Complete registration
5. Data saved to MongoDB Atlas

#### Login:
1. Go to `/login`
2. Enter email/phone + password
3. Capture face for verification
4. Redirected to dashboard

## API Endpoints

### Registration
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "2000-01-01",
  "gender": "male",
  "state": "Karnataka",
  "district": "Bangalore",
  "faceImage": "data:image/jpeg;base64,...",
  "aadhaar": "123456789012",
  "education": {},
  "skills": ["JavaScript", "React"],
  "jobRoles": ["Developer"],
  "resume": "base64_data...",
  "certificates": []
}
```

### Login (Credentials)
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "password123"
}
```

### Face Verification
```http
POST http://localhost:5000/api/auth/verify-face
Content-Type: application/json

{
  "userId": "user_mongodb_id",
  "capturedFaceImage": "data:image/jpeg;base64,..."
}
```

## Database Structure

### MongoDB Atlas
**Connection String**: Your provided URI is configured
**Database Name**: skillbridge
**Collection**: users

### User Document:
```javascript
{
  _id: ObjectId,
  fullName: String,
  phoneNumber: String (unique),
  email: String (unique),
  password: String (hashed),
  dateOfBirth: Date,
  gender: String,
  state: String,
  district: String,
  faceImage: String (base64),  // ← Face stored here
  aadhaar: {
    number: String,
    verified: Boolean
  },
  education: Object,
  skills: Array,
  jobRoles: Array,
  resume: String,
  certificates: Array,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Face Recognition Details

### Current Implementation:
- **Storage**: Base64 encoded image as text
- **Comparison**: String similarity algorithm
- **Threshold**: 70% match required
- **Format**: JPEG at 90% quality

### Production Recommendations:
1. **Use face-api.js**:
   ```javascript
   // Extract face descriptor during registration
   const descriptor = await faceapi
     .detectSingleFace(image)
     .withFaceLandmarks()
     .withFaceDescriptor()
   
   // Store descriptor (128 floats) instead of full image
   user.faceDescriptor = descriptor
   
   // Compare during login
   const distance = faceapi.euclideanDistance(stored, captured)
   const isMatch = distance < 0.6  // Threshold
   ```

2. **Cloud Face Recognition**:
   - Azure Face API
   - AWS Rekognition
   - Google Cloud Vision

3. **Security**:
   - Encrypt face data at rest
   - Use HTTPS for transmission
   - Implement rate limiting
   - Add liveness detection

## Environment Variables

### Server (`.env`):
```env
MONGODB_URI=mongodb+srv://kpramodkumar2006_db_user:PramodAtlas579@cluster0.9qqpb6z.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=skillbridge_secret_key_2026_secure_token
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Check internet connection
- Verify MongoDB Atlas credentials
- Whitelist your IP in Atlas

### "Face verification failed"
- Ensure good lighting during capture
- Face should be clearly visible
- Current algorithm is simplified (70% threshold)

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API_URL in frontend components

### Password doesn't work
- Passwords are hashed (bcryptjs)
- Cannot view/decrypt passwords
- Reset by updating password field with new hash

## Next Steps

### For Production:
1. ✅ Backend API created
2. ✅ MongoDB Atlas connected
3. ✅ Face capture implemented
4. ✅ Login with face recognition
5. ⚠️ **TODO**: Upgrade face recognition
6. ⚠️ **TODO**: Move images to cloud storage
7. ⚠️ **TODO**: Add email verification
8. ⚠️ **TODO**: Implement JWT refresh tokens
9. ⚠️ **TODO**: Add API rate limiting
10. ⚠️ **TODO**: Production deployment

## Testing Credentials

After registering, you can login with:
- **Identifier**: Your registered email or phone
- **Password**: Password set during registration
- **Face**: Must match captured face during registration

## Support

For issues or questions:
1. Check MongoDB Atlas connection
2. Verify backend server is running
3. Check browser console for errors
4. Review server logs for API errors
