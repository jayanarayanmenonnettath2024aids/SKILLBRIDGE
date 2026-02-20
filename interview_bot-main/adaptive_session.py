"""
Adaptive Interview Session - Stateful, continuous interview flow
"""

from datetime import datetime
import json

# Try to import Gemini AI engine first, fallback to OpenAI if not available
try:
    from gemini_ai_engine import InterviewAI
    print("✓ Using Google Gemini AI")
except ImportError:
    try:
        from ai_engine import InterviewAI
        print("✓ Using OpenAI")
    except ImportError:
        raise ImportError("No AI engine available. Install google-generativeai or openai")

class AdaptiveInterviewSession:
    def __init__(self, mode, candidate_name, roles, company=None, jd_text=None):
        self.mode = mode  # "role_based" or "jd_based"
        self.candidate_name = candidate_name
        self.roles = roles if isinstance(roles, list) else [roles]
        self.company = company
        self.jd_text = jd_text
        
        self.ai = InterviewAI()
        self.history = []
        self.question_count = 0
        self.start_time = datetime.now()
        self.jd_context = None
        
        # Parse JD if provided
        if jd_text and company:
            self.jd_context = self.ai.parse_job_description(jd_text, company)
    
    def start_interview(self):
        """Initialize interview"""
        self.start_time = datetime.now()
        
        mode_desc = "Role-Based" if self.mode == "role_based" else "JD + Company-Based"
        roles_str = " + ".join(self.roles)
        company_str = f" at {self.company}" if self.company else ""
        
        return {
            "message": f"Welcome {self.candidate_name}! Starting {mode_desc} interview for {roles_str}{company_str}.",
            "mode": self.mode,
            "roles": self.roles,
            "company": self.company,
            "jd_parsed": self.jd_context is not None
        }
    
    def get_next_question(self):
        """Generate next adaptive question"""
        
        # Build context for AI
        context = {
            "mode": self.mode,
            "roles": self.roles,
            "company": self.company,
            "question_count": self.question_count,
            "history": self.history,
            "jd_context": json.dumps(self.jd_context) if self.jd_context else None,
            "avg_score": self._calculate_avg_score(),
            "performance_trend": self._get_performance_trend()
        }
        
        # Generate question
        question_data = self.ai.generate_next_question(context)
        self.question_count += 1
        
        return {
            "question_number": self.question_count,
            "question": question_data["question"],
            "category": question_data["category"],
            "difficulty": question_data.get("difficulty", "Medium"),
            "reasoning": question_data.get("reasoning", "")
        }
    
    def submit_answer(self, question_data, answer):
        """Evaluate answer and provide feedback"""
        
        # Build context
        context = {
            "roles": self.roles,
            "company": self.company,
            "category": question_data["category"],
            "question_count": self.question_count,
            "performance_trend": self._get_performance_trend()
        }
        
        # Get AI evaluation
        evaluation = self.ai.evaluate_answer(
            question=question_data["question"],
            answer=answer,
            context=context
        )
        
        # Store in history with all new fields
        self.history.append({
            "question_number": question_data["question_number"],
            "question": question_data["question"],
            "category": question_data["category"],
            "difficulty": question_data["difficulty"],
            "answer": answer,
            "score": evaluation["score"],
            # New strict feedback fields
            "interviewer_assessment": evaluation.get("interviewer_assessment", evaluation.get("feedback", "")),
            "what_question_tested": evaluation.get("what_question_tested", ""),
            "specific_mistakes": evaluation.get("specific_mistakes", []),
            "why_this_fails": evaluation.get("why_this_fails", ""),
            "mentor_guidance": evaluation.get("mentor_guidance", ""),
            "how_to_improve": evaluation.get("how_to_improve", []),
            "model_answer": evaluation.get("model_answer", ""),
            # Legacy fields for compatibility
            "feedback": evaluation.get("interviewer_assessment", evaluation.get("feedback", "")),
            "strengths": evaluation.get("strengths", []),
            "improvements": evaluation.get("improvements", []),
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "success": True,
            "evaluation": evaluation
        }
    
    def should_continue(self):
        """Check if interview should continue (always user's choice)"""
        return True  # User decides when to stop
    
    def get_final_report(self):
        """Generate comprehensive final report"""
        
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds() / 60
        
        # Get AI-generated assessment
        session_data = {
            "candidate_name": self.candidate_name,
            "roles": self.roles,
            "company": self.company,
            "question_count": self.question_count,
            "avg_score": self._calculate_avg_score(),
            "history": self.history
        }
        
        ai_report = self.ai.generate_final_report(session_data)
        
        # Calculate statistics
        scores = [h["score"] for h in self.history]
        category_scores = {}
        for h in self.history:
            cat = h["category"]
            if cat not in category_scores:
                category_scores[cat] = []
            category_scores[cat].append(h["score"])
        
        return {
            "candidate_name": self.candidate_name,
            "mode": self.mode,
            "roles": self.roles,
            "company": self.company,
            "interview_date": self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "duration_minutes": round(duration, 2),
            "questions_answered": self.question_count,
            "average_score": round(self._calculate_avg_score(), 2),
            "score_trend": self._get_score_trend(),
            "category_performance": {k: round(sum(v)/len(v), 2) for k, v in category_scores.items()},
            "ai_assessment": ai_report,
            "detailed_history": self.history
        }
    
    def export_report(self, filepath):
        """Export report to JSON"""
        report = self.get_final_report()
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2)
        return filepath
    
    def _calculate_avg_score(self):
        """Calculate average score"""
        if not self.history:
            return 0
        return sum(h["score"] for h in self.history) / len(self.history)
    
    def _get_performance_trend(self):
        """Get performance trend"""
        if len(self.history) < 2:
            return "Starting"
        
        recent = [h["score"] for h in self.history[-3:]]
        avg_recent = sum(recent) / len(recent)
        
        if avg_recent >= 8:
            return "Strong"
        elif avg_recent >= 6:
            return "Good"
        elif avg_recent >= 4:
            return "Moderate"
        else:
            return "Needs Improvement"
    
    def _get_score_trend(self):
        """Get score progression"""
        if len(self.history) < 3:
            return "Insufficient data"
        
        first_half = [h["score"] for h in self.history[:len(self.history)//2]]
        second_half = [h["score"] for h in self.history[len(self.history)//2:]]
        
        avg_first = sum(first_half) / len(first_half)
        avg_second = sum(second_half) / len(second_half)
        
        if avg_second > avg_first + 1:
            return "Improving"
        elif avg_second < avg_first - 1:
            return "Declining"
        else:
            return "Consistent"
