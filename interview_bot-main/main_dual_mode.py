"""
AI-Powered Interview Bot - Dual Mode System
MODE 1: Role/Domain-Based Interview
MODE 2: JD + Company-Based Interview
"""

from adaptive_session import AdaptiveInterviewSession
import os
from datetime import datetime

def print_header(text):
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70)

def print_section(text):
    print("\n" + "-"*70)
    print(f"  {text}")
    print("-"*70)

def get_multiline_input(prompt):
    """Get multi-line input (press Enter twice to submit)"""
    print(f"\n{prompt}")
    print("(Press Enter twice to submit)")
    lines = []
    empty_count = 0
    while empty_count < 1:
        line = input()
        if line == "":
            empty_count += 1
        else:
            empty_count = 0
            lines.append(line)
    return "\n".join(lines).strip()

def select_mode():
    """Select interview mode"""
    print_header("🤖 AI INTERVIEW BOT - SKILL CATALYST")
    print("\nSelect Interview Mode:")
    print("1. Role/Domain-Based Interview")
    print("2. Job Description + Company-Based Interview")
    
    while True:
        choice = input("\nEnter mode (1 or 2): ").strip()
        if choice in ["1", "2"]:
            return "role_based" if choice == "1" else "jd_based"
        print("❌ Invalid choice. Please enter 1 or 2.")

def mode1_setup():
    """Setup for Role/Domain-Based Interview"""
    print_section("MODE 1: ROLE/DOMAIN-BASED INTERVIEW")
    
    available_roles = [
        "Software Developer",
        "Data Scientist",
        "Data Analyst",
        "Product Manager",
        "DevOps Engineer",
        "UI/UX Designer",
        "Marketing Manager",
        "Business Analyst",
        "Full Stack Developer",
        "Machine Learning Engineer"
    ]
    
    print("\nAvailable Roles:")
    for i, role in enumerate(available_roles, 1):
        print(f"{i}. {role}")
    
    print("\nSelect one or more roles (comma-separated, e.g., 1,3,5):")
    while True:
        selection = input("Your selection: ").strip()
        try:
            indices = [int(x.strip()) - 1 for x in selection.split(",")]
            selected_roles = [available_roles[i] for i in indices if 0 <= i < len(available_roles)]
            if selected_roles:
                return selected_roles, None, None
            print("❌ Invalid selection. Try again.")
        except:
            print("❌ Invalid format. Use comma-separated numbers (e.g., 1,3).")

def mode2_setup():
    """Setup for JD + Company-Based Interview"""
    print_section("MODE 2: JOB DESCRIPTION + COMPANY-BASED INTERVIEW")
    
    company = input("\nEnter target company name: ").strip()
    
    print("\nPaste the Job Description below:")
    jd_text = get_multiline_input("Job Description:")
    
    if not company or not jd_text:
        print("❌ Company name and JD are required!")
        return None, None, None
    
    # Extract role from JD or ask
    role = input("\nEnter job role/title: ").strip()
    
    return [role], company, jd_text

