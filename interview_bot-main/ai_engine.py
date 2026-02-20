"""
AI Engine - Question Generation & Feedback
Uses OpenAI for dynamic, context-aware interview flow
"""

import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

class InterviewAI:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY required")
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4o-mini"
    
    def generate_next_question(self, context):
        """Generate next question - STRICT RULES: Non-repetitive, Logical sequence, Adaptive"""
        
        # ✅ Extract JD context and format it properly
        jd_context = context.get('jd_context', 'N/A')
        role_research = context.get('role_research', {})
        
        # Build job requirements section
        if jd_context and jd_context != 'N/A':
            # jd_context is a JSON string from adaptive_session, parse it
            try:
                jd_data = json.loads(jd_context) if isinstance(jd_context, str) else jd_context
                original_jd = jd_data.get('original_jd', 'Not available')
                required_skills = jd_data.get('required_skills', [])
                
                job_info = f"""━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 JOB DESCRIPTION - BASE ALL QUESTIONS ON THIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{original_jd}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY SKILLS: {', '.join(required_skills)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 CRITICAL RULES:
✅ Questions MUST relate to the JD above
✅ Focus on skills/technologies listed in JD
❌ DO NOT ask about unrelated topics
❌ Match the JD's actual requirements"""
            except:
                job_info = f"""JOB DESCRIPTION:
{jd_context}

Base questions on JD content above."""
        elif role_research:
            job_info = f"""Role-Specific Knowledge Required:
{role_research}"""
        else:
            job_info = "Focus on general technical and behavioral competencies"
        
        prompt = f"""You are a STRICT, PROFESSIONAL interviewer conducting a high-fidelity interview simulation.

Context:
- Mode: {context['mode']}
- Role(s): {context['roles']}
- Company: {context.get('company', 'N/A')}
- Question Number: {context['question_count'] + 1}
- Previous Performance: {context.get('avg_score', 'N/A')}/10

Recent Conversation History:
{self._format_history(context['history'][-3:])}

{job_info}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY INTERVIEW RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NEVER REPEAT QUESTIONS
   - Check conversation history
   - Ask completely different topics
   - No rephrasing of previous questions

2. FOLLOW LOGICAL INTERVIEW SEQUENCE:
   Q1-2: Introduction, background, motivation ("Tell me about yourself", "Why this role?")
   Q3-5: Fundamental technical skills for the role
   Q6-8: Deeper technical scenarios, problem-solving
   Q9-12: Advanced challenges, architecture, leadership
   Q13+: Edge cases, system thinking, cultural fit

3. ADAPT TO PERFORMANCE:
   - Weak answers (score <6) → Ask foundational/corrective questions
   - Strong answers (score ≥7) → Increase complexity, go deeper
   - Mixed performance → Probe weak areas identified

4. ROLE-SPECIFIC QUESTIONS:
   - Software Engineer: Algorithms, system design, debugging, code quality
   - Data Scientist: ML models, statistics, feature engineering, deployment
   - Product Manager: Prioritization, stakeholder management, metrics
   - DevOps: CI/CD, infrastructure, monitoring, automation
   - Make questions PRACTICAL and SCENARIO-BASED

5. REALISTIC INTERVIEW FEEL:
   - Questions should sound natural
   - Test different dimensions (technical + behavioral + scenario)
   - Build on previous responses

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate the NEXT interview question now.

Return JSON:
{{
    "question": "<the specific question - natural, realistic, non-generic>",
    "category": "HR/Technical/Scenario",
    "difficulty": "Easy/Medium/Hard",
    "what_this_tests": "<specific skill/quality being evaluated>",
    "reasoning": "<why asking this question now based on interview flow and performance>"
}}

REMEMBER: This must feel like a REAL interview, not a chatbot conversation."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a STRICT, PROFESSIONAL interviewer who asks adaptive, non-repetitive, logically sequenced questions. This is a high-fidelity interview simulation, not friendly conversation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def evaluate_answer(self, question, answer, context):
        """Generate strict interviewer evaluation + constructive mentor guidance"""
        
        prompt = f"""You are DUAL-ROLE evaluator: STRICT INTERVIEWER + SUPPORTIVE MENTOR

