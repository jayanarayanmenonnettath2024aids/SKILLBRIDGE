"""
Voice Interview Mode - Speak with the AI Interviewer
Uses Whisper STT + OpenAI TTS + Llama 3.3 AI Engine
"""

import sys
from datetime import datetime
from voice_engine import VoiceEngine
from free_adaptive_session import FreeAdaptiveSession

def print_banner():
    print("\n" + "=" * 70)
    print("  🎤 VOICE INTERVIEW MODE - AI SKILL CATALYST")
    print("=" * 70)
    print("\n🔊 Speak naturally - The AI will listen and respond with voice")
    print("🎯 This simulates a REAL voice interview experience")
    print("💡 Answer questions out loud - Just like a real interview!\n")

def get_interview_mode():
    """Get interview mode selection"""
    print("Select Interview Mode:")
    print("1. Role/Domain-Based Interview")
    print("2. Job Description + Company-Based Interview")
    
    while True:
        choice = input("\nEnter mode (1 or 2): ").strip()
        if choice in ["1", "2"]:
            return "role_based" if choice == "1" else "jd_based"
        print("❌ Invalid choice. Please enter 1 or 2.")

def get_role_based_input(voice):
    """Get input for role-based interview"""
    print("\n" + "-" * 70)
    print("  MODE 1: ROLE/DOMAIN-BASED INTERVIEW")
    print("-" * 70)
    
    roles_input = input("\nEnter role(s) (comma-separated): ").strip()
    roles = [r.strip() for r in roles_input.split(",") if r.strip()]
    
    if not roles:
        print("❌ No roles provided. Exiting.")
        sys.exit(1)
    
    # Ask for voice confirmation
    voice.speak(f"You've selected interview for: {', '.join(roles)}. Let's begin!")
    
    return roles, None, None

def get_jd_based_input(voice):
    """Get input for JD-based interview"""
    print("\n" + "-" * 70)
    print("  MODE 2: JOB DESCRIPTION + COMPANY-BASED INTERVIEW")
    print("-" * 70)
    
    company = input("\nEnter target company name: ").strip()
    
    print("\nPaste the Job Description below:")
    print("Job Description:")
    print("(Press Enter twice to submit)\n")
    
    jd_lines = []
    empty_count = 0
    while True:
        line = input()
        if not line.strip():
            empty_count += 1
            if empty_count >= 2:
                break
        else:
            empty_count = 0
            jd_lines.append(line)
    
    jd_text = "\n".join(jd_lines).strip()
    
    if not jd_text or not company:
        print("❌ Company name and JD are required. Exiting.")
        sys.exit(1)
    
    role = input("\nEnter job role/title: ").strip()
    
    # Voice confirmation
    voice.speak(f"You've selected interview for {role} at {company}. Analyzing the job description now.")
    
    return [role], company, jd_text

