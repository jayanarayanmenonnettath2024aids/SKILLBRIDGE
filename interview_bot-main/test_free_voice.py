#!/usr/bin/env python3
"""
Quick test of FREE voice system
Tests TTS (text-to-speech) and STT (speech-to-text)
"""

from free_voice_engine import FreeVoiceEngine

def test_tts():
    """Test text-to-speech"""
    print("\n" + "="*60)
    print("🎙️ TESTING FREE TEXT-TO-SPEECH (pyttsx3)")
    print("="*60)
    
    engine = FreeVoiceEngine()
    
    print("\n📢 The system will now speak a test message...")
    engine.speak("Hello! This is the free voice interview system. "
                "I'm using pyttsx3 for text to speech, which is completely free and offline. "
                "No API keys needed!")
    
    print("\n✅ TTS test complete!")

def test_stt():
    """Test speech-to-text"""
    print("\n" + "="*60)
    print("🎤 TESTING FREE SPEECH-TO-TEXT (Vosk)")
    print("="*60)
    
    engine = FreeVoiceEngine()
    
    if engine.vosk_model is None:
        print("⚠️ Speech-to-text not available. Vosk model not loaded.")
        return
    
    print("\n🎙️ Please speak after the beep, then press Enter when done...")
    print("   Try saying: 'Hello, this is a test of the voice system'")
    
    audio_path = engine.record_audio()
    
    print("\n📝 Transcribing your speech...")
    text = engine.speech_to_text(audio_path)
    
    print(f"\n✅ You said: {text}")

def test_full_cycle():
    """Test complete voice cycle: TTS -> record -> STT"""
    print("\n" + "="*60)
    print("🔄 TESTING COMPLETE VOICE CYCLE")
    print("="*60)
    
    engine = FreeVoiceEngine()
    
    # Ask a question with TTS
    question = "What is your favorite programming language?"
    print(f"\n🤖 Question: {question}")
    engine.speak(question)
    
    # Record answer
    print("\n🎤 Please answer the question...")
    audio_path = engine.record_audio()
    
    # Transcribe answer
    print("\n📝 Processing your answer...")
    answer = engine.speech_to_text(audio_path)
    
    print(f"\n✅ Your answer: {answer}")
    
    # Respond with TTS
    response = f"Great! You said: {answer}"
    print(f"\n🤖 Response: {response}")
    engine.speak(response)

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🎯 FREE VOICE SYSTEM TEST")
    print("   100% Free | No API Keys | Offline Processing")
    print("="*60)
    
    while True:
        print("\n\nWhat would you like to test?")
        print("1. Text-to-Speech (TTS) only")
        print("2. Speech-to-Text (STT) only")
        print("3. Complete voice cycle (TTS + STT)")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            test_tts()
        elif choice == "2":
            test_stt()
        elif choice == "3":
            test_full_cycle()
        elif choice == "4":
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1-4.")
