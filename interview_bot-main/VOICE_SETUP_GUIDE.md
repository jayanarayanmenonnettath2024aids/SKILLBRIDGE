# 🎤 Voice Interview Setup Guide

**AI Interview Bot - Voice-to-Voice Mode**  
**Date:** January 19, 2026

---

## 🎯 What This Does

Your interview bot now supports **FULL VOICE CONVERSATIONS**:
- 🎤 **Speak your answers** instead of typing
- 🔊 **AI speaks questions** in natural voice
- 🎯 **Real interview experience** with voice interaction

---

## 🏆 Technology Stack

| Component | Technology | Why? |
|-----------|-----------|------|
| **Speech-to-Text** | OpenAI Whisper | Best accuracy, handles accents |
| **Text-to-Speech** | OpenAI TTS | Natural voice, professional |
| **AI Brain** | Llama 3.3 70B | Free, high-quality responses |
| **Audio Capture** | PyAudio | Cross-platform microphone access |

---

## 📦 Installation Steps

### Step 1: Install Audio Dependencies

**macOS:**
```bash
brew install portaudio
pip3 install pyaudio
```

**Ubuntu/Linux:**
```bash
sudo apt-get install portaudio19-dev python3-pyaudio
pip3 install pyaudio
```

**Windows:**
```bash
pip install pipwin
pipwin install pyaudio
```

### Step 2: Install Python Packages

```bash
cd /Users/kavivignesh/Documents/pals/interview_bot
pip3 install -r requirements_free.txt
```

**Packages installed:**
- `openai` - For Whisper STT and TTS
- `pyaudio` - For microphone recording
- `wave` - For audio file handling

### Step 3: Configure API Keys

Edit `.env` file:
```bash
# OpenAI for Voice (Whisper + TTS)
OPENAI_API_KEY=sk-proj-your_key_here

# OpenRouter for Llama 3.3 (AI brain)
OPENROUTER_API_KEY_1=your_openrouter_key_1
OPENROUTER_API_KEY_2=your_openrouter_key_2
```

---

## 🚀 Usage

### Run Voice Interview:

```bash
python3 main_voice.py
```

### Interview Flow:

1. **Setup Phase:**
   - Enter your name
   - Choose interview mode (Role-based or JD-based)
   - Provide role/company/JD info

2. **Interview Phase:**
   - 🔊 AI speaks the question
   - 🎤 Press Enter → Speak your answer
   - 🛑 Press Enter when done speaking
   - 📊 AI evaluates and speaks feedback
   - 🔄 Continue to next question

3. **Controls:**
   - Type `text` → Switch to text input for one question
   - Type `quit` → End interview early
   - `Ctrl+C` → Emergency exit

---

## 🎛️ Customization Options

### Change AI Voice

Edit `voice_engine.py` line 26:

```python
self.tts_voice = "nova"  # Options: alloy, echo, fable, onyx, nova, shimmer
```

**Voice Personalities:**
- **nova** - Professional female (default, great for interviews)
- **alloy** - Neutral, balanced
- **echo** - Male, authoritative
- **fable** - British accent, formal
- **onyx** - Deep male voice
- **shimmer** - Friendly female

### Adjust Audio Quality

For **higher quality TTS**, edit `voice_engine.py` line 93:

```python
model="tts-1-hd",  # Change from tts-1 to tts-1-hd
```

---

## 💰 Cost Breakdown

### Per 30-Minute Interview:

| Service | Usage | Cost |
|---------|-------|------|
| **Whisper STT** | ~30 min audio | $0.18 |
| **OpenAI TTS** | ~2000 words | $0.30 |
| **Llama 3.3** | Via OpenRouter | FREE |
| **Total** | | **$0.48** |

**Very affordable!** Less than 50 cents per full interview.

---

## 🔧 Troubleshooting

### ❌ "ModuleNotFoundError: No module named 'pyaudio'"

**macOS:**
```bash
brew install portaudio
pip3 install pyaudio
```

**If still fails:**
```bash
pip3 install --global-option='build_ext' --global-option='-I/opt/homebrew/include' --global-option='-L/opt/homebrew/lib' pyaudio
```

### ❌ "PortAudio library not found"

**macOS:**
```bash
brew install portaudio
```

**Linux:**
```bash
sudo apt-get install portaudio19-dev
```

### ❌ "Microphone not detected"

1. Check system microphone permissions
2. macOS: System Settings → Privacy & Security → Microphone → Terminal (allow)
3. Test with: `python3 -c "import pyaudio; print(pyaudio.PyAudio().get_default_input_device_info())"`

### ❌ "OpenAI API key not found"

Add to `.env`:
```
OPENAI_API_KEY=sk-proj-your_actual_key_here
```

Get key from: https://platform.openai.com/api-keys

### ❌ Audio playback not working

**macOS:** Built-in (should work)  
**Linux:** Install `mpg123`:
```bash
sudo apt-get install mpg123
```

---

## 🎯 Feature Comparison

| Feature | Text Mode | Voice Mode |
|---------|-----------|------------|
| Question delivery | Text display | 🔊 Spoken + text |
| Answer input | Type | 🎤 Speak |
| Feedback | Text only | 🔊 Spoken summary + full text |
| Realism | Good | ⭐ Excellent |
| Speed | Fast | Moderate |
| Accessibility | Standard | ✅ Hands-free |
| Cost | Minimal | ~$0.50/interview |

---

## 📊 Voice Files Structure

```
interview_bot/
├── voice_engine.py          # Core voice functionality
├── main_voice.py            # Voice interview script
├── requirements_free.txt    # Updated with voice deps
└── .env                     # API keys (OPENAI_API_KEY required)
```

---

## 🧪 Testing the Voice System

### Quick Test:

```bash
python3 voice_engine.py
```

This will:
1. ✅ Test TTS (AI will speak)
2. ✅ Test STT (record and transcribe)
3. ✅ Echo back your speech

---

## 🎓 Best Practices

### For Candidates:

1. **Quiet environment** - Minimize background noise
2. **Clear speech** - Speak naturally but clearly
3. **Microphone distance** - 6-12 inches from mic
4. **Backup option** - Type `text` if voice fails

### For Developers:

1. **Error handling** - Voice mode gracefully falls back to text
2. **Cost monitoring** - Track API usage via OpenAI dashboard
3. **Voice selection** - Choose professional voices (nova, echo)
4. **Audio cleanup** - Temp files auto-deleted

---

## 🚀 Next Steps

### To Run Voice Interview:

```bash
python3 main_voice.py
```

### To Run Traditional Text Interview:

```bash
python3 main_free_dual_mode.py
```

---

## 📞 Support

**Whisper issues:** https://platform.openai.com/docs/guides/speech-to-text  
**TTS issues:** https://platform.openai.com/docs/guides/text-to-speech  
**PyAudio issues:** https://people.csail.mit.edu/hubert/pyaudio/

---

## ✅ Checklist Before Running

- [ ] `portaudio` installed (macOS: `brew install portaudio`)
- [ ] `pip3 install -r requirements_free.txt` completed
- [ ] `OPENAI_API_KEY` added to `.env`
- [ ] Microphone permissions granted
- [ ] Quiet environment for recording
- [ ] Test with: `python3 voice_engine.py`

---

**🎤 Ready to conduct voice interviews! Your bot just got 10x more realistic!** 🚀
