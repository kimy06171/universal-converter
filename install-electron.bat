@echo off
echo ========================================
echo   安裝 Electron 依賴項
echo ========================================
echo.

echo 正在安裝 Electron 和打包工具...
echo 這可能需要幾分鐘，請耐心等待...
echo.

npm install electron@28.0.0 --save-dev
npm install electron-builder@24.9.1 --save-dev

echo.
echo ========================================
echo   安裝完成！
echo ========================================
echo.
echo 現在您可以執行以下命令：
echo.
echo 1. npm run electron        - 啟動桌面應用程式
echo 2. npm run build-portable  - 建立可攜帶版本
echo 3. npm run build-win       - 建立 Windows 安裝程式
echo.
pause