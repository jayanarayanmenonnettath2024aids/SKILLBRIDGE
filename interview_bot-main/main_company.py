"""
Company-Specific AI Interview Bot
FREE - No API Key Required
"""

from company_session import CompanyInterviewSession
from question_bank import get_all_roles
from company_questions import get_available_companies

def run_company_interview():
    print("=" * 80)
    print("AI INTERVIEW BOT - Skill Catalyst Platform")
    print("Company-Specific Interview Preparation")
    print("FREE VERSION - Powered by Open-Source AI")
    print("=" * 80)
    
    # Get candidate info
    print("\n" + "-" * 80)
    candidate_name = input("Enter your name: ").strip() or "Candidate"
    
    # Select company
    companies = get_available_companies()
    print(f"\n📍 Target Company:")
    for i, company in enumerate(companies, 1):
        print(f"{i}. {company}")
    print(f"{len(companies) + 1}. Other/General")
    
    company_choice = input(f"\nEnter choice (1-{len(companies) + 1}): ").strip()
    try:
        company_index = int(company_choice) - 1
        if 0 <= company_index < len(companies):
            selected_company = companies[company_index]
        else:
            selected_company = None
    except:
        selected_company = None
    
    if not selected_company:
        print("Selected: General Interview (no specific company)")
    
    # Select role
    roles = get_all_roles()
    print(f"\n💼 Job Role:")
    for i, role in enumerate(roles, 1):
        print(f"{i}. {role}")
    
    role_choice = input(f"\nEnter choice (1-{len(roles)}): ").strip()
    try:
        role_index = int(role_choice) - 1
        if 0 <= role_index < len(roles):
            selected_role = roles[role_index]
        else:
            selected_role = roles[0]
            print(f"Invalid choice. Using {selected_role}")
    except:
        selected_role = roles[0]
        print(f"Invalid input. Using {selected_role}")
    
    # Initialize session
    print("\n⏳ Initializing interview session...")
    session = CompanyInterviewSession(
        role=selected_role,
        candidate_name=candidate_name,
        company=selected_company
    )
    
    # Start interview
    welcome = session.start_interview()
    print("\n" + "=" * 80)
    print(f"\n{welcome['message']}")
    print(f"Total Questions: {welcome['total_questions']}")
    
    if selected_company:
        print(f"\n💡 Tips for {selected_company}:")
        print(f"   - Research their products and culture")
        print(f"   - Understand their tech stack")
        print(f"   - Prepare examples aligned with their values")
    
    print(f"\n📋 Instructions:")
    print("- Answer each question thoughtfully")
    print("- Provide specific examples from your experience")
    print("- Press Enter twice to submit each answer")
    print("\n" + "=" * 80)
    
    # Process questions
    while True:
        current_q = session.get_current_question()
        
        if not current_q:
            break
        
        print(f"\n[Question {current_q['question_number']}/{current_q['total_questions']}]")
        print(f"Category: {current_q['category']}")
        print(f"\nQ: {current_q['question']}\n")
        
        print("Your Answer (press Enter twice when done):")
        lines = []
        empty_count = 0
        while empty_count < 2:
            line = input()
            if line == "":
                empty_count += 1
            else:
                empty_count = 0
            lines.append(line)
        
        answer = "\n".join(lines[:-2]) if len(lines) > 2 else "\n".join(lines)
        
        if not answer.strip():
            print("\n⚠️  Empty answer. Please provide an answer.")
            continue
        
        print("\n⏳ Evaluating your answer...")
        result = session.submit_answer(answer)
        
        if "error" in result:
            print(f"\n❌ Error: {result['error']}")
            continue
        
        evaluation = result['evaluation']
        
        # Display evaluation
        print("\n" + "=" * 80)
        print("📊 EVALUATION RESULTS")
        print("=" * 80)
        print(f"\n🎯 Overall Score: {evaluation['score']}/10")
        print(f"💬 Clarity: {evaluation['clarity_score']}/10")
        print(f"🔍 Depth: {evaluation['depth_score']}/10")
        print(f"📝 Key Concepts: {evaluation['keyword_coverage']}%")
        print(f"🔗 Relevance: {evaluation['semantic_similarity']}/10")
        
        print(f"\n✅ Strengths:")
        for i, strength in enumerate(evaluation['strengths'], 1):
            print(f"   {i}. {strength}")
        
        if evaluation['weaknesses']:
            print(f"\n⚠️  Areas for Improvement:")
            for i, weakness in enumerate(evaluation['weaknesses'], 1):
                print(f"   {i}. {weakness}")
        
        print(f"\n💡 Feedback: {evaluation['feedback']}")
        print(f"\n📖 Ideal Answer Reference:")
        print(f"   {evaluation['ideal_answer']}")
        print("\n" + "=" * 80)
        
        if result['has_next']:
            input("\nPress Enter to continue to next question...")
    
    # Final Report
    print("\n\n" + "=" * 80)
    print("📋 FINAL INTERVIEW REPORT")
    print("=" * 80)
    
    report = session.get_final_report()
    
    print(f"\n👤 Candidate: {report['candidate_name']}")
    print(f"💼 Role: {report['role']}")
    if report['company']:
        print(f"🏢 Company: {report['company']}")
    print(f"📅 Date: {report['interview_date']}")
    print(f"⏱️  Duration: {report['duration_minutes']} minutes")
    
    print(f"\n🎯 Overall Score: {report['overall_score']}/10")
    print(f"📈 Performance Level: {report['performance_level']}")
    
    print(f"\n📊 Category Breakdown:")
    for category, score in report['category_scores'].items():
        bar_length = int(score)
        bar = "█" * bar_length + "░" * (10 - bar_length)
        print(f"   {category:20s}: {bar} {score}/10")
    
    print(f"\n✅ Key Strengths:")
    for i, strength in enumerate(report['key_strengths'], 1):
        print(f"   {i}. {strength}")
    
    print(f"\n⚠️  Areas for Improvement:")
    for i, area in enumerate(report['areas_for_improvement'], 1):
        print(f"   {i}. {area}")
    
    print(f"\n💼 Recommendation:")
    print(f"   {report['recommendation']}")
    
    # Export report
    company_suffix = f"_{report['company']}" if report['company'] else ""
    report_file = f"interview_{candidate_name.replace(' ', '_')}_{report['role'].replace(' ', '_')}{company_suffix}.json"
    session.export_report(report_file)
    print(f"\n📄 Detailed report exported to: {report_file}")
    
    print("\n" + "=" * 80)
    print("✨ Thank you for using Skill Catalyst AI Interview Bot!")
    print("💪 Keep practicing and good luck with your interview!")
    print("=" * 80)

if __name__ == "__main__":
    try:
        run_company_interview()
    except KeyboardInterrupt:
        print("\n\nInterview interrupted.")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
