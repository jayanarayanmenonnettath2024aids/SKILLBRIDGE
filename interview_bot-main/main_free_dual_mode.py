"""
FREE AI-Powered Interview Bot - Dual Mode System (No API Keys Required)
MODE 1: Role/Domain-Based Interview
MODE 2: JD + Company-Based Interview
"""

from free_adaptive_session import FreeAdaptiveSession
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
    print_header("🤖 AI INTERVIEW BOT - SKILL CATALYST (FREE VERSION)")
    print("\n✨ 100% FREE - No API Keys Required - Powered by Open-Source AI")
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
    
    print("\nEnter job role(s), domain(s), or area(s) of interest:")
    print("Examples: 'Machine Learning Engineer', 'Blockchain Developer', 'Cloud Architect'")
    print("         'Cybersecurity', 'AI Research', 'Game Development'")
    print("\nYou can enter multiple roles separated by commas.")
    
    while True:
        user_input = input("\nYour role(s)/domain(s): ").strip()
        if user_input:
            roles = [role.strip() for role in user_input.split(',') if role.strip()]
            if roles:
                print(f"\n🔍 AI will research: {', '.join(roles)}")
                return roles, None, None
        print("❌ Please enter at least one role or domain.")

def mode2_setup():
    """Setup for JD + Company-Based Interview"""
    print_section("MODE 2: JOB DESCRIPTION + COMPANY-BASED INTERVIEW")
    
    company = input("\nEnter target company name: ").strip()
    
    print("\nPaste the Job Description below:")
    jd_text = get_multiline_input("Job Description:")
    
    if not company or not jd_text:
        print("❌ Company name and JD are required!")
        return None, None, None
    
    role = input("\nEnter job role/title: ").strip()
    
    return [role], company, jd_text

def run_interview(session):
    """Main interview loop"""
    
    intro = session.start_interview()
    print_header(intro["message"])
    
    if intro.get("jd_parsed"):
        print("✅ Job Description analyzed successfully")
    
    print("\n📝 Interview will continue until you choose to stop.")
    print("💡 Answer thoughtfully - feedback is personalized to YOUR responses.")
    print("🤖 Using FREE open-source AI models (no API costs!)\n")
    
    input("Press Enter to begin...")
    
    while True:
        print_section("GENERATING NEXT QUESTION...")
        question_data = session.get_next_question()
        
        print(f"\n[Question {question_data['question_number']}]")
        print(f"Category: {question_data['category']} | Difficulty: {question_data['difficulty']}")
        print(f"\n❓ {question_data['question']}")
        
        answer = get_multiline_input("\n💬 Your Answer:")
        
        if not answer:
            print("⚠️  Empty answer. Please provide a response.")
            continue
        
        print("\n⏳ Analyzing your answer with AI...")
        result = session.submit_answer(question_data, answer)
        evaluation = result["evaluation"]
        
        print_section("📊 DETAILED INTERVIEW FEEDBACK")
        
        # Interviewer Assessment (Strict)
        print("\n🔴 INTERVIEWER ASSESSMENT (Strict Evaluation)")
        print(f"Score: {evaluation['score']}/10")
        print(f"\n{evaluation.get('interviewer_assessment', evaluation.get('interviewer_evaluation', 'Assessment not available'))}")
        
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
        print("\n� MENTOR GUIDANCE (Constructive Support)")
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
        
        if 'next_focus' in evaluation:
            print(f"\n🔍 Next Focus: {evaluation['next_focus']}")
        
        print("\n" + "-"*70)
        continue_choice = input("\nContinue interview? (y/n): ").strip().lower()
        
        if continue_choice != 'y':
            break
    
    print_section("GENERATING COMPREHENSIVE REPORT...")
    report = session.get_final_report()
    
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
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"interview_{report['candidate_name'].replace(' ', '_')}_{timestamp}.json"
    filepath = session.export_report(filename)
    
    print(f"\n💾 Detailed report saved: {filepath}")
    print("\n" + "="*70)
    print("  Thank you for using AI Interview Bot!")
    print("  100% FREE - No API Costs - Open Source AI")
    print("="*70)

def main():
    """Main entry point"""
    
    candidate_name = input("\nEnter your name: ").strip()
    if not candidate_name:
        candidate_name = "Candidate"
    
    mode = select_mode()
    
    if mode == "role_based":
        roles, company, jd_text = mode1_setup()
    else:
        roles, company, jd_text = mode2_setup()
        if not roles:
            print("❌ Setup failed. Exiting.")
            return
    
    try:
        session = FreeAdaptiveSession(
            mode=mode,
            candidate_name=candidate_name,
            roles=roles,
            company=company,
            jd_text=jd_text
        )
        
        run_interview(session)
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Interview interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
