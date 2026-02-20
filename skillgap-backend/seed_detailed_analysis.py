"""
Seed detailed resume analysis data for JEYANDAN A based on actual resume
"""
import os
from dotenv import load_dotenv
from services.firebase_service import get_db
from datetime import datetime

# Load environment variables
load_dotenv()

def seed_detailed_analysis():
    db = get_db()
    user_id = "b51cfb82-3924-431f-890a-14f4d359b401"
    
    # Detailed analysis based on JEYANDAN A's actual resume
    analysis_data = {
        "extractedSkills": [
            {"skill": "React", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "React Native", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Python", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Java", "proficiency": "Basic", "yearsOfExperience": 1},
            {"skill": "C/C++", "proficiency": "Basic", "yearsOfExperience": 1},
            {"skill": "JavaScript", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "HTML/CSS", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "SpringBoot", "proficiency": "Basic", "yearsOfExperience": 0.5},
            {"skill": "Firebase", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Supabase", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Git/GitHub", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "IoT (ESP32, Raspberry Pi)", "proficiency": "Intermediate", "yearsOfExperience": 1},
            {"skill": "Cloudinary", "proficiency": "Basic", "yearsOfExperience": 0.5},
            {"skill": "Chromium", "proficiency": "Basic", "yearsOfExperience": 0.5}
        ],
        "experienceLevel": "Student Developer / Fresher with Strong Project Portfolio",
        "totalYearsOfExperience": 1,
        "education": [
            {
                "degree": "B.Tech - Artificial Intelligence & Data Science",
                "field": "AI & Data Science",
                "institution": "Sri Eshwar College of Engineering",
                "year": "2024-2028 (Currently Pursuing)",
                "cgpa": "8.3"
            },
            {
                "degree": "Higher Secondary Certificate (HSC)",
                "field": "12th Grade",
                "institution": "U.K.P.M Matric",
                "year": "2022-2024",
                "percentage": "87.3%"
            },
            {
                "degree": "Secondary School Leaving Certificate (SSLC)",
                "field": "10th Grade",
                "institution": "Srinivasa Vidhalaya",
                "year": "2021-2022",
                "percentage": "87.7%"
            }
        ],
        "projects": [
            {
                "name": "Matrimony System App (Client Consultancy Project)",
                "description": "Developed a UI/UX enhanced matrimony system mobile application for client 'Yathu Mangala Malai' using React Native and Web Chromium. Implemented Supabase for database management and Cloudinary for image storage, delivering a complete full-stack solution.",
                "technologies": ["React Native", "Supabase", "Cloudinary", "Web Chromium"],
                "type": "Commercial Client Project",
                "highlights": [
                    "Real-world commercial consultancy project for actual client",
                    "Full-stack mobile app development with cloud database",
                    "Image management and storage optimization",
                    "Focus on enhanced UI/UX design"
                ]
            },
            {
                "name": "PDS Dispenser (IoT Hardware System)",
                "description": "Engineered an IoT-based hardware system for Public Distribution System (PDS) dispensing using React for the frontend interface and Firebase for backend data management. Integrated hardware components like ESP32 and RF Reader for automated distribution.",
                "technologies": ["React", "Firebase", "ESP32", "RF Reader", "IoT"],
                "type": "IoT Hardware Project",
                "highlights": [
                    "Hardware-software integration expertise",
                    "Real-time data management with Firebase",
                    "Public welfare technology application",
                    "IoT sensor integration and automation"
                ]
            },
            {
                "name": "SIH 2025 - AI-Driven Oceanographic Data Platform",
                "description": "Selected as top team from college to participate in Smart India Hackathon (SIH) under problem statement SIH25041. Working on developing an AI-Driven Unified Data Platform for Oceanographic, Fisheries, and Molecular Biodiversity Insights.",
                "technologies": ["AI/ML", "Data Analytics", "Python", "Data Integration"],
                "type": "National-Level Hackathon",
                "highlights": [
                    "Selected among top teams for national competition",
                    "Working with AI and large-scale data integration",
                    "Addressing real-world environmental challenges",
                    "Collaborative team project"
                ]
            },
            {
                "name": "Encoding and Decoding Web Application",
                "description": "Created a web-based message encoding and decoding tool using Python for backend logic and HTML/CSS for the frontend interface. Implemented various encryption and decryption algorithms.",
                "technologies": ["Python", "HTML", "CSS"],
                "type": "Web Application",
                "highlights": [
                    "Cryptography and security concepts",
                    "Full-stack web development",
                    "Algorithm implementation"
                ]
            },
            {
                "name": "Interactive Quiz Game",
                "description": "Built an interactive quiz game application using Python with features for multiple-choice questions, scoring system, and user feedback.",
                "technologies": ["Python"],
                "type": "Desktop Application",
                "highlights": [
                    "Game logic and state management",
                    "User interaction design",
                    "Python programming fundamentals"
                ]
            }
        ],
        "achievements": [
            "MSME Hackathon: Successfully pitched project idea at MSME hackathon held at Amrita University",
            "Embededthon Hackathon: Secured 2nd Runner Up position at Embededthon conducted at Sri Eshwar College of Engineering with prize money",
            "Smart India Hackathon 2025: Selected as top team from college for SIH participation",
            "Completed 800+ programs on Skillrack coding platform",
            "Completed 50+ programs on LeetCode competitive programming platform"
        ],
        "certifications": [
            "HTML for Web Development - Successfully completed",
            "Advanced Diploma in Python Programming (ADPP) - Offline certification",
            "Advanced Diploma in C and C++ Programming - Offline certification"
        ],
        "recommendedRoles": [
            "Full Stack Developer - Junior",
            "React Native Mobile App Developer",
            "Frontend Developer (React)",
            "IoT Developer",
            "Python Developer - Entry Level",
            "Software Development Intern",
            "AI/ML Engineer - Intern",
            "Web Developer"
        ],
        "missingSkills": [
            "Advanced Backend Frameworks (Node.js, Django, FastAPI)",
            "Cloud Platforms (AWS, Azure, Google Cloud)",
            "DevOps Tools (Docker, Kubernetes, CI/CD)",
            "Advanced Database Management (MongoDB, PostgreSQL)",
            "API Design and Development (REST, GraphQL)",
            "Unit Testing and Test-Driven Development",
            "System Design and Architecture Patterns",
            "Machine Learning Libraries (TensorFlow, PyTorch)",
            "Version Control - Advanced Git workflows"
        ],
        "strengths": [
            "Exceptional problem-solving ability with 800+ Skillrack programs and 50+ LeetCode solutions completed",
            "Proven track record of winning hackathons (2nd Runner Up at Embededthon) demonstrating competitive coding and innovation skills",
            "Strong full-stack development expertise with real commercial client project experience (Yathu Mangala Malai Matrimony App)",
            "Versatile technology stack spanning web development (React, HTML/CSS, JavaScript), mobile development (React Native), and IoT hardware integration (ESP32, Raspberry Pi)",
            "Excellent academic performance with 8.3 CGPA in AI & Data Science program and consistently strong marks (87.3% HSC, 87.7% SSLC)",
            "Hands-on experience with modern cloud technologies including Firebase, Supabase, and Cloudinary for scalable application development",
            "Selected for national-level Smart India Hackathon 2025, showcasing leadership and innovation in AI-driven solutions",
            "Strong foundation in multiple programming languages (Python, Java, C/C++, JavaScript) with formal certifications",
            "Practical IoT engineering experience building PDS Dispenser system with hardware-software integration",
            "Active participation and recognition in multiple hackathons (MSME, Embededthon, SIH) demonstrating continuous learning mindset"
        ],
        "improvements": [
            "Deepen backend development expertise by learning Node.js, Express.js, or Django to complement your React frontend skills",
            "Gain hands-on experience with cloud platforms (AWS, Azure, or GCP) focusing on deployment, serverless functions, and cloud databases",
            "Master advanced database concepts including NoSQL (MongoDB), SQL optimization, and database design patterns",
            "Learn containerization with Docker and orchestration with Kubernetes to understand modern DevOps practices",
            "Build more complex AI/ML projects using TensorFlow or PyTorch to leverage your AI & Data Science degree",
            "Implement comprehensive testing strategies including unit tests, integration tests, and test-driven development (TDD)",
            "Study system design principles and architectural patterns for building scalable applications",
            "Contribute to open-source projects on GitHub to build visibility and collaborate with developers globally",
            "Create a professional portfolio website showcasing your impressive projects with detailed case studies",
            "Expand LeetCode practice to 200+ problems focusing on medium and hard difficulty to strengthen DSA skills for tech interviews"
        ],
        "overallScore": 78,
        "summary": "JEYANDAN A is a highly motivated and accomplished B.Tech AI & Data Science student at Sri Eshwar College of Engineering with an impressive 8.3 CGPA. Despite being in the early stages of his degree (2024-2028), he has already demonstrated exceptional technical prowess and entrepreneurial spirit through a remarkable portfolio of real-world projects and competitive achievements.\n\nHis standout accomplishment is successfully delivering a commercial consultancy project - a complete matrimony system mobile application for client 'Yathu Mangala Malai' using React Native, Supabase, and Cloudinary. This demonstrates his ability to work with clients, understand requirements, and deliver production-ready full-stack solutions.\n\nJeyandan's technical versatility is impressive, spanning web development (React, JavaScript, HTML/CSS), mobile app development (React Native), backend technologies (Firebase, Supabase, SpringBoot), and even IoT hardware engineering (ESP32, Raspberry Pi, RF Reader) as evidenced by his PDS Dispenser project. His competitive programming credentials are equally strong with 800+ programs on Skillrack and 50+ on LeetCode.\n\nHis hackathon success story includes securing 2nd Runner Up at Embededthon and being selected as a top team from his college for the prestigious Smart India Hackathon 2025, where he's working on an AI-Driven Unified Data Platform for Oceanographic insights. These achievements showcase not just technical skills but also innovation, teamwork, and the ability to deliver under pressure.\n\nWith formal certifications in Python, C/C++, and HTML, strong academic performance (87.7% SSLC, 87.3% HSC), and practical experience across multiple technology domains, Jeyandan is well-positioned for roles in full-stack development, mobile app development, IoT engineering, or AI/ML development. He represents the ideal combination of academic excellence, practical project experience, competitive success, and continuous learning mindset that makes him a valuable asset for any technology team."
    }
    
    # Save to Firestore
    try:
        db.collection('users').document(user_id).set({
            'geminiAnalysis': analysis_data,
            'analysisDate': datetime.utcnow().isoformat(),
            'userId': user_id
        }, merge=True)
        
        print(f"✅ Successfully saved detailed resume analysis for JEYANDAN A")
        print(f"📊 Experience Level: {analysis_data['experienceLevel']}")
        print(f"⏱️  Total Experience: {analysis_data['totalYearsOfExperience']} year(s)")
        print(f"💼 Skills: {len(analysis_data['extractedSkills'])}")
        print(f"📁 Projects: {len(analysis_data['projects'])}")
        print(f"🏆 Achievements: {len(analysis_data['achievements'])}")
        print(f"⭐ Overall Score: {analysis_data['overallScore']}/100")
        print(f"\n🎯 Top Recommended Roles:")
        for role in analysis_data['recommendedRoles'][:3]:
            print(f"   - {role}")
        print(f"\n📚 Projects Included:")
        for project in analysis_data['projects']:
            print(f"   - {project['name']} ({project['type']})")
        print("\n🎉 Refresh your dashboard to see the detailed summary!")
        
    except Exception as e:
        print(f"❌ Error saving analysis: {str(e)}")

if __name__ == "__main__":
    seed_detailed_analysis()
