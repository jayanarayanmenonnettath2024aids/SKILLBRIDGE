"""
Advanced AI Interview Bot - Two Modes
MODE 1: Role/Domain-Based
MODE 2: JD + Company-Based
"""

from adaptive_session import AdaptiveInterviewSession
from datetime import datetime

def display_header():
    print("=" * 80)
    print("🎯 AI INTERVIEW BOT - Skill Catalyst Platform")
    print("Advanced Adaptive Interview System")
    print("=" * 80)

def select_mode():
    """Let user choose interview mode"""
    print("\n📋 SELECT INTERVIEW MODE:")
    print("1. Role/Domain-Based Interview (select job roles)")
    print("2. JD + Company-Based Interview (paste job description)")
    
    choice = input("\nEnter mode (1 or 2): ").strip()
    return "role_based" if choice == "1" else "jd_based"

def mode1_role_based():
    """MODE 1: Role/Domain-Based Interview"""
    
    print("\n" + "=" * 80)
    print("MODE 1: ROLE/DOMAIN-BASED INTERVIEW")
    print("=" * 80)
    
    candidate_name = input("\nEnter your name: ").strip() or "Candidate"
    
    print("\n💼 Available Roles:")
    roles_list = [
        "Software Developer", "Data Scientist", "Data Analyst",
        "Product Manager", "Marketing Manager", "UI/UX Designer",
        "DevOps Engineer", "Business Analyst", "Full Stack Developer",
        "Machine Learning Engineer", "Cloud Architect", "QA Engineer"
    ]
    
    for i, role in enumerate(roles_list, 1):
        print(f"{i}. {role}")
    
    print("\n💡 You can select multiple roles (e.g., 1,3,5)")
    role_input = input("Enter role numbers: ").strip()
    
    selected_roles = []
    for num in role_input.split(","):
        try:
            idx = int(num.strip()) - 1
            if 0 <= idx < len(roles_list):
                selected_roles.append(roles_list[idx])
        except:
            pass
    
    if not selected_roles:
        selected_roles = [roles_list[0]]
        print(f"Using default: {selected_roles[0]}")
    
    return candidate_name, selected_roles, None, None

def mode2_jd_based():
    """MODE 2: JD + Company-Based Interview"""
    
    print("\n" + "=" * 80)
    print("MODE 2: JD + COMPANY-BASED INTERVIEW")
    print("=" * 80)
    
    candidate_name = input("\nEnter your name: ").strip() or "Candidate"
    company = input("Enter target company: ").strip() or "Company"
    
    print("\n📄 Paste the Job Description (press Enter twice when done):")
    lines = []
    empty_count = 0
    while empty_count < 2:
        line = input()
        if line == "":
            empty_count += 1
        else:
            empty_count = 0
        lines.append(line)
    
    jd_text = "\n".join(lines[:-2]) if len(lines) > 2 else "\n".join(lines)
    
    if not jd_text.strip():
        print("⚠️  No JD provided. Using general interview mode.")
        jd_text = None
    
    # Extract role from JD or ask
    role = input("\nEnter primary role from JD: ").strip() or "Software Developer"
    
    return candidate_name, [role], company, jd_text

