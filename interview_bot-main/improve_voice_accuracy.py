#!/usr/bin/env python3
"""
Voice Accuracy Test & Tips
Test your voice setup and get tips for better accuracy
"""

from free_voice_engine import FreeVoiceEngine
import os

def test_microphone():
    """Test microphone and provide tips"""
    print("\n" + "="*70)
    print("🎤 MICROPHONE & SPEECH TIPS FOR BEST ACCURACY")
    print("="*70)
    
    print("\n📋 BEFORE YOU SPEAK:")
    print("   1. Find a QUIET location (minimal background noise)")
    print("   2. Close windows, turn off fans/AC if possible")
    print("   3. Speak 1-2 feet away from microphone")
    print("   4. Test your microphone volume (System Preferences > Sound)")
    
    print("\n🗣️ WHILE SPEAKING:")
    print("   1. Speak at NORMAL pace (not too fast)")
    print("   2. ENUNCIATE clearly (pronounce each word)")
    print("   3. Use SIMPLE sentences (avoid complex jargon)")
    print("   4. Pause briefly between sentences")
    print("   5. Speak in a CONFIDENT, clear voice")
    
    print("\n⚙️ TECHNICAL TIPS:")
    print("   • Built-in Mac microphone works well")
    print("   • Headset microphone is even better")
    print("   • USB microphones provide best quality")
    print("   • Check microphone input level in System Preferences")
    
    print("\n📊 MODEL ACCURACY:")
    small_model = os.path.exists("vosk-model-small-en-us-0.15")
    large_model = os.path.exists("vosk-model-en-us-0.22")
    
    if large_model:
        print("   ✅ LARGE model installed (95%+ accuracy)")
        print("      You have the best model for accuracy!")
    elif small_model:
        print("   ⚠️ SMALL model installed (85-90% accuracy)")
        print("      For BETTER accuracy, download large model:")
        print("      python3 download_large_vosk_model.py")
    else:
        print("   ❌ No model found - will download on first use")
    
    print("\n" + "="*70)
    input("\nPress Enter to start recording test...")
    
    # Test recording
    print("\n🎤 Recording Test...")
    print("   Say: 'This is a test of the voice recognition system'")
    print("   Speak clearly and press Enter when done.\n")
    
    engine = FreeVoiceEngine()
    audio_path = engine.record_audio()
    
    print("\n📝 Transcribing...")
    text = engine.speech_to_text(audio_path)
    
    if text:
        expected = "this is a test of the voice recognition system"
        if expected in text.lower():
            print("\n✅ EXCELLENT! Transcription is accurate!")
        else:
            print("\n⚠️ Transcription differs from expected.")
            print(f"   Expected: 'This is a test of the voice recognition system'")
            print(f"   Got: '{text}'")
            print("\n💡 TIPS TO IMPROVE:")
            print("   • Speak slower and more clearly")
            print("   • Check microphone volume (System Preferences > Sound)")
            print("   • Reduce background noise")
            print("   • Consider downloading large model for better accuracy:")
            print("     python3 download_large_vosk_model.py")
    else:
        print("\n❌ No speech detected!")
        print("\n💡 TROUBLESHOOTING:")
        print("   • Check microphone is connected and working")
        print("   • Increase microphone input volume")
        print("   • Speak louder and closer to microphone")
        print("   • Test in System Preferences > Sound > Input")

def compare_models():
    """Show model comparison"""
    print("\n" + "="*70)
    print("📊 VOSK MODEL COMPARISON")
    print("="*70)
    
    print("\n1. SMALL Model (vosk-model-small-en-us-0.15)")
    print("   Size: 40 MB")
    print("   Accuracy: 85-90%")
    print("   Speed: Fast")
    print("   Best for: Quick testing, limited storage")
    print("   Status:", "✅ Installed" if os.path.exists("vosk-model-small-en-us-0.15") else "❌ Not installed")
    
    print("\n2. LARGE Model (vosk-model-en-us-0.22)")
    print("   Size: 1.8 GB")
    print("   Accuracy: 95%+")
    print("   Speed: Fast")
    print("   Best for: Production use, best accuracy")
    print("   Status:", "✅ Installed" if os.path.exists("vosk-model-en-us-0.22") else "❌ Not installed")
    
    print("\n💡 RECOMMENDATION:")
    if os.path.exists("vosk-model-en-us-0.22"):
        print("   You have the LARGE model - excellent choice!")
    else:
        print("   Download LARGE model for much better accuracy:")
        print("   python3 download_large_vosk_model.py")

def main():
    print("\n" + "="*70)
    print("🎯 VOICE ACCURACY HELPER")
    print("   Improve your speech recognition accuracy")
    print("="*70)
    
    while True:
        print("\n\nOptions:")
        print("1. Test microphone & get tips")
        print("2. Compare Vosk models")
        print("3. Download large model for better accuracy")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            test_microphone()
        elif choice == "2":
            compare_models()
        elif choice == "3":
            print("\n📥 Starting large model download...")
            os.system("python3 download_large_vosk_model.py")
        elif choice == "4":
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()
