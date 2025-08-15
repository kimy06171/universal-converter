@echo off
chcp 65001 >nul
echo ========================================
echo   Universal Converter - Build GUI
echo ========================================
echo.

echo Checking environment...

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js installed

echo.
echo Installing dependencies...

if not exist node_modules (
    echo Installing base dependencies...
    npm install
)

if not exist node_modules\electron (
    echo Installing Electron...
    npm install
)

echo.
echo Generating icons...
node generate-icons.js

echo.
echo Building portable version...
echo This may take 3-5 minutes...

if exist dist rd /s /q dist

npm run build-portable

if errorlevel 1 (
    echo.
    echo BUILD FAILED!
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD SUCCESS!
echo ========================================
echo.
echo Portable version created:
echo dist\universal-converter-portable.exe
echo.
echo Press any key to open the output folder...
pause >nul

explorer dist

echo Done!
pause