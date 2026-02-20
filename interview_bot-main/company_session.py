"""
Enhanced Interview Session - Company-specific questions
"""

from datetime import datetime
import json
from question_bank import get_questions_for_role, get_all_roles
from company_questions import get_company_questions, get_available_companies
from free_evaluator import FreeAIEvaluator

class CompanyInterviewSession:
    def __init__(self, role, candidate_name, company=None):
        self.role = role
        self.candidate_name = candidate_name
        self.company = company
        self.evaluator = FreeAIEvaluator()
        
        # Get questions
        if company:
            # Company-specific questions + role questions
            self.questions = get_company_questions(company, role) + get_questions_for_role(role)[:2]
        else:
            # Only role questions
            self.questions = get_questions_for_role(role)
        
        self.current_question_index = 0
        self.responses = []
        self.start_time = None
        self.end_time = None
    
    def start_interview(self):
        self.start_time = datetime.now()
        company_msg = f" at {self.company}" if self.company else ""
        return {
            "message": f"Welcome {self.candidate_name}! Starting {self.role}{company_msg} interview.",
            "total_questions": len(self.questions),
            "role": self.role,
            "company": self.company
        }
    
    def get_current_question(self):
        if self.current_question_index >= len(self.questions):
            return None
        
        q = self.questions[self.current_question_index]
        return {
            "question_number": self.current_question_index + 1,
            "total_questions": len(self.questions),
            "question": q["question"],
            "category": q["category"]
        }
    
    def submit_answer(self, answer):
        if self.current_question_index >= len(self.questions):
            return {"error": "No more questions"}
        
        q = self.questions[self.current_question_index]
        
        evaluation = self.evaluator.evaluate_answer(
            question=q["question"],
            answer=answer,
            ideal_answer=q["ideal_answer"],
            keywords=q["keywords"],
            category=q["category"]
        )
        
        response_data = {
            "question_number": self.current_question_index + 1,
            "question": q["question"],
            "category": q["category"],
            "answer": answer,
            "evaluation": evaluation,
            "ideal_answer": q["ideal_answer"],
            "timestamp": datetime.now().isoformat()
        }
        
        self.responses.append(response_data)
        self.current_question_index += 1
        
        return {
            "success": True,
            "evaluation": evaluation,
            "has_next": self.current_question_index < len(self.questions)
        }
    
    def get_final_report(self):
        self.end_time = datetime.now()
        
        if not self.responses:
            return {"error": "No responses recorded"}
        
        total_score = sum(r["evaluation"]["score"] for r in self.responses)
        avg_score = total_score / len(self.responses)
        
        # Category scores
        category_scores = {}
        for response in self.responses:
            cat = response["category"].split(" - ")[0]
            if cat not in category_scores:
                category_scores[cat] = []
            category_scores[cat].append(response["evaluation"]["score"])
        
        category_averages = {
            cat: sum(scores) / len(scores) 
            for cat, scores in category_scores.items()
        }
        
        # Aggregate feedback
        all_strengths = []
        all_weaknesses = []
        for response in self.responses:
            all_strengths.extend(response["evaluation"]["strengths"])
            all_weaknesses.extend(response["evaluation"]["weaknesses"])
        
        # Performance assessment
        if avg_score >= 8:
            performance = "Excellent"
            recommendation = f"Strong candidate for {self.company or 'the role'}. Highly recommended for next round."
        elif avg_score >= 6:
            performance = "Good"
            recommendation = f"Promising candidate for {self.company or 'the role'}. Recommended for next round with focus on improvement areas."
        elif avg_score >= 4:
            performance = "Average"
            recommendation = "Needs improvement in key areas. Additional preparation recommended."
        else:
            performance = "Needs Improvement"
            recommendation = "Significant gaps identified. Further preparation needed before proceeding."
        
        duration = (self.end_time - self.start_time).total_seconds() / 60
        
        company_msg = f" at {self.company}" if self.company else ""
        
        return {
            "candidate_name": self.candidate_name,
            "role": self.role,
            "company": self.company,
            "interview_date": self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "duration_minutes": round(duration, 2),
            "total_questions": len(self.questions),
            "overall_score": round(avg_score, 2),
            "performance_level": performance,
            "category_scores": {k: round(v, 2) for k, v in category_averages.items()},
            "key_strengths": list(set(all_strengths))[:5],
            "areas_for_improvement": list(set(all_weaknesses))[:5],
            "recommendation": recommendation,
            "detailed_responses": self.responses
        }
    
    def export_report(self, filepath):
        report = self.get_final_report()
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2)
        return filepath
