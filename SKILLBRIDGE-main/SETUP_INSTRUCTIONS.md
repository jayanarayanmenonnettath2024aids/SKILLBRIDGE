# SkillBridge AI - Complete Setup Instructions

## 🚀 Quick Start Guide

This guide will help you set up the complete AI-powered Skill Gap Analysis and Job Recommendation System.

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)

---

## 🔧 Installation Steps

### 1. Clone and Install Dependencies

```powershell
# Navigate to project directory
cd f:\pals-anti\SKILLBRIDGE

# Install Frontend Dependencies
npm install

# Install Backend Dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Install Additional Python Packages

```powershell
cd backend
pip install google-generativeai PyPDF2
```

Required Python packages:
- `google-generativeai` - For Gemini API integration
- `PyPDF2` - For PDF text extraction
- `requests` - For HTTP requests (already included)
- `firebase-admin` - For Firebase integration (already in requirements.txt)

---

## 🔑 API Keys Setup

### A. Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project** or select existing one
3. **Enable Firebase Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" and "Google" providers
4. **Create Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in production mode, choose region
5. **Enable Firebase Storage**:
   - Go to Storage → Get started
   - Set security rules to allow authenticated uploads
6. **Get Firebase Config**:
   - Go to Project Settings → General → Your apps
   - Click "Add app" → Web
   - Copy the `firebaseConfig` object
   - Update `src/config/firebase.js` with these values:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```
7. **Download Service Account Key**:
   - Go to Project Settings → Service accounts
   - Click "Generate new private key"
   - Save JSON file as `backend/firebase-admin-key.json`

### B. Google Gemini API Key

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Click "Create API Key"**
3. **Copy the generated key**
4. **Add to `.env` file** (see step 3)

### C. Google Programmable Search Engine

1. **Go to**: https://programmablesearchengine.google.com/
2. **Click "Add"** to create new search engine
3. **Configuration**:
   - Search Engine Name: "SkillBridge Job Search"
   - What to search: "Search the entire web"
   - Sites to search: Add these domains:
     - linkedin.com/jobs
     - indeed.com
     - naukri.com
     - glassdoor.com
   - Click "Create"
4. **Get Search Engine ID**:
   - Copy the "Search engine ID" from the dashboard
5. **Get API Key**:
   - Go to: https://developers.google.com/custom-search/v1/introduction
   - Click "Get a Key"
   - Create or select project
   - Copy the API key

---

## 🔐 Environment Variables Setup

### 3. Create `.env` File in Backend

Create `backend/.env` file:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Google Programmable Search Engine
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Firebase Admin (if needed, otherwise uses JSON file)
FIREBASE_PROJECT_ID=your_project_id
```

### 4. Update Firebase Service Account

**Option A**: Use the existing JSON file (Recommended)
- Ensure `backend/pals-33351-firebase-adminsdk-fbsvc-6dc7f6c99f.json` is present
- Update `backend/app.py` to reference this file:
  ```python
  cred = credentials.Certificate('pals-33351-firebase-adminsdk-fbsvc-6dc7f6c99f.json')
  ```

**Option B**: Use a new service account
- Download new service account JSON from Firebase Console
- Replace the existing JSON file
- Update the filename reference in `backend/app.py`

---

## 🗄️ Firestore Database Structure

Your Firestore will automatically create these collections:

### `users` Collection
```json
{
  "userId": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "aadhaar": "1234 5678 9012",
  "createdAt": "2024-01-01T00:00:00Z",
  
  // After Resume Upload
  "resumeURL": "https://firebasestorage.googleapis.com/...",
  
  // After Gemini Analysis
  "geminiAnalysis": {
    "extractedSkills": ["Python", "JavaScript", "React"],
    "experienceLevel": "Mid-Level",
    "education": "Bachelor's in Computer Science",
    "recommendedRoles": ["Full Stack Developer", "Software Engineer"],
    "missingSkills": ["Docker", "Kubernetes"],
    "strengths": ["Strong backend development skills"],
    "improvements": ["Need to learn containerization"],
    "overallScore": 75,
    "summary": "Experienced developer with strong web development skills",
    "analyzedAt": "2024-01-01T00:00:00Z"
  },
  
  // After Profile Setup
  "interestedDomain": "AI Engineer",
  "skillsSelected": ["Python", "TensorFlow", "Machine Learning"],
  "fieldOfInterest": "Computer Vision",
  "experienceLevel": "Mid-Level",
  "location": "San Francisco, CA",
  
  // After Job Recommendations
  "jobRecommendations": [
    {
      "jobTitle": "ML Engineer",
      "matchScore": 85,
      "reason": "Strong match based on skills",
      "salaryRange": "$100k - $150k",
      "experienceRequired": "3-5 years",
      "requiredSkills": ["Python", "TensorFlow", "PyTorch"]
    }
  ]
}
```

---

## ▶️ Running the Application

### Start Backend Server

```powershell
cd backend
python app.py
```

Backend will run on: **http://localhost:5000**

### Start Frontend Server

Open a new terminal:

```powershell
cd f:\pals-anti\SKILLBRIDGE
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🧪 Testing the Complete Flow

