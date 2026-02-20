"""
Gemini API Service for Resume Analysis
This service handles all AI-powered resume analysis using Google's Gemini API
"""

import os
import google.generativeai as genai
from typing import Dict, Any, List
import json
import PyPDF2
import requests
from io import BytesIO
import time

class GeminiService:
    """Service class for Gemini API integration with automatic key rotation"""
    
    def __init__(self, api_key: str = None):
        """
        Initialize Gemini service with API key rotation support
        
        Args:
            api_key: Gemini API key (if None, reads from environment)
        """
        # Load all available API keys
        self.api_keys = []
        if api_key:
            self.api_keys.append(api_key)
        else:
            # Load all API keys from environment
            for key_name in ['GEMINI_API_KEY', 'GEMINI_API_KEY_1', 'GEMINI_API_KEY_2']:
                key = os.getenv(key_name)
                if key:
                    self.api_keys.append(key)
        
        if not self.api_keys:
            raise ValueError("No Gemini API keys found. Set GEMINI_API_KEY environment variable.")
        
        print(f"✅ Loaded {len(self.api_keys)} Gemini API key(s)")
        
        self.current_key_index = 0
        self.api_key = self.api_keys[self.current_key_index]
        
        genai.configure(api_key=self.api_key)
        # Use gemini-pro-latest (stable, capable model)
        self.model = genai.GenerativeModel('gemini-pro-latest')
    
    def _rotate_api_key(self):
        """Rotate to the next API key"""
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        self.api_key = self.api_keys[self.current_key_index]
        print(f"🔄 Rotating to API key #{self.current_key_index + 1}")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro-latest')
    
    def _call_with_retry(self, prompt: str, max_retries: int = None) -> str:
        """
        Call Gemini API with automatic retry and key rotation on quota errors
        
        Args:
            prompt: The prompt to send to Gemini
            max_retries: Maximum number of retries (defaults to number of API keys)
        
        Returns:
            Response text from Gemini
        """
        if max_retries is None:
            max_retries = len(self.api_keys)
        
        last_error = None
        
        for attempt in range(max_retries):
            try:
                print(f"🔑 Attempt {attempt + 1}/{max_retries} with API key #{self.current_key_index + 1}")
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                error_msg = str(e)
                last_error = e
                
                # Check if it's a quota error (429)
                if "429" in error_msg or "quota" in error_msg.lower() or "RESOURCE_EXHAUSTED" in error_msg:
                    print(f"⚠️ API key #{self.current_key_index + 1} quota exceeded")
                    
                    if attempt < max_retries - 1:
                        # Try next API key
                        self._rotate_api_key()
                        time.sleep(1)  # Brief pause before retry
                        continue
                    else:
                        print(f"❌ All {len(self.api_keys)} API keys exhausted")
                        raise Exception(f"All API keys have exceeded their quota. Please try again later or upgrade your plan.")
                else:
                    # Non-quota error, don't retry
                    raise e
        
        # If we get here, all retries failed
        raise last_error
    
    def extract_text_from_pdf_url(self, pdf_url: str) -> str:
        """
        Download and extract text from PDF URL
        
        Args:
            pdf_url: URL of the PDF file (Firebase Storage URL)
        
        Returns:
            Extracted text content
        """
        try:
            # Download PDF from URL
            response = requests.get(pdf_url)
            response.raise_for_status()
            
            # Read PDF content
            pdf_file = BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extract text from all pages
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    def _generate_fallback_analysis(self, resume_text: str, target_domain: str = "General") -> Dict[str, Any]:
        """
        Generate a basic analysis using keyword matching when Gemini API fails
        
        Args:
            resume_text: Extracted text from resume
            target_domain: Target job domain
        
        Returns:
            Basic analysis dictionary
        """
        print("🔄 Using fallback keyword-based analysis (Gemini API unavailable)")
        
        # Common skill keywords to extract
        skill_keywords = {
            'Python': ['python', 'django', 'flask', 'fastapi'],
            'JavaScript': ['javascript', 'js', 'react', 'angular', 'vue', 'node'],
            'Java': ['java', 'spring', 'hibernate'],
            'C++': ['c++', 'cpp'],
            'SQL': ['sql', 'mysql', 'postgresql', 'database'],
            'Machine Learning': ['machine learning', 'ml', 'ai', 'neural network'],
            'Data Science': ['data science', 'data analysis', 'pandas', 'numpy'],
            'Cloud': ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
            'Web Development': ['html', 'css', 'web development', 'frontend', 'backend'],
            'Git': ['git', 'github', 'version control'],
        }
        
        text_lower = resume_text.lower()
        extracted_skills = []
        
        # Extract skills from resume text
        for skill, keywords in skill_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    extracted_skills.append({
                        "skill": skill,
                        "proficiency": "Intermediate",
                        "yearsOfExperience": 2
                    })
                    break
        
        # If no skills found, provide defaults
        if not extracted_skills:
            extracted_skills = [
                {"skill": "General", "proficiency": "Beginner", "yearsOfExperience": 1}
            ]
        
        # Determine experience level based on text length and content
        if 'senior' in text_lower or 'lead' in text_lower:
            exp_level = "Senior"
            years = 7
        elif 'junior' in text_lower or 'intern' in text_lower or 'fresher' in text_lower:
            exp_level = "Junior"
            years = 1
        else:
            exp_level = "Mid-Level"
            years = 3
        
        return {
            "extractedSkills": extracted_skills,
            "experienceLevel": exp_level,
            "totalYearsOfExperience": years,
            "education": [
                {
                    "degree": "Degree Information",
                    "field": target_domain,
                    "institution": "Educational Institution",
                    "year": "N/A"
                }
            ],
            "recommendedRoles": [
                f"{target_domain} Developer",
                f"{target_domain} Engineer",
                f"{target_domain} Specialist"
            ],
            "missingSkills": [
                {
                    "skill": "Advanced Skills",
                    "importance": "Medium",
                    "reason": f"Recommended for {target_domain} role"
                }
            ],
            "strengths": [
                "Diversified skill set",
                "Relevant experience"
            ],
            "improvements": [
                "Consider expanding technical skills",
                "Build more projects"
            ],
            "overallScore": 70,
            "summary": f"Professional with experience in {target_domain} domain. Resume analysis generated using fallback system due to API limitations."
        }
    
    def analyze_resume(self, resume_text: str, target_domain: str = "General") -> Dict[str, Any]:
        """
        Analyze resume using Gemini API and extract comprehensive information
        
        Args:
            resume_text: Extracted text from resume
            target_domain: Target job domain (e.g., "AI Engineer", "Web Developer")
        
        Returns:
            Dictionary containing extracted skills, experience, recommendations, etc.
        """
        prompt = f"""
        You are an expert career counselor and technical recruiter. Analyze the following resume carefully and provide a comprehensive analysis.
        
        Target Domain: {target_domain}
        
        Resume Content:
        {resume_text}
        
        Please provide a detailed analysis in the following JSON format:
        {{
            "extractedSkills": [
                {{
                    "skill": "Python",
                    "proficiency": "Advanced",
                    "yearsOfExperience": 3
                }}
            ],
            "experienceLevel": "Mid-Level / Senior / Fresher / Junior",
            "totalYearsOfExperience": 3,
            "education": [
                {{
                    "degree": "Bachelor of Technology",
                    "field": "Computer Science",
                    "institution": "University Name",
                    "year": "2020"
                }}
            ],
            "recommendedRoles": [
                "AI Engineer",
                "Machine Learning Engineer",
                "Data Scientist"
            ],
            "missingSkills": [
                {{
                    "skill": "TensorFlow",
                    "importance": "High",
                    "reason": "Required for AI Engineer role"
                }}
            ],
            "strengths": [
                "Strong programming fundamentals",
                "Good project experience"
            ],
            "improvements": [
                "Need more experience with cloud platforms",
                "Should work on system design skills"
            ],
            "overallScore": 75,
            "summary": "Brief professional summary"
        }}
        
        Be specific and actionable in your recommendations. Focus on skills relevant to {target_domain}.
        """
        
        try:
            # Use retry mechanism with API key rotation
            result_text = self._call_with_retry(prompt)
            
            # Try to extract JSON from the response
            # Gemini might wrap JSON in markdown code blocks
            if "```json" in result_text:
                json_start = result_text.find("```json") + 7
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            elif "```" in result_text:
                json_start = result_text.find("```") + 3
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            
            # Parse JSON response
            analysis = json.loads(result_text)
            
            return {
                "success": True,
                "data": analysis
            }
        
        except json.JSONDecodeError as e:
            # If JSON parsing fails, use fallback
            print(f"⚠️ JSON parsing failed, using fallback analysis")
            fallback = self._generate_fallback_analysis(resume_text, target_domain)
            return {
                "success": True,
                "data": fallback,
                "warning": "Using basic analysis due to API response format issues"
            }
        
        except Exception as e:
            error_msg = str(e)
            # Check if it's an API key or quota error
            if any(keyword in error_msg.lower() for keyword in ['quota', 'invalid', 'expired', 'api key', 'api_key']):
                print(f"⚠️ Gemini API unavailable ({error_msg}), using fallback analysis")
                fallback = self._generate_fallback_analysis(resume_text, target_domain)
                return {
                    "success": True,
                    "data": fallback,
                    "warning": "Using basic analysis - Gemini API unavailable. Please update API keys for detailed analysis."
                }
            else:
                # Other unexpected errors
                return {
                    "success": False,
                    "error": str(e)
                }
    
    def calculate_skill_gap(self, user_skills: List[Dict], required_skills: List[Dict]) -> Dict[str, Any]:
        """
        Calculate skill gap between user skills and required skills
        
        Args:
            user_skills: List of user's skills with proficiency levels
            required_skills: List of required skills for target role
        
        Returns:
            Skill gap analysis with recommendations
        """
        skill_map = {
            "Beginner": 1,
            "Basic": 1,
            "Intermediate": 2,
            "Advanced": 3,
            "Expert": 4
        }
        
        gaps = []
        total_gap = 0
        critical_gaps = 0
        moderate_gaps = 0
        
        # Create user skill dictionary for quick lookup
        user_skill_dict = {skill['skill'].lower(): skill for skill in user_skills}
        
        for req_skill in required_skills:
            skill_name = req_skill['skill']
            required_level = skill_map.get(req_skill.get('requiredLevel', 'Intermediate'), 2)
            
            # Check if user has this skill
            user_skill_name = skill_name.lower()
            if user_skill_name in user_skill_dict:
                user_level = skill_map.get(user_skill_dict[user_skill_name].get('proficiency', 'Beginner'), 1)
                gap = required_level - user_level
            else:
                user_level = 0
                gap = required_level
            
            # Determine gap status
            if gap >= 3:
                status = "Critical"
                critical_gaps += 1
            elif gap >= 1:
                status = "Moderate"
                moderate_gaps += 1
            else:
                status = "Good"
            
            gaps.append({
                "skill": skill_name,
                "requiredLevel": required_level,
                "userLevel": user_level,
                "gap": gap,
                "status": status
            })
            
            total_gap += max(0, gap)
        
        # Calculate match percentage
        total_required = sum(skill_map.get(s.get('requiredLevel', 'Intermediate'), 2) for s in required_skills)
        total_user = sum(g['userLevel'] for g in gaps)
        match_percentage = round((total_user / total_required) * 100, 2) if total_required > 0 else 0
        
        return {
            "success": True,
            "gaps": gaps,
            "totalGap": total_gap,
            "criticalGaps": critical_gaps,
            "moderateGaps": moderate_gaps,
            "matchPercentage": match_percentage,
            "overallStatus": "Good" if critical_gaps == 0 and moderate_gaps < 3 else "Needs Improvement"
        }
    
    def generate_job_recommendations(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized job recommendations using Gemini
        
        Args:
            user_profile: User's complete profile with skills and interests
        
        Returns:
            List of recommended jobs with match scores
        """
        skills = user_profile.get('skills', [])
        domain = user_profile.get('interestedDomain', 'General')
        experience = user_profile.get('experienceLevel', 'Fresher')
        
        prompt = f"""
        Based on the following candidate profile, recommend the top 10 most suitable job roles.
        
        Skills: {', '.join([s['skill'] if isinstance(s, dict) else s for s in skills])}
        Target Domain: {domain}
        Experience Level: {experience}
        
        Provide recommendations in JSON format:
        {{
            "recommendations": [
                {{
                    "jobTitle": "AI Engineer",
                    "matchScore": 85,
                    "reason": "Strong match with Python and ML skills",
                    "requiredSkills": ["Python", "TensorFlow", "Machine Learning"],
                    "salaryRange": "$80k - $120k",
                    "experienceRequired": "2-4 years"
                }}
            ]
        }}
        
        Be specific and realistic. Include match scores between 0-100.
        """
        
        try:
            # Use retry mechanism with API key rotation
            result_text = self._call_with_retry(prompt)
            
            # Extract JSON
            if "```json" in result_text:
                json_start = result_text.find("```json") + 7
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            elif "```" in result_text:
                json_start = result_text.find("```") + 3
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            
            recommendations = json.loads(result_text)
            
            return {
                "success": True,
                "data": recommendations
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Singleton instance
_gemini_service = None

def get_gemini_service(api_key: str = None) -> GeminiService:
    """Get or create Gemini service instance"""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService(api_key)
    return _gemini_service
