@echo off
chcp 65001 >nul
echo Testing GUI Application...
echo.

cd /d "%~dp0"

if not exist node_modules\electron (
    echo Installing Electron...
    npm install
)

echo Starting Electron app...
npm run electron

pause