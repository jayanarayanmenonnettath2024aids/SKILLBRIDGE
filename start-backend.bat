@echo off
echo ============================================
echo Starting SkillBridge Unified Backend
echo ============================================
echo.

cd skillgap-backend

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed!
    pause
    exit /b 1
)

echo.
echo Installing/Updating dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Starting Flask server on http://localhost:5000
echo ============================================
echo.
echo Available Services:
echo - Skill Gap Analysis
echo - Resume Analysis
echo - Interview Bot
echo - Authentication
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

python app.py

pause
