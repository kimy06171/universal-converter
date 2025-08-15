@echo off
chcp 65001 >nul
cls
echo ========================================
echo   萬用轉檔工具 - 可攜式版本建立程式
echo ========================================
echo.

cd /d "%~dp0"

:: 步驟 1：檢查並安裝必要的套件
echo [步驟 1/5] 檢查套件相依性...
if not exist node_modules (
    echo 安裝套件中...
    call npm install
    if errorlevel 1 (
        echo [錯誤] 套件安裝失敗
        pause
        exit /b 1
    )
)
echo ✅ 套件檢查完成
echo.

:: 步驟 2：安裝 electron-packager（如果尚未安裝）
echo [步驟 2/5] 檢查打包工具...
if not exist node_modules\electron-packager (
    echo 安裝 electron-packager...
    call npm install electron-packager@17.1.2 --save-dev
    if errorlevel 1 (
        echo [錯誤] electron-packager 安裝失敗
        pause
        exit /b 1
    )
)
echo ✅ 打包工具就緒
echo.

:: 步驟 3：檢查並下載 FFmpeg（如果不存在）
echo [步驟 3/5] 檢查 FFmpeg...
if not exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo ⚠️ 注意：FFmpeg 未安裝在預設位置
    echo 請確保已安裝 FFmpeg，或使用下載腳本：download-ffmpeg.bat
)
echo ✅ FFmpeg 檢查完成
echo.

:: 步驟 4：執行打包
echo [步驟 4/5] 開始打包應用程式...
echo 這可能需要幾分鐘時間，請耐心等待...
echo.

:: 執行打包腳本
call node build-with-packager.js win32

if errorlevel 1 (
    echo [錯誤] 打包失敗
    pause
    exit /b 1
)

echo ✅ 打包完成！
echo.

:: 步驟 5：建立可攜式版本資料夾
echo [步驟 5/5] 整理可攜式版本...

:: 檢查輸出資料夾是否存在
if not exist "dist-final\Universal-Converter-win32-x64" (
    echo [錯誤] 找不到打包後的檔案
    echo 請檢查 dist-final 資料夾
    pause
    exit /b 1
)

:: 建立可攜式版本資料夾
if not exist "Universal-Converter-Portable" (
    mkdir "Universal-Converter-Portable"
)

:: 複製所有檔案到可攜式資料夾
echo 複製檔案中...
xcopy "dist-final\Universal-Converter-win32-x64\*.*" "Universal-Converter-Portable\" /E /Y /Q

echo.
echo ========================================
echo   ✅ 可攜式版本建立完成！
echo ========================================
echo.
echo 📁 位置：Universal-Converter-Portable
echo 📦 大小：約 170 MB
echo.
echo 如何使用：
echo 1. 將整個 Universal-Converter-Portable 資料夾複製到 USB 或其他電腦
echo 2. 執行 Universal-Converter.exe 即可使用
echo.
echo 建議：
echo - 可以將資料夾壓縮成 ZIP 檔案方便傳輸
echo - 在其他電腦第一次執行時可能需要允許防火牆存取
echo.

:: 詢問是否要建立 ZIP 檔案
choice /C YN /M "是否要建立 ZIP 壓縮檔？"
if errorlevel 2 goto END
if errorlevel 1 goto CREATEZIP

:CREATEZIP
echo.
echo 建立 ZIP 檔案中...
powershell Compress-Archive -Path 'Universal-Converter-Portable' -DestinationPath 'Universal-Converter-Portable.zip' -Force
if exist "Universal-Converter-Portable.zip" (
    echo ✅ ZIP 檔案建立成功：Universal-Converter-Portable.zip
) else (
    echo ⚠️ ZIP 檔案建立失敗，請手動壓縮資料夾
)

:END
echo.
echo 按任意鍵開啟輸出資料夾...
pause >nul
explorer .