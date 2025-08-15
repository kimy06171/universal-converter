@echo off
chcp 65001 >nul
cls
echo ========================================
echo   網頁版轉檔工具
echo ========================================
echo.

echo [1] 關閉舊的伺服器...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2] 啟動伺服器...
cd /d "%~dp0"
start /MIN cmd /c "node server.js"

echo.
echo [3] 等待伺服器啟動...
timeout /t 3 /nobreak >nul

echo.
echo [4] 開啟瀏覽器...
start http://localhost:3000

echo.
echo ========================================
echo   網頁版已啟動！
echo ========================================
echo.
echo 瀏覽器應該已經開啟
echo 如果沒有，請手動開啟：
echo http://localhost:3000
echo.
echo 按任意鍵關閉伺服器...
pause >nul

taskkill /F /IM node.exe
echo.
echo 伺服器已關閉
pause