Question: {question}
Category: {context.get('category', 'General')}
Candidate's Answer: {answer}

Interview Context:
- Role(s): {context['roles']}
- Company: {context.get('company', 'N/A')}
- Question #{context['question_count']}
- Previous performance: {context.get('performance_trend', 'N/A')}

IMPORTANT: Address the candidate directly using "you" and "your" (NOT "the candidate" or "their").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: STRICT INTERVIEWER ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Evaluate as a REAL, HARSH interviewer would (address directly as "you"):

1. Score 1-10 (BE STRICT - bad answers deserve 1-3)
2. If answer is IRRELEVANT, INCORRECT, VAGUE, or IMMATURE:
   → STATE IT DIRECTLY using "your answer" not "this answer"
   → NO sugar-coating
   → NO motivational fluff
3. Identify EACH specific mistake in their answer:
   - Missing critical information
   - Factually incorrect statements
   - Vague generalizations without examples
   - Poor structure or rambling
   - Unprofessional language
4. Explain what the question REALLY tested
5. Would this concern a real interviewer? BE HONEST.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2: CONSTRUCTIVE MENTOR GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now switch to SUPPORTIVE MENTOR mode (address as "you"):

1. Calm, respectful improvement advice
2. Step-by-step correction strategy
3. Specific frameworks to use (STAR, PAR, etc.)
4. How to structure better responses
5. Concrete examples of improvement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3: MODEL ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide a detailed MODEL ANSWER showing:
- Proper structure
- Specific examples with metrics
- Professional language
- Complete coverage of what was asked

Return JSON:
{{
    "score": <1-10, STRICT>,
    "interviewer_assessment": "<brutal honesty using 'you/your' - identify ALL mistakes clearly>",
    "what_question_tested": "<what skill/quality this question evaluated>",
    "specific_mistakes": [
        "Mistake 1: <exact issue with your answer>",
        "Mistake 2: <exact issue with your answer>",
        "Mistake 3: <exact issue with your answer>"
    ],
    "why_this_fails": "<why these mistakes would concern a real interviewer, using 'you/your'>",
    "mentor_guidance": "<calm, supportive, step-by-step advice using 'you' for improvement>",
    "how_to_improve": [
        "Step 1: <specific actionable improvement using 'you'>",
        "Step 2: <specific actionable improvement using 'you'>",
        "Step 3: <specific actionable improvement using 'you'>"
    ],
    "model_answer": "<detailed example of a STRONG answer with specifics, metrics, structure>",
    "strengths": ["<specific strength if any>", "<specific strength if any>"],
    "improvements": ["<priority improvement 1>", "<priority improvement 2>"],
    "follow_up_insight": "<what this answer reveals about readiness, using 'you'>",
    "next_focus": "<what to probe or reinforce next>"
}}

CRITICAL: 
- Interviewer section = BRUTALLY HONEST (using "you")
- Mentor section = SUPPORTIVE but CLEAR (using "you")
- No generic praise for weak answers
- DO NOT use "the candidate" - use "you/your"
- Be specific in ALL sections"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a dual-role evaluator: STRICT INTERVIEWER who identifies failures honestly + SUPPORTIVE MENTOR who guides improvement clearly."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def parse_job_description(self, jd_text, company):
        """Parse JD to extract key requirements - KEEP ORIGINAL TEXT"""
        
        prompt = f"""Analyze this job description for {company}:

{jd_text}

Extract and return JSON (MUST include original_jd field):
{{
    "original_jd": "<full original job description text>",
    "required_skills": ["skill1", "skill2", ...],
    "preferred_skills": ["skill1", "skill2", ...],
    "responsibilities": ["resp1", "resp2", ...],
    "tools_technologies": ["tool1", "tool2", ...],
    "experience_level": "Junior/Mid/Senior",
    "key_focus_areas": ["area1", "area2", ...],
    "company_values": ["value1", "value2", ...]
}}"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert at analyzing job descriptions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        # ✅ Ensure original JD is included (fallback if AI didn't include it)
        if 'original_jd' not in result:
            result['original_jd'] = jd_text
        return result
    
    def generate_final_report(self, session_data):
        """Generate comprehensive interview report - STRICT PANEL FEEDBACK FORMAT"""
        
        prompt = f"""You are an INTERVIEW PANEL providing post-interview assessment feedback.

