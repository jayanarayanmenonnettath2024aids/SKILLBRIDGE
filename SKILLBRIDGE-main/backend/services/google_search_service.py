"""
Google Programmable Search Engine API Service for Job Matching
This service fetches real job listings from various job portals
"""

import os
import requests
from typing import Dict, Any, List
from urllib.parse import quote_plus

class GoogleJobSearchService:
    """Service for fetching job listings using Google Programmable Search Engine API"""
    
    def __init__(self, api_key: str = None, search_engine_id: str = None):
        """
        Initialize Google Search service
        
        Args:
            api_key: Google API key for Custom Search
            search_engine_id: Programmable Search Engine ID
        """
        self.api_key = api_key or os.getenv('GOOGLE_SEARCH_API_KEY')
        self.search_engine_id = search_engine_id or os.getenv('GOOGLE_SEARCH_ENGINE_ID')
        
        if not self.api_key:
            raise ValueError("Google Search API key not found. Set GOOGLE_SEARCH_API_KEY environment variable.")
        
        if not self.search_engine_id:
            raise ValueError("Search Engine ID not found. Set GOOGLE_SEARCH_ENGINE_ID environment variable.")
        
        self.base_url = "https://www.googleapis.com/customsearch/v1"
    
    def search_jobs(
        self,
        job_title: str,
        skills: List[str] = None,
        location: str = "Remote",
        experience_level: str = "Entry Level",
        num_results: int = 10
    ) -> Dict[str, Any]:
        """
        Search for jobs using Google Programmable Search Engine
        
        Args:
            job_title: Job title to search for
            skills: List of skills to include in search
            location: Job location preference
            experience_level: Experience level (Fresher, Junior, Mid-Level, Senior)
            num_results: Number of results to return (max 10 per request)
        
        Returns:
            Dictionary containing job search results
        """
        try:
            # Construct search query
            query_parts = [job_title]
            
            if skills:
                # Add top 3 skills to query
                query_parts.extend(skills[:3])
            
            # Map experience level to common job board terms
            experience_map = {
                "Fresher": "fresher entry level",
                "Junior": "junior entry level",
                "Mid-Level": "mid level",
                "Senior": "senior",
                "Expert": "lead senior"
            }
            
            exp_term = experience_map.get(experience_level, "entry level")
            query_parts.append(exp_term)
            
            # Add job sites to search
            site_filter = "site:linkedin.com OR site:indeed.com OR site:naukri.com OR site:glassdoor.com"
            
            # Construct final query
            query = f"{' '.join(query_parts)} jobs {location} {site_filter}"
            
            print(f"\n🔍 Google Search API Query: {query}")
            
            # Make API request
            params = {
                'key': self.api_key,
                'cx': self.search_engine_id,
                'q': query,
                'num': min(num_results, 10)  # Max 10 per request
            }
            
            print(f"📡 Calling Google Search API...")
            response = requests.get(self.base_url, params=params)
            print(f"📊 API Response Status: {response.status_code}")
            
            response.raise_for_status()
            
            data = response.json()
            
            # Parse and structure results
            jobs = []
            for item in data.get('items', []):
                job = {
                    'title': item.get('title', ''),
                    'link': item.get('link', ''),
                    'snippet': item.get('snippet', ''),
                    'displayLink': item.get('displayLink', ''),
                    'source': self._extract_source(item.get('displayLink', ''))
                }
                jobs.append(job)
            
            total_results = data.get('searchInformation', {}).get('totalResults', 0)
            print(f"✅ Found {len(jobs)} jobs (Total available: {total_results})")
            
            return {
                "success": True,
                "query": query,
                "totalResults": total_results,
                "jobs": jobs
            }
        
        except requests.exceptions.RequestException as e:
            error_msg = f"API request failed: {str(e)}"
            print(f"❌ {error_msg}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    print(f"❌ API Error Details: {error_data}")
                    error_msg = f"{error_msg} - {error_data.get('error', {}).get('message', '')}"
                except:
                    pass
            return {
                "success": False,
                "error": error_msg
            }
        
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            print(f"❌ {error_msg}")
            return {
                "success": False,
                "error": error_msg
            }
    
    def _extract_source(self, display_link: str) -> str:
        """Extract job source from display link"""
        if 'linkedin' in display_link.lower():
            return 'LinkedIn'
        elif 'indeed' in display_link.lower():
            return 'Indeed'
        elif 'naukri' in display_link.lower():
            return 'Naukri'
        elif 'glassdoor' in display_link.lower():
            return 'Glassdoor'
        else:
            return display_link
    
    def calculate_job_match_score(
        self,
        job_description: str,
        user_skills: List[str],
        user_domain: str
    ) -> int:
        """
        Calculate match score between job and user profile
        
        Args:
            job_description: Job description/snippet
            user_skills: List of user's skills
            user_domain: User's domain of interest
        
        Returns:
            Match score (0-100)
        """
        job_lower = job_description.lower()
        
        # Check skill matches
        skill_matches = 0
        for skill in user_skills:
            if skill.lower() in job_lower:
                skill_matches += 1
        
        # Calculate skill match percentage
        skill_score = (skill_matches / len(user_skills)) * 70 if user_skills else 0
        
        # Check domain match
        domain_score = 30 if user_domain.lower() in job_lower else 0
        
        # Total score
        total_score = min(100, int(skill_score + domain_score))
        
        return total_score
    
    def search_and_match_jobs(
        self,
        user_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Search for jobs and calculate match scores for user profile
        
        Args:
            user_profile: Complete user profile with skills, domain, experience
        
        Returns:
            Dictionary containing matched jobs with scores
        """
        try:
            # Extract profile data
            job_title = user_profile.get('interestedDomain', 'Software Engineer')
            skills = user_profile.get('skillsSelected', [])
            experience_level = user_profile.get('experienceLevel', 'Fresher')
            location = user_profile.get('location', 'Remote')
            
            # Perform search
            search_result = self.search_jobs(
                job_title=job_title,
                skills=skills,
                location=location,
                experience_level=experience_level,
                num_results=10
            )
            
            if not search_result.get('success'):
                return search_result
            
            # Calculate match scores for each job
            matched_jobs = []
            for job in search_result.get('jobs', []):
                job_text = f"{job['title']} {job['snippet']}"
                match_score = self.calculate_job_match_score(
                    job_text,
                    skills,
                    job_title
                )
                
                matched_jobs.append({
                    **job,
                    'matchScore': match_score
                })
            
            # Sort by match score
            matched_jobs.sort(key=lambda x: x['matchScore'], reverse=True)
            
            return {
                "success": True,
                "totalJobs": len(matched_jobs),
                "matchedJobs": matched_jobs
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Singleton instance
_search_service = None

def get_job_search_service(api_key: str = None, search_engine_id: str = None) -> GoogleJobSearchService:
    """Get or create Google Job Search service instance"""
    global _search_service
    if _search_service is None:
        _search_service = GoogleJobSearchService(api_key, search_engine_id)
    return _search_service
