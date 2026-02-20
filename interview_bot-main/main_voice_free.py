"""
FREE Voice Interview Mode - 100% FREE, NO API KEYS!
Uses Vosk (offline STT) + pyttsx3 (offline TTS) + Llama 3.3 (free OpenRouter)
"""

import sys
from datetime import datetime
from free_voice_engine import FreeVoiceEngine
from free_adaptive_session import FreeAdaptiveSession

def print_banner():
    print("\n" + "=" * 70)
    print("  🎤 FREE VOICE INTERVIEW MODE - 100% FREE!")
    print("=" * 70)
    print("\n💰 COST: $0.00 - Completely FREE!")
    print("🔊 Offline speech recognition (Vosk)")
    print("🎯 Offline text-to-speech (pyttsx3)")
    print("🧠 Free AI brain (Llama 3.3 via OpenRouter)")
    print("💡 Answer questions out loud - Just like a real interview!\n")

def get_interview_mode(voice, interaction_mode='text'):
    """Get interview mode selection; uses voice when in speech/hybrid"""
    prompt_text = "Select Interview Mode for content: 1 for Role/Domain-Based, 2 for Job Description + Company-Based."
    if interaction_mode in ('speech', 'hybrid') and voice:
        voice.speak("Please say 'role' for role-based interviews, or 'job' for job-description based interviews.")
        print("(Listening for interview mode...)")
        resp = voice.record_and_transcribe() or ""
        resp = resp.strip().lower()
        if resp:
            if 'role' in resp or 'one' in resp or '1' in resp:
                return 'role_based'
            if 'job' in resp or 'description' in resp or 'jd' in resp or 'two' in resp or '2' in resp:
                return 'jd_based'
        # Fallback to text input if voice was unclear
        print("Voice input unclear; falling back to keyboard input.")

    # Text fallback
    print("Select Interview Mode for content:")
    print("1. Role/Domain-Based Interview")
    print("2. Job Description + Company-Based Interview")
    while True:
        choice = input("\nEnter mode (1 or 2): ").strip()
        if choice in ["1", "2"]:
            return "role_based" if choice == "1" else "jd_based"
        print("❌ Invalid choice. Please enter 1 or 2.")


def get_interaction_mode():
    """Get global interaction mode: text-only, speech-only, or hybrid"""
    print("\nSelect Interaction Mode:")
    print("1. Text-only (type questions/answers) - fastest, no audio needed")
    print("2. Speech-only (speak answers; questions spoken)")
    print("3. Hybrid (questions spoken, you may answer via speech or type per-question)")

    while True:
        choice = input("\nEnter interaction mode (1/2/3): ").strip()
        if choice == '1':
            return 'text'
        if choice == '2':
            return 'speech'
        if choice == '3':
            return 'hybrid'
        print("❌ Invalid choice. Please enter 1, 2 or 3.")

def get_role_based_input(voice, interaction_mode='text'):
    """Get input for role-based interview"""
    print("\n" + "-" * 70)
    print("  MODE 1: ROLE/DOMAIN-BASED INTERVIEW")
    print("-" * 70)
    if interaction_mode in ('speech', 'hybrid'):
        voice.speak("Please say the role or roles you want to be interviewed for. Separate multiple roles by saying 'and'.")
        print("(Listening for role(s)...)")
        roles_text = voice.record_and_transcribe() or ""
        # Attempt simple split by ' and ' or commas
        roles = [r.strip() for r in roles_text.replace(' and ', ',').split(',') if r.strip()]
        if not roles:
            print("❌ No roles detected from voice. Falling back to text input.")
            roles_input = input("\nEnter role(s) (comma-separated): ").strip()
            roles = [r.strip() for r in roles_input.split(",") if r.strip()]
    else:
        roles_input = input("\nEnter role(s) (comma-separated): ").strip()
        roles = [r.strip() for r in roles_input.split(",") if r.strip()]

    if not roles:
        print("❌ No roles provided. Exiting.")
        sys.exit(1)

    # Voice confirmation
    if voice:
        voice.speak(f"You've selected interview for: {', '.join(roles)}. Let's begin!")

    return roles, None, None

