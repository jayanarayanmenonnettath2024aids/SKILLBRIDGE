"""
AI Engine using Google Gemini - Question Generation & Feedback for Interview Bot
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

class InterviewAI:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY required in .env file")
        
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash (stable and widely available)
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("✅ Using Gemini 1.5 Flash model")
        except:
            # Ultimate fallback to gemini-pro
            self.model = genai.GenerativeModel('gemini-pro')
            print("✅ Using Gemini Pro model")
    
    def generate_next_question(self, context):
        """Generate next interview question using Gemini"""
        
        job_title = context.get('job_title', 'Position')
        company = context.get('company', 'Company')
        question_count = context.get('question_count', 0)
        avg_score = context.get('avg_score', 'N/A')
        
        prompt = f"""You are a professional interviewer conducting a technical interview.

Context:
- Role: {job_title}
- Company: {company}
- Question Number: {question_count + 1}
- Previous Performance: {avg_score}/10

INTERVIEW RULES:
1. NEVER repeat previous questions
2. Follow logical sequence:
   Q1-2: Background and motivation ("Tell me about yourself", "Why this company?")
   Q3-5: Fundamental technical skills related to {job_title}
   Q6-8: Problem-solving scenarios and real-world challenges
   Q9+: Advanced challenges and situational questions

3. Adapt to performance:
   - Low scores (<6): Ask foundational questions
   - High scores (≥7): Increase complexity

Generate the next interview question. Return ONLY a JSON object with this exact format:
{{
    "question": "Your interview question here",
    "category": "Technical/Behavioral/Situational",
    "difficulty": "Easy/Medium/Hard",
    "reasoning": "Why this question is appropriate now"
}}

Return ONLY the JSON object, no other text."""

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            # Extract JSON from response
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                text = text.split('```')[1].split('```')[0].strip()
            
            question_data = json.loads(text)
            
            return {
                "question": question_data.get("question", "Tell me about your experience."),
                "category": question_data.get("category", "General"),
                "difficulty": question_data.get("difficulty", "Medium"),
                "reasoning": question_data.get("reasoning", "")
            }
            
        except Exception as e:
            print(f"Error generating question: {e}")
            # Fallback questions based on question number
            fallback_questions = [
                {"question": "Tell me about yourself and your relevant experience.", "category": "Introduction", "difficulty": "Easy"},
                {"question": f"Why do you want to work at {company}?", "category": "Motivation", "difficulty": "Easy"},
                {"question": f"What skills do you have that make you suitable for the {job_title} role?", "category": "Technical", "difficulty": "Medium"},
                {"question": "Describe a challenging situation you faced and how you handled it.", "category": "Behavioral", "difficulty": "Medium"},
                {"question": "Where do you see yourself in 5 years?", "category": "Career Goals", "difficulty": "Easy"}
            ]
            idx = min(question_count, len(fallback_questions) - 1)
            return fallback_questions[idx]
    
    def evaluate_answer(self, question, answer, context):
        """Evaluate candidate's answer using Gemini"""
        
        job_title = context.get('job_title', 'Position')
        company = context.get('company', 'Company')
        
        prompt = f"""You are an expert interviewer evaluating a candidate's answer.

Role: {job_title}
Company: {company}

Question Asked:
"{question}"

Candidate's Answer:
"{answer}"

Evaluate this answer and provide structured feedback. Return ONLY a JSON object with this exact format:
{{
    "score": 7.5,
    "interviewer_assessment": "Detailed honest feedback on the answer",
    "what_question_tested": "What skills/knowledge this question evaluated",
    "specific_mistakes": ["Mistake 1", "Mistake 2"],
    "why_this_fails": "Explanation of why weak areas are problematic",
    "mentor_guidance": "Supportive advice for improvement",
    "how_to_improve": ["Improvement tip 1", "Improvement tip 2"],
    "model_answer": "Example of a strong answer to this question",
    "feedback": "Brief summary feedback"
}}

Score Guidelines:
- 9-10: Exceptional answer, industry expert level
- 7-8: Strong answer, good understanding
- 5-6: Adequate but missing key points
- 3-4: Weak answer, fundamental gaps
- 0-2: Poor answer, major misunderstandings

Return ONLY the JSON object, no other text."""

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            # Extract JSON from response
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                text = text.split('```')[1].split('```')[0].strip()
            
            evaluation = json.loads(text)
            
            return {
                "score": float(evaluation.get("score", 5.0)),
                "interviewer_assessment": evaluation.get("interviewer_assessment", "Answer received."),
                "what_question_tested": evaluation.get("what_question_tested", ""),
                "specific_mistakes": evaluation.get("specific_mistakes", []),
                "why_this_fails": evaluation.get("why_this_fails", ""),
                "mentor_guidance": evaluation.get("mentor_guidance", ""),
                "how_to_improve": evaluation.get("how_to_improve", []),
                "model_answer": evaluation.get("model_answer", ""),
                "feedback": evaluation.get("feedback", "Thank you for your answer.")
            }
            
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            # Fallback evaluation
            return {
                "score": 6.0,
                "interviewer_assessment": "Thank you for your answer. Consider providing more specific examples and details.",
                "feedback": "Answer received. Please continue.",
                "specific_mistakes": [],
                "how_to_improve": ["Provide more specific examples", "Be more detailed in your response"],
                "what_question_tested": "Communication and technical knowledge",
                "model_answer": "A strong answer would include specific examples and demonstrate clear understanding."
            }
    
    def generate_final_report(self, session_data):
        """Generate comprehensive final interview report"""
        
        candidate_name = session_data.get('candidate_name', 'Candidate')
        job_title = session_data.get('job_title', 'Position')
        company = session_data.get('company', 'Company')
        question_count = session_data.get('question_count', 0)
        
        # Calculate average score from answers
        answers = session_data.get('answers', [])
        if answers:
            scores = [a.get('evaluation', {}).get('score', 6.0) for a in answers if 'evaluation' in a]
            avg_score = sum(scores) / len(scores) if scores else 6.0
        else:
            avg_score = 6.0
        
        prompt = f"""You are an HR expert reviewing a completed interview.

Candidate: {candidate_name}
Role: {job_title}
Company: {company}
Questions Answered: {question_count}
Average Score: {avg_score:.1f}/10

Based on the interview performance, generate a final assessment. Return ONLY a JSON object:
{{
    "overall_score": 7.5,
    "summary": "Brief 2-3 sentence summary of performance",
    "strengths": ["Strength 1", "Strength 2"],
    "areas_for_improvement": ["Area 1", "Area 2"],
    "hiring_recommendation": "Strong Hire/Hire/Maybe/No Hire",
    "detailed_analysis": "Comprehensive paragraph about the candidate's performance"
}}

Return ONLY the JSON object, no other text."""

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            # Extract JSON from response
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                text = text.split('```')[1].split('```')[0].strip()
            
            report = json.loads(text)
            return report
            
        except Exception as e:
            print(f"Error generating report: {e}")
            # Fallback report
            recommendation = "Strong Hire" if avg_score >= 8 else "Hire" if avg_score >= 7 else "Maybe" if avg_score >= 6 else "No Hire"
            return {
                "overall_score": avg_score,
                "summary": f"Candidate completed {question_count} questions with an average score of {avg_score:.1f}/10.",
                "strengths": ["Good communication", "Professional demeanor"],
                "areas_for_improvement": ["Continue building experience", "Practice technical concepts"],
                "hiring_recommendation": recommendation,
                "detailed_analysis": f"{candidate_name} demonstrated adequate performance during the interview for {job_title} at {company}."
            }
