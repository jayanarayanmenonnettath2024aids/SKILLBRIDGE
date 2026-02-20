@echo off
echo ========================================
echo Starting SkillBridge Interview System
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
cd interview_bot-main

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/updating Python dependencies...
pip install -r requirements_api.txt --quiet

if not exist ".env" (
    echo.
    echo ========================================
    echo WARNING: .env file not found!
    echo ========================================
    echo Please create a .env file with your OpenAI API key:
    echo OPENAI_API_KEY=your_key_here
    echo.
    set /p OPENAI_KEY="Enter your OpenAI API key (or press Enter to skip): "
    if not "!OPENAI_KEY!"=="" (
        echo OPENAI_API_KEY=!OPENAI_KEY! > .env
        echo .env file created successfully!
    ) else (
        echo Continuing without API key - some features may not work
    )
    echo.
)

echo.
echo [2/4] Starting Flask Backend API Server...
echo Backend will run on http://localhost:5000
echo.
start "SkillBridge Backend" cmd /k "cd /d %CD% && venv\Scripts\activate && python api.py"

timeout /t 3 /nobreak >nul

cd ..

echo.
echo [3/4] Checking frontend dependencies...
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

echo.
echo [4/4] Starting React Frontend...
echo Frontend will run on http://localhost:5173
echo.
start "SkillBridge Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo SkillBridge Interview System Started!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause
