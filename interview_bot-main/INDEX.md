# 📑 Master Index - AI Interview Bot

## 🎯 Quick Navigation

**New to the project?** → Start with **[START_HERE.md](START_HERE.md)**  
**Want to use it?** → Read **[USAGE_GUIDE.md](USAGE_GUIDE.md)**  
**Need quick help?** → Check **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**  
**Want technical details?** → See **[ARCHITECTURE.md](ARCHITECTURE.md)**

---

## 📦 Complete File Listing

### 🚀 Entry Points (Run These!)

| File | Purpose | API Key Required |
|------|---------|------------------|
| **[main_free_dual_mode.py](main_free_dual_mode.py)** | FREE dual-mode interview bot | ❌ No |
| **[main_dual_mode.py](main_dual_mode.py)** | OpenAI dual-mode interview bot | ✅ Yes |
| [main_company.py](main_company.py) | Original company-based bot | ❌ No |

**Recommended**: Start with `main_free_dual_mode.py` (no API keys needed!)

---

### 🧠 Core AI Engines

| File | Purpose | Type |
|------|---------|------|
| **[free_ai_engine.py](free_ai_engine.py)** | FREE AI engine (Sentence-BERT) | Open-source |
| **[ai_engine.py](ai_engine.py)** | OpenAI AI engine (GPT-4) | API-based |
| [free_evaluator.py](free_evaluator.py) | Original free evaluator | Legacy |

---

### 🔄 Session Managers

| File | Purpose | Works With |
|------|---------|------------|
| **[free_adaptive_session.py](free_adaptive_session.py)** | FREE session manager | free_ai_engine.py |
| **[adaptive_session.py](adaptive_session.py)** | OpenAI session manager | ai_engine.py |
| [company_session.py](company_session.py) | Original company session | Legacy |

---

### 📚 Documentation Files

#### 🌟 Start Here
| File | Purpose | Read This If... |
|------|---------|-----------------|
| **[START_HERE.md](START_HERE.md)** | Executive summary | You're new to the project |
| **[README_DUAL_MODE.md](README_DUAL_MODE.md)** | Main README | You want complete overview |
| [README.md](README.md) | Original README | You want legacy system info |

#### 📖 User Guides
| File | Purpose | Read This If... |
|------|---------|-----------------|
| **[USAGE_GUIDE.md](USAGE_GUIDE.md)** | Step-by-step usage | You want to use the system |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick lookup | You need fast answers |
| **[EXAMPLE_MODE1.md](EXAMPLE_MODE1.md)** | Complete example | You want to see it in action |
| [QUICKSTART.md](QUICKSTART.md) | Original quickstart | Legacy reference |

#### 🏗️ Technical Documentation
| File | Purpose | Read This If... |
|------|---------|-----------------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture | You want technical details |
| **[SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md)** | Visual diagrams | You prefer visual learning |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Implementation summary | You want complete overview |
| **[DELIVERABLES.md](DELIVERABLES.md)** | Complete checklist | You want to verify completeness |

---

### ⚙️ Configuration Files

| File | Purpose | Use This For |
|------|---------|--------------|
| **[requirements_free.txt](requirements_free.txt)** | FREE version dependencies | `pip install -r requirements_free.txt` |
| **[requirements.txt](requirements.txt)** | OpenAI version dependencies | `pip install -r requirements.txt` |
| [.env](.env) | API keys (OpenAI) | Store `OPENAI_API_KEY` |

---

### 📊 Sample Reports (Generated)

| File | Description |
|------|-------------|
| [interview_jay_Data_Scientist_Netflix.json](interview_jay_Data_Scientist_Netflix.json) | Sample report |
| [interview_kavi_Marketing_Manager_Google.json](interview_kavi_Marketing_Manager_Google.json) | Sample report |
| [interview_v_Software_Developer_Microsoft.json](interview_v_Software_Developer_Microsoft.json) | Sample report |

---

### 🗂️ Legacy Files (Original System)

| File | Purpose | Status |
|------|---------|--------|
| [main.py](main.py) | Original main | Legacy |
| [company_questions.py](company_questions.py) | Company question bank | Legacy |
| [question_bank.py](question_bank.py) | Role question bank | Legacy |

---

## 🎯 File Purpose Matrix

### By User Type

