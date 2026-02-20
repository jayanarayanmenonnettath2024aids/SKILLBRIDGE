"""
Free AI Engine - No API Keys Required
Uses Sentence-BERT and local models for question generation and feedback
"""

import os
from dotenv import load_dotenv
import requests
import json
import random

load_dotenv()

class LlamaInterviewAI:
    def __init__(self):
        self.api_keys = [
            os.getenv("OPENROUTER_API_KEY_1"),
            os.getenv("OPENROUTER_API_KEY_2")
        ]
        self.api_keys = [k for k in self.api_keys if k and k != "your_first_api_key_here" and k != "your_second_api_key_here"]
        
        if not self.api_keys:
            raise ValueError("No valid OpenRouter API keys found in .env file")
        
        self.current_key_index = 0
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "meta-llama/llama-3.3-70b-instruct:free"
        print(f"✅ Llama 3.3 70B initialized with {len(self.api_keys)} API key(s)!")
    
    def _get_next_api_key(self):
        """Load balance between API keys"""
        key = self.api_keys[self.current_key_index]
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        return key
    
    def _call_llama(self, messages, temperature=0.7, max_retries=5):
        """Call Llama via OpenRouter with load balancing and retry logic"""
        import time
        
        for attempt in range(max_retries):
            try:
                headers = {
                    "Authorization": f"Bearer {self._get_next_api_key()}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com/interview-bot",
                    "X-Title": "Free Voice Interview Bot"
                }
                
                payload = {
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 2000  # Increased token limit
                }
                
                response = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
                
                # If rate limited, wait and retry
                if response.status_code == 429:
                    wait_time = (attempt + 1) * 3  # Exponential backoff: 3, 6, 9, 12, 15 seconds
                    print(f"⏳ Rate limit hit. Waiting {wait_time} seconds (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(wait_time)
                    continue
                
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
                
            except requests.exceptions.HTTPError as e:
                if attempt == max_retries - 1:
                    raise
                print(f"⚠️ Request failed (attempt {attempt + 1}/{max_retries}). Retrying...")
                time.sleep(2)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                print(f"⚠️ Error: {e}. Retrying...")
                time.sleep(2)
        
        raise Exception("Max retries exceeded")
    
    def research_roles(self, roles):
        """Research interview expectations using Llama"""
        roles_str = ", ".join(roles)
        
        prompt = f"""Analyze interview expectations for: {roles_str}

Provide:
1. Key technical skills required
2. Common interview topics
3. Interview focus areas
4. Expected technical depth

Format as JSON with keys: key_skills (array), common_topics (array), interview_focus (string), technical_depth (string)."""
        
        messages = [{"role": "user", "content": prompt}]
        response = self._call_llama(messages, temperature=0.3)
        
        try:
            return json.loads(response)
        except:
            return {
                "key_skills": ["problem solving", "technical knowledge", "communication"],
                "common_topics": ["experience", "projects", "challenges"],
                "interview_focus": "practical skills",
                "technical_depth": "medium"
            }
    
    def _extract_role_skills(self, role):
        """Extract key skills for role"""
        skill_map = {
            'machine learning': ['Python', 'TensorFlow', 'PyTorch', 'ML algorithms', 'statistics'],
            'blockchain': ['Solidity', 'smart contracts', 'cryptography', 'distributed systems'],
            'cloud': ['AWS/Azure/GCP', 'containerization', 'microservices', 'DevOps'],
            'security': ['penetration testing', 'encryption', 'network security', 'compliance'],
            'data': ['SQL', 'Python', 'data analysis', 'visualization', 'statistics'],
            'frontend': ['JavaScript', 'React/Vue/Angular', 'CSS', 'responsive design'],
            'backend': ['APIs', 'databases', 'server architecture', 'scalability'],
            'mobile': ['iOS/Android', 'mobile UI/UX', 'app architecture', 'performance'],
            'devops': ['CI/CD', 'Docker', 'Kubernetes', 'automation', 'monitoring'],
            'ai': ['neural networks', 'NLP', 'computer vision', 'deep learning']
        }
        
        skills = []
        for key, vals in skill_map.items():
            if key in role:
                skills.extend(vals)
        
        return skills if skills else ['problem solving', 'coding', 'system design', 'communication']
    
    def _extract_role_topics(self, role):
        """Extract common interview topics"""
        if 'data' in role or 'analyst' in role:
            return ['data cleaning', 'SQL queries', 'visualization', 'statistical analysis']
        elif 'machine learning' in role or 'ai' in role:
            return ['model training', 'feature engineering', 'evaluation metrics', 'deployment']
        elif 'security' in role or 'cyber' in role:
            return ['threat modeling', 'vulnerability assessment', 'incident response']
        elif 'cloud' in role or 'devops' in role:
            return ['infrastructure', 'automation', 'scalability', 'monitoring']
        else:
            return ['algorithms', 'system design', 'coding', 'problem solving']
    
    def _extract_interview_focus(self, role):
        """Determine interview focus areas"""
        if 'senior' in role or 'lead' in role or 'architect' in role:
            return 'architecture and leadership'
        elif 'junior' in role or 'entry' in role:
            return 'fundamentals and learning ability'
        else:
            return 'practical skills and experience'
    
    def _assess_technical_depth(self, role):
        """Assess expected technical depth"""
        if any(word in role for word in ['engineer', 'developer', 'architect', 'scientist']):
            return 'high'
        elif any(word in role for word in ['analyst', 'coordinator', 'associate']):
            return 'medium'
        else:
            return 'medium'
    
    def _load_role_knowledge(self):
        """Load general role knowledge base"""
        return {
            'technical_roles': ['engineer', 'developer', 'architect', 'scientist', 'analyst'],
            'leadership_roles': ['manager', 'lead', 'director', 'head'],
            'creative_roles': ['designer', 'ux', 'ui', 'creative'],
            'business_roles': ['product', 'business', 'marketing', 'sales']
        }
    
    def _load_question_templates(self):
        """Load question templates for different categories"""
        return {
            "HR": {
                "general": [
                    "Tell me about yourself and your background.",
                    "Why are you interested in this role?",
                    "What are your greatest strengths?",
                    "Describe a challenging situation you faced and how you handled it.",
                    "Where do you see yourself in 5 years?",
                    "Why should we hire you?",
                    "What motivates you in your work?",
                    "How do you handle criticism?",
                    "Describe your ideal work environment.",
                    "What's your biggest professional achievement?"
                ],
                "company_specific": {
                    "template": "Why do you want to work at {company} specifically?",
                    "culture": "How do you align with {company}'s values and culture?",
                    "knowledge": "What do you know about {company}'s products/services?"
                }
            },
            "Technical": {
                "Software Developer": [
                    "Explain the difference between object-oriented and functional programming.",
                    "How would you optimize a slow database query?",
                    "Describe your experience with version control systems like Git.",
                    "What's your approach to debugging complex issues?",
                    "Explain REST APIs and how you've used them.",
                    "How do you ensure code quality in your projects?",
                    "Describe a challenging technical problem you solved.",
                    "What design patterns have you used and why?",
                    "How do you stay updated with new technologies?",
                    "Explain the concept of technical debt."
                ],
                "Data Scientist": [
                    "Explain the bias-variance tradeoff.",
                    "How do you handle missing data in a dataset?",
                    "Describe your experience with machine learning algorithms.",
                    "What's the difference between supervised and unsupervised learning?",
                    "How do you validate a machine learning model?",
                    "Explain feature engineering and its importance.",
                    "Describe a data science project you're proud of.",
                    "How do you communicate technical findings to non-technical stakeholders?",
                    "What tools and libraries do you use for data analysis?",
                    "How do you handle imbalanced datasets?"
                ],
                "Data Analyst": [
                    "How do you approach data cleaning and preparation?",
                    "Explain SQL joins with examples.",
                    "What visualization tools have you used?",
                    "How do you identify trends and patterns in data?",
                    "Describe your experience with Excel/Python for analysis.",
                    "How do you ensure data accuracy?",
                    "What metrics would you track for [business problem]?",
                    "How do you present insights to stakeholders?",
                    "Describe a time when data analysis led to a business decision.",
                    "What's your approach to A/B testing?"
                ],
                "Product Manager": [
                    "How do you prioritize features in a product roadmap?",
                    "Describe your experience with agile methodologies.",
                    "How do you gather and validate user requirements?",
                    "What metrics do you use to measure product success?",
                    "How do you handle conflicting stakeholder priorities?",
                    "Describe a product you launched from concept to delivery.",
                    "How do you make data-driven product decisions?",
                    "What's your approach to user research?",
                    "How do you work with engineering teams?",
                    "Describe a failed product initiative and what you learned."
                ],
                "DevOps Engineer": [
                    "Explain CI/CD and your experience implementing it.",
                    "How do you approach infrastructure as code?",
                    "Describe your experience with containerization (Docker/Kubernetes).",
                    "How do you monitor and troubleshoot production systems?",
                    "What's your approach to security in DevOps?",
                    "Explain the concept of immutable infrastructure.",
                    "How do you handle deployment rollbacks?",
                    "Describe your experience with cloud platforms (AWS/Azure/GCP).",
                    "How do you optimize system performance?",
                    "What automation tools have you used?"
                ]
            },
            "Scenario": [
                "You have a tight deadline and limited resources. How do you prioritize?",
                "A team member consistently misses deadlines. How do you handle it?",
                "You disagree with your manager's technical decision. What do you do?",
                "How would you handle a situation where requirements change mid-project?",
                "Describe how you would onboard a new team member.",
                "You discover a critical bug in production. Walk me through your response.",
                "How do you handle multiple competing priorities?",
                "A stakeholder is unhappy with your work. How do you respond?",
                "You need to learn a new technology quickly. What's your approach?",
                "How would you improve a process that's inefficient?"
            ]
        }
    
    def generate_next_question(self, context):
        """Generate next question - STRICT RULES: Non-repetitive, Sequential, Adaptive"""
        
        question_count = context['question_count']
        roles = context['roles']
        company = context.get('company')
        history = context.get('history', [])
        avg_score = context.get('avg_score', 5)
        role_research = context.get('role_research', {})
        jd_context = context.get('jd_context')  # ✅ FIXED: Extract JD context
        
        # Extract all previously asked questions
        asked_questions = [h['question'].lower().strip() for h in history]
        asked_questions_str = "\n".join([f"{i+1}. {q}" for i, q in enumerate(asked_questions)])
        
        # Build detailed history
        history_details = []
        for i, h in enumerate(history[-3:]):
            history_details.append(
                f"Q{i+1}: {h['question']}\n"
                f"Answer: {h['answer'][:150]}...\n"
                f"Score: {h['score']}/10\n"
                f"Issue: {h.get('improvements', ['N/A'])[0] if h.get('improvements') else 'N/A'}"
            )
        history_str = "\n\n".join(history_details)
        
        # ✅ FIXED: Build job requirements section based on what's available
        if jd_context:
            # Mode 2: Use parsed job description
            # jd_context is a JSON string, parse it to get the original JD text
            try:
                jd_data = json.loads(jd_context) if isinstance(jd_context, str) else jd_context
                original_jd = jd_data.get('original_jd', 'Not available')
                required_skills = jd_data.get('required_skills', [])
                
                job_requirements = f"""━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 JOB DESCRIPTION - BASE ALL QUESTIONS ON THIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{original_jd}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY SKILLS DETECTED: {', '.join(required_skills)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 CRITICAL RULES:
✅ Ask questions ONLY about the skills and technologies mentioned in the JD above
✅ Match your questions to the actual job responsibilities described
❌ DO NOT ask about unrelated technologies or skills not in the JD
❌ If JD mentions "Python + ML", don't ask about web frameworks
❌ If JD says "data pipelines", don't ask about front-end development"""
            except:
                job_requirements = f"""JOB DESCRIPTION REQUIREMENTS:
{jd_context}

CRITICAL: Base questions on the JD content above."""
        elif role_research:
            # Mode 1: Use role research
            job_requirements = f"""Role-Specific Knowledge Required:
{json.dumps(role_research, indent=2)}"""
        else:
            # Fallback
            job_requirements = "Focus on general technical and behavioral competencies for the role"
        
        prompt = f"""You are a STRICT, PROFESSIONAL interviewer conducting a high-fidelity interview simulation.

Interview Status:
- Role(s): {', '.join(roles)}
- Company: {company or 'General'}
- Question Number: {question_count + 1}
- Performance Score: {avg_score:.1f}/10

{job_requirements}

Recent Interview History:
{history_str if history_str else 'Starting interview - ask about background and experience'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTIONS ALREADY ASKED (NEVER REPEAT):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{asked_questions_str if asked_questions_str else 'None - this is the first question'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY INTERVIEW RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NEVER REPEAT OR REPHRASE PREVIOUS QUESTIONS
   - Check the list above carefully
   - Ask about COMPLETELY different topics
   - No variations of previous questions

2. FOLLOW STRICT INTERVIEW SEQUENCE:
   Q1-2: Introduction, background ("Tell me about yourself", "Why this role?", "Why this company?")
   Q3-5: Fundamental technical skills ("Explain [core concept]", "What's your experience with [key tool]?")
   Q6-8: Problem-solving scenarios ("How would you handle [realistic situation]?", "Describe a challenge...")
   Q9-12: Advanced technical depth ("Design a [system]", "Optimize [problem]", "Explain [complex topic]")
   Q13+: Leadership, edge cases, cultural fit

3. ADAPT TO PERFORMANCE:
   - Score <5: Ask foundational/basic questions to assess fundamentals
   - Score 5-6: Ask standard technical questions
   - Score 7-8: Increase complexity, go deeper technically
   - Score 9-10: Ask expert-level architecture/design questions

4. ROLE-SPECIFIC QUESTIONS for {', '.join(roles)}:
   - Software Engineer: Algorithms, data structures, system design, debugging, code quality, testing
   - Data Scientist: ML algorithms, statistics, feature engineering, model evaluation, deployment
   - Product Manager: Prioritization, stakeholder management, metrics, user research, roadmapping
   - DevOps: CI/CD, infrastructure as code, monitoring, containerization, cloud platforms
   - Marketing Manager: Campaign strategy, analytics, budget management, team leadership
   
5. MAKE QUESTIONS SPECIFIC AND PRACTICAL:
   ✅ "Explain how you would implement authentication in a React app with JWT tokens"
   ✅ "Walk me through debugging a memory leak in a Node.js application"
   ❌ "Tell me about your experience with development"
   ❌ "What are your technical skills?"

6. REALISTIC INTERVIEW FEEL:
   - Sound natural, not robotic
   - Test different dimensions (technical + behavioral + scenario)
   - Build on previous answers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate the NEXT interview question now.

Return ONLY valid JSON (no markdown, no extra text):
{{
  "question": "<specific, non-generic, realistic question>",
  "category": "HR/Technical/Scenario",
  "difficulty": "Easy/Medium/Hard",
  "what_this_tests": "<specific skill/quality being evaluated>"
}}

REMEMBER: This is a HIGH-FIDELITY INTERVIEW SIMULATION, not a friendly chatbot."""

        messages = [{"role": "user", "content": prompt}]
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self._call_llama(messages, temperature=0.95)
                # Clean response
                response = response.strip()
                if response.startswith('```'):
                    response = response.split('```')[1]
                    if response.startswith('json'):
                        response = response[4:]
                response = response.strip()
                
                result = json.loads(response)
                new_question = result["question"].lower().strip()
                
                # Check if it's truly different
                is_duplicate = any(
                    self._similarity(new_question, asked) > 0.7 
                    for asked in asked_questions
                )
                
                if not is_duplicate:
                    return result
                    
            except Exception as e:
                if attempt == max_retries - 1:
                    # Fallback with guaranteed unique question based on question count
                    return self._get_fallback_question(question_count, roles, asked_questions)
        
        # Ultimate fallback
        return self._get_fallback_question(question_count, roles, asked_questions)
    
    def _get_fallback_question(self, question_count, roles, asked_questions):
        """Generate fallback question based on interview stage"""
        # Sequential fallback questions by stage
        stage_questions = {
            1: [
                "Tell me about your background and what brought you to this field.",
                "Walk me through your professional journey and key experiences.",
                "What sparked your interest in this role and why now?"
            ],
            2: [
                "Why are you interested in this specific position?",
                f"What attracts you to working as a {roles[0] if roles else 'professional'}?",
                "What are your strongest technical skills and how have you developed them?"
            ],
            3: [
                "Explain a technical concept you're expert in and how you've applied it.",
                "What development tools and technologies are you most comfortable with?",
                "Describe your approach to learning new technologies."
            ],
            4: [
                "Walk me through a challenging technical problem you solved recently.",
                "How do you approach debugging complex issues in production?",
                "Describe your experience with system design and architecture."
            ],
            5: [
                "How would you design a scalable solution for [common problem in your domain]?",
                "Explain how you would optimize performance in a production application.",
                "What's your approach to ensuring code quality and maintainability?"
            ],
            6: [
                "Describe a situation where you had to make a difficult technical trade-off.",
                "How do you handle competing priorities and tight deadlines?",
                "Tell me about a time you had to work with a difficult team member."
            ],
            7: [
                "How do you stay current with industry trends and emerging technologies?",
                "What's your approach to mentoring junior developers?",
                "Describe how you've contributed to improving team processes."
            ],
            8: [
                "What's the most complex system you've architected and why?",
                "How do you approach technical decision-making at scale?",
                "Describe your leadership style and how you influence without authority."
            ]
        }
        
        # Determine stage
        stage = min((question_count // 2) + 1, 8)
        questions = stage_questions.get(stage, stage_questions[8])
        
        # Find first unique question
        for q in questions:
            if q.lower() not in asked_questions:
                difficulty = "Easy" if stage <= 2 else "Medium" if stage <= 5 else "Hard"
                category = "HR" if stage <= 2 else "Technical" if stage <= 5 else "Scenario"
                return {
                    "question": q,
                    "category": category,
                    "difficulty": difficulty,
                    "what_this_tests": f"Stage {stage} competency"
                }
        
        # Ultimate unique fallback
        return {
            "question": f"What's the most significant professional challenge you've overcome in your {roles[0] if roles else 'career'} journey?",
            "category": "Scenario",
            "difficulty": "Medium",
            "what_this_tests": "Problem-solving and resilience"
        }
    
    def _similarity(self, text1, text2):
        """Simple similarity check"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        if not words1 or not words2:
            return 0
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union)
    
    def evaluate_answer(self, question, answer, context):
        """STRICT INTERVIEWER + SUPPORTIVE MENTOR evaluation - Dual-mode feedback"""
        
        prompt = f"""You are DUAL-ROLE evaluator: STRICT INTERVIEWER + SUPPORTIVE MENTOR

ROLE: {', '.join(context.get('roles', ['Professional']))}
QUESTION: {question}
CANDIDATE'S ANSWER: {answer}

IMPORTANT: Address the candidate directly using "you" and "your" (NOT "the candidate" or "their").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: STRICT INTERVIEWER ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Evaluate as a REAL, HARSH interviewer would (address directly as "you"):

1. Score 1-10 (BE BRUTAL - bad answers deserve 1-3, NOT 5-6)
2. If answer is:
   - IRRELEVANT → State: "Your answer is completely off-topic"
   - INCORRECT → State: "Your response contains factual errors"
   - VAGUE → State: "Your answer is too generic and lacks substance"
   - IMMATURE → State: "Your response shows lack of professional experience"
   - UNPROFESSIONAL → State: "Your answer is not interview-appropriate"

3. Identify EACH specific mistake in their answer:
   ❌ Missing critical information
   ❌ Factually incorrect statements
   ❌ Vague generalizations without examples
   ❌ Poor structure or rambling
   ❌ Lack of metrics or concrete details
   ❌ Unprofessional language

4. Explain: What was this question REALLY testing?
5. Would this concern a real interviewer? BE HONEST.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2: CONSTRUCTIVE MENTOR GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now switch to CALM, SUPPORTIVE MENTOR mode (still address as "you"):

1. Respectful, learning-focused guidance
2. Step-by-step improvement strategy
3. Specific frameworks to use:
   - STAR (Situation, Task, Action, Result)
   - PAR (Problem, Action, Result)
   - CAR (Challenge, Action, Result)
4. How to structure better responses
5. Clear examples of what "good" looks like

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3: MODEL ANSWER (LEARNING EXAMPLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide detailed MODEL ANSWER showing:
✅ Proper structure (STAR/PAR format)
✅ Specific examples with metrics (numbers, percentages, timelines)
✅ Professional language
✅ Complete coverage of what was asked
✅ Clear beginning, middle, end

Return ONLY valid JSON (no markdown):
{{
  "score": <1-10, BE STRICT - weak answers get 1-3, not 5>,
  "interviewer_assessment": "<BRUTALLY HONEST evaluation using 'you/your' - identify ALL failures clearly>",
  "what_question_tested": "<what skill/quality this question evaluated>",
  "specific_mistakes": [
    "Mistake 1: <exact issue with your answer>",
    "Mistake 2: <exact issue with your answer>",
    "Mistake 3: <exact issue with your answer>"
  ],
  "why_this_fails": "<why these mistakes concern a real interviewer, using 'you/your'>",
  "mentor_guidance": "<CALM, SUPPORTIVE, step-by-step advice using 'you' - respectful tone>",
  "how_to_improve": [
    "Step 1: <specific actionable improvement using 'you'>",
    "Step 2: <specific actionable improvement using 'you'>",
    "Step 3: <specific actionable improvement using 'you'>"
  ],
  "model_answer": "<DETAILED example of STRONG answer with structure, specifics, metrics, professional language>",
  "strengths": ["<specific strength if any - be honest, empty if none>"],
  "improvements": ["<priority fix 1>", "<priority fix 2>"],
  "next_focus": "<what to probe or reinforce next>"
}}

CRITICAL RULES:
❌ NO sugar-coating weak answers
❌ NO inflated scores for poor responses
❌ NO generic motivational phrases
❌ DO NOT use "the candidate" - use "you/your"
✅ Interviewer section = BRUTALLY HONEST (using "you")
✅ Mentor section = SUPPORTIVE but CLEAR (using "you")
✅ Be SPECIFIC in all sections"""

        messages = [{"role": "user", "content": prompt}]
        response = self._call_llama(messages, temperature=0.6)
        
        try:
            # Clean response
            response = response.strip()
            if response.startswith('```'):
                response = response.split('```')[1]
                if response.startswith('json'):
                    response = response[4:]
            response = response.strip()
            
            result = json.loads(response)
            
            # Ensure strict scoring - don't let AI be too generous
            if result["score"] > 6 and len(result.get("specific_mistakes", [])) >= 3:
                result["score"] = max(3, result["score"] - 2)
            
            return result
            
        except Exception as e:
            # Fallback with strict evaluation
            return {
                "score": 3.0,
                "interviewer_assessment": "Answer needs significant improvement. Lacks specificity, structure, and concrete examples. This would raise concerns in a real interview.",
                "what_question_tested": "Ability to communicate clearly and demonstrate relevant experience",
                "specific_mistakes": [
                    "Too vague - no concrete examples provided",
                    "Missing technical details",
                    "No clear structure or flow"
                ],
                "how_to_avoid": [
                    "Add specific examples: 'In project X, I did Y which resulted in Z'",
                    "Include technical terms and tools used",
                    "Use STAR method: Situation, Task, Action, Result"
                ],
                "mentor_guidance": "Start by clearly stating your main point. Then support it with a specific example including what you did, how you did it, and what the outcome was. End with what you learned.",
                "model_answer": "A strong answer would include: 1) Clear opening statement, 2) Specific example with context, 3) Your actions and decisions, 4) Quantifiable results, 5) Key learning or takeaway.",
                "strengths": ["Attempted to answer the question"],
                "improvements": ["Add concrete examples", "Include metrics and results", "Structure answer clearly"],
                "next_focus": "Focus on specificity and structure"
            }
    
    def _strict_interviewer_evaluation(self, answer, score, is_irrelevant, is_too_short, is_vague, lacks_structure, similarity, context):
        """STRICT, HONEST evaluation - no sugarcoating"""
        
        if is_irrelevant:
            return f"❌ This answer misses the point entirely. The question was testing your understanding of [specific concept], but your response doesn't address it. Relevance score: {similarity*100:.0f}%. In a real interview, this would raise serious concerns about your comprehension."
        
        if is_too_short:
            return f"❌ This answer is far too brief ({len(answer.split())} words). Real interviewers expect 100-200 word responses with depth. This looks like you either don't know the answer or aren't taking the question seriously."
        
        if is_vague and lacks_structure:
            return f"⚠️ This answer is too generic and unstructured. You're speaking in generalities without concrete examples or clear logic. Interviewers can immediately tell when candidates are avoiding specifics because they lack real experience."
        
        if score < 5:
            return f"⚠️ This answer demonstrates weak understanding. The interviewer was looking for [specific elements], but your response lacks depth, examples, and technical accuracy. This would likely lead to follow-up probing questions or concern about your qualifications."
        
        if score < 7:
            return f"Acceptable but not impressive. Your answer covers basics but lacks the depth and examples that distinguish strong candidates. In competitive interviews, this level of response puts you at risk."
        
        if score < 8.5:
            return f"Good answer with solid foundation. You demonstrate understanding and provide relevant information. However, top candidates would add more specific examples, metrics, or deeper technical insights."
        
        return f"Excellent response. You demonstrated strong understanding, provided specific examples, and communicated clearly. This is the caliber of answer that impresses interviewers."
    
    def _supportive_mentor_guidance(self, answer, score, has_examples, has_metrics, has_structure, context):
        """CONSTRUCTIVE, SUPPORTIVE guidance for improvement"""
        
        guidance = []
        
        if score < 5:
            guidance.append("Let's rebuild this answer together. Start by clearly stating your main point in one sentence.")
            guidance.append("Then, support it with a specific example from your experience - what did you do, how did you do it, what was the result?")
        
        if not has_examples:
            guidance.append("Add a concrete example: 'For instance, when I worked on [project], I [action] which resulted in [outcome].'")
        
        if not has_metrics:
            guidance.append("Quantify your impact: Instead of 'improved performance', say 'reduced load time by 40% from 5s to 3s'.")
        
        if not has_structure:
            guidance.append("Structure your answer using STAR: Situation (context), Task (challenge), Action (what you did), Result (outcome).")
        
        if score >= 7:
            guidance.append("You're on the right track. To elevate this further, add more technical depth or discuss trade-offs you considered.")
        
        if not guidance:
            guidance.append("Strong answer. Keep this level of detail and specificity for remaining questions.")
        
        return " ".join(guidance)
    
    def _generate_model_answer(self, question, context):
        """Generate example of strong answer"""
        
        role = context.get('roles', ['Professional'])[0]
        
        return f"Example strong answer: [Specific opening statement]. For instance, in my role as {role}, I [concrete example with context]. I approached this by [clear methodology]. The result was [quantified outcome]. This experience taught me [key learning]."
    
    def _identify_strengths(self, answer, has_examples, has_structure, has_metrics):
        """Identify specific strengths - honest assessment"""
        strengths = []
        
        if has_examples:
            strengths.append("Provided concrete examples from real experience")
        if has_structure:
            strengths.append("Clear logical structure and flow")
        if has_metrics:
            strengths.append("Included quantifiable results and metrics")
        if len(answer.split()) > 100:
            strengths.append("Comprehensive and detailed response")
        if any(word in answer.lower() for word in ['challenge', 'problem', 'solved', 'improved']):
            strengths.append("Demonstrated problem-solving approach")
        
        if not strengths:
            strengths = ["Attempted to answer the question"]
        
        return strengths[:3] if strengths else ["Needs significant improvement across all areas"]
    
    def _identify_improvements(self, answer, score, has_examples, has_structure):
        """Identify areas for improvement"""
        improvements = []
        
        if not has_examples:
            improvements.append("Add specific examples or experiences to illustrate your points")
        if not has_structure:
            improvements.append("Use a clearer structure (e.g., STAR method: Situation, Task, Action, Result)")
        if len(answer.split()) < 50:
            improvements.append("Provide more detailed and comprehensive answers")
        if score < 6:
            improvements.append("Demonstrate deeper technical knowledge or more relevant experience")
        
        if not improvements:
            improvements = ["Consider adding more quantifiable results", "Expand on the business impact"]
        
        return improvements[:3]
    
    def _get_insight(self, answer, context):
        """Get insight about candidate"""
        insights = [
            "Shows practical experience and hands-on knowledge",
            "Demonstrates good communication skills",
            "Indicates strong problem-solving approach",
            "Reveals attention to detail and thoroughness",
            "Shows ability to learn and adapt"
        ]
        return random.choice(insights)
    
    def _suggest_next_focus(self, score, context):
        """Suggest what to probe next"""
        if score >= 8:
            return "Explore more complex scenarios or technical depth"
        elif score >= 6:
            return "Probe for specific examples and deeper understanding"
        else:
            return "Assess foundational knowledge and basic competencies"
    
    def parse_job_description(self, jd_text, company):
        """Parse JD using keyword extraction - KEEP ORIGINAL TEXT"""
        
        jd_lower = jd_text.lower()
        
        # Common skill keywords
        tech_skills = ['python', 'java', 'javascript', 'sql', 'aws', 'azure', 'docker', 'kubernetes', 
                       'react', 'angular', 'node', 'machine learning', 'data analysis', 'agile',
                       'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'api', 'backend',
                       'regression', 'classification', 'data pipeline', 'model deployment']
        
        soft_skills = ['communication', 'leadership', 'teamwork', 'problem-solving', 'analytical']
        
        found_tech = [skill for skill in tech_skills if skill in jd_lower]
        found_soft = [skill for skill in soft_skills if skill in jd_lower]
        
        # Determine experience level
        if 'senior' in jd_lower or '5+ years' in jd_lower or '7+ years' in jd_lower:
            exp_level = "Senior"
        elif 'junior' in jd_lower or 'entry' in jd_lower or '0-2 years' in jd_lower or 'early-career' in jd_lower:
            exp_level = "Junior"
        else:
            exp_level = "Mid"
        
        # ✅ CRITICAL FIX: Return the FULL JD text, not just extracted keywords
        return {
            "original_jd": jd_text,  # ✅ Keep full text for AI to reference
            "required_skills": found_tech[:10],  # More skills
            "preferred_skills": found_soft[:3],
            "tools_technologies": found_tech,
            "experience_level": exp_level,
            "key_focus_areas": found_tech[:5] if found_tech else ["technical skills", "problem solving"],
            "company_values": ["innovation", "collaboration", "excellence"]
        }
    
    def generate_final_report(self, session_data):
        """Generate STRICT PANEL FEEDBACK - Final Interview Assessment"""
        
        avg_score = session_data['avg_score']
        question_count = session_data['question_count']
        candidate_name = session_data.get('candidate_name', 'Candidate')
        roles = session_data.get('roles', ['Professional'])
        
        # Build complete history string
        history_summary = []
        for i, item in enumerate(session_data['history'], 1):
            history_summary.append(
                f"Q{i}: {item['question']}\n"
                f"Score: {item['score']}/10\n"
                f"Key Issue: {item.get('improvements', ['N/A'])[0] if item.get('improvements') else 'N/A'}"
            )
        history_str = "\n\n".join(history_summary)
        
        prompt = f"""You are an INTERVIEW PANEL providing final assessment after completing an interview.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Candidate: {candidate_name}
Role(s): {', '.join(roles)}
Questions Asked: {question_count}
Average Score: {avg_score:.1f}/10

Performance Record:
{history_str}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVIDE HONEST PANEL FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

As an interview panel, provide feedback DIRECTLY TO THE CANDIDATE (use "you", not "the candidate"):

1. OVERALL INTERVIEW SCORE (X/10)
   - Be realistic based on performance
   - Consider: technical skills, communication, depth of experience

2. HONEST ASSESSMENT (2-3 paragraphs)
   - Address the candidate directly using "you"
   - What impressed the panel (be specific)
   - What raised concerns (be direct)
   - Overall impression and readiness

3. TOP STRENGTHS (3-5 items)
   - Specific strengths demonstrated
   - Reference actual answer quality
   - Be honest - if none, say basic competencies

4. CRITICAL GAPS (3-5 items)
   - Significant weaknesses identified
   - Patterns of concern
   - Areas that need work

5. READINESS VERDICT (choose one):
   - "Not Ready" = Needs 3-6 months intensive preparation
   - "Needs Practice" = Needs 1-2 months focused improvement
   - "Interview Ready" = Can interview but needs polish
   - "Strong Candidate" = Would likely advance to next round
   - "Outstanding" = Would recommend for hire

6. SPECIFIC RECOMMENDATIONS (5-7 items)
   - Concrete, actionable advice (address as "you")
   - Topics to study
   - Skills to practice
   - Preparation strategies

7. SUCCESS PROBABILITY
   - Realistic % for similar interviews
   - Clear reasoning

8. PANEL VERDICT
   - Final decision statement addressing the candidate directly
   - Use "you" not "candidate"

Return ONLY valid JSON:
{{
  "overall_score": "<X/10 - justification>",
  "overall_assessment": "<2-3 honest paragraphs addressing candidate as 'you'>",
  "readiness_level": "Not Ready/Needs Practice/Interview Ready/Strong Candidate/Outstanding",
  "top_strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "critical_gaps": [
    "<gap 1>",
    "<gap 2>",
    "<gap 3>"
  ],
  "specific_recommendations": [
    "<recommendation 1 using 'you'>",
    "<recommendation 2 using 'you'>",
    "<recommendation 3 using 'you'>",
    "<recommendation 4 using 'you'>",
    "<recommendation 5 using 'you'>"
  ],
  "estimated_success_probability": "<X% - reasoning>",
  "panel_verdict": "<final honest decision addressing candidate as 'you'>"
}}

Be REALISTIC and HONEST like a real interview panel would be. Always use second person ("you") when addressing the candidate."""

        try:
            messages = [{"role": "user", "content": prompt}]
            response = self._call_llama(messages, temperature=0.5)
            
            # Clean response
            response = response.strip()
            if response.startswith('```'):
                response = response.split('```')[1]
                if response.startswith('json'):
                    response = response[4:]
            response = response.strip()
            
            return json.loads(response)
            
        except Exception as e:
            # Fallback assessment based on score
            if avg_score >= 8:
                readiness = "Strong Candidate"
                probability = "75-85% - High likelihood of success with this performance level"
                assessment = f"Strong performance across {question_count} questions. You demonstrated solid technical knowledge, good communication skills, and relevant experience. Your responses were generally well-structured with specific examples. Minor areas for improvement identified but you are overall interview-ready."
            elif avg_score >= 6.5:
                readiness = "Interview Ready"
                probability = "60-70% - Competitive with focused preparation on weak areas"
                assessment = f"Adequate performance with average score of {avg_score:.1f}/10. You show foundational competency but your responses lacked consistent depth and specific examples. Communication was acceptable but needs refinement. With targeted practice on identified gaps, you should be competitive."
            elif avg_score >= 5:
                readiness = "Needs Practice"
                probability = "40-50% - Requires 1-2 months focused improvement"
                assessment = f"Below average performance indicating need for substantial practice. You demonstrated basic understanding but struggled with depth, examples, and structure. Your technical knowledge needs strengthening. We recommend intensive mock interviews and technical review before real interviews."
            else:
                readiness = "Not Ready"
                probability = "20-30% - Needs 3-6 months intensive preparation"
                assessment = f"Weak performance across {question_count} questions. You showed significant gaps in technical knowledge, communication, and interview readiness. Your responses lacked specificity, structure, and depth. We strongly recommend delaying real interviews and focusing on fundamental skill-building and extensive practice."
            
            # Extract from history
            all_strengths = []
            all_gaps = []
            for item in session_data['history']:
                all_strengths.extend(item.get('strengths', []))
                all_gaps.extend(item.get('improvements', []))
            
            top_strengths = list(dict.fromkeys(all_strengths))[:3] or ["Completed interview", "Attempted all questions", "Basic communication"]
            critical_gaps = list(dict.fromkeys(all_gaps))[:3] or ["Lacks specific examples", "Needs technical depth", "Poor answer structure"]
            
            return {
                "overall_score": f"{avg_score:.1f}/10 - Based on {question_count} questions",
                "overall_assessment": assessment,
                "readiness_level": readiness,
                "top_strengths": top_strengths,
                "critical_gaps": critical_gaps,
                "specific_recommendations": [
                    "Practice STAR method (Situation, Task, Action, Result) for all behavioral questions",
                    "Prepare 5-7 detailed project examples with quantifiable metrics and outcomes",
                    f"Review core technical concepts for {roles[0]} role with focus on fundamentals",
                    "Conduct 10-15 mock interviews with peers or mentors for structured feedback",
                    "Record and review your answers to identify verbal patterns and improve clarity"
                ],
                "estimated_success_probability": probability,
                "panel_verdict": f"Panel recommendation: {readiness}. You should {'proceed with real interviews' if avg_score >= 7 else 'focus on preparation before interviewing'}."
            }
