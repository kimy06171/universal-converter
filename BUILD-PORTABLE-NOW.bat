@echo off
chcp 65001 >nul
echo Building single portable EXE file...
echo.

cd /d "%~dp0"

npx electron-builder --win portable

echo.
echo Done! Check the dist folder for the portable EXE file.
pause