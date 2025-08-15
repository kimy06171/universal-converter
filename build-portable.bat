@echo off
echo ========================================
echo   建立可攜帶版本
echo ========================================
echo.

:: 檢查是否已安裝 Electron
if not exist node_modules\electron (
    echo [錯誤] 請先執行 install-electron.bat 安裝必要的依賴項
    pause
    exit /b 1
)

:: 檢查 FFmpeg 是否存在
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
echo 正在建立可攜帶版本...
echo 這可能需要幾分鐘，請耐心等待...
echo.

npm run build-portable

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
echo 可攜帶版本位於：dist\萬用轉檔工具-portable.exe
echo.
echo 您可以將此檔案複製到任何 Windows 電腦執行
echo （無需安裝，包含所有必要的元件）
echo.

:: 開啟輸出資料夾
explorer dist

pause