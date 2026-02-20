# 🎤 Voice-to-Voice Interview Feature

## 📋 Quick Reference

### ⚡ Quick Start (3 steps):

```bash
# 1. Run setup script
./setup_voice.sh

# 2. Add OPENAI_API_KEY to .env file
# OPENAI_API_KEY=sk-proj-your_key_here

# 3. Start voice interview
python3 main_voice.py
```

---

## 🎯 What You Get

Your interview bot now has **FULL VOICE CAPABILITIES**:

✅ **AI Speaks Questions** - Natural voice using OpenAI TTS  
✅ **You Speak Answers** - Transcribed with OpenAI Whisper  
✅ **AI Speaks Feedback** - Voice summary of your performance  
✅ **Fallback to Text** - Type `text` anytime if voice fails  
✅ **Professional Voices** - Choose from 6 voice personalities  

---

## 🏆 Why This Is The Best Solution

### OpenAI Whisper (Speech-to-Text)
- ✅ **99%+ accuracy** - Industry leading
- ✅ **Handles accents** - Works with any English accent
- ✅ **Background noise filtering** - Professional quality
- ✅ **Fast** - Real-time transcription
- ✅ **Affordable** - $0.006/minute ($0.36 for 1 hour)

### OpenAI TTS (Text-to-Speech)  
- ✅ **Human-like voices** - Most natural on the market
- ✅ **Professional quality** - Perfect for interviews
- ✅ **Multiple voices** - Choose personality
- ✅ **Fast generation** - Instant speech
- ✅ **Affordable** - $0.015/1K characters (~$0.30 per interview)

### Llama 3.3 70B (AI Brain)
- ✅ **FREE** - Via OpenRouter
- ✅ **High quality** - GPT-4 level responses
- ✅ **Already integrated** - Your existing engine

**Total Cost:** ~$0.50 per 30-minute interview 💰

---

## 📦 Installation

### Automatic Setup (Recommended):

```bash
./setup_voice.sh
```

This installs everything automatically!

### Manual Setup:

**macOS:**
```bash
brew install portaudio
pip3 install pyaudio openai
```

**Linux:**
```bash
sudo apt-get install portaudio19-dev python3-pyaudio mpg123
pip3 install pyaudio openai
```

**Windows:**
```bash
pip install pipwin
pipwin install pyaudio
pip install openai
```

---

## 🎛️ Voice Options

### Available Voices:

| Voice | Gender | Personality | Best For |
|-------|--------|-------------|----------|
| **nova** ⭐ | Female | Professional, clear | Default - Interviews |
| **alloy** | Neutral | Balanced, friendly | General use |
| **echo** | Male | Authoritative | Senior roles |
| **fable** | Female | British, formal | Executive interviews |
| **onyx** | Male | Deep, confident | Technical roles |
| **shimmer** | Female | Friendly, warm | HR/behavioral |

**Change voice:** Edit `voice_engine.py` line 26:
```python
self.tts_voice = "echo"  # Change to any voice name
```

---

## 🚀 Usage Examples

### Example 1: Role-Based Voice Interview

```bash
$ python3 main_voice.py

Enter your name: Kavi
Select Interview Mode: 1
Enter role(s): Software Engineer, Machine Learning

🔊 AI: "You've selected interview for Software Engineer, Machine Learning. Let's begin!"

[Question 1] 
🔊 AI: "Tell me about a challenging ML project you've worked on."

🎤 You: [Speak your answer]
       "I worked on a recommendation system using collaborative filtering..."

📊 Score: 7/10
🔊 AI: "You scored 7 out of 10. Good technical depth, but add more specific metrics..."
```

### Example 2: Job Description Voice Interview

```bash
$ python3 main_voice.py

Enter your name: Jay
Select Interview Mode: 2
Enter company: Netflix
[Paste JD]
Enter role: Data Scientist

🔊 AI: "You've selected interview for Data Scientist at Netflix. Analyzing the job description now."

[Interview proceeds with voice interaction]
```

---

## 🎓 Interview Controls

### During Interview:

| Action | How |
|--------|-----|
| **Speak answer** | Press Enter → Speak → Press Enter when done |
| **Type answer** | Type `text` before speaking |
| **End interview** | Type `quit` |
| **Emergency exit** | Press `Ctrl+C` |

### Tips for Best Results:

✅ **Quiet environment** - Reduces transcription errors  
✅ **Speak clearly** - Natural pace, clear pronunciation  
✅ **6-12 inches from mic** - Optimal recording distance  
✅ **Complete sentences** - Helps Whisper accuracy  
✅ **Pause between points** - Improves transcription  

---

## 📊 Cost Analysis

