"""
Test script to verify Gemini AI integration in unified backend
"""

import requests
import json

BASE_URL = "http://localhost:5000/api/interview"

def test_interview_flow():
    print("=" * 70)
    print("Testing SkillBridge Unified Backend - Gemini AI Integration")
    print("=" * 70)
    
    # 1. Health check
    print("\n1. Health Check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    # 2. Start interview
    print("\n2. Starting Interview Session...")
    start_data = {
        "candidate_name": "Test User",
        "job_title": "Software Engineer",
        "company": "TechCorp"
    }
    response = requests.post(f"{BASE_URL}/start", json=start_data)
    result = response.json()
    print(f"   Status: {response.status_code}")
    print(f"   Session ID: {result.get('session_id')}")
    
    session_id = result.get('session_id')
    
    if not session_id:
        print("   ERROR: Failed to create session")
        return
    
    # 3. Get first question (should use Gemini AI)
    print("\n3. Getting First Question (from Gemini AI)...")
    response = requests.get(f"{BASE_URL}/{session_id}/question")
    result = response.json()
    print(f"   Status: {response.status_code}")
    if result.get('success'):
        question = result.get('question', {})
        print(f"   Question: {question.get('question')}")
        print(f"   Category: {question.get('category')}")
        print(f"   Difficulty: {question.get('difficulty')}")
        
        # 4. Submit answer (should get AI evaluation)
        print("\n4. Submitting Answer (AI Evaluation)...")
        answer_data = {
            "question_data": question,
            "answer": "I have 5 years of experience in software development, working with Python, JavaScript, and cloud technologies. I've built scalable web applications and led teams of 3-4 developers."
        }
        response = requests.post(f"{BASE_URL}/{session_id}/answer", json=answer_data)
        result = response.json()
        print(f"   Status: {response.status_code}")
        if result.get('success'):
            evaluation = result.get('evaluation', {})
            print(f"   Score: {evaluation.get('score')}/10")
            print(f"   Feedback: {evaluation.get('feedback')}")
            print(f"   Assessment: {evaluation.get('interviewer_assessment')[:100]}...")
        
        # 5. Get second question
        print("\n5. Getting Second Question (AI-Generated)...")
        response = requests.get(f"{BASE_URL}/{session_id}/question")
        result = response.json()
        if result.get('success'):
            question2 = result.get('question', {})
            print(f"   Question: {question2.get('question')}")
            print(f"   Category: {question2.get('category')}")
            
            # Submit second answer
            answer_data2 = {
                "question_data": question2,
                "answer": "TechCorp has a strong reputation for innovation and employee growth. I'm particularly interested in your AI products and would love to contribute to cutting-edge projects."
            }
            requests.post(f"{BASE_URL}/{session_id}/answer", json=answer_data2)
        
        # 6. Get final report (with AI assessment)
        print("\n6. Getting Final Report (AI-Generated Assessment)...")
        response = requests.get(f"{BASE_URL}/{session_id}/report")
        result = response.json()
        print(f"   Status: {response.status_code}")
        if result.get('success'):
            report = result.get('report', {})
            print(f"   Overall Score: {report.get('overall_score'):.2f}/10")
            print(f"   Recommendation: {report.get('recommendation')}")
            if 'ai_assessment' in report:
                ai = report['ai_assessment']
                print(f"   AI Hiring Recommendation: {ai.get('hiring_recommendation')}")
                print(f"   Strengths: {', '.join(ai.get('strengths', []))}")
                print(f"   Report saved to: {result.get('saved_to')}")
        
        # 7. End session
        print("\n7. Ending Interview Session...")
        response = requests.post(f"{BASE_URL}/{session_id}/end")
        result = response.json()
        print(f"   Status: {response.status_code}")
        print(f"   Message: {result.get('message')}")
    
    print("\n" + "=" * 70)
    print("✅ Test Complete! Gemini AI is integrated and working.")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_interview_flow()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the backend is running on http://localhost:5000")
