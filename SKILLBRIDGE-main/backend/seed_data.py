"""
Synthetic Data Seeder for Skill Gap Analysis

This script creates realistic synthetic data for demonstration purposes:
- Users with various roles and skill levels
- Required skills for each job role

Run this script to populate Firestore with demo data for the hackathon.
"""

import os
from dotenv import load_dotenv
from services.firebase_service import get_db

# Load environment variables
load_dotenv()


def seed_synthetic_data():
    """
    Populate Firestore with synthetic users and required skills data.
    Creates realistic data suitable for hackathon demonstration.
    """
    db = get_db()
    
    print("🌱 Starting data seeding process...")
    
    # ========================================
    # 1. Seed Required Skills by Role
    # ========================================
    
    required_skills_data = {
        'Data Entry Operator': {
            'skills': {
                'Typing Speed': 8,
                'MS Excel': 7,
                'Attention to Detail': 9,
                'Data Accuracy': 8,
                'English Communication': 6,
                'Computer Basics': 7
            }
        },
        'Software Developer': {
            'skills': {
                'Python': 8,
                'JavaScript': 8,
                'Problem Solving': 9,
                'Git Version Control': 7,
                'Database Management': 7,
                'API Development': 8,
                'Testing & Debugging': 7
            }
        },
        'Customer Service Representative': {
            'skills': {
                'English Communication': 9,
                'Problem Solving': 8,
                'Patience': 9,
                'CRM Software': 6,
                'Phone Etiquette': 8,
                'Conflict Resolution': 7,
                'Active Listening': 8
            }
        },
        'Digital Marketing Specialist': {
            'skills': {
                'SEO Optimization': 8,
                'Social Media Marketing': 8,
                'Content Creation': 7,
                'Google Analytics': 7,
                'Email Marketing': 6,
                'Graphic Design Basics': 6,
                'Copywriting': 7
            }
        },
        'Delivery Partner': {
            'skills': {
                'Navigation Skills': 8,
                'Time Management': 9,
                'Customer Service': 7,
                'Mobile App Usage': 8,
                'Physical Fitness': 8,
                'Vehicle Maintenance': 6
            }
        }
    }
    
    print("📋 Seeding required skills for each role...")
    for role, data in required_skills_data.items():
        db.collection('requiredSkills').document(role).set(data)
        print(f"   ✓ Added required skills for: {role}")
    
    # ========================================
    # 2. Seed User Data
    # ========================================
    
    users_data = [
        {
            'userId': 'user_001',
            'name': 'Rahul Kumar',
            'role': 'Data Entry Operator',
            'skills': {
                'Typing Speed': 5,
                'MS Excel': 4,
                'Attention to Detail': 7,
                'Data Accuracy': 6,
                'English Communication': 5,
                'Computer Basics': 6
            }
        },
        {
            'userId': 'user_002',
            'name': 'Priya Sharma',
            'role': 'Software Developer',
            'skills': {
                'Python': 6,
                'JavaScript': 7,
                'Problem Solving': 8,
                'Git Version Control': 5,
                'Database Management': 5,
                'API Development': 4,
                'Testing & Debugging': 6
            }
        },
        {
            'userId': 'user_003',
            'name': 'Amit Patel',
            'role': 'Customer Service Representative',
            'skills': {
                'English Communication': 7,
                'Problem Solving': 6,
                'Patience': 8,
                'CRM Software': 3,
                'Phone Etiquette': 7,
                'Conflict Resolution': 5,
                'Active Listening': 7
            }
        },
        {
            'userId': 'user_004',
            'name': 'Sneha Reddy',
            'role': 'Digital Marketing Specialist',
            'skills': {
                'SEO Optimization': 5,
                'Social Media Marketing': 6,
                'Content Creation': 7,
                'Google Analytics': 4,
                'Email Marketing': 5,
                'Graphic Design Basics': 3,
                'Copywriting': 6
            }
        },
        {
            'userId': 'user_005',
            'name': 'Rajesh Singh',
            'role': 'Delivery Partner',
            'skills': {
                'Navigation Skills': 9,
                'Time Management': 7,
                'Customer Service': 6,
                'Mobile App Usage': 8,
                'Physical Fitness': 9,
                'Vehicle Maintenance': 4
            }
        },
        {
            'userId': 'user_006',
            'name': 'Ananya Iyer',
            'role': 'Data Entry Operator',
            'skills': {
                'Typing Speed': 7,
                'MS Excel': 6,
                'Attention to Detail': 8,
                'Data Accuracy': 7,
                'English Communication': 6,
                'Computer Basics': 8
            }
        },
        {
            'userId': 'user_007',
            'name': 'Vikram Malhotra',
            'role': 'Software Developer',
            'skills': {
                'Python': 9,
                'JavaScript': 8,
                'Problem Solving': 9,
                'Git Version Control': 8,
                'Database Management': 8,
                'API Development': 7,
                'Testing & Debugging': 8
            }
        },
        {
            'userId': 'user_008',
            'name': 'Deepika Nair',
            'role': 'Customer Service Representative',
            'skills': {
                'English Communication': 9,
                'Problem Solving': 8,
                'Patience': 9,
                'CRM Software': 5,
                'Phone Etiquette': 9,
                'Conflict Resolution': 7,
                'Active Listening': 9
            }
        }
    ]
    
    print("👥 Seeding user data...")
    for user in users_data:
        user_id = user.pop('userId')
        db.collection('users').document(user_id).set(user)
        print(f"   ✓ Added user: {user['name']} ({user['role']})")
    
    print("\n✅ Data seeding completed successfully!")
    print(f"   - {len(required_skills_data)} job roles with required skills")
    print(f"   - {len(users_data)} users with skill profiles")
    print("\n🚀 Ready for hackathon demonstration!")


if __name__ == '__main__':
    """
    Run this script directly to seed data:
    python seed_data.py
    """
    seed_synthetic_data()