def run_interview(session):
    """Main interview loop"""
    
    # Start interview
    intro = session.start_interview()
    print_header(intro["message"])
    
    if intro.get("jd_parsed"):
        print("✅ Job Description analyzed successfully")
    
    print("\n📝 Interview will continue until you choose to stop.")
    print("💡 Answer thoughtfully - feedback is personalized to YOUR responses.\n")
    
    input("Press Enter to begin...")
    
    # Interview loop
    while True:
        # Get next question
        print_section("GENERATING NEXT QUESTION...")
        question_data = session.get_next_question()
        
        print(f"\n[Question {question_data['question_number']}]")
        print(f"Category: {question_data['category']} | Difficulty: {question_data['difficulty']}")
        print(f"\n❓ {question_data['question']}")
        
        # Get answer
        answer = get_multiline_input("\n💬 Your Answer:")
        
        if not answer:
            print("⚠️  Empty answer. Please provide a response.")
            continue
        
        # Evaluate answer
        print("\n⏳ Analyzing your answer with AI...")
        result = session.submit_answer(question_data, answer)
        evaluation = result["evaluation"]
        
        # Display feedback with new structure
        print_section("📊 DETAILED INTERVIEW FEEDBACK")
        
        # Interviewer Assessment (Strict)
        print("\n🔴 INTERVIEWER ASSESSMENT (Strict Evaluation)")
        print(f"Score: {evaluation['score']}/10")
        print(f"\n{evaluation.get('interviewer_assessment', evaluation.get('feedback', 'Assessment not available'))}")
        
        # What Question Tested
        if evaluation.get('what_question_tested'):
            print(f"\n🎯 What This Question Tested:")
            print(f"   {evaluation['what_question_tested']}")
        
        # Specific Mistakes
        if evaluation.get('specific_mistakes'):
            print("\n❌ SPECIFIC MISTAKES IDENTIFIED:")
            for i, mistake in enumerate(evaluation['specific_mistakes'], 1):
                print(f"   {i}. {mistake}")
        
        # Why This Fails
        if evaluation.get('why_this_fails'):
            print(f"\n⚠️  Why This Concerns a Real Interviewer:")
            print(f"   {evaluation['why_this_fails']}")
        
        # Mentor Guidance (Supportive)
        print("\n🟢 MENTOR GUIDANCE (Constructive Support)")
        print(f"{evaluation.get('mentor_guidance', 'Focus on adding more specific details and examples.')}")
        
        # How to Improve
        if evaluation.get('how_to_improve'):
            print("\n✅ HOW TO IMPROVE:")
            for i, step in enumerate(evaluation['how_to_improve'], 1):
                print(f"   {i}. {step}")
        
        # Model Answer
        if evaluation.get('model_answer'):
            print("\n📚 MODEL ANSWER (What a Strong Answer Looks Like):")
            print(f"{evaluation['model_answer']}")
        
        # Strengths and Improvements
        if evaluation.get('strengths'):
            print(f"\n✨ Strengths:")
            for i, strength in enumerate(evaluation['strengths'], 1):
                print(f"   {i}. {strength}")
        
        if evaluation.get('improvements'):
            print(f"\n🎯 Priority Improvements:")
            for i, improvement in enumerate(evaluation['improvements'], 1):
                print(f"   {i}. {improvement}")
        
        if evaluation.get('next_focus'):
            print(f"\n🔍 Next Focus: {evaluation['next_focus']}")
        
        # Ask to continue
        print("\n" + "-"*70)
        continue_choice = input("\nContinue interview? (y/n): ").strip().lower()
        
        if continue_choice != 'y':
            break
    
    # Generate final report
    print_section("GENERATING COMPREHENSIVE REPORT...")
    report = session.get_final_report()
    
    # Display final report
    print_header("📋 FINAL INTERVIEW REPORT")
    
    print(f"\n👤 Candidate: {report['candidate_name']}")
    print(f"📅 Date: {report['interview_date']}")
    print(f"⏱️  Duration: {report['duration_minutes']} minutes")
    print(f"❓ Questions Answered: {report['questions_answered']}")
    print(f"📊 Average Score: {report['average_score']}/10")
    print(f"📈 Score Trend: {report['score_trend']}")
    
    print(f"\n📊 Category Performance:")
    for category, score in report['category_performance'].items():
        print(f"   • {category}: {score}/10")
    
    ai_assessment = report['ai_assessment']
    
    print(f"\n🎯 Readiness Level: {ai_assessment['readiness_level']}")
    print(f"📈 Success Probability: {ai_assessment['estimated_success_probability']}")
    
    # Overall Score if available
    if ai_assessment.get('overall_score'):
        print(f"\n⭐ Overall Interview Score: {ai_assessment['overall_score']}")
    
    print(f"\n✅ Top Strengths:")
    for i, strength in enumerate(ai_assessment['top_strengths'], 1):
        print(f"   {i}. {strength}")
    
    print(f"\n⚠️  Critical Gaps:")
    for i, gap in enumerate(ai_assessment['critical_gaps'], 1):
        print(f"   {i}. {gap}")
    
    print(f"\n💡 Specific Recommendations:")
    for i, rec in enumerate(ai_assessment['specific_recommendations'], 1):
        print(f"   {i}. {rec}")
    
    print(f"\n📝 Panel Assessment:")
    print(f"   {ai_assessment['overall_assessment']}")
    
    # Panel Verdict if available
    if ai_assessment.get('panel_verdict'):
        print(f"\n⚖️  Panel Verdict:")
        print(f"   {ai_assessment['panel_verdict']}")
    
    # Export report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"interview_{report['candidate_name'].replace(' ', '_')}_{timestamp}.json"
    filepath = session.export_report(filename)
    
    print(f"\n💾 Detailed report saved: {filepath}")
    print("\n" + "="*70)
    print("  Thank you for using AI Interview Bot!")
    print("="*70)

def main():
    """Main entry point"""
    
    # Get candidate name
    candidate_name = input("\nEnter your name: ").strip()
    if not candidate_name:
        candidate_name = "Candidate"
    
    # Select mode
    mode = select_mode()
    
    # Setup based on mode
    if mode == "role_based":
        roles, company, jd_text = mode1_setup()
    else:
        roles, company, jd_text = mode2_setup()
        if not roles:
            print("❌ Setup failed. Exiting.")
            return
    
    # Create session
    try:
        session = AdaptiveInterviewSession(
            mode=mode,
            candidate_name=candidate_name,
            roles=roles,
            company=company,
            jd_text=jd_text
        )
        
        # Run interview
        run_interview(session)
        
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        print("💡 Make sure OPENAI_API_KEY is set in .env file")
    except KeyboardInterrupt:
        print("\n\n⚠️  Interview interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
