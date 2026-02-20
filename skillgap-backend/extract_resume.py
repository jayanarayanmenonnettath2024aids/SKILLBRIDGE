import PyPDF2
import sys
import os

resume_path = sys.argv[1] if len(sys.argv) > 1 else None

if not resume_path or not os.path.exists(resume_path):
    print("Resume file not found")
    sys.exit(1)

try:
    with open(resume_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
        print(text)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