### 1. User Registration
- Navigate to: http://localhost:5173/onboarding
- Click "Register"
- Enter: Name, Email, Phone, Aadhaar
- Click "Register"

### 2. Upload Resume
- After registration, navigate to: http://localhost:5173/resume-upload
- Upload a PDF resume (max 5MB)
- Wait for AI analysis (may take 10-30 seconds)
- Automatically redirects to profile setup

### 3. Complete Profile Setup
- Select your domain (e.g., "AI Engineer")
- Select skills (multi-select)
- Enter field of interest
- Select experience level
- Enter location preference
- Click "Complete Setup"
- Redirects to skill gap dashboard

### 4. View Skill Gap Analysis
- Navigate to: http://localhost:5173/dashboard/skills
- View your extracted skills vs required skills
- See match percentage

### 5. View AI Job Recommendations
- Navigate to: http://localhost:5173/job-recommendations
- View AI-generated job recommendations based on your profile
- Each job shows match score, required skills, salary range
- Click "Find Matching Jobs" to see real listings

### 6. Search Real Job Listings
- Navigate to: http://localhost:5173/job-matching
- Enter job title and location
- Click "Search Jobs"
- View real jobs from LinkedIn, Indeed, Naukri, Glassdoor
- Each job has a match score based on your skills
- Click "View Job Details" to go to the original job posting

---

## 📁 Project Structure

```
SKILLBRIDGE/
├── backend/
│   ├── app.py                          # Flask app initialization
│   ├── routes.py                       # API endpoints (NEW: AI routes added)
│   ├── models.py                       # Data models
│   ├── requirements.txt                # Python dependencies
│   ├── firebase-admin-key.json         # Firebase service account
│   └── services/
│       ├── firebase_service.py         # Firebase operations
│       ├── gemini_service.py           # NEW: Gemini AI integration
│       └── google_search_service.py    # NEW: Job search API
├── src/
│   ├── App.jsx                         # UPDATED: New routes added
│   ├── config/
│   │   └── firebase.js                 # NEW: Firebase SDK config
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.jsx              # UPDATED: New navigation links
│   ├── pages/
│   │   ├── resume/
│   │   │   └── ResumeUpload.jsx        # NEW: Resume upload page
│   │   ├── profile/
│   │   │   └── ProfileSetup.jsx        # NEW: Profile setup page
│   │   └── jobs/
│   │       ├── JobRecommendation.jsx   # NEW: AI job recommendations
│   │       └── JobMatching.jsx         # NEW: Real job listings
│   ├── services/
│   │   └── api.js                      # UPDATED: New API functions
│   └── styles/
│       ├── ResumeUpload.css            # NEW: Resume upload styling
│       ├── ProfileSetup.css            # NEW: Profile setup styling
│       ├── JobRecommendation.css       # NEW: Job recommendations styling
│       └── JobMatching.css             # NEW: Job matching styling
└── .env.example                        # NEW: Environment variables template
```

