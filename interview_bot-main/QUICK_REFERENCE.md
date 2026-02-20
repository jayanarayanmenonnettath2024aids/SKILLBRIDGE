# 🚀 Quick Reference Guide - AI Interview Bot

## ⚡ 30-Second Start

```bash
# FREE Version (No API Keys)
pip install -r requirements_free.txt
python main_free_dual_mode.py

# OpenAI Version (More Advanced)
pip install -r requirements.txt
echo "OPENAI_API_KEY=your_key" > .env
python main_dual_mode.py
```

---

## 🎯 Two Modes at a Glance

| Mode | When to Use | Input Required |
|------|-------------|----------------|
| **Mode 1: Role-Based** | General prep, multiple domains | Select 1+ roles |
| **Mode 2: JD+Company** | Specific job application | Company + JD text |

---

## 📋 Mode 1: Role-Based

**Purpose**: Practice for multiple roles simultaneously

**Steps**:
1. Enter name
2. Select Mode 1
3. Choose roles (e.g., 1,3,5)
4. Answer questions
5. Get feedback
6. Continue or stop
7. Receive report

**Available Roles**:
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

---

## 📋 Mode 2: JD + Company

**Purpose**: Prepare for specific company interview

**Steps**:
1. Enter name
2. Select Mode 2
3. Enter company name
4. Paste job description
5. Enter job role
6. Answer questions
7. Get feedback
8. Continue or stop
9. Receive report

**AI Extracts**:
- Required skills
- Tools & technologies
- Experience level
- Key responsibilities
- Company values

---

## 🧠 How AI Works

### Question Generation
```
Context → AI Engine → Adaptive Question
  ↓
• Mode type
• Selected roles
• Company/JD
• Previous Q&A
• Performance
• Question count
```

### Answer Evaluation
```
Answer → AI Analysis → Personalized Feedback
  ↓
• Semantic relevance
• Depth of knowledge
• Specific examples
• Structure & clarity
• Communication quality
```

### Adaptive Difficulty
```
Score ≥ 8  → Hard questions
Score 6-7  → Medium questions
Score < 6  → Easy questions
```

---

## 📊 Feedback Structure

Every answer receives:

```
🎯 Score: X/10

💡 Feedback:
   [Personalized commentary based on your answer]

✅ Strengths:
   1. [Specific strength from your answer]
   2. [Another specific strength]
   3. [Third specific strength]

⚠️ Areas for Improvement:
   1. [Actionable improvement]
   2. [Another improvement]
   3. [Third improvement]

🔍 Next Focus: [What to probe next]
```

---

## 📈 Final Report Includes

```
👤 Candidate Info
📅 Date & Duration
❓ Questions Answered
📊 Average Score
📈 Score Trend

📊 Category Performance
   • HR: X/10
   • Technical: X/10
   • Scenario: X/10

🎯 Readiness Level
   • Not Ready
   • Needs Practice
   • Interview Ready
   • Strong Candidate

📈 Success Probability
   • XX-XX% with reasoning

✅ Top 3 Strengths
⚠️ Critical 3 Gaps
💡 3 Recommendations

📝 Overall Assessment
💾 JSON Export
```

---

## 💡 Tips for High Scores

### Structure Your Answers
```
✅ Use STAR Method:
   • Situation: Context
   • Task: What needed to be done
   • Action: What you did
   • Result: Outcome (quantified)
```

### Be Specific
```
❌ "I worked on a project"
✅ "I built a REST API serving 10K requests/day"

❌ "I improved performance"
✅ "I reduced load time by 40% from 5s to 3s"
```

### Provide Examples
```
✅ Mention specific technologies
✅ Reference real projects
✅ Include metrics/numbers
✅ Describe actual challenges
✅ Explain your decisions
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Models downloading slowly | First run only, ~100MB, be patient |
| Low scores | Use STAR method, add examples, be specific |
| Generic feedback | Provide longer, more detailed answers |
| Import errors | Run `pip install -r requirements_free.txt` |
| API key error | Check `.env` file has `OPENAI_API_KEY=...` |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `main_free_dual_mode.py` | FREE version entry point |
| `main_dual_mode.py` | OpenAI version entry point |
| `free_ai_engine.py` | FREE AI logic |
| `ai_engine.py` | OpenAI AI logic |
| `free_adaptive_session.py` | FREE session manager |
| `adaptive_session.py` | OpenAI session manager |
| `requirements_free.txt` | FREE dependencies |
| `requirements.txt` | OpenAI dependencies |

---

## 🎓 Score Interpretation

| Score | Meaning | Action |
|-------|---------|--------|
| 9-10 | Exceptional | Interview-ready |
| 7-8 | Strong | Minor improvements |
| 5-6 | Moderate | More depth needed |
| 3-4 | Weak | Significant work needed |
| 1-2 | Poor | Fundamental gaps |

---

## 📊 Readiness Levels

| Level | Success % | Meaning |
|-------|-----------|---------|
| Strong Candidate | 80-90% | Highly likely to succeed |
| Interview Ready | 60-75% | Good chance with prep |
| Needs Practice | 40-55% | Focused improvement needed |
| Not Ready | <40% | Significant preparation needed |

---

## 🔄 Interview Flow

```
START
  ↓
