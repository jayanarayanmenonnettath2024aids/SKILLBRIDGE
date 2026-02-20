"""
Free Adaptive Interview Session - No API Keys Required
Uses open-source models for complete interview flow
"""

from datetime import datetime
import json
import random
from free_ai_engine import LlamaInterviewAI
from question_bank import get_questions_for_role

"""
FreeAdaptiveSession now supports a graceful fallback when the external
Llama/OpenRouter AI is unavailable (rate limits or network errors).

If the AI fails during initialization or later calls, this session will
use the local `question_bank` to generate questions and a lightweight
keyword-matching evaluator to score answers. This keeps interviews
running in text-only or speech modes without external API calls.
"""

class FreeAdaptiveSession:
    def __init__(self, mode, candidate_name, roles, company=None, jd_text=None):
        self.mode = mode
        self.candidate_name = candidate_name
        self.roles = roles if isinstance(roles, list) else [roles]
        self.company = company
        self.jd_text = jd_text
        # Initialize AI and session state
        self.ai = LlamaInterviewAI()
        self.ai_available = True
        self.history = []
        self.question_count = 0
        self.asked_questions = set()
        self.start_time = datetime.now()
        self.jd_context = None
        self.role_research = None

        # Research roles in Mode 1
        if mode == "role_based" and roles:
            print("⏳ Analyzing interview expectations for these roles...")
            try:
                self.role_research = self.ai.research_roles(roles)
                print("✅ Role analysis complete!\n")
            except Exception as e:
                # Fail gracefully and fall back to local question bank
                print(f"⚠️ Role analysis failed (AI unavailable): {e}")
                print("   Falling back to local question bank for questions.")
                self.ai_available = False

        # Parse JD in Mode 2
        if jd_text and company:
            try:
                self.jd_context = self.ai.parse_job_description(jd_text, company)
            except Exception as e:
                print(f"⚠️ JD parsing failed (AI unavailable): {e}")
                print("   JD context will not be available; using local prompts instead.")
                self.ai_available = False
    
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
        
        context = {
            "mode": self.mode,
            "roles": self.roles,
            "company": self.company,
            "question_count": self.question_count,
            "history": self.history,
            "role_research": self.role_research,
            "jd_context": json.dumps(self.jd_context) if self.jd_context else None,
            "avg_score": self._calculate_avg_score(),
            "performance_trend": self._get_performance_trend()
        }
        
        # If AI is available, ask it to generate the next question. Otherwise
        # fall back to the local `question_bank`.
        if self.ai_available:
            try:
                question_data = self.ai.generate_next_question(context)
            except Exception as e:
                print(f"⚠️ AI question generation failed: {e}")
                print("   Falling back to local question bank.")
                self.ai_available = False
                question_data = None
        else:
            question_data = None

        if not question_data:
            # Local fallback: pick a random role from provided roles and fetch
            # a random question from the question bank.
            role = self.roles[0] if self.roles else None
            questions = get_questions_for_role(role) if role else []
            if not questions:
                # As a last resort, pick any role from the bank
                from question_bank import get_all_roles
                all_roles = get_all_roles()
                if all_roles:
                    role = random.choice(all_roles)
                    questions = get_questions_for_role(role)

            if not questions:
                # No questions available - return a generic prompt
                q_text = "Tell me about yourself and your background."
                question_data = {"question": q_text, "category": "HR", "difficulty": "Easy"}
            else:
                # Filter out previously asked questions to avoid repetition
                filtered = [q for q in questions if q.get("question") not in self.asked_questions]

                # Prioritize categories for efficiency: technical -> scenario -> hr
                category_order = ["technical", "scenario", "hr", "general"]
                selected = None
                for cat in category_order:
                    for q in filtered:
                        qcat = q.get("category", "General").lower()
                        if (cat == "general" and qcat not in ["technical", "scenario", "hr"]) or qcat == cat:
                            selected = q
                            break
                    if selected:
                        break

                # If all questions were asked already, allow repeats by resetting
                if not selected:
                    if not filtered and questions:
                        # Reset asked set and pick from full list
                        self.asked_questions.clear()
                        selected = random.choice(questions)
                    else:
                        selected = random.choice(filtered) if filtered else random.choice(questions)

                question_data = {"question": selected["question"], "category": selected.get("category", "General"), "difficulty": selected.get("difficulty", "Medium")}
                # Mark as asked
                self.asked_questions.add(question_data["question"])

        self.question_count += 1

        return {
            "question_number": self.question_count,
            "question": question_data["question"],
            "category": question_data.get("category", "General"),
            "difficulty": question_data.get("difficulty", "Medium"),
            "reasoning": question_data.get("reasoning", "")
        }
    
    def submit_answer(self, question_data, answer):
        """Evaluate answer and provide feedback"""
        
        context = {
            "roles": self.roles,
            "company": self.company,
            "category": question_data["category"],
            "question_count": self.question_count,
            "performance_trend": self._get_performance_trend()
        }
        
        # If AI is available, prefer AI evaluation. Otherwise use a lightweight
        # keyword-based evaluator against the local question bank's ideal answers.
        evaluation = None
        if self.ai_available:
            try:
                evaluation = self.ai.evaluate_answer(
                    question=question_data["question"],
                    answer=answer,
                    context=context
                )
            except Exception as e:
                print(f"⚠️ AI evaluation failed: {e}")
                print("   Falling back to local keyword-based evaluation.")
                self.ai_available = False

        if not evaluation:
            # Local evaluation: try to find an ideal answer and count keyword matches
            role = self.roles[0] if self.roles else None
            questions = get_questions_for_role(role) if role else []
            ideal = None
            for q in questions:
                if q.get("question", "").strip().lower() == question_data["question"].strip().lower():
                    ideal = q
                    break

            score = 5.0
            interviewer_assessment = "Good effort. Provide more specifics and examples."
            mentor_guidance = "Structure your answer: Situation, Task, Action, Result. Add specific metrics when possible."

            if ideal:
                keywords = ideal.get("keywords", [])
                matches = 0
                for kw in keywords:
                    if kw.lower() in answer.lower():
                        matches += 1

                # Fuzzy matching against the ideal answer using difflib
                from difflib import SequenceMatcher
                ideal_text = ideal.get("ideal_answer", "").lower()
                ans_text = answer.lower()
                similarity = 0.0
                if ideal_text and ans_text:
                    try:
                        similarity = SequenceMatcher(None, ideal_text, ans_text).ratio()
                    except Exception:
                        similarity = 0.0

                # Keyword coverage
                kw_score = (matches / len(keywords)) if keywords else 0.0

                # Combine signals into a 0..1 combined score
                # Give more weight to semantic similarity, but keywords matter for technical questions
                combined = 0.7 * similarity + 0.3 * kw_score

                # Map combined to 0..10
                score = round(combined * 10, 1)
                score = max(0, min(10, score))

                interviewer_assessment = f"Keyword matches: {matches}/{len(keywords)}. Similarity to model answer: {int(similarity*100)}%."
                # Generate actionable suggestions
                suggestions = []
                if matches == 0:
                    suggestions.append("Include key terms or technologies mentioned in the question's ideal answer.")
                if similarity < 0.5:
                    suggestions.append("Bring your answer closer to the model structure: explain concept, give example, show impact.")
                if len(answer.split()) < 20:
                    suggestions.append("Expand your answer with a short example or metric.")

                if not suggestions:
                    suggestions = ["Good answer. Add concrete metrics or examples to improve further."]

                mentor_guidance = ideal.get("ideal_answer", mentor_guidance)
                specific_mistakes = []
                # Heuristic mistakes: missing keywords, low similarity
                if matches == 0:
                    specific_mistakes.append("Missing core keywords from ideal answer.")
                if similarity < 0.4:
                    specific_mistakes.append("Answer lacks expected structure or depth.")

                # Attach these fields into evaluation returned to caller
                evaluation_fields = {
                    "score": score,
                    "interviewer_assessment": interviewer_assessment,
                    "mentor_guidance": mentor_guidance,
                    "model_answer": ideal.get("ideal_answer", ""),
                    "what_question_tested": question_data.get("category", "General"),
                    "suggestions": suggestions,
                    "specific_mistakes": specific_mistakes
                }

                evaluation = evaluation_fields

            evaluation = {
                "score": max(0, min(10, score)),
                "interviewer_assessment": interviewer_assessment,
                "mentor_guidance": mentor_guidance,
                "model_answer": ideal.get("ideal_answer", "") if ideal else "",
                "what_question_tested": question_data.get("category", "General")
            }
        
        # Store complete feedback with all new fields
        self.history.append({
            "question_number": question_data["question_number"],
            "question": question_data["question"],
            "category": question_data["category"],
            "difficulty": question_data["difficulty"],
            "answer": answer,
            "score": evaluation["score"],
            # New strict feedback fields
            "interviewer_assessment": evaluation.get("interviewer_assessment", evaluation.get("interviewer_evaluation", "")),
            "what_question_tested": evaluation.get("what_question_tested", ""),
            "specific_mistakes": evaluation.get("specific_mistakes", []),
            "why_this_fails": evaluation.get("why_this_fails", ""),
            "mentor_guidance": evaluation.get("mentor_guidance", ""),
            "how_to_improve": evaluation.get("how_to_improve", []),
            "model_answer": evaluation.get("model_answer", ""),
            # Legacy fields
            "strengths": evaluation.get("strengths", []),
            "improvements": evaluation.get("improvements", []),
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "success": True,
            "evaluation": evaluation,
            "score": evaluation.get("score", 0),
            "interviewer_assessment": evaluation.get("interviewer_assessment", ""),
            "mentor_guidance": evaluation.get("mentor_guidance", "")
        }
    
    def get_final_report(self):
        """Generate comprehensive final report"""
        
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds() / 60
        
        session_data = {
            "candidate_name": self.candidate_name,
            "roles": self.roles,
            "company": self.company,
            "question_count": self.question_count,
            "avg_score": self._calculate_avg_score(),
            "history": self.history
        }
        
        ai_report = None
        if self.ai_available:
            try:
                ai_report = self.ai.generate_final_report(session_data)
            except Exception as e:
                print(f"⚠️ AI final report generation failed: {e}")
                ai_report = None
        
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
