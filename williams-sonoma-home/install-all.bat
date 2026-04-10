@echo off
REM Script to install dependencies for both backend and frontend

echo.
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
cd /d "c:\Users\Shreya\Desktop\Projects\software-hackathon\new-trial\williams-sonoma-home\frontend"
call npm install

echo.
echo ========================================
echo Installing Backend Dependencies
echo ========================================
cd /d "c:\Users\Shreya\Desktop\Projects\software-hackathon\new-trial\williams-sonoma-home\backend"
call npm install

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open Terminal 1: cd backend && npm run dev
echo 2. Open Terminal 2: cd frontend && npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
pause
