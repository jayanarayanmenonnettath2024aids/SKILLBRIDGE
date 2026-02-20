# Quick Start Guide

## Installation (One-Time Setup)

```bash
# Navigate to project
cd /Users/kavivignesh/Documents/pals/interview_bot

# Install dependencies (takes 2-3 minutes)
pip3 install -r requirements_free.txt
```

## Run Interview

```bash
python3 main_company.py
```

## Usage

1. **Enter your name**
2. **Select company** (1-7 or 8 for general)
3. **Select role** (1-8)
4. **Answer questions** (press Enter twice to submit)
5. **Get instant feedback** after each answer
6. **Receive final report** at the end

## Example Session

```
Enter your name: Kavi
Select company: 1 (Google)
Select role: 1 (Software Developer)

[Question 1/7] Why do you want to work at Google?
Your Answer: [Type answer, press Enter twice]

📊 Score: 8/10
✅ Strengths: Clear communication, mentioned culture
⚠️ Improve: Add specific products

[Continue with remaining questions...]

📋 FINAL REPORT
🎯 Overall Score: 7.5/10
📈 Performance: Good
💼 Recommendation: Promising candidate for Google
```

## Features

✅ **7 Companies**: Google, Amazon, Microsoft, Meta, Apple, Netflix, Startup  
✅ **8 Roles**: Developer, Data Scientist, Product Manager, etc.  
✅ **FREE**: No API key needed  
✅ **Instant Feedback**: After each answer  
✅ **Detailed Report**: JSON export with full analysis  

## Files Generated

- `interview_[Name]_[Role]_[Company].json` - Detailed report

## Need Help?

- Check README.md for full documentation
- Ensure Python 3.8+ is installed
- First run downloads AI models (~100MB)
