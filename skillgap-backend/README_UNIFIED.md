# SkillBridge Unified Backend

This is the unified backend for SkillBridge AI platform, combining all backend services into a single Flask application.

## Services Included

1. **Skill Gap Analysis** - `/api/skill-gap/*`
2. **Resume Analysis** - `/api/ai/*`
3. **Interview Bot** - `/api/interview/*`
4. **Authentication** - `/api/auth/*`

## Quick Start

### Option 1: Run Backend Only
```bash
cd skillgap-backend
pip install -r requirements.txt
python app.py
```

### Option 2: Run Full Stack (Recommended)
From project root:
```bash
start-full-stack.bat
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:5173

## API Endpoints

### Health Check
- `GET /` - API documentation
- `GET /api/interview/health` - Interview service health

### Interview Bot
- `POST /api/interview/start` - Start new interview
- `GET /api/interview/<session_id>/question` - Get next question
- `POST /api/interview/<session_id>/answer` - Submit answer
- `GET /api/interview/<session_id>/report` - Get final report
- `POST /api/interview/<session_id>/video` - Upload video
- `GET /api/interview/<session_id>/status` - Get session status
- `POST /api/interview/<session_id>/end` - End interview

### Skill Gap Analysis
- `GET /api/skill-gap/users` - Get all users
- `GET /api/users/<user_id>` - Get user skill gap
- `POST /api/skill-gap/seed-data` - Seed demo data

### Resume Analysis
- `POST /api/resume/upload` - Upload resume
- `POST /api/ai/analyze-resume` - Analyze resume
- `GET /api/ai/resume-analysis/<user_id>` - Get analysis
- `GET /api/ai/learning-videos/<user_id>` - Get learning videos

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Environment Variables

Create a `.env` file in `skillgap-backend/`:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Server
PORT=5000

# Firebase (optional - for full features)
# GOOGLE_APPLICATION_CREDENTIALS=path/to/firebase-key.json
```

## Dependencies

Install all dependencies:
```bash
pip install -r requirements.txt
```

Main packages:
- Flask & Flask-CORS
- Firebase Admin SDK
- Google Generative AI
- PyPDF2 for resume parsing
- Transformers & Torch (optional, for advanced AI features)

## Development

The backend runs on port 5000 by default. To change:
```env
PORT=8000
```

## Notes

- Interview sessions are stored in memory (use Redis/database in production)
- Videos are saved to `interview_videos/` directory
- Mock data is used when Firebase is not configured
- CORS is enabled for all origins (restrict in production)