#### 👨‍🎓 Students / Job Seekers
**Want to practice interviews?**
1. Read: [START_HERE.md](START_HERE.md)
2. Read: [USAGE_GUIDE.md](USAGE_GUIDE.md)
3. Run: [main_free_dual_mode.py](main_free_dual_mode.py)
4. Reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

#### 👨‍💻 Developers
**Want to understand the code?**
1. Read: [ARCHITECTURE.md](ARCHITECTURE.md)
2. Read: [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md)
3. Review: [free_ai_engine.py](free_ai_engine.py)
4. Review: [free_adaptive_session.py](free_adaptive_session.py)
5. Reference: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

#### 🎓 Educators
**Want to use for training?**
1. Read: [README_DUAL_MODE.md](README_DUAL_MODE.md)
2. Read: [USAGE_GUIDE.md](USAGE_GUIDE.md)
3. Review: [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md)
4. Run: [main_free_dual_mode.py](main_free_dual_mode.py)

#### 🏢 Integrators
**Want to integrate into your platform?**
1. Read: [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review: [free_adaptive_session.py](free_adaptive_session.py)
3. Review: [free_ai_engine.py](free_ai_engine.py)
4. Reference: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 🚀 Quick Start Paths

### Path 1: Just Want to Try It (5 minutes)
```bash
pip install -r requirements_free.txt
python main_free_dual_mode.py
```

### Path 2: Want to Understand It (30 minutes)
1. Read [START_HERE.md](START_HERE.md) (5 min)
2. Read [USAGE_GUIDE.md](USAGE_GUIDE.md) (15 min)
3. Run [main_free_dual_mode.py](main_free_dual_mode.py) (10 min)

### Path 3: Want to Master It (2 hours)
1. Read [START_HERE.md](START_HERE.md) (5 min)
2. Read [README_DUAL_MODE.md](README_DUAL_MODE.md) (15 min)
3. Read [ARCHITECTURE.md](ARCHITECTURE.md) (30 min)
4. Read [USAGE_GUIDE.md](USAGE_GUIDE.md) (20 min)
5. Review [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md) (10 min)
6. Run [main_free_dual_mode.py](main_free_dual_mode.py) (20 min)
7. Review code files (20 min)

### Path 4: Want to Integrate It (4 hours)
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) (30 min)
2. Read [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md) (20 min)
3. Review [free_adaptive_session.py](free_adaptive_session.py) (30 min)
4. Review [free_ai_engine.py](free_ai_engine.py) (45 min)
5. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) (30 min)
6. Test integration (90 min)

---

## 📊 File Statistics

### Code Files
- **Core Implementation**: 6 files (~2000 lines)
- **Legacy Files**: 5 files
- **Total Python**: 11 files

### Documentation Files
- **New Documentation**: 8 files (~3400 lines)
- **Legacy Documentation**: 2 files
- **Total Docs**: 10 files

### Configuration Files
- **Dependencies**: 2 files
- **Environment**: 1 file
- **Total Config**: 3 files

### Sample Data
- **Interview Reports**: 3 files
- **Total Samples**: 3 files

**Grand Total: 27 files**

---

## 🎯 Feature Location Guide

### Where to Find...