---

## 🔗 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### AI & Resume Analysis
- `POST /api/ai/analyze-resume` - Analyze resume with Gemini
  - Body: `{ userId, resumeURL }`
  - Returns: Gemini analysis results

- `GET /api/ai/job-recommendations?userId=X` - Get AI job recommendations
  - Returns: Array of recommended jobs with match scores

### Job Search
- `POST /api/jobs/search` - Search real job listings
  - Body: `{ userId, jobTitle, location }`
  - Returns: Real jobs from LinkedIn/Indeed/Naukri/Glassdoor with match scores

### User Profile
- `POST /api/user/profile/update` - Update user profile
  - Body: `{ userId, interestedDomain, skillsSelected, fieldOfInterest, experienceLevel, location }`

---

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Authentication Errors**
- Ensure Email/Password provider is enabled in Firebase Console
- Check if `firebaseConfig` in `src/config/firebase.js` is correct

**2. Gemini API Errors (403/401)**
- Verify `GEMINI_API_KEY` in `.env` is correct
- Check if API key has proper permissions
- Ensure you're using `gemini-pro` model (not `gemini-1.5-pro` if not available)

**3. Google Search API Errors**
- Verify both `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` are set
- Check if you've exceeded daily quota (100 searches/day on free tier)
- Ensure search engine is configured to search the entire web

**4. PDF Upload Fails**
- Check Firebase Storage rules allow authenticated uploads
- Verify file is under 5MB
- Ensure file is a valid PDF

**5. Resume Analysis Takes Too Long**
- Gemini API can take 10-30 seconds for large resumes
- Check network connection
- Verify PDF text extraction is working (check backend logs)

**6. No Jobs Found**
- Try broader search terms
- Check if Google Search API quota is exhausted
- Verify search engine has proper site indexing

### Check Backend Logs

```powershell
cd backend
python app.py
```

Look for error messages in console output.

### Check Frontend Console

Press `F12` in browser → Console tab → Look for errors

---

## 📊 Free Tier Limits

### Google Gemini API
- **Free Tier**: 60 requests/minute
- **Cost**: Free for development

### Google Programmable Search
- **Free Tier**: 100 searches/day
- **Cost**: Free for testing, $5/1000 searches after

### Firebase
- **Free Tier (Spark Plan)**:
  - Firestore: 50K reads/day, 20K writes/day
  - Storage: 5GB storage, 1GB/day download
  - Authentication: Unlimited
- Sufficient for hackathon/prototype

---

## 🎯 Demo Flow for Hackathon

1. **Registration** → User signs up with basic info
2. **Resume Upload** → Upload PDF resume
3. **AI Analysis** → Gemini extracts skills, experience, recommendations (show loading animation)
4. **Profile Setup** → User selects interests, skills, location
5. **Skill Gap Dashboard** → Show extracted vs required skills with visual charts
6. **Job Recommendations** → AI generates 5-10 job recommendations with match scores
7. **Real Job Search** → Search LinkedIn/Indeed/Naukri for actual job postings with match percentage
8. **Apply** → Click through to job portal to apply

**Estimated Demo Time**: 5-7 minutes

---

## 📝 Additional Notes

- All new files have been created in the correct locations
- Backend routes have been updated with new API endpoints
- Frontend routing has been configured for all new pages
- Navbar includes links to all new features
- All required CSS files have been created

**You're ready to run the application!** 🎉

Follow the steps above, set up your API keys, and start both servers to see the complete AI-powered career intelligence platform in action.

For questions or issues, check the troubleshooting section or review the console logs for specific error messages.