Interview Summary:
- Candidate: {session_data['candidate_name']}
- Role(s): {session_data['roles']}
- Company: {session_data.get('company', 'N/A')}
- Total Questions: {session_data['question_count']}
- Average Score: {session_data['avg_score']:.1f}/10

Complete Performance Record:
{self._format_history(session_data['history'])}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVIDE PANEL FEEDBACK AS IF THIS WAS A REAL INTERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: Address the candidate directly using "you" and "your" (NOT "the candidate").

Your assessment must include:

1. OVERALL INTERVIEW SCORE (X/10)
   - Be brutally honest
   - Consider: technical competency, communication, readiness

2. HONEST OVERALL ASSESSMENT (address as "you")
   - 2-3 paragraphs of realistic feedback
   - What impressed the panel (using "you")
   - What raised concerns (using "you")
   - Overall impression

3. IDENTIFIED STRENGTHS (address as "you")
   - List specific strengths you demonstrated
   - Be concrete, reference actual answers

4. MAJOR WEAKNESSES / GAPS (address as "you")
   - List critical gaps you showed
   - Areas of concern for the role
   - Patterns of weakness

5. ROLE READINESS VERDICT
   - Not Ready: Needs significant preparation
   - Needs Practice: Has basics but needs refinement
   - Interview Ready: Can interview but needs polish
   - Strong Candidate: Would advance to next round
   - Outstanding: Would recommend for hire

6. CLEAR NEXT STEPS (address as "you")
   - Specific, actionable recommendations
   - Topics you should study
   - Skills you should develop
   - Practice strategies

7. ESTIMATED SUCCESS PROBABILITY
   - Realistic % chance of passing similar interviews
   - Reasoning for estimate

Generate JSON:
{{
    "overall_score": "<X/10 with one-line justification>",
    "overall_assessment": "<2-3 paragraphs addressing candidate as 'you' - honest, panel-style feedback>",
    "readiness_level": "Not Ready/Needs Practice/Interview Ready/Strong Candidate/Outstanding",
    "top_strengths": [
        "<strength 1 you demonstrated>",
        "<strength 2 you demonstrated>",
        "<strength 3 you demonstrated>"
    ],
    "critical_gaps": [
        "<gap 1 you showed>",
        "<gap 2 you showed>",
        "<gap 3 you showed>"
    ],
    "specific_recommendations": [
        "<actionable step 1 for you>",
        "<actionable step 2 for you>",
        "<actionable step 3 for you>",
        "<actionable step 4 for you>",
        "<actionable step 5 for you>"
    ],
    "estimated_success_probability": "<X% - reasoning why>",
    "panel_verdict": "<final honest verdict addressing you directly>"
}}

Remember: Address candidate as "you/your" throughout. This should feel like REAL panel feedback after a REAL interview."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an interview panel providing honest, actionable post-interview feedback directly to the candidate using 'you/your'. Be realistic and direct like a real hiring panel would be."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _format_history(self, history):
        """Format conversation history for context"""
        formatted = []
        for i, item in enumerate(history, 1):
            formatted.append(f"Q{i}: {item['question']}")
            formatted.append(f"A{i}: {item['answer'][:200]}...")
            formatted.append(f"Score: {item.get('score', 'N/A')}/10\n")
        return "\n".join(formatted)
