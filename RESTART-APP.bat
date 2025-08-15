@echo off
chcp 65001 >nul
cls
echo ========================================
echo   重新啟動萬用轉檔工具
echo ========================================
echo.

echo [1] 關閉舊的程式...
taskkill /F /IM Universal-Converter.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ 已關閉舊程式
) else (
    echo ℹ️ 沒有執行中的程式
)

timeout /t 2 /nobreak >nul

echo.
echo [2] 啟動新版程式...
cd /d "%~dp0"
start "" "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe"

timeout /t 3 /nobreak >nul

echo.
echo [3] 檢查狀態...
curl -s http://localhost:3456/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 程式啟動成功！
    echo.
    echo 程式視窗應該已經開啟
    echo 如果看到錯誤訊息，請按 F5 重新整理頁面
) else (
    echo ⏳ 程式正在啟動中...
)

echo.
pause