Name Entry
  ↓
Mode Selection (1 or 2)
  ↓
Setup (Roles or JD+Company)
  ↓
┌─────────────────┐
│ INTERVIEW LOOP  │ ← No fixed count
│                 │
│ 1. Get Question │
│ 2. Answer       │
│ 3. Get Feedback │
│ 4. Continue?    │
│    • Yes → Loop │
│    • No → Exit  │
└─────────────────┘
  ↓
Final Report
  ↓
JSON Export
  ↓
END
```

---

## 💰 Cost Comparison

| Version | Cost | Speed | Quality |
|---------|------|-------|---------|
| FREE | $0 | Fast | Good |
| OpenAI | $0.01-0.05/interview | Fast | Excellent |

---

## 🎯 Use Case Quick Pick

**Choose Mode 1 if**:
- ✅ Exploring multiple careers
- ✅ General interview prep
- ✅ Not targeting specific company
- ✅ Want broad skill assessment

**Choose Mode 2 if**:
- ✅ Have specific job description
- ✅ Targeting particular company
- ✅ Want realistic simulation
- ✅ Need JD-aligned practice

---

## 📚 Documentation Quick Links

- **README_DUAL_MODE.md** - Complete overview
- **ARCHITECTURE.md** - Technical details
- **USAGE_GUIDE.md** - Step-by-step examples
- **EXAMPLE_MODE1.md** - Full interaction example
- **PROJECT_SUMMARY.md** - Implementation summary
- **QUICK_REFERENCE.md** - This file

---

## 🚀 Integration Example

```python
from free_adaptive_session import FreeAdaptiveSession

# Create session
session = FreeAdaptiveSession(
    mode="role_based",
    candidate_name="John Doe",
    roles=["Software Developer", "Data Analyst"]
)

# Start interview
intro = session.start_interview()

# Get question
question = session.get_next_question()

# Submit answer
result = session.submit_answer(question, user_answer)
feedback = result["evaluation"]

# Get final report
report = session.get_final_report()

# Export
session.export_report("interview_report.json")
```

---

## 🎯 Key Features Checklist

✅ Two distinct modes (role-based + JD-based)  
✅ Dynamic question generation  
✅ Adaptive difficulty  
✅ No fixed question count  
✅ Personalized feedback  
✅ Multi-role support  
✅ JD parsing  
✅ Company-specific questions  
✅ Stateful sessions  
✅ Comprehensive reports  
✅ FREE version available  
✅ JSON export  

---

## 💡 Pro Tips

1. **First Question**: Always HR/introduction
2. **Answer Length**: 100-200 words optimal
3. **Examples**: Include 1-2 per answer
4. **Numbers**: Quantify whenever possible
5. **Structure**: Use clear beginning-middle-end
6. **Honesty**: AI detects vague responses
7. **Practice**: Do multiple sessions
8. **Review**: Read feedback carefully
9. **Improve**: Apply suggestions in next answers
10. **Track**: Compare reports over time

---

## 🎬 Example Commands

```bash
# Install FREE version
pip install sentence-transformers torch scikit-learn

# Run FREE version
python main_free_dual_mode.py

# Install OpenAI version
pip install openai python-dotenv sentence-transformers

# Set API key
export OPENAI_API_KEY="your_key_here"

# Run OpenAI version
python main_dual_mode.py

# View report
cat interview_*.json | python -m json.tool
```

---

## 📞 Quick Help

**Need help?**
- Check USAGE_GUIDE.md for detailed examples
- Check ARCHITECTURE.md for technical details
- Check troubleshooting section above
- Contact Skill Catalyst team

**Want to contribute?**
- Fork repository
- Make improvements
- Submit pull request
- Follow coding standards

---

## 🎉 Ready to Start?

```bash
# Just run this:
python main_free_dual_mode.py

# And follow the prompts!
```

**Good luck with your interview preparation!** 🚀

---

**Built for Skill Catalyst / SkillBridgeAI**  
*Empowering students and rural youth for real-world job interviews*
