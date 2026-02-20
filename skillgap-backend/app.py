from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes import api_bp
from routes_interview import interview_bp

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure max file upload size (16MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(interview_bp, url_prefix='/api/interview')

@app.route('/')
def home():
    return {
        "message": "SkillBridge Unified Backend API",
        "version": "1.0.0",
        "services": [
            "Skill Gap Analysis (/api/skill-gap/*)",
            "Resume Analysis (/api/ai/*)",
            "Interview Bot (/api/interview/*)",
            "Authentication (/api/auth/*)"
        ]
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 70)
    print("SkillBridge Unified Backend Server")
    print("=" * 70)
    print(f"Server running on: http://localhost:{port}")
    print(f"API Documentation: http://localhost:{port}/")
    print("=" * 70)
    app.run(debug=True, port=port)
