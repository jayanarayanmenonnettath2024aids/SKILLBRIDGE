import json
from datetime import datetime

class StudentProfile:
    def __init__(self, data):
        self.name = data.get('name', '')
        self.email = data.get('email', '')
        self.education = data.get('education', []) # List of {degree, institution, year}
        self.skills = data.get('skills', {}) # Dict of {category: [skills]}
        self.experience = data.get('experience', []) # List of {role, company, duration, description}
        self.achievements = data.get('achievements', [])
        self.interests = data.get('interests', [])

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'education': self.education,
            'skills': self.skills,
            'experience': self.experience,
            'achievements': self.achievements,
            'interests': self.interests
        }

class Opportunity:
    def __init__(self, data):
        self.id = data.get('id')
        self.title = data.get('title', '')
        self.link = data.get('link', '')
        self.source = data.get('source', '')
        self.snippet = data.get('snippet', '')
        self.date_posted = data.get('date_posted', '')
        self.deadline = data.get('deadline', None) # Extracted deadline
        self.eligibility_criteria = data.get('eligibility_criteria', '') # Extracted criteria
        self.relevance_score = data.get('relevance_score', 0)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'link': self.link,
            'source': self.source,
            'snippet': self.snippet,
            'deadline': self.deadline,
            'eligibility_criteria': self.eligibility_criteria,
            'relevance_score': self.relevance_score
        }
