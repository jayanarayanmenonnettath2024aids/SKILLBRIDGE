"""
Interview Bot API Routes
Handles AI-powered interview sessions using Gemini AI
"""

from flask import Blueprint, request, jsonify
import os
import uuid
from datetime import datetime
import json
import sys

# Add services directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))

try:
    from services.interview_ai import InterviewAI
    ai_engine = InterviewAI()
    AI_AVAILABLE = True
    print("✅ Gemini AI Engine loaded successfully")
except Exception as e:
    print(f"⚠️ AI Engine not available: {e}")
    AI_AVAILABLE = False
    ai_engine = None

interview_bp = Blueprint('interview', __name__)

# Store active interview sessions in memory (use Redis/DB in production)
sessions = {}

# Video storage directory
VIDEO_DIR = os.path.join(os.path.dirname(__file__), "..", "interview_videos")
os.makedirs(VIDEO_DIR, exist_ok=True)


@interview_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "interview-bot", "timestamp": datetime.now().isoformat()})


@interview_bp.route('/start', methods=['POST'])
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
        
        # For now, store simple session data without importing adaptive_session
        # This can be enhanced later to import the actual interview bot logic
        session_data = {
            "session_id": session_id,
            "candidate_name": candidate_name,
            "job_title": job_title,
            "company": company,
            "question_count": 0,
            "questions": [],
            "answers": [],
            "started_at": datetime.now().isoformat()
        }
        
        # Store session
        sessions[session_id] = session_data
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "message": f"Welcome {candidate_name}! Ready to start your interview for {job_title} at {company}?",
            "candidate_name": candidate_name,
            "job_title": job_title,
            "company": company
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@interview_bp.route('/<session_id>/question', methods=['GET'])
def get_next_question(session_id):
    """Get the next interview question using Gemini AI"""
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        question_num = session["question_count"] + 1
        
        # Maximum 10 questions per interview
        if question_num > 10:
            return jsonify({
                "success": False,
                "error": "Interview completed",
                "completed": True
            }), 200
        
        # Generate question using Gemini AI
        if AI_AVAILABLE and ai_engine:
            try:
                # Calculate average score from previous answers
                answers = session.get("answers", [])
                if answers:
                    scores = [a.get('evaluation', {}).get('score', 6.0) for a in answers if 'evaluation' in a]
                    avg_score = sum(scores) / len(scores) if scores else 6.0
                else:
                    avg_score = 6.0
                
                context = {
                    "job_title": session["job_title"],
                    "company": session["company"],
                    "question_count": session["question_count"],
                    "avg_score": avg_score
                }
                
                question_data = ai_engine.generate_next_question(context)
                question_data["question_number"] = question_num
                
            except Exception as e:
                print(f"AI generation error: {e}")
                # Fallback to preset questions
                question_data = get_fallback_question(session, question_num)
        else:
            # Fallback to preset questions
            question_data = get_fallback_question(session, question_num)
        
        # Store question in session
        session["questions"].append(question_data)
        session["question_count"] = question_num
        
        return jsonify({
            "success": True,
            "question": question_data
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def get_fallback_question(session, question_num):
    """Fallback questions when AI is not available"""
    questions = [
        {
            "question": "Tell me about yourself and your experience.",
            "question_number": question_num,
            "category": "introduction",
            "difficulty": "Easy"
        },
        {
            "question": f"Why do you want to work at {session['company']}?",
            "question_number": question_num,
            "category": "motivation",
            "difficulty": "Easy"
        },
        {
            "question": f"What skills do you have that make you suitable for the {session['job_title']} role?",
            "question_number": question_num,
            "category": "technical",
            "difficulty": "Medium"
        },
        {
            "question": "Describe a challenging situation you faced and how you handled it.",
            "question_number": question_num,
            "category": "behavioral",
            "difficulty": "Medium"
        },
        {
            "question": "Where do you see yourself in 5 years?",
            "question_number": question_num,
            "category": "career_goals",
            "difficulty": "Easy"
        }
    ]
    
    idx = min(question_num - 1, len(questions) - 1)
    return questions[idx]


@interview_bp.route('/<session_id>/answer', methods=['POST'])
def submit_answer(session_id):
    """Submit an answer and get AI evaluation from Gemini"""
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
        
        # Evaluate answer using Gemini AI
        if AI_AVAILABLE and ai_engine:
            try:
                context = {
                    "job_title": session["job_title"],
                    "company": session["company"],
                    "question_count": session["question_count"]
                }
                
                evaluation = ai_engine.evaluate_answer(
                    question=question_data.get("question"),
                    answer=answer,
                    context=context
                )
            except Exception as e:
                print(f"AI evaluation error: {e}")
                # Fallback evaluation
                evaluation = get_fallback_evaluation(answer)
        else:
            # Fallback evaluation
            evaluation = get_fallback_evaluation(answer)
        
        # Store answer with evaluation
        session["answers"].append({
            "question_number": question_data.get("question_number"),
            "question": question_data.get("question"),
            "answer": answer,
            "evaluation": evaluation,
            "timestamp": datetime.now().isoformat()
        })
        
        return jsonify({
            "success": True,
            "evaluation": evaluation,
            "question_number": question_data.get("question_number")
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def get_fallback_evaluation(answer):
    """Fallback evaluation when AI is not available"""
    word_count = len(answer.split())
    
    # Simple heuristic based on answer length
    if word_count < 10:
        score = 4.0
        feedback = "Your answer is too brief. Try to provide more detail and specific examples."
    elif word_count < 30:
        score = 6.0
        feedback = "Good start. Consider elaborating more with specific examples."
    elif word_count < 60:
        score = 7.5
        feedback = "Well-structured answer. Good level of detail provided."
    else:
        score = 8.0
        feedback = "Excellent detailed response. You clearly articulated your thoughts."
    
    return {
        "score": score,
        "interviewer_assessment": feedback,
        "feedback": feedback,
        "specific_mistakes": [],
        "how_to_improve": ["Provide specific examples", "Be clear and concise"],
        "what_question_tested": "Communication and knowledge",
        "model_answer": "A strong answer would include specific examples and demonstrate clear understanding."
    }


@interview_bp.route('/<session_id>/report', methods=['GET'])
def get_final_report(session_id):
    """Get final interview report with AI-generated assessment"""
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        
        # Calculate overall score from answers
        answers = session.get("answers", [])
        if answers:
            scores = [a.get('evaluation', {}).get('score', 6.0) for a in answers if 'evaluation' in a]
            total_score = sum(scores) / len(scores) if scores else 6.0
        else:
            total_score = 6.0
        
        # Generate AI report if available
        ai_assessment = None
        if AI_AVAILABLE and ai_engine and answers:
            try:
                ai_assessment = ai_engine.generate_final_report(session)
            except Exception as e:
                print(f"AI report generation error: {e}")
        
        # Build comprehensive report
        report = {
            "session_id": session_id,
            "candidate_name": session["candidate_name"],
            "job_title": session["job_title"],
            "company": session["company"],
            "started_at": session["started_at"],
            "completed_at": datetime.now().isoformat(),
            "total_questions": session["question_count"],
            "answers_submitted": len(answers),
            "overall_score": total_score,
            "recommendation": get_recommendation(total_score),
            "answers": answers
        }
        
        # Add AI assessment if available
        if ai_assessment:
            report["ai_assessment"] = ai_assessment
            report["strengths"] = ai_assessment.get("strengths", [])
            report["areas_for_improvement"] = ai_assessment.get("areas_for_improvement", [])
            report["detailed_analysis"] = ai_assessment.get("detailed_analysis", "")
            report["hiring_recommendation"] = ai_assessment.get("hiring_recommendation", "")
        
        # Save report to file
        filename = f"interview_{session['candidate_name'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
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


def get_recommendation(score):
    """Get hiring recommendation based on score"""
    if score >= 8.5:
        return "Strong Hire - Excellent performance"
    elif score >= 7.0:
        return "Hire - Good performance with minor areas to improve"
    elif score >= 6.0:
        return "Maybe - Adequate performance, needs further evaluation"
    else:
        return "No Hire - Significant gaps identified"


@interview_bp.route('/<session_id>/video', methods=['POST'])
def upload_video(session_id):
    """Upload interview video recording"""
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
        filename = f"interview_{session['candidate_name']}_{session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.webm"
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


@interview_bp.route('/<session_id>/status', methods=['GET'])
def get_session_status(session_id):
    """Get current interview session status"""
    try:
        if session_id not in sessions:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        session = sessions[session_id]
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "candidate_name": session["candidate_name"],
            "question_count": session["question_count"],
            "job_title": session["job_title"],
            "company": session["company"],
            "active": True
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@interview_bp.route('/<session_id>/end', methods=['POST'])
def end_interview(session_id):
    """End interview session and clean up"""
    try:
        if session_id in sessions:
            # Get final report before deleting session
            session = sessions[session_id]
            
            report = {
                "session_id": session_id,
                "candidate_name": session["candidate_name"],
                "total_questions": session["question_count"],
                "ended_at": datetime.now().isoformat()
            }
            
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
