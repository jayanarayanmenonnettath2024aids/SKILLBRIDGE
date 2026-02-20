"""
YouTube Video Service

Fetches relevant educational videos from YouTube based on resume skills and analysis.
Uses YouTube Data API v3 to search for skill-based learning content.
"""

import os
import requests
from typing import List, Dict, Optional

class YouTubeService:
    """Service for fetching educational videos from YouTube"""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_SEARCH_API_KEY')
        self.base_url = 'https://www.googleapis.com/youtube/v3'
        
    def get_educational_videos(self, resume_analysis: Dict, max_results: int = 3) -> List[Dict]:
        """
        Fetch educational videos based on resume analysis
        
        Args:
            resume_analysis: Dictionary containing resume analysis with skills
            max_results: Number of videos to return (default: 3)
            
        Returns:
            List of video objects with title, description, videoId, thumbnail, channelTitle
        """
        try:
            # Extract skills from resume analysis
            skills = self._extract_skills_from_analysis(resume_analysis)
            
            if not skills:
                # Fallback to general career development videos
                skills = ['career development', 'professional skills']
            
            # Build search query focused on learning/tutorials
            search_query = f"{' '.join(skills[:3])} tutorial course learn"
            
            videos = self._search_youtube_videos(search_query, max_results)
            
            return videos
            
        except Exception as e:
            print(f"❌ Error fetching YouTube videos: {str(e)}")
            return self._get_fallback_videos()
    
    def _extract_skills_from_analysis(self, analysis: Dict) -> List[str]:
        """
        Extract key skills from resume analysis
        
        Args:
            analysis: Resume analysis dictionary
            
        Returns:
            List of skill keywords
        """
        skills = []
        
        try:
            # Check for skills in various possible fields
            if isinstance(analysis, dict):
                # Look for skills array
                if 'skills' in analysis and isinstance(analysis['skills'], list):
                    skills.extend(analysis['skills'][:5])
                
                # Look for technical_skills
                if 'technical_skills' in analysis and isinstance(analysis['technical_skills'], list):
                    skills.extend(analysis['technical_skills'][:5])
                
                # Look for targetDomain
                if 'targetDomain' in analysis:
                    skills.append(analysis['targetDomain'])
                
                # Look for domain
                if 'domain' in analysis:
                    skills.append(analysis['domain'])
                
                # Look for skills in summary text
                if 'summary' in analysis and isinstance(analysis['summary'], str):
                    # Extract potential skills from summary
                    summary_lower = analysis['summary'].lower()
                    common_skills = ['python', 'java', 'javascript', 'react', 'node.js', 
                                   'sql', 'aws', 'docker', 'kubernetes', 'machine learning',
                                   'data science', 'web development', 'mobile development']
                    for skill in common_skills:
                        if skill in summary_lower and skill not in skills:
                            skills.append(skill)
            
            # Clean and deduplicate skills
            skills = [s.strip() for s in skills if s and isinstance(s, str)]
            skills = list(dict.fromkeys(skills))  # Remove duplicates while preserving order
            
        except Exception as e:
            print(f"⚠️ Error extracting skills: {str(e)}")
        
        return skills[:5]  # Return top 5 skills
    
    def _search_youtube_videos(self, query: str, max_results: int) -> List[Dict]:
        """
        Search YouTube for educational videos
        
        Args:
            query: Search query string
            max_results: Number of results to fetch
            
        Returns:
            List of video objects
        """
        try:
            if not self.api_key:
                print("⚠️ YouTube API key not found in environment")
                return self._get_fallback_videos()
            
            # YouTube Data API search endpoint
            search_url = f"{self.base_url}/search"
            
            params = {
                'key': self.api_key,
                'part': 'snippet',
                'q': query,
                'type': 'video',
                'maxResults': max_results,
                'order': 'relevance',
                'videoDuration': 'medium',  # 4-20 minutes
                'videoEmbeddable': 'true',
                'safeSearch': 'strict'
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                videos = []
                
                for item in data.get('items', []):
                    video = {
                        'videoId': item['id']['videoId'],
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'][:200] + '...' if len(item['snippet']['description']) > 200 else item['snippet']['description'],
                        'thumbnail': item['snippet']['thumbnails']['high']['url'] if 'high' in item['snippet']['thumbnails'] else item['snippet']['thumbnails']['default']['url'],
                        'channelTitle': item['snippet']['channelTitle'],
                        'publishedAt': item['snippet']['publishedAt']
                    }
                    videos.append(video)
                
                print(f"✅ Fetched {len(videos)} YouTube videos for query: {query}")
                return videos
            else:
                print(f"⚠️ YouTube API returned status {response.status_code}")
                return self._get_fallback_videos()
                
        except Exception as e:
            print(f"❌ Error searching YouTube: {str(e)}")
            return self._get_fallback_videos()
    
    def _get_fallback_videos(self) -> List[Dict]:
        """
        Return curated fallback videos when API fails
        
        Returns:
            List of default educational videos
        """
        return [
            {
                'videoId': 'rfscVS0vtbw',
                'title': 'Learn Python - Full Course for Beginners',
                'description': 'Master Python programming with this comprehensive tutorial covering basics to advanced concepts.',
                'thumbnail': 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
                'channelTitle': 'freeCodeCamp.org',
                'publishedAt': '2018-07-11T00:00:00Z'
            },
            {
                'videoId': 'PkZNo7MFNFg',
                'title': 'Learn JavaScript - Full Course for Beginners',
                'description': 'This complete JavaScript course covers everything from fundamentals to advanced concepts.',
                'thumbnail': 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
                'channelTitle': 'freeCodeCamp.org',
                'publishedAt': '2018-09-26T00:00:00Z'
            },
            {
                'videoId': 'zOjov-2OZ0E',
                'title': 'SQL Tutorial - Full Database Course for Beginners',
                'description': 'Learn SQL and database management with this comprehensive tutorial for beginners.',
                'thumbnail': 'https://i.ytimg.com/vi/zOjov-2OZ0E/hqdefault.jpg',
                'channelTitle': 'freeCodeCamp.org',
                'publishedAt': '2018-03-09T00:00:00Z'
            }
        ]


# Singleton instance
_youtube_service = None

def get_youtube_service() -> YouTubeService:
    """Get or create the YouTube service singleton"""
    global _youtube_service
    if _youtube_service is None:
        _youtube_service = YouTubeService()
    return _youtube_service
