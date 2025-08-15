@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   FFmpeg 自動安裝程式
echo ========================================
echo.

:: 檢查是否已安裝
ffmpeg -version >nul 2>&1
if %errorlevel% equ 0 (
    echo FFmpeg 已經安裝！
    ffmpeg -version
    pause
    exit /b 0
)

echo FFmpeg 尚未安裝，開始安裝程序...
echo.

:: 檢查是否有管理員權限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 此腳本需要管理員權限執行
    echo 請右鍵點擊此檔案，選擇「以系統管理員身分執行」
    pause
    exit /b 1
)

:: 設定下載路徑
set FFMPEG_URL=https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
set DOWNLOAD_PATH=%TEMP%\ffmpeg.zip
set INSTALL_PATH=C:\ffmpeg

echo 1. 正在下載 FFmpeg...
echo    這可能需要幾分鐘，請耐心等待...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%FFMPEG_URL%' -OutFile '%DOWNLOAD_PATH%'}"

if not exist "%DOWNLOAD_PATH%" (
    echo [錯誤] 下載失敗！
    echo 請手動從以下網址下載：
    echo %FFMPEG_URL%
    pause
    exit /b 1
)

echo.
echo 2. 正在解壓縮...
powershell -Command "& {Expand-Archive -Path '%DOWNLOAD_PATH%' -DestinationPath '%TEMP%\ffmpeg-extract' -Force}"

:: 找到解壓縮後的資料夾
for /d %%i in (%TEMP%\ffmpeg-extract\ffmpeg-*) do set EXTRACTED_PATH=%%i

if not exist "%EXTRACTED_PATH%" (
    echo [錯誤] 解壓縮失敗！
    pause
    exit /b 1
)

echo.
echo 3. 正在安裝到 %INSTALL_PATH%...

:: 如果目標資料夾已存在，先刪除
if exist "%INSTALL_PATH%" (
    echo    移除舊版本...
    rd /s /q "%INSTALL_PATH%"
)

:: 移動到安裝位置
move "%EXTRACTED_PATH%" "%INSTALL_PATH%" >nul 2>&1

if not exist "%INSTALL_PATH%\bin\ffmpeg.exe" (
    echo [錯誤] 安裝失敗！
    pause
    exit /b 1
)

echo.
echo 4. 正在設定環境變數...

:: 檢查 PATH 是否已包含 ffmpeg
echo %PATH% | findstr /C:"%INSTALL_PATH%\bin" >nul
if %errorlevel% neq 0 (
    :: 添加到系統 PATH
    setx /M PATH "%PATH%;%INSTALL_PATH%\bin" >nul 2>&1
    
    :: 也更新當前會話的 PATH
    set "PATH=%PATH%;%INSTALL_PATH%\bin"
    
    echo    環境變數已更新！
) else (
    echo    環境變數已存在，跳過...
)

echo.
echo 5. 清理暫存檔案...
del "%DOWNLOAD_PATH%" 2>nul
rd /s /q "%TEMP%\ffmpeg-extract" 2>nul

echo.
echo ========================================
echo   FFmpeg 安裝完成！
echo ========================================
echo.
echo 安裝位置：%INSTALL_PATH%
echo.
echo 正在驗證安裝...
"%INSTALL_PATH%\bin\ffmpeg.exe" -version

echo.
echo [重要] 請關閉並重新開啟命令提示字元或 PowerShell
echo        以使環境變數生效！
echo.
pause