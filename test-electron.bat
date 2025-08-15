@echo off
echo ========================================
echo   測試 Electron 桌面應用程式
echo ========================================
echo.

:: 檢查依賴項
if not exist node_modules\electron (
    echo 正在安裝 Electron...
    call install-electron.bat
)

:: 生成圖標
echo 正在生成圖標...
node generate-icons.js

echo.
echo 正在啟動桌面應用程式...
echo.

npm run electron

pause