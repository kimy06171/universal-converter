@echo off
echo ========================================
echo   建立所有版本（安裝程式 + 可攜帶版）
echo ========================================
echo.

:: 檢查是否已安裝 Electron
if not exist node_modules\electron (
    echo [錯誤] 請先執行 install-electron.bat 安裝必要的依賴項
    pause
    exit /b 1
)

:: 檢查 FFmpeg
if not exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo [警告] 找不到 FFmpeg，打包的程式將無法處理影音檔案
    echo 請確保 FFmpeg 已安裝在 C:\ffmpeg
    echo.
    choice /C YN /M "是否繼續打包"
    if errorlevel 2 exit /b 1
)

echo 正在清理舊的建置檔案...
if exist dist rd /s /q dist

echo.
echo 正在建立所有版本...
echo 這可能需要 5-10 分鐘，請耐心等待...
echo.

npm run dist

if errorlevel 1 (
    echo.
    echo [錯誤] 建置失敗！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   建置完成！
echo ========================================
echo.
echo 輸出檔案位於 dist 資料夾：
echo.
echo 1. 安裝程式：萬用轉檔工具 Setup *.exe
echo 2. 可攜帶版：萬用轉檔工具-portable.exe
echo.
echo 安裝程式版本：
echo - 需要安裝，會建立開始選單和桌面捷徑
echo - 適合長期使用
echo.
echo 可攜帶版本：
echo - 無需安裝，直接執行
echo - 適合隨身碟使用或臨時使用
echo - 可複製到任何 Windows 電腦執行
echo.

:: 開啟輸出資料夾
explorer dist

pause