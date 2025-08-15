@echo off
echo 正在啟動萬用轉檔工具 GUI...
echo.

:: 檢查是否已安裝 Electron
if not exist node_modules\electron (
    echo 首次執行，正在安裝必要元件...
    npm install electron@28.0.0 --save-dev
    echo.
)

:: 生成圖標（如果不存在）
if not exist public\icon.png (
    node generate-icons.js
)

:: 啟動應用程式
npm run electron

pause