def get_jd_based_input(voice, interaction_mode='text'):
    """Get input for JD-based interview"""
    print("\n" + "-" * 70)
    print("  MODE 2: JOB DESCRIPTION + COMPANY-BASED INTERVIEW")
    print("-" * 70)
    if interaction_mode in ('speech', 'hybrid'):
        # Use voice prompts to collect company, JD and role
        voice.speak("Please say the target company name after the beep.")
        print("(Listening for company name...)")
        company = voice.record_and_transcribe() or ""
        company = company.strip()

        # Offer dictation or paste for JD
        voice.speak("Would you like to dictate the job description or paste it? Say 'dictate' to speak or 'paste' to paste text.")
        choice = voice.record_and_transcribe() or "paste"
        choice = choice.strip().lower()

        if 'dict' in choice:
            voice.speak("Please dictate the job description. Press Enter when finished dictating.")
            print("(Listening for job description dictation...)")
            jd_text = voice.record_and_transcribe() or ""
        else:
            # Paste fallback via text input
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

        voice.speak("Now say the role or job title for this position.")
        print("(Listening for role/title...)")
        role = voice.record_and_transcribe() or ""
        role = role.strip()

        if not company or not jd_text or not role:
            print("❌ Missing company, JD or role. Falling back to text prompts.")
            # Fall back to text input for any missing values
            if not company:
                company = input("\nEnter target company name: ").strip()
            if not jd_text:
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
            if not role:
                role = input("\nEnter job role/title: ").strip()

        # Voice confirmation
        voice.speak(f"You've selected interview for {role} at {company}. Analyzing the job description now.")

        return [role], company, jd_text

    # Default text-only path
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
    # Voice confirmation (may be DummyVoice)
    if voice:
        voice.speak(f"You've selected interview for {role} at {company}. Analyzing the job description now.")
    return [role], company, jd_text

