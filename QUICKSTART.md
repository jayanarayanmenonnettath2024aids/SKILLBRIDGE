# 🚀 Quick Start Guide - AI Interview Integration

## Fastest Way to Get Started

### Option 1: Automated Startup (Windows)

**Double-click** `start-interview-system.bat`

This will:
- ✅ Check dependencies  
- ✅ Create virtual environment
- ✅ Install Python packages
- ✅ Start backend server (Port 5000)
- ✅ Start frontend server (Port 5173)

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd interview_bot-main
python -m venv venv
venv\Scripts\activate
pip install -r requirements_api.txt
python api.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

## ⚠️ Important: API Key Required

Before starting, create `.env` file in `interview_bot-main/`:

```
OPENAI_API_KEY=sk-your-key-here
```

Get your API key: https://platform.openai.com/api-keys

**No API key?** See `interview_bot-main/README.md` for free alternatives.

## 🎯 Usage

1. Open browser to **http://localhost:5173**
2. Navigate to **Find Jobs** or **Interview** section
3. Click **Start Interview** on any job listing
4. Grant camera/microphone permissions when prompted
5. Answer AI-generated questions
6. Receive real-time feedback and scoring

## 🎥 Video Interview Features

- **Red "Recording" badge**: Video is being recorded
- **Green "Microphone Active" badge**: Audio is capturing
- **Click play button** if video doesn't auto-start (browser security)
- Video automatically uploads to backend when interview ends

## 🐛 Common Issues

**"Failed to connect to interview server"**
→ Make sure backend is running on http://localhost:5000

**"OPENAI_API_KEY required"**
→ Create `.env` file with your API key

**Camera not showing**
→ Grant browser permissions, refresh page

**Black video screen**
→ Click the play button overlay to start video

## 📊 What's Different Now?

### Before (Static)
- ❌ Fixed 7 questions
- ❌ No evaluation
- ❌ No intelligence

### After (AI-Powered)
- ✅ Dynamic adaptive questions
- ✅ Real-time AI evaluation (score + feedback)
- ✅ Questions adjust to your performance
- ✅ Comprehensive final report
- ✅ Video recording saved to backend

## 💰 Cost

Approximately **$0.15-0.25 per interview** using OpenAI GPT-4o-mini.

First-time users get $5 free credit from OpenAI (20-30 interviews).

## 📖 Full Documentation

See `INTERVIEW_INTEGRATION_README.md` for complete details.

## ✅ Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed  
- [ ] OpenAI API key obtained
- [ ] `.env` file created in `interview_bot-main/`
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Both servers accessible (check in browser)

## 🎉 You're Ready!

Navigate to http://localhost:5173 and start your AI-powered interview!
