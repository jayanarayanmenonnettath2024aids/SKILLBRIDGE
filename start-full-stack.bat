@echo off
echo ============================================
echo Starting SkillBridge Full Stack
echo ============================================
echo.

REM Start backend in a new window
start "SkillBridge Backend" cmd /k "cd skillgap-backend && python app.py"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Start frontend
echo Starting frontend...
start "SkillBridge Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo Both services are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ============================================
echo.
echo Close this window after both services start
pause
