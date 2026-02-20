# SkillBridge AI Interview Bot Integration

This integration connects the React frontend with the Python AI Interview Bot backend for intelligent, adaptive interview experiences.

## Architecture

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Flask API + AI Interview Bot (Port 5000)
- **AI Engine**: OpenAI GPT-4 for question generation and evaluation

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **OpenAI API Key** (required for AI features)

## Setup Instructions

### Step 1: Backend Setup

1. Navigate to the interview bot directory:
```bash
cd interview_bot-main
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements_api.txt
```

4. Configure OpenAI API Key:

Create a `.env` file in the `interview_bot-main` directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

To get an API key:
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it into the `.env` file

5. Start the Flask API server:
```bash
python api.py
```

You should see:
```
🚀 AI Interview Bot API Server
Server running on: http://localhost:5000
```

### Step 2: Frontend Setup

1. Open a NEW terminal window

2. Navigate to the main project directory:
```bash
cd d:\Desktop\SKILLBRIDGE-master
```

3. Install dependencies (if not already done):
```bash
npm install
```

4. Start the React development server:
```bash
npm run dev
```

You should see:
```
VITE ready in XXXms
Local: http://localhost:5173/
```

### Step 3: Access the Application

1. Open your browser to: **http://localhost:5173**

2. Navigate to the Interview section

3. Start an interview - it will now use the AI backend!

## Features

### AI-Powered Interview
- ✅ Dynamic question generation based on role and company
- ✅ Real-time answer evaluation with detailed feedback
- ✅ Adaptive difficulty - questions adjust based on performance
- ✅ Comprehensive final report with scores and recommendations

### Video Recording
- ✅ Camera and microphone access
- ✅ Video recording during interview
- ✅ Automatic video upload to backend
- ✅ Recording indicators (red badge)

### Interview Flow
1. **Start Interview** → Creates session with backend
2. **Answer Questions** → AI generates adaptive questions
3. **Get Feedback** → Instant evaluation after each answer
4. **Final Report** → Comprehensive assessment at the end

## API Endpoints

### Start Interview
```
POST /api/interview/start
Body: { candidate_name, job_title, company }
Response: { session_id, message }
```

### Get Next Question
```
GET /api/interview/<session_id>/question
Response: { question, category, difficulty, question_number }
```

### Submit Answer
```
POST /api/interview/<session_id>/answer
Body: { question_data, answer }
Response: { evaluation: { score, feedback, ... } }
```

### Get Final Report
```
GET /api/interview/<session_id>/report
Response: { overall_score, summary, detailed_analysis }
```

### Upload Video
```
POST /api/interview/<session_id>/video
Body: FormData with video file
Response: { success, filename, size }
```

## Troubleshooting

### Backend Issues

**Error: "OPENAI_API_KEY required"**
- Make sure you created the `.env` file in `interview_bot-main`
- Verify the API key is valid

**Error: "Address already in use" (Port 5000)**
- Another service is using port 5000
- Kill the process or change the port in `api.py`

**Error: "Module not found"**
- Run `pip install -r requirements_api.txt` again
- Make sure virtual environment is activated

### Frontend Issues

**Error: "Failed to connect to interview server"**
- Check if backend is running on http://localhost:5000
- Try accessing http://localhost:5000/api/health in browser
- Check firewall/antivirus settings

**Camera not showing**
- Grant camera/microphone permissions in browser
- Use HTTPS or localhost (required for camera access)
- Check if another app is using the camera

### CORS Issues

If you see CORS errors in browser console:
- Backend has `flask-cors` enabled for all origins
- Make sure backend is running
- Try restarting both frontend and backend

## Cost Considerations

### OpenAI API Costs
- **GPT-4o-mini**: ~$0.15 per interview (recommended)
- **GPT-4**: ~$0.50-1.00 per interview (higher quality)

Typical interview cost breakdown:
- Question generation: 7-10 questions × $0.01 = ~$0.10
- Answer evaluation: 7-10 evaluations × $0.01 = ~$0.10
- Final report: $0.02
- **Total: ~$0.22 per interview**

### Free Alternative
For testing without API costs, you can modify `free_ai_engine.py` for mock responses (see `interview_bot-main/README.md`).

## Development

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd interview_bot-main
python api.py
```

**Frontend (with hot-reload):**
```bash
npm run dev
```

### Project Structure
```
SKILLBRIDGE-master/
├── src/
│   ├── pages/
│   │   └── interview/
│   │       └── InterviewBot.jsx  ← Updated with API integration
│   └── styles/
│       └── InterviewBot.css
├── interview_bot-main/
│   ├── api.py                    ← Flask API server
│   ├── adaptive_session.py       ← Interview session logic
│   ├── ai_engine.py              ← OpenAI integration
│   ├── .env                      ← API keys (create this)
│   └── requirements_api.txt      ← Python dependencies
└── package.json
```

## Next Steps

1. **Customize Questions**: Modify prompts in `ai_engine.py`
2. **Add More Features**: Voice responses, real-time transcription
3. **Deploy**: Use cloud services for production deployment
4. **Analytics**: Track interview performance and metrics

## Support

For issues or questions:
1. Check the console logs (both browser and backend terminal)
2. Review the error messages
3. Verify all dependencies are installed
4. Ensure API key is valid and has credits

## License

This project integrates open-source components with commercial AI services (OpenAI).
