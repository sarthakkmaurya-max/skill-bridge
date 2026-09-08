@echo off
echo ===================================================
echo   Building and Starting SkillBridge Production
echo   Running:  http://localhost:5000
echo ===================================================
call npm run build
npm start
pause
