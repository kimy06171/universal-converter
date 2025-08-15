@echo off
chcp 65001 >nul
cls
echo ========================================
echo   萬用轉檔工具 - 啟動程式
echo ========================================
echo.

cd /d "%~dp0"

set APP_PATH=dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe

if exist "%APP_PATH%" (
    echo ✅ 找到程式！
    echo.
    echo 📍 位置：
    echo %APP_PATH%
    echo.
    echo 🚀 正在啟動程式...
    start "" "%APP_PATH%"
    
    timeout /t 3 /nobreak >nul
    
    echo.
    echo 📊 檢查伺服器狀態...
    curl -s http://localhost:3456/api/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 伺服器運行正常！
        echo.
        echo 🌐 請在瀏覽器開啟：http://localhost:3456
        echo.
        echo 或程式視窗應該已經開啟
    ) else (
        echo ⏳ 伺服器正在啟動中...
    )
) else (
    echo ❌ 找不到程式
    echo.
    echo 請確認檔案是否存在：
    echo %APP_PATH%
)

echo.
echo 按任意鍵結束...
pause >nul