### Per Interview (30 minutes):

| Component | Usage | Cost |
|-----------|-------|------|
| Recording candidate answers | ~10 min | $0.06 |
| AI asking ~12 questions | ~500 words | $0.08 |
| AI feedback (voice) | ~1500 words | $0.22 |
| Llama 3.3 processing | FREE | $0.00 |
| **TOTAL** | | **$0.36** |

**Extremely affordable!** Less than $1 per interview.

### Monthly Estimate:

- **10 interviews/month:** $3.60
- **50 interviews/month:** $18.00
- **100 interviews/month:** $36.00

Compare to:
- **Mock interview service:** $50-150 per session
- **Interview coach:** $100-300 per hour

---

## 🔧 Technical Architecture

```
┌─────────────┐
│   User      │
│  🎤 Speaks  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   PyAudio           │
│  (Records Audio)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  OpenAI Whisper     │
│  (STT: Voice→Text)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Llama 3.3 70B      │
│  (AI Evaluation)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  OpenAI TTS         │
│  (Text→Voice)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   System Audio      │
│  🔊 Plays Response  │
└─────────────────────┘
```

---

## 🐛 Troubleshooting

### ❌ "No module named 'pyaudio'"

**macOS:**
```bash
brew install portaudio
pip3 install pyaudio
```

**Still failing? Try:**
```bash
pip3 install --global-option='build_ext' \
  --global-option='-I/opt/homebrew/include' \
  --global-option='-L/opt/homebrew/lib' pyaudio
```

### ❌ "Microphone not detected"

1. Check system permissions:
   - macOS: System Settings → Privacy & Security → Microphone → Terminal
2. Test microphone:
   ```bash
   python3 -c "import pyaudio; print(pyaudio.PyAudio().get_device_count())"
   ```

### ❌ "OpenAI API Error"

Check `.env` file has valid key:
```bash
OPENAI_API_KEY=sk-proj-your_actual_key_here
```

Get key from: https://platform.openai.com/api-keys

### ❌ Audio plays but no sound

**macOS:** Should work automatically  
**Linux:** Install audio player:
```bash
sudo apt-get install mpg123
```

### ❌ Poor transcription quality

- Move closer to microphone (6-12 inches)
- Reduce background noise
- Speak more clearly
- Check mic input level in system settings

---

## 📁 New Files Added

```
interview_bot/
├── voice_engine.py          # Core voice functionality
│   ├── VoiceEngine class
│   ├── record_audio()       # Capture microphone
│   ├── speech_to_text()     # Whisper STT
│   ├── text_to_speech()     # OpenAI TTS
│   └── play_audio()         # Audio playback
│
├── main_voice.py            # Voice interview script
│   ├── Voice interview loop
│   ├── Question speaking
│   ├── Answer recording
│   └── Feedback speaking
│
├── setup_voice.sh           # Auto-setup script
├── VOICE_SETUP_GUIDE.md     # Detailed setup guide
└── VOICE_QUICK_START.md     # This file
```

---

## 🎯 Feature Comparison

| Feature | Text Mode | Voice Mode |
|---------|-----------|------------|
| **Realism** | Good | ⭐ Excellent |
| **Speed** | Fast | Moderate |
| **Accessibility** | Standard | Hands-free ♿ |
| **Interview feel** | 7/10 | 10/10 🏆 |
| **Cost** | ~$0.10 | ~$0.50 |
| **Preparation** | None | Mic setup |
| **Multitasking** | No | Yes (hands-free) |

---

## ✅ Pre-Flight Checklist

Before running voice interview:

- [ ] `portaudio` installed
- [ ] `pip3 install -r requirements_free.txt` completed  
- [ ] `OPENAI_API_KEY` in `.env` file
- [ ] Microphone permissions granted
- [ ] Tested with: `python3 voice_engine.py`
- [ ] Quiet environment
- [ ] Good microphone positioning

---

## 🚀 Let's Go!

**Start your first voice interview:**

```bash
python3 main_voice.py
```

**Test the system first:**

```bash
python3 voice_engine.py
```

---

## 📚 Resources

- **OpenAI Whisper Docs:** https://platform.openai.com/docs/guides/speech-to-text
- **OpenAI TTS Docs:** https://platform.openai.com/docs/guides/text-to-speech
- **PyAudio Docs:** https://people.csail.mit.edu/hubert/pyaudio/
- **Voice Examples:** https://platform.openai.com/docs/guides/text-to-speech/voice-options

---

## 🎉 You're Ready!

Your interview bot now provides the **most realistic interview simulation available** with full voice interaction! 🚀

**This is enterprise-level quality at $0.50 per interview!** 💎
