"""
AI Engine using Google Gemini - Question Generation & Feedback
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
        # Use gemini-2.5-flash (February 2026 - Latest fast model)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_next_question(self, context):
        """Generate next interview question using Gemini"""
        
        jd_context = context.get('jd_context', 'N/A')
        
        # Build job requirements section
        job_info = "Focus on general technical and behavioral competencies"
        if jd_context and jd_context != 'N/A':
            try:
                jd_data = json.loads(jd_context) if isinstance(jd_context, str) else jd_context
                original_jd = jd_data.get('original_jd', 'Not available')
                required_skills = jd_data.get('required_skills', [])
                
                job_info = f"""JOB DESCRIPTION:
{original_jd}

KEY SKILLS: {', '.join(required_skills)}

IMPORTANT: Questions MUST relate to the JD above. Focus on skills/technologies listed."""
            except:
                job_info = f"JOB DESCRIPTION:\n{jd_context}"
        
        prompt = f"""You are a professional interviewer conducting a technical interview.

Context:
- Role(s): {context['roles']}
- Company: {context.get('company', 'N/A')}
- Question Number: {context['question_count'] + 1}
- Previous Performance: {context.get('avg_score', 'N/A')}/10

{job_info}

INTERVIEW RULES:
1. NEVER repeat previous questions
2. Follow logical sequence:
   Q1-2: Background and motivation
   Q3-5: Fundamental technical skills
   Q6-8: Problem-solving scenarios
   Q9+: Advanced challenges

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
            # Fallback question
            return {
                "question": f"Can you tell me about your experience with {context['roles'][0]}?",
                "category": "General",
                "difficulty": "Medium",
                "reasoning": "General opening question"
            }
    
    def evaluate_answer(self, question, answer, context):
        """Evaluate candidate's answer using Gemini"""
        
        prompt = f"""You are an expert interviewer evaluating a candidate's answer.

Role: {context['roles']}
Company: {context.get('company', 'N/A')}

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
                "score": 5.0,
                "interviewer_assessment": "Thank you for your answer.",
                "feedback": "Answer received. Please continue.",
                "specific_mistakes": [],
                "how_to_improve": []
            }
    
    def parse_job_description(self, jd_text, company):
        """Parse job description to extract key requirements"""
        
        prompt = f"""Analyze this job description and extract key information.

Company: {company}

Job Description:
{jd_text}

Extract and return ONLY a JSON object with this format:
{{
    "original_jd": "full job description text",
    "required_skills": ["skill1", "skill2", "skill3"],
    "key_responsibilities": ["resp1", "resp2"],
    "experience_level": "Junior/Mid/Senior"
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
            
            parsed = json.loads(text)
            return parsed
            
        except Exception as e:
            print(f"Error parsing JD: {e}")
            return {
                "original_jd": jd_text,
                "required_skills": [],
                "key_responsibilities": [],
                "experience_level": "Mid"
            }
    
    def generate_final_report(self, session_data):
        """Generate comprehensive final interview report"""
        
        prompt = f"""You are an HR expert reviewing a completed interview.

Candidate: {session_data['candidate_name']}
Role: {session_data['roles']}
Company: {session_data.get('company', 'N/A')}
Questions Answered: {session_data['question_count']}
Average Score: {session_data['avg_score']}/10

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
            return {
                "overall_score": session_data['avg_score'],
                "summary": "Interview completed successfully.",
                "strengths": ["Good communication"],
                "areas_for_improvement": ["Continue practicing"],
                "hiring_recommendation": "Review recommended",
                "detailed_analysis": "Thank you for participating in the interview."
            }
