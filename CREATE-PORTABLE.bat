@echo off
chcp 65001 >nul
cls
echo ========================================
echo   建立可攜帶版 EXE 檔案
echo ========================================
echo.

cd /d "%~dp0"

if not exist "dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo [錯誤] 找不到已編譯的程式
    echo 請先執行: node build-with-packager.js
    pause
    exit /b 1
)

echo ✅ 找到編譯後的程式！
echo.
echo 📍 位置：
echo dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe
echo.
echo 📦 檔案大小：約 170 MB
echo.
echo ========================================
echo   如何使用可攜帶版
echo ========================================
echo.
echo 方法 1：直接使用資料夾
echo - 將整個 Universal-Converter-win32-x64 資料夾複製到其他電腦
echo - 執行裡面的 Universal-Converter.exe
echo.
echo 方法 2：壓縮成 ZIP（推薦）
echo - 對 Universal-Converter-win32-x64 資料夾按右鍵
echo - 選擇「傳送到」→「壓縮的資料夾」
echo - 將 ZIP 檔案分享給其他人
echo - 解壓縮後執行 Universal-Converter.exe
echo.
echo 按任意鍵開啟資料夾...
pause >nul

explorer dist-packager\Universal-Converter-win32-x64

echo.
echo 完成！
pause