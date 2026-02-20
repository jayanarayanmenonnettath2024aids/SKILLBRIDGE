#!/usr/bin/env python3
"""
Download Large Vosk Model for Better Accuracy
This will download ~1.8GB model with much better transcription accuracy
"""

import os
import sys
import urllib.request
import zipfile
import ssl

def download_large_model():
    """Download the large Vosk model (1.8GB) for high accuracy"""
    
    import requests
    
    model_url = "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip"
    model_zip = "vosk-model-large.zip"
    model_name = "vosk-model-en-us-0.22"
    
    # Check if already downloaded
    if os.path.exists(model_name):
        print(f"✅ Large model already exists: {model_name}")
        print("   Delete the folder to re-download")
        return
    
    print("=" * 70)
    print("📥 DOWNLOADING LARGE VOSK MODEL")
    print("=" * 70)
    print()
    print(f"Model: {model_name}")
    print(f"Size: ~1.8 GB")
    print(f"Accuracy: HIGH (95%+ for clear speech)")
    print()
    print("This will significantly improve transcription accuracy!")
    print("Download takes 5-10 minutes depending on internet speed.")
    print()
    
    response = input("Continue download? (y/n): ")
    if response.lower() != 'y':
        print("❌ Download cancelled")
        return
    
    print("\n📥 Downloading large model (1.8GB)...")
    print("   This may take 5-10 minutes...")
    
    try:
        # Download with progress using requests
        response = requests.get(model_url, stream=True, verify=False)
        total_size = int(response.headers.get('content-length', 0))
        
        with open(model_zip, 'wb') as f:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    
                    # Show progress
                    if total_size > 0:
                        percent = int(downloaded * 100 / total_size)
                        downloaded_mb = downloaded / (1024 * 1024)
                        total_mb = total_size / (1024 * 1024)
                        print(f"\r   Progress: {percent}% ({downloaded_mb:.1f} MB / {total_mb:.1f} MB)", 
                              end='', flush=True)
        
        print("\n\n📦 Extracting model...")
        
        with zipfile.ZipFile(model_zip, 'r') as zip_ref:
            zip_ref.extractall(".")
        
        os.remove(model_zip)
        
        print("✅ Large model downloaded successfully!")
        print(f"   Location: {os.path.abspath(model_name)}")
        print("\n🎤 Now run your voice interview for better accuracy!")
        print("   python3 main_voice_free.py")
        
    except KeyboardInterrupt:
        print("\n\n❌ Download cancelled by user")
        if os.path.exists(model_zip):
            os.remove(model_zip)
    except Exception as e:
        print(f"\n\n❌ Download failed: {e}")
        if os.path.exists(model_zip):
            os.remove(model_zip)

if __name__ == "__main__":
    download_large_model()