def run_voice_interview():
    """Main voice interview flow"""
    print_banner()
    
    # Initialize voice engine
    print("🔄 Initializing voice engine...")
    try:
        voice = VoiceEngine()
    except Exception as e:
        print(f"❌ Failed to initialize voice engine: {e}")
        print("\n💡 Make sure you have:")
        print("   1. OPENAI_API_KEY in .env file")
        print("   2. pyaudio installed: pip install pyaudio")
        sys.exit(1)
    
    # Get candidate name
    candidate_name = input("\nEnter your name: ").strip() or "Candidate"
    
    # Welcome message
    voice.speak(f"Hello {candidate_name}! Welcome to your AI voice interview.")
    
    # Get interview mode
    mode = get_interview_mode()
    
    # Get interview parameters
    if mode == "role_based":
        roles, company, jd_text = get_role_based_input(voice)
    else:
        roles, company, jd_text = get_jd_based_input(voice)
    
    # Initialize session
    print("\n🔄 Preparing your interview...")
    session = FreeAdaptiveSession(
        mode=mode,
        candidate_name=candidate_name,
        roles=roles,
        company=company,
        jd_text=jd_text
    )
    
    # Start interview
    start_info = session.start_interview()
    
    print("\n" + "=" * 70)
    print(f"  Welcome {candidate_name}!")
    print(f"  {start_info['message']}")
    print("=" * 70)
    
    if start_info.get('jd_parsed'):
        print("✅ Job Description analyzed successfully")
    
    print("\n📝 Voice Interview Starting...")
    print("💡 Speak your answers naturally - The AI will evaluate them.")
    print("🎤 Type 'text' to switch to text mode for a question")
    print("🛑 Type 'quit' to end the interview\n")
    
    voice.speak("Your interview is starting now. I'll ask you questions, and you can answer by speaking. Let's begin!")
    
    input("Press Enter to begin...\n")
    
    # Interview loop
    while True:
        try:
            # Generate question
            print("-" * 70)
            print("  GENERATING NEXT QUESTION...")
            print("-" * 70)
            
            question_data = session.get_next_question()
            
            # Display question
            print(f"\n[Question {question_data['question_number']}]")
            print(f"Category: {question_data['category']} | Difficulty: {question_data['difficulty']}")
            print(f"\n❓ {question_data['question']}\n")
            
            # Speak question
            voice.speak(question_data['question'])
            
            # Get answer (voice or text)
            print("🎤 Your Answer: (Speak now, or type 'text' for text input, 'quit' to end)\n")
            
            # Check if user wants text mode
            choice_input = input("Press Enter to speak, or type 'text'/'quit': ").strip().lower()
            
            if choice_input == 'quit':
                print("\n⚠️ Interview ended by user.")
                break
            elif choice_input == 'text':
                # Text mode for this question
                print("\n💬 Text Mode - Type your answer:")
                print("(Press Enter twice to submit)\n")
                answer_lines = []
                empty_count = 0
                while True:
                    line = input()
                    if not line.strip():
                        empty_count += 1
                        if empty_count >= 2:
                            break
                    else:
                        empty_count = 0
                        answer_lines.append(line)
                answer = "\n".join(answer_lines).strip()
            else:
                # Voice mode (default)
                answer = voice.record_and_transcribe()
                
                if not answer:
                    print("❌ Could not understand audio. Please try again.")
                    continue
            
            if not answer or len(answer) < 10:
                print("❌ Answer too short. Please provide a detailed response.")
                voice.speak("Your answer was too short. Please provide more detail.")
                continue
            
            # Evaluate answer
            print("\n" + "-" * 70)
            print("  EVALUATING YOUR ANSWER...")
            print("-" * 70)
            
            feedback = session.submit_answer(question_data, answer)
            
            # Display feedback (text)
            print(f"\n⭐ Score: {feedback['score']}/10")
            print(f"\n📊 INTERVIEWER ASSESSMENT:")
            print(feedback.get('interviewer_assessment', feedback.get('interviewer_evaluation', 'N/A')))
            
            print(f"\n💡 MENTOR GUIDANCE:")
            print(feedback.get('mentor_guidance', 'N/A'))
            
            # Speak key feedback
            feedback_speech = f"You scored {feedback['score']} out of 10. "
            feedback_speech += feedback.get('mentor_guidance', '')[:200]  # First 200 chars
            
            voice.speak(feedback_speech)
            
            # Ask if user wants to continue
            print("\n" + "-" * 70)
            continue_choice = input("\nContinue to next question? (yes/no): ").strip().lower()
            
            if continue_choice in ['no', 'n', 'quit', 'exit']:
                break
            
        except KeyboardInterrupt:
            print("\n\n⚠️ Interview interrupted by user.")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            continue
    
    # Generate final report
    print("\n" + "=" * 70)
    print("  GENERATING FINAL INTERVIEW REPORT...")
    print("=" * 70)
    
    report = session.get_final_report()
    
    print(f"\n{'=' * 70}")
    print(f"  FINAL INTERVIEW ASSESSMENT - {candidate_name}")
    print(f"{'=' * 70}\n")
    
    print(f"Overall Score: {report['overall_score']}/10")
    print(f"Total Questions: {report['question_count']}")
    print(f"Interview Duration: {report['duration']}")
    
    print(f"\n{'-' * 70}")
    print("PANEL FEEDBACK:")
    print(f"{'-' * 70}")
    print(report['panel_feedback'])
    
    print(f"\n{'-' * 70}")
    print("TOP STRENGTHS:")
    print(f"{'-' * 70}")
    for i, strength in enumerate(report['strengths'], 1):
        print(f"{i}. {strength}")
    
    print(f"\n{'-' * 70}")
    print("AREAS FOR IMPROVEMENT:")
    print(f"{'-' * 70}")
    for i, area in enumerate(report['areas_for_improvement'], 1):
        print(f"{i}. {area}")
    
    print(f"\n{'-' * 70}")
    print("HIRING RECOMMENDATION:")
    print(f"{'-' * 70}")
    print(report['recommendation'])
    
    # Speak final summary
    final_speech = f"Your final score is {report['overall_score']} out of 10. "
    final_speech += report['recommendation'][:150]
    voice.speak(final_speech)
    
    # Save report
    filename = session.save_report()
    print(f"\n📄 Report saved: {filename}")
    
    print("\n" + "=" * 70)
    print("  Thank you for using AI Voice Interview Bot!")
    print("=" * 70)
    
    voice.speak("Thank you for completing the interview. Good luck with your job search!")


if __name__ == "__main__":
    run_voice_interview()
