@echo off
chcp 65001 >nul
cls
echo ========================================
echo   診斷應用程式問題
echo ========================================
echo.

cd /d "%~dp0"

echo [1] 檢查應用程式檔案...
if exist "dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ✅ 找到主程式
) else (
    echo ❌ 找不到主程式
)

if exist "dist-packager\Universal-Converter-win32-x64\resources\app\server.js" (
    echo ✅ 找到伺服器檔案
) else (
    echo ❌ 找不到伺服器檔案
)

if exist "dist-packager\Universal-Converter-win32-x64\resources\app\node_modules" (
    echo ✅ 找到 node_modules
) else (
    echo ❌ 找不到 node_modules
)

echo.
echo [2] 檢查檔案結構...
echo.
echo 應用程式資料夾內容：
dir "dist-packager\Universal-Converter-win32-x64\resources\app" /b 2>nul

echo.
echo [3] 嘗試直接執行伺服器...
cd "dist-packager\Universal-Converter-win32-x64\resources\app"
node server.js --test 2>nul
if %errorlevel% equ 0 (
    echo ✅ 伺服器可以執行
) else (
    echo ❌ 伺服器無法執行
)

cd /d "%~dp0"

echo.
echo 按任意鍵繼續...
pause >nul