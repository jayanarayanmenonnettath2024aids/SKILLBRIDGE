"""
Skill Gap Analysis Service

This module handles all skill gap calculations and analysis logic.
It fetches user skills and required skills from Firestore and performs
gap analysis with status categorization.
"""

from typing import Dict, List, Any
from services.firebase_service import get_db


class SkillGapService:
    """Service for calculating and analyzing skill gaps."""

    @staticmethod
    def calculate_skill_gap(user_id: str) -> Dict[str, Any]:
        """
        Calculate comprehensive skill gap analysis for a user.
        
        Args:
            user_id: The unique identifier for the user
            
        Returns:
            Dictionary containing:
            - user_info: User details
            - skill_gaps: List of skill gap details
            - match_percentage: Overall skill match percentage
            - readiness_score: Skill readiness score
        """
        db = get_db()
        
        # Fetch user data
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists:
            raise ValueError(f"User {user_id} not found")
        
        user_data = user_doc.to_dict()
        user_role = user_data.get('role')
        user_skills = user_data.get('skills', {})
        
        # Fetch required skills for the user's role
        required_doc = db.collection('requiredSkills').document(user_role).get()
        if not required_doc.exists:
            raise ValueError(f"Required skills for role {user_role} not found")
        
        required_skills = required_doc.to_dict().get('skills', {})
        
        # Calculate gaps for each required skill
        skill_gaps = []
        total_gap = 0
        total_required = 0
        
        for skill_name, required_level in required_skills.items():
            user_level = user_skills.get(skill_name, 0)  # Default to 0 if user doesn't have the skill
            gap = required_level - user_level
            
            # Determine gap status based on gap value
            if gap >= 5:
                status = "Critical"
            elif gap >= 3:
                status = "Moderate"
            else:
                status = "Good"
            
            skill_gaps.append({
                'skill_name': skill_name,
                'required_level': required_level,
                'user_level': user_level,
                'gap': max(0, gap),  # Ensure gap is non-negative
                'status': status
            })
            
            # Track totals for percentage calculations
            total_required += required_level
            total_gap += max(0, gap)
        
        # Calculate match percentage (how much of required skills the user has)
        # Formula: (Total Required - Total Gap) / Total Required * 100
        if total_required > 0:
            match_percentage = round(((total_required - total_gap) / total_required) * 100, 2)
        else:
            match_percentage = 100.0
        
        # Calculate readiness score (0-100 scale)
        # Considers both the match percentage and the severity of gaps
        critical_count = sum(1 for sg in skill_gaps if sg['status'] == 'Critical')
        moderate_count = sum(1 for sg in skill_gaps if sg['status'] == 'Moderate')
        
        # Penalize critical and moderate gaps
        penalty = (critical_count * 10) + (moderate_count * 5)
        readiness_score = max(0, min(100, match_percentage - penalty))
        
        return {
            'user_info': {
                'user_id': user_id,
                'name': user_data.get('name'),
                'role': user_role
            },
            'skill_gaps': sorted(skill_gaps, key=lambda x: x['gap'], reverse=True),
            'match_percentage': match_percentage,
            'readiness_score': round(readiness_score, 2),
            'summary': {
                'total_skills_required': len(required_skills),
                'critical_gaps': critical_count,
                'moderate_gaps': moderate_count,
                'good_skills': len(skill_gaps) - critical_count - moderate_count
            }
        }

    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        """
        Fetch all users from Firestore.
        
        Returns:
            List of user dictionaries with their basic info
        """
        db = get_db()
        users_ref = db.collection('users').stream()
        
        users = []
        for doc in users_ref:
            user_data = doc.to_dict()
            users.append({
                'user_id': doc.id,
                'name': user_data.get('name'),
                'role': user_data.get('role')
            })
        
        return users

    @staticmethod
    def get_required_skills_by_role(role: str) -> Dict[str, Any]:
        """
        Fetch required skills for a specific role.
        
        Args:
            role: The job role name
            
        Returns:
            Dictionary with role and required skills
        """
        db = get_db()
        doc = db.collection('requiredSkills').document(role).get()
        
        if not doc.exists:
            raise ValueError(f"Required skills for role {role} not found")
        
        data = doc.to_dict()
        return {
            'role': role,
            'skills': data.get('skills', {})
        }
