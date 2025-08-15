@echo off
echo ========================================
echo   Universal Converter - 執行程式
echo ========================================
echo.

set APP_PATH=C:\Users\user\OneDrive\tuf18\universal-converter\dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe

if exist "%APP_PATH%" (
    echo ✅ 找到程式！
    echo.
    echo 位置：
    echo %APP_PATH%
    echo.
    echo 正在啟動程式...
    start "" "%APP_PATH%"
    echo.
    echo 程式已啟動！
) else (
    echo ❌ 找不到程式
    echo.
    echo 請確認檔案是否存在：
    echo %APP_PATH%
    echo.
    echo 如果檔案不存在，請執行：
    echo node build-with-packager.js
)

pause