def run_interview():
    """Main interview loop"""
    
    display_header()
    
    # Select mode
    mode = select_mode()
    
    # Get interview parameters based on mode
    if mode == "role_based":
        candidate_name, roles, company, jd_text = mode1_role_based()
    else:
        candidate_name, roles, company, jd_text = mode2_jd_based()
    
    # Initialize session
    print("\n⏳ Initializing AI interviewer...")
    
    try:
        session = AdaptiveInterviewSession(
            mode=mode,
            candidate_name=candidate_name,
            roles=roles,
            company=company,
            jd_text=jd_text
        )
        
        welcome = session.start_interview()
        
        print("\n" + "=" * 80)
        print(f"✅ {welcome['message']}")
        print(f"\n📋 Interview Details:")
        print(f"   Mode: {welcome['mode']}")
        print(f"   Role(s): {', '.join(welcome['roles'])}")
        if welcome['company']:
            print(f"   Company: {welcome['company']}")
        if welcome['jd_parsed']:
            print(f"   ✓ Job description analyzed")
        
        print(f"\n💡 Instructions:")
        print("   - Answer each question thoughtfully")
        print("   - Press Enter twice to submit")
        print("   - Type 'stop' to end interview anytime")
        print("   - You'll get feedback after each answer")
        print("=" * 80)
        
        # Continuous interview loop
        while True:
            # Generate next question
            print("\n⏳ Generating next question...")
            question_data = session.get_next_question()
            
            print(f"\n[Question #{question_data['question_number']}]")
            print(f"Category: {question_data['category']} | Difficulty: {question_data['difficulty']}")
            print(f"\nQ: {question_data['question']}\n")
            
            # Get answer
            print("Your Answer (press Enter twice, or type 'stop' to end):")
            lines = []
            empty_count = 0
            while empty_count < 2:
                line = input()
                if line.strip().lower() == 'stop':
                    print("\n🛑 Interview stopped by user.")
                    return session
                if line == "":
                    empty_count += 1
                else:
                    empty_count = 0
                lines.append(line)
            
            answer = "\n".join(lines[:-2]) if len(lines) > 2 else "\n".join(lines)
            
            if not answer.strip():
                print("⚠️  Empty answer. Please provide an answer or type 'stop'.")
                continue
            
            # Evaluate
            print("\n⏳ Analyzing your answer...")
            result = session.submit_answer(question_data, answer)
            evaluation = result['evaluation']
            
            # Display feedback
            print("\n" + "=" * 80)
            print("📊 FEEDBACK")
            print("=" * 80)
            print(f"\n🎯 Score: {evaluation['score']}/10")
            print(f"\n💬 {evaluation['feedback']}")
            
            print(f"\n✅ Strengths:")
            for s in evaluation['strengths']:
                print(f"   • {s}")
            
            print(f"\n⚠️  Improvements:")
            for i in evaluation['improvements']:
                print(f"   • {i}")
            
            if 'follow_up_insight' in evaluation:
                print(f"\n🔍 Insight: {evaluation['follow_up_insight']}")
            
            print("=" * 80)
            
            # Ask to continue
            continue_choice = input("\n➡️  Continue interview? (yes/no): ").strip().lower()
            if continue_choice in ['no', 'n', 'stop']:
                print("\n✅ Interview completed by user choice.")
                break
        
        return session
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def display_final_report(session):
    """Display comprehensive final report"""
    
    if not session:
        return
    
    print("\n\n" + "=" * 80)
    print("📋 FINAL INTERVIEW REPORT")
    print("=" * 80)
    
    report = session.get_final_report()
    
    print(f"\n👤 Candidate: {report['candidate_name']}")
    print(f"💼 Role(s): {', '.join(report['roles'])}")
    if report['company']:
        print(f"🏢 Company: {report['company']}")
    print(f"📅 Date: {report['interview_date']}")
    print(f"⏱️  Duration: {report['duration_minutes']} minutes")
    print(f"❓ Questions: {report['questions_answered']}")
    
    print(f"\n🎯 Average Score: {report['average_score']}/10")
    print(f"📈 Score Trend: {report['score_trend']}")
    
    print(f"\n📊 Category Performance:")
    for cat, score in report['category_performance'].items():
        bar = "█" * int(score) + "░" * (10 - int(score))
        print(f"   {cat:15s}: {bar} {score}/10")
    
    ai_assessment = report['ai_assessment']
    
    print(f"\n🎓 Readiness Level: {ai_assessment.get('readiness_level', 'N/A')}")
    
    print(f"\n✅ Top Strengths:")
    for i, s in enumerate(ai_assessment.get('top_strengths', []), 1):
        print(f"   {i}. {s}")
    
    print(f"\n⚠️  Critical Gaps:")
    for i, g in enumerate(ai_assessment.get('critical_gaps', []), 1):
        print(f"   {i}. {g}")
    
    print(f"\n💡 Recommendations:")
    for i, r in enumerate(ai_assessment.get('specific_recommendations', []), 1):
        print(f"   {i}. {r}")
    
    print(f"\n📝 Overall Assessment:")
    print(f"   {ai_assessment.get('overall_assessment', 'N/A')}")
    
    if 'estimated_success_probability' in ai_assessment:
        print(f"\n🎲 Success Probability: {ai_assessment['estimated_success_probability']}")
    
    # Export
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"interview_{report['candidate_name'].replace(' ', '_')}_{timestamp}.json"
    session.export_report(filename)
    
    print(f"\n📄 Detailed report: {filename}")
    print("\n" + "=" * 80)
    print("✨ Thank you for using Skill Catalyst AI Interview Bot!")
    print("💪 Keep practicing and good luck!")
    print("=" * 80)

if __name__ == "__main__":
    try:
        session = run_interview()
        if session:
            display_final_report(session)
    except KeyboardInterrupt:
        print("\n\n🛑 Interview interrupted.")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
