@echo off
echo 正在下載 FFmpeg，請稍候...
echo.

:: 使用 PowerShell 下載
powershell -Command "& {$ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' -OutFile 'ffmpeg.zip'}"

if exist ffmpeg.zip (
    echo 下載完成！
    echo 檔案位置: %cd%\ffmpeg.zip
    echo.
    echo 請執行 install-ffmpeg-from-zip.bat 來安裝
) else (
    echo 下載失敗，請手動下載：
    echo https://github.com/BtbN/FFmpeg-Builds/releases/latest
)
pause