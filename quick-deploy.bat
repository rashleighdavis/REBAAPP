@echo off
echo ========================================
echo   REBA - Quick Deploy Script
echo ========================================
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Your app is ready to deploy.
echo.
echo Choose your deployment method:
echo   1. Vercel (Recommended)
echo   2. Netlify
echo   3. Exit
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Vercel...
    npx vercel
) else if "%choice%"=="2" (
    echo.
    echo To deploy to Netlify:
    echo 1. Go to https://app.netlify.com/drop
    echo 2. Drag and drop the 'dist' folder
    echo.
    start https://app.netlify.com/drop
    explorer dist
) else (
    echo Exiting...
)

echo.
pause
