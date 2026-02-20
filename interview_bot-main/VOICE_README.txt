╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║        🎤 VOICE INTERVIEW MODE - QUICK START                      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

🎯 WHAT THIS IS:
   Your interview bot now SPEAKS and LISTENS!
   - AI asks questions with natural voice
   - You answer by speaking (hands-free!)
   - AI evaluates and responds with voice
   
   Cost: Only $0.50 per 30-minute interview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 3-STEP SETUP:

   Step 1: Run Setup Script
   ────────────────────────
   ./setup_voice.sh
   
   This installs everything you need automatically!

   Step 2: Add OpenAI API Key
   ───────────────────────────
   1. Get free credits: https://platform.openai.com/signup
   2. Get API key: https://platform.openai.com/api-keys
   3. Edit .env file:
      OPENAI_API_KEY=sk-proj-your_key_here

   Step 3: Start Voice Interview
   ──────────────────────────────
   python3 main_voice.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

�� HOW TO USE:

   During Interview:
   
   1. AI speaks question → You listen
   2. Press Enter → Speak your answer
   3. Press Enter when done → AI transcribes
   4. AI evaluates → Speaks feedback
   5. Continue to next question
   
   Commands:
   - Type "text" → Switch to typing for one question
   - Type "quit" → End interview
   - Ctrl+C → Emergency exit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔊 AVAILABLE VOICES:

   Change voice in voice_engine.py (line 26):
   
   nova      ⭐ Professional female (default)
   echo      💼 Authoritative male
   alloy     🤝 Neutral balanced
   fable     🎩 British formal
   onyx      💪 Deep confident
   shimmer   😊 Friendly warm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 COST BREAKDOWN:

   Per 30-minute interview:
   - Whisper (speech-to-text): $0.06
   - TTS (text-to-speech): $0.30
   - Llama 3.3 AI: FREE
   ─────────────────────────────
   Total: $0.36 per interview
   
   Compare to:
   - Mock interview services: $50-150
   - Interview coaches: $100-300/hr

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐛 TROUBLESHOOTING:

   ❌ "No module named 'pyaudio'"
      → Run: brew install portaudio
      → Then: pip3 install pyaudio
   
   ❌ "Microphone not detected"
      → macOS: System Settings → Privacy → Microphone → Terminal
      → Test: python3 voice_engine.py
   
   ❌ "OpenAI API Error"
      → Check .env has: OPENAI_API_KEY=sk-proj-...
      → Verify key at: https://platform.openai.com/api-keys
   
   ❌ Audio playback not working (Linux)
      → Install: sudo apt-get install mpg123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION:

   VOICE_QUICK_START.md     ← Start here (5 min)
   VOICE_SETUP_GUIDE.md     ← Detailed setup (10 min)
   VOICE_IMPLEMENTATION.md  ← Technical details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TEST FIRST:

   Before full interview, test the system:
   
   python3 voice_engine.py
   
   This tests both speaking and listening!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ READY TO GO!

   ./setup_voice.sh              ← Run setup
   python3 main_voice.py         ← Start interview
   
   Your bot is now ENTERPRISE-LEVEL quality! 🚀

╚════════════════════════════════════════════════════════════════════╝
