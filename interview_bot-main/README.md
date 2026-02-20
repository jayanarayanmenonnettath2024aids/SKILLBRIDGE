# AI Interview Bot - Skill Catalyst Platform

**Company-Specific Interview Preparation System**  
FREE - No API Key Required | Powered by Open-Source AI

## 🎯 Features

### ✨ Core Capabilities
- **🎤 VOICE-TO-VOICE MODE**: Speak with AI interviewer (NEW!)
- **Company-Specific Questions**: Tailored for Google, Amazon, Microsoft, Meta, Apple, Netflix, and Startups
- **8 Job Roles**: Software Developer, Data Scientist, Data Analyst, Product Manager, Marketing Manager, UI/UX Designer, DevOps Engineer, Business Analyst
- **AI-Powered Evaluation**: Uses Llama 3.3 70B for intelligent scoring
- **Detailed Feedback**: Score, strengths, weaknesses, and ideal answers
- **Comprehensive Report**: Final assessment with hiring recommendation
- **Dual-Mode System**: Strict Interviewer + Supportive Mentor feedback

### 🎤 Voice Interview (NEW!)
- **Natural Voice Interaction**: Speak your answers instead of typing
- **AI Voice Questions**: Professional voice asks questions
- **OpenAI Whisper STT**: 99%+ accuracy speech recognition
- **OpenAI TTS**: Human-like voice responses
- **Cost**: Only ~$0.50 per 30-minute interview
- **Setup**: [Voice Quick Start Guide](VOICE_QUICK_START.md)

### 📊 Evaluation Metrics
- Overall Score (0-10)
- Interviewer Assessment (Brutally Honest)
- Mentor Guidance (Supportive)
- Specific Mistakes Identified
- Model Answer Provided
- Next Focus Areas

## 🚀 Quick Start

### Option 1: Voice Interview (Recommended!)
```bash
# Setup voice (one-time)
./setup_voice.sh

# Run voice interview
python3 main_voice.py
```
**📖 Full guide:** [VOICE_QUICK_START.md](VOICE_QUICK_START.md)

### Option 2: Text Interview (Free - No Setup)
```bash
# Install dependencies
pip install -r requirements_free.txt

# Run text interview
python3 main_free_dual_mode.py
```

### Option 3: Company-Specific Interview
```bash
python3 main_company.py
```

### Follow Prompts
- Enter your name
- Select interview mode or company
- Select job role
- Answer questions (type or speak)
- Get instant feedback after each answer
- Receive final comprehensive report

## 🎤 Voice vs Text Mode

| Feature | Voice Mode | Text Mode |
|---------|------------|-----------|
| **Realism** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Setup** | Requires mic | None |
| **Cost** | ~$0.50/interview | ~$0.10/interview |
| **Speed** | Moderate | Fast |
| **Best For** | Real practice | Quick feedback |

## 💼 Available Companies

1. **Google** - Focus on scalability, algorithms, innovation
2. **Amazon** - Customer obsession, leadership principles
3. **Microsoft** - Cloud computing, AI, growth mindset
4. **Meta** - Social networking, move fast, impact
5. **Apple** - Design excellence, privacy, innovation
6. **Netflix** - Streaming, microservices, high performance
7. **Startup** - Rapid development, adaptability, ownership
8. **Other/General** - Standard role-based questions

## 📋 Available Roles

1. Software Developer
2. Data Analyst
3. Data Scientist
4. Product Manager
5. Marketing Manager
6. UI/UX Designer
7. DevOps Engineer
8. Business Analyst

## 📖 How It Works

### Question Generation
- Company-specific questions based on culture and tech stack
- Role-specific technical and scenario questions
- HR questions about company fit

### Answer Evaluation
- AI analyzes semantic similarity to ideal answers
- Checks keyword coverage of key concepts
- Evaluates clarity and depth
- Provides actionable feedback

### Final Report
- Overall performance score
- Category-wise breakdown
- Key strengths identified
- Areas for improvement
- Hiring recommendation
- JSON export for detailed review

## 💡 Sample Interview Flow

```
Enter your name: John Doe
Select company: 1 (Google)
Select role: 1 (Software Developer)

[Question 1/7]
Category: HR - Company Fit
Q: Why do you want to work at Google specifically?

Your Answer: [Type your answer, press Enter twice]

⏳ Evaluating your answer...

📊 EVALUATION RESULTS
🎯 Overall Score: 7.5/10
💬 Clarity: 8/10
🔍 Depth: 7/10
📝 Key Concepts: 75%

✅ Strengths:
   1. Clear communication style
   2. Mentioned Google's culture
   3. Showed genuine enthusiasm

⚠️ Areas for Improvement:
   1. Add specific Google products you admire
   2. Mention technical innovations

💡 Feedback: Good answer with solid foundation...
```

## 📄 Output Files

Each interview generates a JSON report:
```
interview_JohnDoe_SoftwareDeveloper_Google.json
```

Contains:
- All questions and answers
- Detailed evaluations
- Final performance report
- Timestamp and duration

## 🔧 Technical Details

### AI Models Used
- **Sentence Transformers**: `all-MiniLM-L6-v2` for semantic similarity
- **Free & Open Source**: No API costs
- **Offline Capable**: Models downloaded once, run locally

### Evaluation Algorithm
1. Semantic similarity to ideal answer (40%)
2. Keyword coverage (30%)
3. Answer length/depth (20%)
4. Structure/clarity (10%)

## 💰 Cost

**100% FREE**
- No API keys required
- No usage limits
- No hidden costs
- Open-source models

## 🎓 Use Cases

### For Students
- Practice company-specific interviews
- Get instant feedback
- Learn from ideal answers
- Build confidence

### For Job Seekers
- Prepare for target companies
- Understand company culture
- Practice technical questions
- Track improvement over time

### For Educators
- Assess student readiness
- Provide structured practice
- Track progress
- Customize for specific companies

## 📊 Project Structure

```
interview_bot/
├── main_company.py          # Main entry point
├── company_questions.py     # Company-specific questions
├── company_session.py       # Interview session manager
├── question_bank.py         # Role-based questions
├── free_evaluator.py        # AI evaluation engine
└── requirements_free.txt    # Dependencies
```

## 🔒 Privacy

- All processing happens locally
- No data sent to external servers
- Reports saved locally only
- Your answers remain private

## 🐛 Troubleshooting

**Models downloading slowly?**
- First run downloads AI models (~100MB)
- Subsequent runs are instant

**Import errors?**
- Run: `pip install -r requirements_free.txt`
- Ensure Python 3.8+ installed

**Evaluation seems slow?**
- First evaluation loads models (10-20 seconds)
- Subsequent evaluations are fast (2-3 seconds)

## 🚀 Future Enhancements

- [ ] More companies (Uber, Airbnb, etc.)
- [ ] More job roles
- [ ] Voice input/output
- [ ] Video interview simulation
- [ ] Progress tracking over time
- [ ] Peer comparison

## 📞 Support

For issues or questions, contact the Skill Catalyst team.

## 📝 License

Part of the Skill Catalyst / SkillBridgeAI platform.

---

**Built with ❤️ for Skill Catalyst**  
*Empowering students and rural youth for real-world job interviews*