def run_free_voice_interview():
    """Main FREE voice interview flow"""
    print_banner()
    # Ask user for interaction mode (text/speech/hybrid)
    interaction_mode = get_interaction_mode()

    # Initialize voice engine only if needed
    voice = None
    if interaction_mode in ('speech', 'hybrid'):
        print("🔄 Initializing FREE voice engine (no API keys needed)...")
        try:
            voice = FreeVoiceEngine()
        except Exception as e:
            print(f"❌ Failed to initialize voice engine: {e}")
            print("\n💡 Make sure you have:")
            print("   1. pyaudio installed: pip install pyaudio")
            print("   2. pyttsx3 installed: pip install pyttsx3")
            print("   3. vosk installed: pip install vosk")
            print("Falling back to text-only interaction.")
            interaction_mode = 'text'

    # Simple DummyVoice for text-only mode to keep interfaces uniform
    class DummyVoice:
        def speak(self, text):
            print("[TTS]", text)

        def record_and_transcribe(self):
            # Used when a voice recording is requested in text-only mode
            print("\n[Text-only] Type your answer below. Press Enter twice to submit:\n")
            lines = []
            empty = 0
            while True:
                try:
                    l = input()
                except EOFError:
                    break
                if not l.strip():
                    empty += 1
                    if empty >= 2:
                        break
                else:
                    empty = 0
                    lines.append(l)
            return "\n".join(lines).strip()

    if interaction_mode == 'text' and voice is None:
        voice = DummyVoice()
    
    # Get candidate name (use voice if in speech/hybrid)
    if interaction_mode in ('speech', 'hybrid') and voice:
        voice.speak("Please say your full name after the beep.")
        print("(Listening for name...)")
        candidate_name = voice.record_and_transcribe() or "Candidate"
        candidate_name = candidate_name.strip() or "Candidate"
    else:
        candidate_name = input("\nEnter your name: ").strip() or "Candidate"

    # Welcome message
    if voice:
        voice.speak(f"Hello {candidate_name}! Welcome to your free AI interview.")
    else:
        print(f"Hello {candidate_name}! Welcome to your free AI interview.")
    
    # Get interview mode (use voice when available)
    mode = get_interview_mode(voice, interaction_mode=interaction_mode)
    
    # Get interview parameters
    if mode == "role_based":
        roles, company, jd_text = get_role_based_input(voice, interaction_mode=interaction_mode)
    else:
        roles, company, jd_text = get_jd_based_input(voice, interaction_mode=interaction_mode)
    
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
    
    print("\n📝 FREE Voice Interview Starting...")
    print("💡 Speak your answers naturally - The AI will evaluate them.")
    print("🎤 Type 'text' to switch to text mode for a question")
    print("🛑 Type 'quit' to end the interview\n")
    
    if voice:
        voice.speak("Your interview is starting now. I'll ask you questions, and you can answer according to the chosen interaction mode.")
    else:
        print("Your interview is starting now. Answer the questions in text.")
    
    # Start prompt
    if interaction_mode == 'speech' and voice:
        voice.speak("Starting interview now.")
    else:
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
            
            # Get answer according to interaction mode
            if interaction_mode == 'text':
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
            elif interaction_mode == 'speech':
                # Voice-only: record and transcribe automatically
                answer = voice.record_and_transcribe()
                if not answer:
                    print("❌ Could not understand audio. Please try again.")
                    continue
            else:  # hybrid
                print("🎤 Your Answer: (Press Enter to speak, or type 'text' for text input, 'quit' to end)\n")
                choice_input = input("Press Enter to speak, or type 'text'/'quit': ").strip().lower()
                if choice_input == 'quit':
                    print("\n⚠️ Interview ended by user.")
                    break
                elif choice_input == 'text':
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

            # Detailed model answer and suggestions
            model_ans = feedback.get('evaluation', {}).get('model_answer') or feedback.get('model_answer')
            suggestions = feedback.get('evaluation', {}).get('suggestions') or feedback.get('suggestions')
            mistakes = feedback.get('evaluation', {}).get('specific_mistakes') or feedback.get('specific_mistakes')

            if model_ans:
                print(f"\n🧾 MODEL / IDEAL ANSWER:\n{model_ans}\n")

            if mistakes:
                print("🔍 SPECIFIC MISTAKES:")
                for m in mistakes:
                    print(f" - {m}")

            if suggestions:
                print("\n🛠️ HOW TO IMPROVE:")
                for s in suggestions:
                    print(f" - {s}")
            
            # Speak key feedback (short version)
            feedback_speech = f"You scored {feedback['score']} out of 10. "
            mentor_text = feedback.get('mentor_guidance', '')
            if len(mentor_text) > 150:
                feedback_speech += mentor_text[:150] + "..."
            else:
                feedback_speech += mentor_text
            
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
            import traceback
            traceback.print_exc()
            continue
    
    # Generate final report
    print("\n" + "=" * 70)
    print("  GENERATING FINAL INTERVIEW REPORT...")
    print("=" * 70)
    
    report = session.get_final_report()
    
    print(f"\n{'=' * 70}")
    print(f"  FINAL INTERVIEW ASSESSMENT - {candidate_name}")
    print(f"{'=' * 70}\n")

    print(f"Average Score: {report.get('average_score', 'N/A')}")
    print(f"Total Questions Answered: {report.get('questions_answered', report.get('question_count', 0))}")
    print(f"Interview Duration (min): {report.get('duration_minutes', 0)}")

    print(f"\n{'-' * 70}")
    print("CATEGORY PERFORMANCE:")
    print(f"{'-' * 70}")
    for cat, val in report.get('category_performance', {}).items():
        print(f"{cat}: {val}")

    # Speak final summary (short version)
    final_score = report.get('average_score', 0)
    final_speech = f"Your average score is {final_score} out of 10."
    if voice:
        voice.speak(final_speech)
    else:
        print(final_speech)

    # Save report
    filename = f"{candidate_name.replace(' ', '_')}_interview_report.json"
    session.export_report(filename)
    print(f"\n📄 Report saved: {filename}")
    
    print("\n" + "=" * 70)
    print("  Thank you for using FREE AI Voice Interview Bot!")
    print("  💰 Total Cost: $0.00 - Completely FREE!")
    print("=" * 70)
    
    voice.speak("Thank you for completing the interview. Good luck with your job search!")


if __name__ == "__main__":
    # Support a non-interactive headless test mode for automated runs
    if '--headless' in sys.argv:
        # Minimal headless run: text-only, one question & answer cycle
        print('Running headless test...')
        # Use DummyVoice from the interactive function scope by re-creating minimal behavior
        class _DummyVoice:
            def speak(self, text):
                print('[TTS]', text)

        voice = _DummyVoice()
        # Create a session and run one Q/A
        session = FreeAdaptiveSession(mode='role_based', candidate_name='AutomatedTest', roles=['Software Developer'])
        q = session.get_next_question()
        print('\n[Headless] Question:', q['question'])
        answer = 'I have experience with Python, SQL and REST APIs. I led projects and improved performance.'
        print('\n[Headless] Answering:', answer)
        fb = session.submit_answer(q, answer)
        print('\n[Headless] Feedback:', fb)
        report = session.get_final_report()
        print('\n[Headless] Final report keys:', list(report.keys()))
        fname = 'automated_headless_report.json'
        session.export_report(fname)
        print('\n[Headless] Report saved as', fname)
    else:
        run_free_voice_interview()
