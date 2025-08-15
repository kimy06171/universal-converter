@echo off
chcp 65001 >nul
cls
echo ========================================
echo   修復並執行轉檔工具
echo ========================================
echo.

echo [1] 關閉所有舊程序...
taskkill /F /IM Universal-Converter.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ 已關閉舊程序
    timeout /t 2 /nobreak >nul
) else (
    echo ℹ️ 沒有執行中的程序
)

echo.
echo [2] 啟動應用程式...
cd /d "%~dp0"

if exist "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo 找到應用程式，正在啟動...
    start "" /MAX "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe"
    
    echo.
    echo [3] 等待伺服器啟動...
    timeout /t 5 /nobreak >nul
    
    echo.
    echo [4] 開啟瀏覽器...
    start http://localhost:3456
    
    echo.
    echo ========================================
    echo   應用程式已啟動！
    echo ========================================
    echo.
    echo 如果沒有看到視窗，請：
    echo 1. 檢查工作列是否有圖示
    echo 2. 在瀏覽器輸入 http://localhost:3456
    echo 3. 按 Alt+Tab 切換視窗
    echo.
) else (
    echo ❌ 找不到應用程式
    echo.
    echo 請確認路徑：
    echo dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe
)

pause