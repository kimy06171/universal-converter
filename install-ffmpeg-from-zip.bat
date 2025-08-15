@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   FFmpeg 安裝程式（從 ZIP 檔案）
echo ========================================
echo.

:: 檢查是否有管理員權限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 此腳本需要管理員權限執行
    echo 請右鍵點擊此檔案，選擇「以系統管理員身分執行」
    pause
    exit /b 1
)

:: 檢查 ZIP 檔案是否存在
if not exist ffmpeg.zip (
    echo [錯誤] 找不到 ffmpeg.zip 檔案！
    echo 請先執行 download-ffmpeg.bat 下載檔案
    pause
    exit /b 1
)

echo 1. 正在解壓縮 FFmpeg...
powershell -Command "Expand-Archive -Path 'ffmpeg.zip' -DestinationPath 'ffmpeg-temp' -Force"

:: 找到解壓縮後的資料夾
for /d %%i in (ffmpeg-temp\ffmpeg-*) do set EXTRACTED_PATH=%%i

if not exist "%EXTRACTED_PATH%" (
    echo [錯誤] 解壓縮失敗！
    pause
    exit /b 1
)

echo 2. 正在安裝到 C:\ffmpeg...

:: 如果目標資料夾已存在，先刪除
if exist "C:\ffmpeg" (
    echo    移除舊版本...
    rd /s /q "C:\ffmpeg"
)

:: 移動到安裝位置
move "%EXTRACTED_PATH%" "C:\ffmpeg" >nul 2>&1

:: 清理暫存資料夾
rd /s /q "ffmpeg-temp" 2>nul

echo 3. 正在設定環境變數...

:: 添加到系統 PATH
setx /M PATH "%PATH%;C:\ffmpeg\bin" >nul 2>&1

echo.
echo ========================================
echo   FFmpeg 安裝完成！
echo ========================================
echo.
echo 安裝位置：C:\ffmpeg
echo.
echo [重要] 請關閉並重新開啟命令提示字元或 PowerShell
echo        以使環境變數生效！
echo.
pause