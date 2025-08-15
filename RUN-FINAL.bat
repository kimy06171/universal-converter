@echo off
chcp 65001 >nul
cls
echo ========================================
echo   執行萬用轉檔工具
echo ========================================
echo.

echo [1] 關閉舊程序...
taskkill /F /IM Universal-Converter.exe 2>nul
timeout /t 1 /nobreak >nul

echo.
echo [2] 啟動應用程式...
cd /d "%~dp0"

if exist "dist-final\Universal-Converter-win32-x64\Universal-Converter.exe" (
    start "" "dist-final\Universal-Converter-win32-x64\Universal-Converter.exe"
    echo ✅ 應用程式已啟動！
    echo.
    echo 如果看到黑色畫面：
    echo 1. 按 F12 開啟開發者工具
    echo 2. 檢查 Console 是否有錯誤訊息
    echo 3. 或嘗試手動開啟 http://localhost:3456/test.html
) else (
    echo ❌ 找不到應用程式
    echo 請先執行: npm run build-win
)

echo.
pause