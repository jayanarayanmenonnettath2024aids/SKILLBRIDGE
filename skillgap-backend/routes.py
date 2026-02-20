from flask import Blueprint, request, jsonify, send_from_directory
from services.profile_service import ProfileService
from services.opportunity_service import OpportunityService
from services.reasoning_service import ReasoningService
from services.mongodb_service import get_db
from services.skill_gap_service import SkillGapService
from services.gemini_service import get_gemini_service
from services.google_search_service import get_job_search_service
from services.youtube_service import get_youtube_service
import uuid
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import PyPDF2

api_bp = Blueprint('api', __name__)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ========================================
# Authentication Endpoints
# ========================================

@api_bp.route('/auth/register', methods=['POST'])
def register_user():
    """
    Register a new user with name, email, phone, and aadhaar.
    
    Request Body:
        {
            "name": "User Name",
            "email": "user@gmail.com",
            "phone": "1234567890",
            "aadhaar": "123456789012"
        }
    """
    try:
        data = request.json
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        aadhaar = data.get('aadhaar', '').strip()
        
        if not name or not email or not phone or not aadhaar:
            return jsonify({"error": "All fields are required"}), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Invalid email format"}), 400
        
        # Phone validation (10 digits)
        if not phone.isdigit() or len(phone) != 10:
            return jsonify({"error": "Phone number must be 10 digits"}), 400
        
        # Aadhaar validation (12 digits)
        if not aadhaar.isdigit() or len(aadhaar) != 12:
            return jsonify({"error": "Aadhaar number must be 12 digits"}), 400
        
        db = get_db()
        
        # Check if email already exists
        existing_email = db.auth_users.find_one({'email': email})
        if existing_email:
            return jsonify({"error": "Email already registered"}), 400
        
        # Check if Aadhaar already exists
        existing_aadhaar = db.auth_users.find_one({'aadhaar': aadhaar})
        if existing_aadhaar:
            return jsonify({"error": "Aadhaar number already registered"}), 400
        
        # Create new user
        user_id = str(uuid.uuid4())
        user_doc = {
            "_id": user_id,
            "name": name,
            "email": email,
            "phone": phone,
            "aadhaar": aadhaar,
            "role": "candidate",
            "createdAt": datetime.utcnow().isoformat(),
            "lastLogin": datetime.utcnow().isoformat()
        }
        
        db.auth_users.insert_one(user_doc)
        
        return jsonify({
            "message": "Registration successful!",
            "userId": user_id,
            "name": name,
            "email": email,
            "phone": phone,
            "createdAt": user_doc['createdAt']
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/auth/login', methods=['POST'])
def login_user():
    """
    Login user with name and email.
    
    Request Body:
        {
            "name": "User Name",
            "email": "user@gmail.com"
        }
    """
    try:
        data = request.json
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        
        if not name or not email:
            return jsonify({"error": "Name and email are required"}), 400
        
        db = get_db()
        user_doc = db.auth_users.find_one({'email': email})
        
        if user_doc is None:
            return jsonify({"error": "User not found. Please register first."}), 404
        
        user_data = user_doc
        
        # Verify name matches (case-insensitive)
        if user_data.get('name', '').lower() != name.lower():
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Update last login
        db.auth_users.update_one(
            {'_id': user_doc['_id']},
            {'$set': {"lastLogin": datetime.utcnow().isoformat()}}
        )
        
        return jsonify({
            "message": "Login successful!",
            "userId": user_doc['_id'],
            "name": user_data.get('name'),
            "email": user_data.get('email'),
            "phone": user_data.get('phone'),
            "createdAt": user_data.get('createdAt')
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================================
# Profile Endpoints
# ========================================

@api_bp.route('/profile', methods=['POST'])
def update_profile():
    data = request.json
    is_valid, msg = ProfileService.validate_profile(data)
    if not is_valid:
        return jsonify({"error": msg}), 400
    
    db = get_db()
    # For now, store a single global profile document. In a real app,
    # you'd use a user-specific document ID.
    db.profiles.update_one(
        {'_id': 'current_profile'},
        {'$set': data},
        upsert=True
    )

    return jsonify({"message": "Profile updated successfully", "profile": data})

@api_bp.route('/profile', methods=['GET'])
def get_profile():
    db = get_db()
    doc = db.profiles.find_one({'_id': 'current_profile'})

    if doc is None:
        return jsonify({})

    return jsonify(doc)

@api_bp.route('/opportunities/search', methods=['GET'])
def search_opportunities():
    query = request.args.get('q', 'hackathons')
    keywords = request.args.getlist('keywords')
    
    results = OpportunityService.search_opportunities(query, keywords)
    return jsonify([r.to_dict() for r in results])

@api_bp.route('/check-eligibility', methods=['POST'])
def check_eligibility():
    data = request.json
    opportunity = data.get('opportunity')
    
    # Use stored profile from MongoDB if not provided in request
    profile = data.get('profile')
    if not profile:
        db = get_db()
        doc = db.profiles.find_one({'_id': 'current_profile'})
        profile = doc if doc is not None else None
    
    if not profile or not opportunity:
        return jsonify({"error": "Profile and Opportunity data required"}), 400
        
    analysis = ReasoningService.check_eligibility(profile, opportunity)
    return jsonify(analysis)


# ========================================
# Skill Gap Analysis Endpoints
# ========================================

@api_bp.route('/users/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """
    Get user profile including resume analysis (geminiAnalysis)
    
    Args:
        user_id: The user ID
        
    Returns:
        JSON with user data including geminiAnalysis if available
    """
    try:
        db = get_db()
        user_doc = db.users.find_one({'_id': user_id})
        
        if user_doc is None:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        user_data = user_doc
        
        return jsonify({
            "success": True,
            "data": user_data
        })
        
    except Exception as e:
        print(f"❌ Error fetching user profile: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/users/<user_id>/resume', methods=['GET'])
def check_user_resume(user_id):
    """
    Check if user has uploaded a resume and get resume data
    
    Args:
        user_id: The user ID
        
    Returns:
        JSON with hasResume flag and resume data if available
    """
    try:
        db = get_db()
        user_doc = db.users.find_one({'_id': user_id})
        
        if user_doc is None:
            return jsonify({
                "success": False,
                "error": "User not found",
                "hasResume": False
            }), 404
        
        # Check if user has geminiAnalysis (resume)
        has_resume = 'geminiAnalysis' in user_doc and user_doc['geminiAnalysis'] is not None
        resume_url = user_doc.get('resumeURL', None)
        
        return jsonify({
            "success": True,
            "hasResume": has_resume,
            "resumeURL": resume_url,
            "geminiAnalysis": user_doc.get('geminiAnalysis', None) if has_resume else None,
            "analysis": user_doc.get('analysis', None) if has_resume else None
        })
        
    except Exception as e:
        print(f"❌ Error checking user resume: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "hasResume": False
        }), 500

@api_bp.route('/skill-gap/users', methods=['GET'])
def get_all_users():
    """
    Get all users from Firestore.
    
    Returns:
        JSON array of users with their basic info
    """
    try:
        users = SkillGapService.get_all_users()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/skill-gap/analysis/<user_id>', methods=['GET'])
def get_skill_gap_analysis(user_id):
    """
    Calculate and return comprehensive skill gap analysis for a user.
    
    Args:
        user_id: The user ID to analyze
        
    Returns:
        JSON with skill gaps, match percentage, readiness score
    """
    try:
        analysis = SkillGapService.calculate_skill_gap(user_id)
        return jsonify(analysis)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/skill-gap/required-skills/<role>', methods=['GET'])
def get_required_skills(role):
    """
    Get required skills for a specific job role.
    
    Args:
        role: The job role name
        
    Returns:
        JSON with role and required skills
    """
    try:
        skills = SkillGapService.get_required_skills_by_role(role)
        return jsonify(skills)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================================
# Resume Upload Endpoint
# ========================================

@api_bp.route('/resume/upload', methods=['POST'])
def upload_resume():
    """
    Upload resume PDF file and store locally
    
    Form Data:
        - file: PDF file
        - userId: User ID
    
    Returns:
        {
            "success": true,
            "resumeURL": "http://localhost:5000/api/files/resumes/{userId}/{filename}",
            "message": "Resume uploaded successfully"
        }
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400
        
        file = request.files['file']
        user_id = request.form.get('userId')
        
        if not user_id:
            return jsonify({"success": False, "error": "userId is required"}), 400
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"success": False, "error": "Only PDF files are allowed"}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Create unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{user_id}_{timestamp}_{filename}"
        
        # Store file locally
        storage_dir = os.path.join(UPLOAD_FOLDER, 'resumes', user_id)
        os.makedirs(storage_dir, exist_ok=True)
        
        final_path = os.path.join(storage_dir, unique_filename)
        file.save(final_path)
        
        # Create URL to access the file via Flask
        resume_url = f"http://localhost:5000/api/files/resumes/{user_id}/{unique_filename}"
        
        # Update user document in MongoDB (create if doesn't exist)
        db = get_db()
        db.users.update_one(
            {'_id': user_id},
            {
                '$set': {
                    'resumeURL': resume_url,
                    'resumeName': filename,
                    'resumeUploadedAt': datetime.utcnow().isoformat(),
                    'userId': user_id
                }
            },
            upsert=True
        )
        
        return jsonify({
            "success": True,
            "resumeURL": resume_url,
            "message": "Resume uploaded successfully"
        })
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ========================================
# AI-Powered Resume Analysis Endpoints (Gemini)
# ========================================

@api_bp.route('/ai/analyze-resume', methods=['POST'])
def analyze_resume():
    """
    Analyze resume using Gemini API
    
    Request Body:
        {
            "userId": "user123",
            "resumeURL": "https://firebasestorage.../resume.pdf"
        }
    
    Returns:
        Gemini analysis with skills, experience, recommendations
    """
    try:
        data = request.json
        user_id = data.get('userId')
        resume_url = data.get('resumeURL')
        target_domain = data.get('targetDomain', 'General')
        
        if not user_id or not resume_url:
            return jsonify({"error": "userId and resumeURL are required"}), 400
        
        print(f"\n{'='*60}")
        print(f"📄 Starting Resume Analysis")
        print(f"User ID: {user_id}")
        print(f"Resume URL: {resume_url}")
        print(f"Target Domain: {target_domain}")
        print(f"{'='*60}\n")
        
        try:
            # Initialize Gemini service
            print("🔧 Initializing Gemini service...")
            gemini_service = get_gemini_service()
            print("✅ Gemini service initialized")
            
            # Extract text from PDF
            print(f"📖 Extracting text from PDF: {resume_url}")
            
            # Check if it's a local file URL (localhost)
            if 'localhost' in resume_url or '127.0.0.1' in resume_url:
                # Convert localhost URL to local file path
                # URL format: http://localhost:5000/api/files/resumes/{userId}/{filename}
                url_parts = resume_url.split('/files/')
                if len(url_parts) == 2:
                    relative_path = url_parts[1]  # resumes/{userId}/{filename}
                    local_file_path = os.path.join(UPLOAD_FOLDER, relative_path)
                    print(f"📁 Converting localhost URL to file path: {local_file_path}")
                    
                    if os.path.exists(local_file_path):
                        print(f"✅ File exists, reading directly from filesystem")
                        # Read PDF directly from filesystem
                        import PyPDF2
                        with open(local_file_path, 'rb') as pdf_file:
                            pdf_reader = PyPDF2.PdfReader(pdf_file)
                            resume_text = ""
                            for page in pdf_reader.pages:
                                resume_text += page.extract_text() + "\n"
                            resume_text = resume_text.strip()
                    else:
                        print(f"❌ File not found: {local_file_path}")
                        raise FileNotFoundError(f"Resume file not found: {local_file_path}")
                else:
                    # Fallback to URL download if parsing fails
                    resume_text = gemini_service.extract_text_from_pdf_url(resume_url)
            else:
                # External URL (e.g., Firebase Storage), use HTTP download
                resume_text = gemini_service.extract_text_from_pdf_url(resume_url)
            
            print(f"✅ Extracted {len(resume_text)} characters from PDF")
            
            if len(resume_text) < 100:
                print(f"⚠️ WARNING: Resume text is very short ({len(resume_text)} chars)")
            
            # Analyze resume
            print(f"🤖 Starting Gemini AI analysis for user {user_id}")
            analysis_result = gemini_service.analyze_resume(resume_text, target_domain)
            print(f"📊 Analysis completed. Success: {analysis_result.get('success')}")
            
            if not analysis_result.get('success'):
                # Analysis completely failed
                error_msg = analysis_result.get('error', 'Unknown error')
                print(f"❌ Analysis failed: {error_msg}")
                return jsonify({
                    "success": False,
                    "error": f"AI analysis failed: {error_msg}",
                    "analysis": None
                }), 500
            
            # Store analysis in MongoDB (even if it's fallback analysis)
            print("💾 Storing analysis in MongoDB...")
            db = get_db()
            db.users.update_one(
                {'_id': user_id},
                {'$set': {
                    'geminiAnalysis': analysis_result['data'],
                    'analysisDate': datetime.utcnow().isoformat(),
                    'analysisFallback': 'warning' in analysis_result  # Flag if fallback was used
                }},
                upsert=True
            )
            print("✅ Analysis stored successfully in MongoDB")
            
            # Check if warning exists (fallback was used)
            warning_msg = analysis_result.get('warning')
            if warning_msg:
                print(f"⚠️ {warning_msg}")
            
            print(f"\n{'='*60}")
            print(f"✅ Resume Analysis Complete for User: {user_id}")
            print(f"{'='*60}\n")
            
            response_data = {
                "success": True,
                "analysis": analysis_result['data']
            }
            
            # Include warning if present
            if warning_msg:
                response_data['warning'] = warning_msg
            
            return jsonify(response_data)
        
        except Exception as analysis_error:
            # Log the error with full details
            error_msg = str(analysis_error)
            print(f"\n{'='*60}")
            print(f"❌ ANALYSIS ERROR")
            print(f"Error Type: {type(analysis_error).__name__}")
            print(f"Error Message: {error_msg}")
            print(f"User ID: {user_id}")
            print(f"Resume URL: {resume_url}")
            print(f"{'='*60}\n")
            
            import traceback
            traceback.print_exc()
            
            return jsonify({
                "success": False,
                "error": f"Resume analysis failed: {error_msg}",
                "analysis": None
            }), 500
        
    except Exception as e:
        print(f"\n❌ REQUEST ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route('/ai/resume-analysis/<user_id>', methods=['GET'])
def get_resume_analysis(user_id):
    """
    Get the Gemini AI resume analysis for a user
    
    Returns:
        Resume analysis including strengths, weaknesses, projects, skills, etc.
    """
    try:
        db = get_db()
        user_doc = db.users.find_one({'_id': user_id})
        
        if user_doc is None:
            return jsonify({"error": "User not found"}), 404
        
        user_data = user_doc
        gemini_analysis = user_data.get('geminiAnalysis')
        resume_url = user_data.get('resumeURL')
        
        if not gemini_analysis:
            # Return resume URL if available, even when analysis is missing
            if resume_url:
                return jsonify({
                    "error": "No resume analysis found for this user",
                    "resumeURL": resume_url,
                    "hint": "Resume uploaded but not analyzed. Click 'Re-analyze Resume' to process it."
                }), 404
            else:
                return jsonify({"error": "No resume analysis found for this user"}), 404
        
        return jsonify({
            "success": True,
            "analysis": gemini_analysis,
            "analysisDate": user_data.get('analysisDate'),
            "resumeURL": resume_url
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route('/ai/job-recommendations', methods=['GET'])
def get_job_recommendations_ai():
    """
    Get AI-powered job recommendations for a user
    
    Query Params:
        userId: User ID
    
    Returns:
        List of recommended jobs with match scores
    """
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({"error": "userId is required"}), 400
        
        # Get user profile from MongoDB
        db = get_db()
        user_doc = db.users.find_one({'_id': user_id})
        
        if user_doc is None:
            return jsonify({"error": "User not found"}), 404
        
        user_profile = user_doc
        
        # Generate recommendations using Gemini
        gemini_service = get_gemini_service()
        recommendations_result = gemini_service.generate_job_recommendations(user_profile)
        
        if not recommendations_result.get('success'):
            return jsonify(recommendations_result), 500
        
        # Store recommendations
        db.users.update_one(
            {'_id': user_id},
            {'$set': {
                'jobRecommendations': recommendations_result['data'].get('recommendations', []),
                'recommendationsDate': datetime.utcnow().isoformat()
            }}
        )
        
        return jsonify({
            "success": True,
            "data": recommendations_result['data']
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ========================================
# Job Matching Endpoints (Google Programmable Search)
# ========================================

def generate_mock_jobs(user_profile):
    """Generate mock job listings based on user profile"""
    domain = user_profile.get('interestedDomain', 'Software Engineer')
    skills = user_profile.get('skillsSelected', [])
    experience = user_profile.get('experienceLevel', 'Fresher')
    
    # Generate relevant mock jobs
    mock_jobs = [
        {
            "title": f"{domain} - {experience}",
            "link": "https://www.linkedin.com/jobs/view/example1",
            "snippet": f"We are looking for a talented {domain} with skills in {', '.join(skills[:3])}. Great opportunity for growth and learning.",
            "displayLink": "www.linkedin.com",
            "source": "LinkedIn",
            "matchScore": 92
        },
        {
            "title": f"Junior {domain}",
            "link": "https://www.indeed.com/viewjob?jk=example2",
            "snippet": f"Exciting role for {experience} candidate with knowledge of {', '.join(skills[:2])}. Remote-friendly company with great culture.",
            "displayLink": "www.indeed.com",
            "source": "Indeed",
            "matchScore": 87
        },
        {
            "title": f"{skills[0] if skills else 'Software'} Developer",
            "link": "https://www.naukri.com/job-listings/example3",
            "snippet": f"Join our team as a {skills[0] if skills else 'Software'} Developer. Work on cutting-edge projects with modern technologies including {', '.join(skills[1:3]) if len(skills) > 1 else 'latest frameworks'}.",
            "displayLink": "www.naukri.com",
            "source": "Naukri",
            "matchScore": 83
        },
        {
            "title": f"{domain} - Entry Level",
            "link": "https://www.glassdoor.com/job-listing/example4",
            "snippet": f"Great opportunity for freshers and entry-level {domain} professionals. We value skills in {', '.join(skills[:3])}. Competitive salary and benefits.",
            "displayLink": "www.glassdoor.com",
            "source": "Glassdoor",
            "matchScore": 79
        },
        {
            "title": f"Graduate {domain} Program",
            "link": "https://www.linkedin.com/jobs/view/example5",
            "snippet": f"Graduate training program for aspiring {domain}s. Perfect for candidates with {', '.join(skills[:2])} background. Mentorship included.",
            "displayLink": "www.linkedin.com",
            "source": "LinkedIn",
            "matchScore": 75
        }
    ]
    
    return {
        "success": True,
        "totalJobs": len(mock_jobs),
        "matchedJobs": mock_jobs,
        "note": "Mock job data - Google Search API requires enablement in Google Cloud Console"
    }

@api_bp.route('/jobs/search', methods=['POST'])
def search_jobs():
    """
    Search for real job listings using Google Programmable Search Engine
    Uses user's resume analysis (skills, experience) to find relevant jobs
    
    Request Body:
        {
            "userId": "user123",
            "jobTitle": "AI Engineer",  (optional - uses resume recommendations if not provided)
            "location": "Remote",
            "numResults": 10
        }
    
    Returns:
        Matched jobs from LinkedIn, Indeed, Naukri, Glassdoor with match scores
    """
    try:
        data = request.json
        user_id = data.get('userId')
        job_title = data.get('jobTitle')
        location = data.get('location', 'Remote')
        num_results = data.get('numResults', 10)
        
        print(f"\n🔍 Job Search Request:")
        print(f"   User ID: {user_id}")
        print(f"   Job Title: {job_title}")
        print(f"   Location: {location}")
        
        if not user_id:
            return jsonify({"error": "userId is required"}), 400
        
        # Get user profile from MongoDB
        db = get_db()
        user_doc = db.users.find_one({'_id': user_id})
        
        if user_doc is None:
            print(f"❌ User {user_id} not found in MongoDB")
            return jsonify({
                "success": False,
                "error": "User not found. Please upload your resume first."
            }), 404
        
        user_data = user_doc
        print(f"✅ User found. Checking for geminiAnalysis...")
        
        # Extract skills and domain from resume analysis
        gemini_analysis = user_data.get('geminiAnalysis', {})
        
        if not gemini_analysis:
            print(f"⚠️ No geminiAnalysis found for user {user_id}")
            return jsonify({
                "success": False,
                "error": "Resume analysis not found. Please upload and analyze your resume first.",
                "hint": "Visit the Resume Upload page to upload your resume."
            }), 404
        
        # Build intelligent user profile for job search
        user_profile = {}
        
        # Get skills from resume analysis
        extracted_skills = gemini_analysis.get('extractedSkills', [])
        if extracted_skills:
            # Extract just skill names
            user_profile['skillsSelected'] = [
                skill['skill'] if isinstance(skill, dict) else skill 
                for skill in extracted_skills
            ]
        else:
            print(f"⚠️ No extracted skills found, using empty list")
            user_profile['skillsSelected'] = []
        
        # Get experience level
        user_profile['experienceLevel'] = gemini_analysis.get('experienceLevel', 'Fresher')
        
        # Get interested domain from recommended roles or use provided job title
        if job_title:
            user_profile['interestedDomain'] = job_title
        else:
            # Use first recommended role from resume analysis
            recommended_roles = gemini_analysis.get('recommendedRoles', [])
            if recommended_roles:
                user_profile['interestedDomain'] = recommended_roles[0]
            else:
                user_profile['interestedDomain'] = 'Software Engineer'
        
        # Set location
        user_profile['location'] = location
        
        print(f"🔍 Searching jobs for user {user_id}")
        print(f"   Domain: {user_profile['interestedDomain']}")
        print(f"   Skills: {', '.join(user_profile['skillsSelected'][:5])}")
        print(f"   Experience: {user_profile['experienceLevel']}")
        print(f"   Location: {location}")
        
        # Search and match jobs using Google Search API
        search_service = get_job_search_service()
        result = search_service.search_and_match_jobs(user_profile)
        
        if not result.get('success'):
            error_msg = result.get('error', 'Unknown error')
            print(f"❌ Google Search API Error: {error_msg}")
            
            # Check if it's an API access error
            if 'does not have' in error_msg or 'Forbidden' in error_msg or '403' in error_msg:
                print("⚠️ Using mock job data as fallback")
                # Return mock job data based on user's skills
                result = generate_mock_jobs(user_profile)
            else:
                return jsonify(result), 500
        
        # Store job matches in MongoDB for caching
        db.users.update_one(
            {'_id': user_id},
            {'$set': {
                'jobMatches': result.get('matchedJobs', [])[:10],  # Store top 10
                'jobMatchesDate': datetime.utcnow().isoformat(),
                'lastSearchDomain': user_profile['interestedDomain']
            }},
            upsert=True
        )
        
        print(f"✅ Found {result.get('totalJobs', 0)} matching jobs")
        
        return jsonify({
            "success": True,
            "data": result,
            "searchCriteria": {
                "domain": user_profile['interestedDomain'],
                "skills": user_profile['skillsSelected'][:5],
                "experience": user_profile['experienceLevel'],
                "location": location
            }
        })
        
    except Exception as e:
        print(f"❌ Job search error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# ========================================
# User Profile Update Endpoint
# ========================================

@api_bp.route('/user/profile/update', methods=['POST'])
def update_user_profile():
    """
    Update user profile with interests, skills, and domain
    
    Request Body:
        {
            "userId": "user123",
            "interestedDomain": "AI Engineer",
            "skillsSelected": ["Python", "TensorFlow"],
            "fieldOfInterest": "Natural Language Processing",
            "experienceLevel": "Fresher",
            "location": "Remote"
        }
    
    Returns:
        Success message
    """
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({"error": "userId is required"}), 400
        
        # Extract profile fields
        profile_updates = {
            'interestedDomain': data.get('interestedDomain'),
            'skillsSelected': data.get('skillsSelected', []),
            'fieldOfInterest': data.get('fieldOfInterest'),
            'experienceLevel': data.get('experienceLevel', 'Fresher'),
            'location': data.get('location', 'Remote'),
            'profileUpdatedAt': datetime.utcnow().isoformat()
        }
        
        # Remove None values
        profile_updates = {k: v for k, v in profile_updates.items() if v is not None}
        
        # Update MongoDB
        db = get_db()
        db.users.update_one(
            {'_id': user_id},
            {'$set': profile_updates}
        )
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route('/skill-gap/seed-data', methods=['POST'])
def seed_skill_gap_data():
    """
    Seed synthetic data into MongoDB for demonstration.
    This endpoint is useful for quickly setting up demo data during hackathons.
    
    Returns:
        Success message
    """
    try:
        # Import here to avoid issues if seed_data is run standalone
        from seed_data import seed_synthetic_data
        seed_synthetic_data()
        return jsonify({
            "message": "Synthetic data seeded successfully!",
            "info": "Users and required skills have been added to MongoDB"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================================
# YouTube Learning Videos Endpoint
# ========================================

@api_bp.route('/ai/learning-videos/<user_id>', methods=['GET'])
def get_learning_videos(user_id):
    """
    Fetch educational YouTube videos based on user's resume analysis
    
    Args:
        user_id: The Firebase user ID
        
    Returns:
        JSON array of video objects with videoId, title, description, thumbnail, channelTitle
    """
    try:
        print(f"📺 Fetching learning videos for user: {user_id}")
        
        db = get_db()
        
        # Fetch user's resume analysis from MongoDB
        analysis_doc = db.resume_analysis.find_one({'_id': user_id})
        
        if analysis_doc is None:
            print(f"⚠️ No resume analysis found for user {user_id}")
            # Return fallback videos
            youtube_service = get_youtube_service()
            videos = youtube_service._get_fallback_videos()
            return jsonify({
                "success": True,
                "videos": videos,
                "message": "Showing default educational videos"
            })
        
        # Get resume analysis data
        analysis_data = analysis_doc
        analysis = analysis_data.get('analysis', {})
        
        print(f"✅ Found resume analysis for user {user_id}")
        
        # Get YouTube service and fetch videos
        youtube_service = get_youtube_service()
        videos = youtube_service.get_educational_videos(analysis, max_results=3)
        
        return jsonify({
            "success": True,
            "videos": videos,
            "user_id": user_id
        })
        
    except Exception as e:
        print(f"❌ Error fetching learning videos: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Return fallback videos even on error
        try:
            youtube_service = get_youtube_service()
            fallback_videos = youtube_service._get_fallback_videos()
            return jsonify({
                "success": True,
                "videos": fallback_videos,
                "message": "Showing default videos due to error"
            })
        except:
            return jsonify({"error": "Failed to fetch videos", "details": str(e)}), 500


# ========================================
# File Serving Endpoint
# ========================================

@api_bp.route('/files/resumes/<user_id>/<filename>', methods=['GET'])
def serve_resume(user_id, filename):
    """
    Serve uploaded resume files
    """
    try:
        file_dir = os.path.join('uploads', 'resumes', user_id)
        return send_from_directory(file_dir, filename, mimetype='application/pdf')
    except Exception as e:
        return jsonify({"error": "File not found"}), 404
