# 🤖 AI-Powered Interview Bot - Dual Mode System

**Advanced Interview Preparation for Skill Catalyst / SkillBridgeAI**

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FREE Version Available](https://img.shields.io/badge/FREE-No%20API%20Keys-green.svg)](main_free_dual_mode.py)

## 🎯 Overview

An intelligent, adaptive interview preparation system with **TWO DISTINCT MODES** designed for realistic interview practice and employability enhancement.

### ✨ Key Features

- 🎭 **Dual Mode System**: Role-based OR JD+Company-based interviews
- 🧠 **Truly Adaptive**: Questions adjust based on your performance
- ♾️ **No Fixed Questions**: Interview continues until YOU decide to stop
- 💬 **Personalized Feedback**: Unique, context-aware feedback for every answer
- 📊 **Comprehensive Reports**: Detailed assessment with actionable insights
- 💰 **100% FREE Option**: No API keys required with open-source models

---

## 🔥 What Makes This Different?

### vs Traditional Interview Bots

| Feature | Traditional Bots | This System |
|---------|-----------------|-------------|
| Questions | Fixed set | Dynamically generated |
| Feedback | Generic templates | Personalized per answer |
| Duration | Fixed count | User-controlled |
| Adaptation | None | Real-time difficulty adjustment |
| Context | Ignored | Full conversation history |
| Intelligence | Rule-based | AI-powered understanding |

### Unique Capabilities

✅ **Two Complete Modes** - Role-based AND JD-based interviews  
✅ **Adaptive Flow** - No two interviews are the same  
✅ **Semantic Understanding** - Not just keyword matching  
✅ **Human-like Feedback** - Feels like a real interviewer  
✅ **Company-Specific Prep** - Parses actual job descriptions  
✅ **Multi-Role Support** - Practice for multiple domains simultaneously  

---

## 🚀 Quick Start

### Option 1: FREE Version (Recommended)

```bash
# Clone or navigate to project
cd interview_bot

# Install dependencies
pip install -r requirements_free.txt

# Run interview bot
python main_free_dual_mode.py
```

**No API keys needed! Uses open-source models.**

### Option 2: OpenAI Version (More Advanced)

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_openai_key_here" > .env

# Run interview bot
python main_dual_mode.py
```

---

## 📋 Two Modes Explained

### MODE 1: Role/Domain-Based Interview

**Perfect for:**
- Exploring multiple career paths
- General interview preparation
- Skill assessment across domains
- Not targeting specific company

**How it works:**
1. Select one or more job roles (e.g., Software Developer + Data Analyst)
2. AI generates questions covering all selected domains
3. Mix of HR, technical, and scenario-based questions
4. Difficulty adapts based on your performance
5. Continue until you're ready to stop

**Example Roles:**
- Software Developer
- Data Scientist
- Data Analyst
- Product Manager
- DevOps Engineer
- UI/UX Designer
- Marketing Manager
- Business Analyst
- Full Stack Developer
- Machine Learning Engineer

### MODE 2: JD + Company-Based Interview

**Perfect for:**
- Applying to specific company
- Have actual job description
- Want realistic company interview
- Targeting particular role

**How it works:**
1. Enter target company name
2. Paste actual job description
3. AI parses JD to extract skills, tools, requirements
4. Generates company-specific questions
5. Questions match JD requirements and company culture
6. Continue until you're ready to stop

**AI Extracts from JD:**
- Required skills
- Preferred skills
- Tools & technologies
- Experience level
- Key responsibilities
- Company values

---

## 🎬 Example Session

```
Enter your name: Sarah Chen
Select mode: 1 (Role-Based)
Select roles: 1,3 (Software Developer + Data Analyst)

[Question 1] HR | Easy
Q: Tell me about yourself and your background.
A: [Your answer...]

📊 FEEDBACK
Score: 7.5/10
✅ Strengths: Clear structure, mentioned relevant experience
⚠️ Improvements: Add more specific examples, quantify achievements
💡 Feedback: Good introduction with solid foundation...

Continue? y

[Question 2] Technical | Medium
Q: Explain REST APIs and how you've used them.
A: [Your answer...]

📊 FEEDBACK
Score: 8.2/10
✅ Strengths: Excellent technical depth, practical examples
⚠️ Improvements: Mention authentication methods
💡 Feedback: Strong technical explanation...

Continue? y

[Question 3] Technical | Medium
Q: How do you approach data cleaning and preparation?
A: [Your answer...]

Continue? n

📋 FINAL REPORT
Average Score: 7.8/10
Readiness: Interview Ready
Success Probability: 65-70%
Top Strengths: [...]
Critical Gaps: [...]
Recommendations: [...]

Report saved: interview_Sarah_Chen_20240115.json
```

---

## 🧠 AI Intelligence

### Question Generation

**Context Considered:**
- Interview mode (role vs JD-based)
- Selected roles/domains
- Company culture (if provided)
- Previous questions asked
- Previous answer quality
- Performance trend
- Question count

**Adaptive Difficulty:**
- High performance (8+) → Harder questions
- Good performance (6-7) → Medium questions
- Lower performance (<6) → Foundational questions

### Answer Evaluation

**What AI Analyzes:**
- Semantic relevance to question
- Depth of knowledge demonstrated
- Use of specific examples
- Answer structure and clarity
- Communication quality
- Technical accuracy

**Feedback Generation:**
- Unique for every answer
- Context-aware
- Specific strengths identified
- Actionable improvements
- Feels like human interviewer

### No Predefined Templates

Every piece of feedback is dynamically generated based on:
- What you actually said
- How you structured your answer
- Relevance to the question
- Depth demonstrated
- Interview context

---

## 📊 Evaluation Metrics

### Per-Answer Metrics
- **Score**: 1-10 (context-aware, not formulaic)
- **Strengths**: 2-3 specific positive observations
- **Improvements**: 2-3 actionable suggestions
- **Feedback**: Personalized commentary
- **Next Focus**: What to probe next

### Final Report Includes
- **Average Score**: Overall performance
- **Score Trend**: Improving/Declining/Consistent
- **Category Performance**: HR vs Technical vs Scenario
- **Readiness Level**: Not Ready → Strong Candidate
- **Success Probability**: Estimated % with reasoning
- **Top Strengths**: 3 key strengths
- **Critical Gaps**: 3 areas needing work
- **Recommendations**: 3 specific action items
- **Detailed History**: All Q&A with scores

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Main Entry Point                │
│  (Dual Mode Selection & Interview Loop) │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  AI Engine  │  │   Session   │
│             │◄─┤   Manager   │
│ • Questions │  │             │
│ • Evaluation│  │ • State     │
│ • JD Parse  │  │ • History   │
│ • Feedback  │  │ • Reports   │
└─────────────┘  └─────────────┘
```

### Core Components

**1. AI Engine** (`ai_engine.py` / `free_ai_engine.py`)
- Dynamic question generation
- Semantic answer evaluation
- JD parsing and analysis
- Personalized feedback generation

**2. Session Manager** (`adaptive_session.py` / `free_adaptive_session.py`)
- Stateful interview flow
- Conversation history
- Performance tracking
- Report generation

**3. Main Interface** (`main_dual_mode.py` / `main_free_dual_mode.py`)
- Mode selection
- User interaction
- Feedback display
- Report presentation

---

## 📦 Project Structure

```
interview_bot/
├── main_dual_mode.py              # OpenAI-powered entry point
├── main_free_dual_mode.py         # FREE entry point (no API)
├── ai_engine.py                   # OpenAI question gen + eval
├── free_ai_engine.py              # FREE AI engine
├── adaptive_session.py            # OpenAI session manager
├── free_adaptive_session.py       # FREE session manager
├── requirements.txt               # OpenAI version dependencies
├── requirements_free.txt          # FREE version dependencies
├── .env                           # API keys (OpenAI version)
├── README_DUAL_MODE.md            # This file
├── ARCHITECTURE.md                # System architecture details
├── USAGE_GUIDE.md                 # Comprehensive usage guide
└── *.json                         # Generated interview reports
```

---

## 💡 Usage Tips

### For Best Results

1. **Be Specific**: Use concrete examples from your experience
2. **Use STAR Method**: Situation, Task, Action, Result
3. **Quantify**: Numbers make answers compelling (e.g., "improved by 40%")
4. **Structure**: Clear beginning, middle, end
5. **Be Honest**: AI detects vague or generic responses

### Mode 1 Tips
- Select roles you're genuinely interested in
- Practice transferable skills
- Use for general preparation

### Mode 2 Tips
- Use actual JDs you're applying to
- Research company beforehand
- Mention specific technologies from JD
- Align answers with company values

---

## 🎓 Use Cases

### For Students
✅ Practice for campus placements  
✅ Prepare for specific companies  
✅ Understand interview expectations  
✅ Build confidence  

### For Job Seekers
✅ Target specific job applications  
✅ Company-specific preparation  
✅ Skill gap identification  
✅ Interview readiness assessment  

### For Career Changers
✅ Multi-domain exploration  
✅ Transferable skill assessment  
✅ New role preparation  
✅ Confidence building  

### For Educators
✅ Student assessment  
✅ Interview training  
✅ Progress tracking  
✅ Curriculum feedback  

---

## 🔧 Technical Details

### FREE Version
- **Models**: Sentence-BERT (all-MiniLM-L6-v2)
- **Processing**: 100% local
- **Cost**: $0
- **Internet**: Only for initial model download
- **Privacy**: All data stays local

### OpenAI Version
- **Models**: GPT-4 / GPT-4-mini
- **Processing**: API calls
- **Cost**: ~$0.01-0.05 per interview
- **Internet**: Required
- **Privacy**: Subject to OpenAI terms

### Requirements
- Python 3.8+
- 2GB RAM (FREE version)
- 4GB RAM (OpenAI version)
- Internet (for model download / API calls)

---

## 📊 Sample Report

```json
{
  "candidate_name": "Sarah Chen",
  "mode": "role_based",
  "roles": ["Software Developer", "Data Analyst"],
  "average_score": 7.8,
  "readiness_level": "Interview Ready",
  "success_probability": "65-70%",
  "top_strengths": [
    "Strong technical foundation",
    "Clear communication",
    "Specific examples"
  ],
  "critical_gaps": [
    "Add more quantifiable results",
    "Deeper technical depth needed",
    "Improve scenario responses"
  ],
  "recommendations": [
    "Practice STAR method",
    "Prepare 5 detailed project examples",
    "Review advanced technical concepts"
  ]
}
```

---

## 🔒 Privacy & Security

- ✅ All processing in session memory
- ✅ Reports saved locally only
- ✅ No external data transmission (FREE version)
- ✅ User controls all data
- ✅ No tracking or analytics
- ✅ Interview data never shared

---

## 🐛 Troubleshooting

**Models downloading slowly?**
- First run downloads AI models (~100MB)
- Subsequent runs are instant

**Low scores consistently?**
- Read improvement suggestions carefully
- Use STAR method for answers
- Add specific examples and metrics

**Questions seem repetitive?**
- Shouldn't happen with adaptive system
- Try different roles/company
- Restart session for fresh context

---

## 🚀 Future Enhancements

- [ ] Voice input/output
- [ ] Video interview simulation
- [ ] Multi-language support
- [ ] Industry-specific modes
- [ ] Progress tracking over time
- [ ] Mobile app version
- [ ] Integration with LMS platforms

---

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and technical details
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Comprehensive usage examples
- **[README.md](README.md)** - Original company-based system docs

---

## 🤝 Contributing

This is part of the **Skill Catalyst / SkillBridgeAI** platform focused on empowering students and rural youth with real-world interview preparation.

---

## 📝 License

Part of the Skill Catalyst / SkillBridgeAI platform.

---

## 🎯 Quality Bar

This system is designed for:
- ✅ Hackathon demos
- ✅ Academic evaluation
- ✅ Real candidate practice
- ✅ Production deployment

**Treat this as a real interview preparation product.**

---

## 📞 Support

For issues or questions, contact the Skill Catalyst team.

---

**Built with ❤️ for Skill Catalyst**  
*Empowering students and rural youth for real-world job interviews*

---

## 🎬 Get Started Now!

```bash
# FREE Version (No API Keys)
python main_free_dual_mode.py

# OpenAI Version (More Advanced)
python main_dual_mode.py
```

**Your journey to interview success starts here!** 🚀
