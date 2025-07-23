@echo off
echo Starting Mesothelioma Project Setup...
echo.
echo Step 1: Creating MySQL Database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mesothelioma_forms;"
echo.
echo Step 2: Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo.
echo Step 3: Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo.
echo Setup Complete!
echo.
echo To start the project:
echo 1. Run: start-project.bat
echo 2. Or manually:
echo    - Backend: cd backend && npm run dev
echo    - Frontend: cd frontend && npm start
pause
