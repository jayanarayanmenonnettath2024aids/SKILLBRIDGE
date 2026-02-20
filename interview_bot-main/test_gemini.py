"""
Test script to check available Gemini models
"""
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

print(f"Testing API Key: {api_key[:20]}...")
print()

try:
    genai.configure(api_key=api_key)
    print("✓ API Key configured successfully")
    print()
    
    # List available models
    print("Available Models:")
    print("=" * 60)
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Description: {model.description[:80]}...")
            print()
    
    # Try using models
    test_models = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
        'models/gemini-pro',
        'models/gemini-1.5-pro'
    ]
    
    print("\nTesting Models:")
    print("=" * 60)
    for model_name in test_models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Say 'Hi'")
            print(f"✓ {model_name} - WORKS!")
            print(f"  Response: {response.text[:50]}")
            print()
            break
        except Exception as e:
            print(f"✗ {model_name} - Failed: {str(e)[:60]}")
    
except Exception as e:
    print(f"ERROR: {e}")
