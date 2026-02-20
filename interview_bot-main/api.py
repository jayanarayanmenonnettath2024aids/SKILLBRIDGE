"""
Flask API for AI Interview Bot
Exposes interview bot functionality to React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from adaptive_session import AdaptiveInterviewSession
import os
import uuid
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Store active interview sessions in memory (use Redis/DB in production)
sessions = {}

# Video storage directory
VIDEO_DIR = "interview_videos"
os.makedirs(VIDEO_DIR, exist_ok=True)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})


@app.route('/api/interview/start', methods=['POST'])
def start_interview():
    """
    Start a new interview session
    Request body:
    {
        "candidate_name": "John Doe",
        "job_title": "Data Entry Operator",
        "company": "TechServe Solutions"
    }
    """
    try:
        data = request.json
        candidate_name = data.get('candidate_name', 'Candidate')
        job_title = data.get('job_title', 'Data Entry Operator')
        company = data.get('company', 'Company')
        
        # Create session ID
        session_id = str(uuid.uuid4())
        
        # Create adaptive session (role-based mode)
        session = AdaptiveInterviewSession(
            mode="role_based",
            candidate_name=candidate_name,
            roles=[job_title],
            company=company,
            jd_text=None
        )
        
        # Store session
        sessions[session_id] = session
        
        # Start interview
        start_info = session.start_interview()
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "message": start_info["message"],
            "candidate_name": candidate_name,
            "job_title": job_title,
            "company": company
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/question', methods=['GET'])
def get_next_question(session_id):
    """
    Get the next interview question
    """
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        question_data = session.get_next_question()
        
        return jsonify({
            "success": True,
            "question": question_data
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/answer', methods=['POST'])
def submit_answer(session_id):
    """
    Submit an answer and get evaluation
    Request body:
    {
        "question_data": {...},
        "answer": "User's answer text"
    }
    """
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        data = request.json
        question_data = data.get('question_data')
        answer = data.get('answer', '')
        
        if not answer.strip():
            return jsonify({
                "success": False,
                "error": "Answer cannot be empty"
            }), 400
        
        session = sessions[session_id]
        result = session.submit_answer(question_data, answer)
        
        return jsonify({
            "success": True,
            "evaluation": result["evaluation"],
            "question_number": question_data["question_number"]
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/report', methods=['GET'])
def get_final_report(session_id):
    """
    Get final interview report
    """
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        report = session.get_final_report()
        
        # Save report to file
        filename = f"interview_{session.candidate_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(VIDEO_DIR, filename)
        
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        return jsonify({
            "success": True,
            "report": report,
            "saved_to": filename
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/video', methods=['POST'])
def upload_video(session_id):
    """
    Upload interview video recording
    """
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        if 'video' not in request.files:
            return jsonify({"success": False, "error": "No video file provided"}), 400
        
        video_file = request.files['video']
        
        if video_file.filename == '':
            return jsonify({"success": False, "error": "Empty filename"}), 400
        
        session = sessions[session_id]
        
        # Save video with session info
        filename = f"interview_{session.candidate_name}_{session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.webm"
        filepath = os.path.join(VIDEO_DIR, filename)
        
        video_file.save(filepath)
        
        return jsonify({
            "success": True,
            "message": "Video uploaded successfully",
            "filename": filename,
            "size": os.path.getsize(filepath)
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/status', methods=['GET'])
def get_session_status(session_id):
    """
    Get current interview session status
    """
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "candidate_name": session.candidate_name,
            "question_count": session.question_count,
            "roles": session.roles,
            "company": session.company,
            "avg_score": session._calculate_avg_score(),
            "active": True
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/interview/<session_id>/end', methods=['POST'])
def end_interview(session_id):
    """
    End interview session and clean up
    """
    try:
        if session_id in sessions:
            # Get final report before deleting session
            session = sessions[session_id]
            report = session.get_final_report()
            
            # Remove session from memory
            del sessions[session_id]
            
            return jsonify({
                "success": True,
                "message": "Interview session ended",
                "report": report
            })
        else:
            return jsonify({"success": False, "error": "Session not found"}), 404
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    print("=" * 70)
    print("🚀 AI Interview Bot API Server")
    print("=" * 70)
    print("Server running on: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("=" * 70)
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
