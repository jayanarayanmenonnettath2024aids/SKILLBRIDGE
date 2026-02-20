"""
Seed realistic resume analysis data for user
"""
import os
from dotenv import load_dotenv
from services.firebase_service import get_db
from datetime import datetime

# Load environment variables
load_dotenv()

def seed_analysis():
    db = get_db()
    user_id = "b51cfb82-3924-431f-890a-14f4d359b401"
    
    # Realistic analysis based on typical resume
    analysis_data = {
        "extractedSkills": [
            {"skill": "Python", "proficiency": "Advanced", "yearsOfExperience": 2},
            {"skill": "JavaScript", "proficiency": "Intermediate", "yearsOfExperience": 2},
            {"skill": "React", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Flask", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Firebase", "proficiency": "Basic", "yearsOfExperience": 1},
            {"skill": "SQL", "proficiency": "Intermediate", "yearsOfExperience": 2},
            {"skill": "Git", "proficiency": "Intermediate", "yearsOfExperience": 2},
            {"skill": "REST APIs", "proficiency": "Intermediate", "yearsOfExperience": 1}
        ],
        "experienceLevel": "Junior Developer",
        "totalYearsOfExperience": 2,
        "education": [
            {
                "degree": "Bachelor of Technology",
                "field": "Computer Science Engineering",
                "institution": "University",
                "year": "2022"
            }
        ],
        "recommendedRoles": [
            "Full Stack Developer",
            "Backend Developer",
            "Python Developer",
            "Junior Software Engineer",
            "Web Developer"
        ],
        "missingSkills": [
            "Docker",
            "Kubernetes",
            "AWS/Cloud Services",
            "CI/CD",
            "MongoDB"
        ],
        "strengths": [
            "Strong foundation in Python programming and web development",
            "Experience with modern web frameworks (React, Flask)",
            "Good understanding of database management and SQL",
            "Familiar with version control systems and collaborative development",
            "Quick learner with hands-on project experience"
        ],
        "improvements": [
            "Gain experience with cloud platforms (AWS, Azure, or Google Cloud)",
            "Learn containerization and orchestration tools (Docker, Kubernetes)",
            "Improve knowledge of system design and architecture patterns",
            "Expand experience with testing frameworks and test-driven development",
            "Build more complex full-stack applications to showcase expertise"
        ],
        "overallScore": 72,
        "summary": "A motivated junior developer with 2 years of experience in full-stack web development. Demonstrates solid programming skills in Python and JavaScript with practical experience in building web applications using React and Flask. Shows good foundational knowledge in database management and modern development practices. Ready for junior to mid-level positions with opportunities to grow in cloud technologies and enterprise-scale application development."
    }
    
    # Save to Firestore
    try:
        db.collection('users').document(user_id).set({
            'geminiAnalysis': analysis_data,
            'analysisDate': datetime.utcnow().isoformat(),
            'userId': user_id
        }, merge=True)
        
        print(f"✅ Successfully saved resume analysis for user: {user_id}")
        print(f"📊 Experience Level: {analysis_data['experienceLevel']}")
        print(f"⏱️  Total Experience: {analysis_data['totalYearsOfExperience']} years")
        print(f"💼 Skills: {len(analysis_data['extractedSkills'])}")
        print(f"⭐ Overall Score: {analysis_data['overallScore']}/100")
        print(f"🎯 Recommended Roles: {', '.join(analysis_data['recommendedRoles'][:3])}")
        print("\n🎉 Refresh your dashboard to see the summary!")
        
    except Exception as e:
        print(f"❌ Error saving analysis: {str(e)}")

if __name__ == "__main__":
    seed_analysis()
