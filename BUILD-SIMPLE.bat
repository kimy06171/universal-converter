@echo off
chcp 65001 >nul
cls
echo ========================================
echo   Building Portable Converter
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo Step 2: Generating icons...
call node generate-icons.js
if errorlevel 1 goto error

echo.
echo Step 3: Building portable version...
echo This will take 3-5 minutes...
echo.

if exist dist rd /s /q dist

call npx electron-builder --win portable
if errorlevel 1 goto error

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo Output file:
dir dist\*.exe /b
echo.
echo Location: %cd%\dist\
echo.
pause
start explorer dist
exit /b 0

:error
echo.
echo ========================================
echo   BUILD FAILED!
echo ========================================
echo.
echo Please check the error messages above.
echo.
pause
exit /b 1