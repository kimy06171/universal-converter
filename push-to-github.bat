@echo off
chcp 65001 >nul
cls
echo ========================================
echo   推送到 GitHub
echo ========================================
echo.
echo 請確保您已經在 GitHub 上建立了 universal-converter 倉庫
echo https://github.com/kimy06171/universal-converter
echo.
pause

echo.
echo 正在推送到 GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 您的專案現在已經在：
    echo https://github.com/kimy06171/universal-converter
) else (
    echo.
    echo ❌ 推送失敗
    echo.
    echo 可能的原因：
    echo 1. 倉庫尚未建立
    echo 2. 沒有推送權限
    echo 3. 網路連接問題
    echo.
    echo 請先在 GitHub 建立倉庫：
    echo https://github.com/new
)

pause