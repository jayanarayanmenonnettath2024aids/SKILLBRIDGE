"""
FREE Voice Engine - 100% Free Voice Solution
Uses Vosk (offline STT) + pyttsx3 (offline TTS)
NO API KEYS REQUIRED - Completely free and offline
"""

import os
import pyaudio
import wave
import tempfile
import json
from pathlib import Path

class FreeVoiceEngine:
    def __init__(self):
        """Initialize FREE voice engine - no API keys needed"""
        self.CHUNK = 1024
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.RATE = 16000
        
        # Initialize TTS engine
        try:
            import pyttsx3
            self.tts_engine = pyttsx3.init()
            
            # Configure voice
            voices = self.tts_engine.getProperty('voices')
            # Try to use a female voice if available
            for voice in voices:
                if 'female' in voice.name.lower() or 'samantha' in voice.name.lower():
                    self.tts_engine.setProperty('voice', voice.id)
                    break
            
            # Set speech rate
            self.tts_engine.setProperty('rate', 175)  # Speed
            self.tts_engine.setProperty('volume', 0.9)  # Volume
            
            print("✅ FREE Voice Engine initialized (pyttsx3 TTS)")
        except Exception as e:
            print(f"⚠️ TTS initialization failed: {e}")
            self.tts_engine = None
        
        # Initialize STT engine
        self.vosk_model = None
        self._init_vosk()
    
    def _init_vosk(self):
        """Initialize Vosk speech recognition with better model"""
        try:
            from vosk import Model, KaldiRecognizer, SetLogLevel
            
            # Suppress Vosk logs for cleaner output
            SetLogLevel(-1)
            
            # Try larger model for better accuracy first
            model_paths = [
                "vosk-model-en-us-0.22",  # Large model - better accuracy
                "vosk-model-small-en-us-0.15"  # Small model - fallback
            ]
            
            model_path = None
            for path in model_paths:
                if os.path.exists(path):
                    model_path = path
                    break
            
            if not model_path:
                print("⚠️ Vosk model not found. Downloading larger model for better accuracy...")
                print("   This is a one-time download (~1.8GB for high accuracy)")
                print("   Or press Ctrl+C to use smaller model (40MB, lower accuracy)")
                try:
                    self._download_vosk_model(use_large=True)
                    model_path = "vosk-model-en-us-0.22"
                except KeyboardInterrupt:
                    print("\n⏩ Using smaller model instead...")
                    self._download_vosk_model(use_large=False)
                    model_path = "vosk-model-small-en-us-0.15"
            
            self.vosk_model = Model(model_path)
            accuracy = "high" if "0.22" in model_path else "medium"
            print(f"✅ FREE Speech Recognition initialized (Vosk - {accuracy} accuracy)")
            
        except ImportError:
            print("⚠️ Vosk not installed. Installing...")
            import subprocess
            subprocess.check_call(["pip3", "install", "vosk"])
            print("✅ Vosk installed! Please restart the program.")
        except Exception as e:
            print(f"⚠️ Vosk initialization failed: {e}")
            print("   Speech-to-text will not be available")
    
    def _download_vosk_model(self, use_large=False):
        """Download Vosk model for speech recognition"""
        import zipfile
        import requests
        
        if use_large:
            # Large model - much better accuracy (1.8GB)
            model_url = "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip"
            model_zip = "vosk-model-large.zip"
            print("📥 Downloading LARGE model (1.8GB) - High accuracy...")
        else:
            # Small model - good for testing (40MB)
            model_url = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip"
            model_zip = "vosk-model.zip"
            print("📥 Downloading small model (40MB)...")
        
        try:
            # Download with progress using requests
            print("   Downloading...")
            response = requests.get(model_url, verify=False, stream=True)
            total_size = int(response.headers.get('content-length', 0))
            
            with open(model_zip, 'wb') as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        
                        # Show progress
                        if total_size > 0:
                            percent = int(downloaded * 100 / total_size)
                            print(f"\r   Progress: {percent}%", end='', flush=True)
            print("\n")
        except Exception as e:
            print(f"\n❌ Download failed: {e}")
            return
        
        print("📦 Extracting model...")
        with zipfile.ZipFile(model_zip, 'r') as zip_ref:
            zip_ref.extractall(".")
        
        os.remove(model_zip)
        print("✅ Model downloaded and ready!")
    
    def record_audio(self, duration=None, output_path=None):
        """
        Record audio from microphone
        
        Args:
            duration: Recording duration in seconds (None = record until Enter pressed)
            output_path: Path to save audio file
        
        Returns:
            Path to recorded audio file
        """
        if output_path is None:
            temp_dir = tempfile.gettempdir()
            output_path = os.path.join(temp_dir, "free_interview_recording.wav")
        
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
            import queue
            import threading
            
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
        Convert speech to text using Vosk (offline) - IMPROVED ACCURACY
        
        Args:
            audio_path: Path to audio file
        
        Returns:
            Transcribed text
        """
        # Prefer faster-whisper (local Whisper) if installed — higher accuracy
        try:
            from faster_whisper import WhisperModel
            print("🔄 Transcribing audio with faster-whisper (local Whisper model)...")
            # Choose model size - uses automatically if already downloaded
            model = WhisperModel("small", device="cpu", compute_type="int8_float16")
            segments, info = model.transcribe(audio_path, beam_size=5)
            text = " ".join([seg.text.strip() for seg in segments]).strip()
            if text:
                text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()
                print(f"✅ Transcription (whisper): \"{text}\"\n")
                return text
        except Exception:
            # faster-whisper not available or failed — fall back to Vosk
            pass

        if not self.vosk_model:
            print("❌ Speech recognition not available")
            return None

        print("🔄 Transcribing audio (Vosk offline)...")

        try:
            from vosk import KaldiRecognizer

            wf = wave.open(audio_path, "rb")

            if wf.getnchannels() != 1 or wf.getsampwidth() != 2:
                print("❌ Audio file must be WAV format mono PCM.")
                return None

            # Create recognizer with larger frame rate for better accuracy
            rec = KaldiRecognizer(self.vosk_model, wf.getframerate())
            rec.SetWords(True)
            rec.SetMaxAlternatives(0)  # Disable alternatives for cleaner output
            rec.SetPartialWords(False)  # Only get final results

            # Process audio in larger chunks for better accuracy
            results = []

            while True:
                data = wf.readframes(8000)  # Larger chunks (was 4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    if 'text' in result and result['text'].strip():
                        results.append(result['text'].strip())

            # Get final result
            final_result = json.loads(rec.FinalResult())
            if 'text' in final_result and final_result['text'].strip():
                results.append(final_result['text'].strip())

            # Join all results
            text = ' '.join(results).strip()

            # Post-processing: capitalize first letter, clean up spaces
            if text:
                text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()
                # Remove duplicate spaces
                text = ' '.join(text.split())

                print(f"✅ Transcription: \"{text}\"\n")
                return text
            else:
                print("⚠️ No speech detected. Please speak louder and clearer.")
                return None

        except Exception as e:
            print(f"❌ Transcription error: {e}")
            return None
    
    def text_to_speech(self, text):
        """
        Convert text to speech using pyttsx3 (offline)
        
        Args:
            text: Text to convert to speech
        """
        if not self.tts_engine:
            print("❌ Text-to-speech not available")
            return
        
        print("🔊 Speaking...")
        
        try:
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
            print("✅ Speech complete\n")
            
        except Exception as e:
            print(f"❌ TTS error: {e}")
    
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
        self.text_to_speech(text)


# Test function
if __name__ == "__main__":
    print("=" * 70)
    print("  FREE VOICE ENGINE TEST (No API Keys Required!)")
    print("=" * 70)
    
    voice = FreeVoiceEngine()
    
    print("\n1. Testing Text-to-Speech (pyttsx3)...")
    voice.speak("Hello! I'm your free AI interviewer. This system is completely offline and costs nothing!")
    
    print("\n2. Testing Speech-to-Text (Vosk)...")
    print("Please say something when prompted...")
    text = voice.record_and_transcribe()
    
    if text:
        print(f"\nYou said: {text}")
        voice.speak(f"You said: {text}")
    
    print("\n✅ Free voice engine test complete!")
    print("💰 Cost: $0.00 - Completely FREE!")