#### Two Interview Modes
- **Implementation**: [main_dual_mode.py](main_dual_mode.py), [main_free_dual_mode.py](main_free_dual_mode.py)
- **Documentation**: [README_DUAL_MODE.md](README_DUAL_MODE.md), [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Examples**: [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md)

#### Question Generation
- **Implementation**: [ai_engine.py](ai_engine.py), [free_ai_engine.py](free_ai_engine.py)
- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Diagrams**: [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md)

#### Answer Evaluation
- **Implementation**: [ai_engine.py](ai_engine.py), [free_ai_engine.py](free_ai_engine.py)
- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Examples**: [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md)

#### Session Management
- **Implementation**: [adaptive_session.py](adaptive_session.py), [free_adaptive_session.py](free_adaptive_session.py)
- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Diagrams**: [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md)

#### JD Parsing
- **Implementation**: [ai_engine.py](ai_engine.py), [free_ai_engine.py](free_ai_engine.py)
- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Usage**: [USAGE_GUIDE.md](USAGE_GUIDE.md)

#### Report Generation
- **Implementation**: [adaptive_session.py](adaptive_session.py), [free_adaptive_session.py](free_adaptive_session.py)
- **Documentation**: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Samples**: [interview_*.json](.)

---

## 🔍 Search Guide

### Looking for...

#### "How do I install?"
→ [START_HERE.md](START_HERE.md) or [README_DUAL_MODE.md](README_DUAL_MODE.md)

#### "How do I use Mode 1?"
→ [USAGE_GUIDE.md](USAGE_GUIDE.md) - Mode 1 section

#### "How do I use Mode 2?"
→ [USAGE_GUIDE.md](USAGE_GUIDE.md) - Mode 2 section

#### "How does the AI work?"
→ [ARCHITECTURE.md](ARCHITECTURE.md) - AI Intelligence section

#### "What's the architecture?"
→ [ARCHITECTURE.md](ARCHITECTURE.md) or [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md)

#### "Can I see an example?"
→ [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md)

#### "Quick command reference?"
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

#### "What's been delivered?"
→ [DELIVERABLES.md](DELIVERABLES.md) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

#### "How do I integrate this?"
→ [ARCHITECTURE.md](ARCHITECTURE.md) + [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 📖 Reading Order Recommendations

### For First-Time Users
1. [START_HERE.md](START_HERE.md) - Get oriented
2. [USAGE_GUIDE.md](USAGE_GUIDE.md) - Learn how to use
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Keep handy
4. Run [main_free_dual_mode.py](main_free_dual_mode.py) - Try it!

### For Developers
1. [START_HERE.md](START_HERE.md) - Overview
2. [ARCHITECTURE.md](ARCHITECTURE.md) - System design
3. [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md) - Visual understanding
4. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Implementation details
5. Review code files - Deep dive

### For Evaluators
1. [START_HERE.md](START_HERE.md) - Executive summary
2. [README_DUAL_MODE.md](README_DUAL_MODE.md) - Complete overview
3. [DELIVERABLES.md](DELIVERABLES.md) - What's included
4. [EXAMPLE_MODE1.md](EXAMPLE_MODE1.md) - See it in action
5. Run [main_free_dual_mode.py](main_free_dual_mode.py) - Test it

---

## 🎯 Key Files Summary

### Must-Read Files (Top 5)
1. **[START_HERE.md](START_HERE.md)** - Executive summary
2. **[README_DUAL_MODE.md](README_DUAL_MODE.md)** - Complete overview
3. **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - How to use
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details
5. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick lookup

### Must-Run Files (Top 2)
1. **[main_free_dual_mode.py](main_free_dual_mode.py)** - FREE version
2. **[main_dual_mode.py](main_dual_mode.py)** - OpenAI version

### Must-Review Code (Top 3)
1. **[free_ai_engine.py](free_ai_engine.py)** - AI logic
2. **[free_adaptive_session.py](free_adaptive_session.py)** - Session management
3. **[main_free_dual_mode.py](main_free_dual_mode.py)** - Main interface

---

## 🚀 Next Steps

### Immediate Actions
1. ✅ Read [START_HERE.md](START_HERE.md)
2. ✅ Install dependencies: `pip install -r requirements_free.txt`
3. ✅ Run: `python main_free_dual_mode.py`
4. ✅ Try both modes
5. ✅ Review generated report

### Learning Path
1. Read all documentation files
2. Review example interactions
3. Study code implementation
4. Test with different scenarios
5. Explore integration options

### Integration Path
1. Understand architecture
2. Review API/interfaces
3. Test integration points
4. Implement in your platform
5. Deploy and monitor

---

## 📞 Support

**Questions?**
- Check documentation files
- Review example interactions
- Contact Skill Catalyst team

**Issues?**
- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) troubleshooting
- Review [USAGE_GUIDE.md](USAGE_GUIDE.md)
- Check code comments

---

## 🎉 You're All Set!

**Everything you need is here:**
- ✅ Complete working system
- ✅ Comprehensive documentation
- ✅ Example interactions
- ✅ Quick references
- ✅ Visual diagrams
- ✅ Integration guides

**Start with**: [START_HERE.md](START_HERE.md)  
**Then run**: `python main_free_dual_mode.py`

**Good luck with your interview preparation!** 🚀

---

**Built with ❤️ for Skill Catalyst / SkillBridgeAI**  
*Empowering students and rural youth for real-world job interviews*
