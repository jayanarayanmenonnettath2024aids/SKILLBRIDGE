"""
Voice Engine - Speech-to-Text and Text-to-Speech
Uses OpenAI Whisper (STT) + OpenAI TTS for voice interviews
"""

import os
from openai import OpenAI
from dotenv import load_dotenv
import pyaudio
import wave
import tempfile
from pathlib import Path
import threading
import queue

load_dotenv()

class VoiceEngine:
    def __init__(self):
        """Initialize voice engine with OpenAI"""
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Audio recording settings
        self.CHUNK = 1024
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.RATE = 16000
        
        # TTS voice options: alloy, echo, fable, onyx, nova, shimmer
        self.tts_voice = "nova"  # Professional female voice (good for interviews)
        
        print("✅ Voice Engine initialized (Whisper + OpenAI TTS)")
    
    def record_audio(self, duration=None, output_path=None):
        """
        Record audio from microphone
        
        Args:
            duration: Recording duration in seconds (None = record until Enter pressed)
            output_path: Path to save audio file (None = use temp file)
        
        Returns:
            Path to recorded audio file
        """
        if output_path is None:
            temp_dir = tempfile.gettempdir()
            output_path = os.path.join(temp_dir, "interview_recording.wav")
        
        audio = pyaudio.PyAudio()
        
        # Open microphone stream
        stream = audio.open(
            format=self.FORMAT,
            channels=self.CHANNELS,
            rate=self.RATE,
            input=True,
            frames_per_buffer=self.CHUNK
        )
        
        print("\n🎤 Recording... (Press Enter to stop)")
        frames = []
        
        if duration:
            # Fixed duration recording
            for _ in range(0, int(self.RATE / self.CHUNK * duration)):
                data = stream.read(self.CHUNK)
                frames.append(data)
        else:
            # Record until Enter pressed
            stop_recording = queue.Queue()
            
            def wait_for_enter():
                input()
                stop_recording.put(True)
            
            threading.Thread(target=wait_for_enter, daemon=True).start()
            
            while stop_recording.empty():
                try:
                    data = stream.read(self.CHUNK, exception_on_overflow=False)
                    frames.append(data)
                except:
                    pass
        
        print("🛑 Recording stopped")
        
        # Stop and close stream
        stream.stop_stream()
        stream.close()
        audio.terminate()
        
        # Save to WAV file
        wf = wave.open(output_path, 'wb')
        wf.setnchannels(self.CHANNELS)
        wf.setsampwidth(audio.get_sample_size(self.FORMAT))
        wf.setframerate(self.RATE)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        return output_path
    
    def speech_to_text(self, audio_path):
        """
        Convert speech to text using OpenAI Whisper
        
        Args:
            audio_path: Path to audio file
        
        Returns:
            Transcribed text
        """
        print("🔄 Transcribing audio...")
        
        try:
            with open(audio_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="en"  # Can be removed for auto-detection
                )
            
            text = transcript.text
            print(f"✅ Transcription: \"{text}\"\n")
            return text
            
        except Exception as e:
            print(f"❌ Transcription error: {e}")
            return None
    
    def text_to_speech(self, text, output_path=None, play_audio=True):
        """
        Convert text to speech using OpenAI TTS
        
        Args:
            text: Text to convert to speech
            output_path: Path to save audio file (None = use temp file)
            play_audio: Whether to play audio immediately
        
        Returns:
            Path to generated audio file
        """
        if output_path is None:
            temp_dir = tempfile.gettempdir()
            output_path = os.path.join(temp_dir, "interview_response.mp3")
        
        print("🔄 Generating speech...")
        
        try:
            response = self.client.audio.speech.create(
                model="tts-1",  # Use tts-1-hd for higher quality
                voice=self.tts_voice,
                input=text
            )
            
            # Save audio file
            response.stream_to_file(output_path)
            print("✅ Speech generated")
            
            if play_audio:
                self.play_audio(output_path)
            
            return output_path
            
        except Exception as e:
            print(f"❌ TTS error: {e}")
            return None
    
    def play_audio(self, audio_path):
        """
        Play audio file using system default player
        
        Args:
            audio_path: Path to audio file
        """
        print("🔊 Playing audio...")
        
        try:
            import platform
            import subprocess
            
            system = platform.system()
            
            if system == "Darwin":  # macOS
                subprocess.run(["afplay", audio_path], check=True)
            elif system == "Linux":
                subprocess.run(["mpg123", audio_path], check=True)
            elif system == "Windows":
                os.startfile(audio_path)
            
            print("✅ Audio playback complete\n")
            
        except Exception as e:
            print(f"⚠️ Could not play audio automatically: {e}")
            print(f"📁 Audio saved at: {audio_path}\n")
    
    def record_and_transcribe(self):
        """
        Record audio from microphone and transcribe to text
        
        Returns:
            Transcribed text
        """
        audio_path = self.record_audio()
        text = self.speech_to_text(audio_path)
        
        # Clean up temp file
        try:
            os.remove(audio_path)
        except:
            pass
        
        return text
    
    def speak(self, text):
        """
        Speak text using TTS
        
        Args:
            text: Text to speak
        """
        audio_path = self.text_to_speech(text, play_audio=True)
        
        # Clean up temp file after a delay
        if audio_path:
            try:
                import time
                time.sleep(1)  # Wait for playback
                os.remove(audio_path)
            except:
                pass
    
    def set_voice(self, voice_name):
        """
        Change TTS voice
        
        Args:
            voice_name: Voice name (alloy, echo, fable, onyx, nova, shimmer)
        """
        valid_voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
        
        if voice_name.lower() in valid_voices:
            self.tts_voice = voice_name.lower()
            print(f"✅ Voice changed to: {self.tts_voice}")
        else:
            print(f"❌ Invalid voice. Choose from: {', '.join(valid_voices)}")


# Test function
if __name__ == "__main__":
    print("=" * 70)
    print("  VOICE ENGINE TEST")
    print("=" * 70)
    
    voice = VoiceEngine()
    
    print("\n1. Testing Text-to-Speech...")
    voice.speak("Hello! I'm your AI interviewer. Let's begin the interview.")
    
    print("\n2. Testing Speech-to-Text...")
    print("Please say something when prompted...")
    text = voice.record_and_transcribe()
    
    if text:
        print(f"\nYou said: {text}")
        voice.speak(f"You said: {text}")
    
    print("\n✅ Voice engine test complete!")
