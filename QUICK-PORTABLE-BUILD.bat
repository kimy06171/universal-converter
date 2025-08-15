@echo off
chcp 65001 >nul
cls
echo ========================================
echo   快速建立可攜式版本
echo ========================================
echo.

cd /d "%~dp0"

:: 快速檢查是否已有編譯好的版本
if exist "Universal-Converter-Portable\Universal-Converter.exe" (
    echo ✅ 發現已存在的可攜式版本！
    echo.
    echo 位置：Universal-Converter-Portable\
    echo.
    choice /C YN /M "是否要重新建立？"
    if errorlevel 2 goto EXISTING
    if errorlevel 1 goto BUILD
)

:BUILD
echo 開始建立可攜式版本...
echo.

:: 確保必要套件已安裝
if not exist node_modules (
    echo 安裝必要套件...
    call npm install
)

:: 執行打包
echo 執行打包程式...
call node build-with-packager.js win32

:: 建立可攜式資料夾
if exist "dist-final\Universal-Converter-win32-x64" (
    echo.
    echo 建立可攜式資料夾...
    if exist "Universal-Converter-Portable" rd /s /q "Universal-Converter-Portable"
    xcopy "dist-final\Universal-Converter-win32-x64" "Universal-Converter-Portable\" /E /I /Q
    
    echo.
    echo ✅ 可攜式版本建立成功！
    goto SUCCESS
) else (
    echo ❌ 打包失敗，請檢查錯誤訊息
    pause
    exit /b 1
)

:EXISTING
:SUCCESS
echo.
echo ========================================
echo   可攜式版本資訊
echo ========================================
echo.
echo 📁 資料夾：Universal-Converter-Portable
echo 🚀 執行檔：Universal-Converter.exe
echo 💾 大小：約 170 MB
echo.
echo 使用方式：
echo 1. 複製整個資料夾到 USB 或其他電腦
echo 2. 直接執行 Universal-Converter.exe
echo.

:: 建立 ZIP 檔案
choice /C YN /T 5 /D N /M "建立 ZIP 壓縮檔？(5秒後自動跳過)"
if errorlevel 1 (
    echo.
    echo 建立 ZIP 檔案...
    powershell -NoProfile -Command "& {Compress-Archive -Path 'Universal-Converter-Portable' -DestinationPath 'Universal-Converter-Portable.zip' -Force}"
    echo ✅ ZIP 檔案已建立
)

echo.
echo 按任意鍵開啟資料夾...
pause >nul
explorer Universal-Converter-Portable