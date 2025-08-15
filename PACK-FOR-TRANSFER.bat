@echo off
chcp 65001 >nul
cls
echo ========================================
echo   打包應用程式以便攜帶
echo ========================================
echo.

cd /d "%~dp0"

echo 正在壓縮應用程式...
echo 這可能需要幾分鐘，請稍候...
echo.

powershell -Command "Compress-Archive -Path 'dist-packager-new\Universal-Converter-win32-x64' -DestinationPath 'Universal-Converter-Portable.zip' -Force"

if exist "Universal-Converter-Portable.zip" (
    echo ✅ 壓縮成功！
    echo.
    echo ========================================
    echo   打包完成
    echo ========================================
    echo.
    echo 📦 檔案名稱：Universal-Converter-Portable.zip
    for %%I in (Universal-Converter-Portable.zip) do echo 📏 檔案大小：%%~zI bytes
    echo 📍 檔案位置：%cd%\Universal-Converter-Portable.zip
    echo.
    echo ========================================
    echo   如何在其他電腦使用
    echo ========================================
    echo.
    echo 1. 將 Universal-Converter-Portable.zip 複製到其他電腦
    echo    （透過 USB、雲端硬碟、Email 等方式）
    echo.
    echo 2. 在目標電腦解壓縮 ZIP 檔案
    echo.
    echo 3. 進入解壓縮後的 Universal-Converter-win32-x64 資料夾
    echo.
    echo 4. 雙擊執行 Universal-Converter.exe
    echo.
    echo ⚠️ 注意：目標電腦需要 Windows 10/11 (64位元)
    echo ⚠️ 不需要安裝任何其他軟體！
    echo.
    echo 按 Y 開啟檔案位置，按 N 結束
    choice /c YN /n
    if %errorlevel% equ 1 (
        explorer /select,"Universal-Converter-Portable.zip"
    )
) else (
    echo ❌ 壓縮失敗！
    echo 請確認 dist-packager-new\Universal-Converter-win32-x64 資料夾存在
)

echo.
pause