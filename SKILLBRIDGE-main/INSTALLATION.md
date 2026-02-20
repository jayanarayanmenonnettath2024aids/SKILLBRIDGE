# Quick Installation Commands for SkillBridge AI

## Backend Setup

```powershell
# Navigate to backend directory
cd f:\pals-anti\SKILLBRIDGE\backend

# Install all required Python packages
pip install -r requirements.txt

# Install additional AI packages
pip install google-generativeai PyPDF2

# Verify installations
pip list | Select-String -Pattern "google-generativeai|PyPDF2|firebase|flask|flask-cors"
```

## Frontend Setup

```powershell
# Navigate to project root
cd f:\pals-anti\SKILLBRIDGE

# Install all Node.js dependencies
npm install

# Verify React Router is installed (should be in package.json)
npm list react-router-dom
```

## Environment Configuration

```powershell
# Create .env file in backend directory
cd backend
Copy-Item .env.example .env

# Edit .env file with your API keys
# Use notepad or VS Code to edit:
notepad .env
# OR
code .env
```

## Required Package Versions

### Python (backend)
- Flask==2.3.0
- flask-cors==4.0.0
- firebase-admin==6.2.0
- google-generativeai==0.3.0  # For Gemini API
- PyPDF2==3.0.1  # For PDF text extraction
- requests==2.31.0

### Node.js (frontend)
- react==18.2.0
- react-router-dom==6.14.0
- axios==1.4.0
- lucide-react==0.263.1
- firebase==10.1.0

## Start Development Servers

### Terminal 1 - Backend
```powershell
cd f:\pals-anti\SKILLBRIDGE\backend
python app.py
```

Server runs on: http://localhost:5000

### Terminal 2 - Frontend
```powershell
cd f:\pals-anti\SKILLBRIDGE
npm run dev
```

Server runs on: http://localhost:5173

## Verify Installation

### Check Backend
```powershell
# Test backend is running
curl http://localhost:5000/api/health

# Should return: {"status": "ok"}
```

### Check Frontend
Open browser: http://localhost:5173
- Should see SkillBridge landing page
- Check browser console for errors (F12)

## Quick Package Installation (All at Once)

```powershell
# Backend - One command
cd f:\pals-anti\SKILLBRIDGE\backend; pip install flask flask-cors firebase-admin google-generativeai PyPDF2 requests python-dotenv

# Frontend - One command
cd f:\pals-anti\SKILLBRIDGE; npm install
```

## Troubleshooting Installation

### Issue: ModuleNotFoundError
```powershell
# Reinstall specific package
pip install --upgrade google-generativeai
```

### Issue: npm ERR! peer dependency
```powershell
# Use legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Python version mismatch
```powershell
# Check Python version (should be 3.8+)
python --version

# If using Python 3.11+, you may need:
pip install --upgrade setuptools
```

## API Keys Checklist

After installation, you'll need to obtain these API keys:

### 1. Firebase Configuration
- [ ] Create Firebase project at https://console.firebase.google.com/
- [ ] Enable Authentication (Email/Password + Google)
- [ ] Create Firestore Database
- [ ] Enable Firebase Storage
- [ ] Download service account JSON
- [ ] Update `src/config/firebase.js` with web config
- [ ] Place service account JSON in `backend/` directory

### 2. Google Gemini API Key
- [ ] Get key from https://makersuite.google.com/app/apikey
- [ ] Add to `backend/.env` as `GEMINI_API_KEY`

### 3. Google Programmable Search
- [ ] Create search engine at https://programmablesearchengine.google.com/
- [ ] Configure to search linkedin.com, indeed.com, naukri.com, glassdoor.com
- [ ] Get Search Engine ID
- [ ] Get API key from https://developers.google.com/custom-search/v1/introduction
- [ ] Add both to `backend/.env`

## Quick Test Commands

```powershell
# Test backend routes
curl http://localhost:5000/api/auth/register -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","phone":"1234567890","aadhaar":"1234567890123"}'

# Test Gemini API (after setting API key)
curl http://localhost:5000/api/ai/analyze-resume -Method POST -ContentType "application/json" -Body '{"userId":"test123","resumeURL":"https://example.com/resume.pdf"}'

# Test Google Search (after setting API keys)
curl http://localhost:5000/api/jobs/search -Method POST -ContentType "application/json" -Body '{"userId":"test123","jobTitle":"Software Engineer","location":"San Francisco"}'
```

## File Permissions (if needed)

```powershell
# If you get permission errors on Windows
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# For npm scripts
npm config set script-shell powershell
```

---

**Installation Complete!** 🎉

Next steps:
1. Set up API keys (see SETUP_INSTRUCTIONS.md)
2. Start both servers
3. Navigate to http://localhost:5173
4. Test the complete flow!
