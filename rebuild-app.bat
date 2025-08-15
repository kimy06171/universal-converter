@echo off
chcp 65001 >nul
cls
echo ========================================
echo   重新建立可攜帶版應用程式
echo ========================================
echo.

cd /d "%~dp0"

echo [1] 刪除舊的打包檔案...
if exist "dist-packager" (
    rd /s /q "dist-packager"
    echo ✅ 已刪除舊檔案
)

echo.
echo [2] 執行打包程式...
echo.
node build-with-packager.js

echo.
echo [3] 檢查打包結果...
if exist "dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ✅ 打包成功！
    echo.
    echo 程式位置：
    echo dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe
    echo.
    echo 按任意鍵執行程式...
    pause >nul
    start "" "dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe"
) else (
    echo ❌ 打包失敗
)

echo.
pause