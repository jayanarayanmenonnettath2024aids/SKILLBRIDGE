import os
import google.generativeai as genai
import json

class ReasoningService:
    @staticmethod
    def check_eligibility(profile_data, opportunity_data):
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            return {
                "error": "Gemini API key not configured",
                "eligibility_status": "Unknown",
                "confidence_score": 0
            }

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        You are an expert career counselor and technical recruiter.
        Analyze the following student profile and opportunity details to determine eligibility and provide a gap analysis.
        
        Student Profile:
        {json.dumps(profile_data, indent=2)}
        
        Opportunity Details:
        {json.dumps(opportunity_data, indent=2)}
        
        Provide the output STRICTLY in the following JSON format (no markdown code blocks):
        {{
            "eligibility_score": <number 0-100>,
            "eligibility_status": "<Highly Eligible / Eligible / Potentially Eligible / Not Eligible>",
            "reasons_met": ["<reason 1>", "<reason 2>"],
            "reasons_not_met": ["<reason 1>", "<reason 2>"],
            "missing_skills": ["<skill 1>", "<skill 2>"],
            "missing_experience": ["<experience gap 1>"],
            "confidence_score": <number 0-100>,
            "explanation_simple": "<A short, encouraging explanation for the student>",
            "next_steps_roadmap": [
                {{
                    "step": "<Step Name>",
                    "description": "<What to do>",
                    "resources": ["<optional resource idea>"]
                }}
            ]
        }}
        """

        try:
            response = model.generate_content(prompt)
            # Clean up response if it contains markdown code blocks
            text = response.text
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return {
                "error": str(e),
                "eligibility_status": "Error",
                "confidence_score": 0
            }
