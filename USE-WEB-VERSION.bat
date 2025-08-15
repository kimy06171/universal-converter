@echo off
chcp 65001 >nul
cls
echo ========================================
echo   建議：使用網頁版本
echo ========================================
echo.
echo 由於 Electron 版本仍有顯示問題，
echo 建議您使用網頁版本。
echo.
echo ========================================
echo   啟動網頁版轉檔工具
echo ========================================
echo.

REM 關閉舊的 Node 程序
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
timeout /t 2 /nobreak >nul

echo [1] 啟動伺服器...
cd /d "%~dp0"
start /MIN cmd /c "node server.js"

echo.
echo [2] 等待伺服器啟動...
timeout /t 3 /nobreak >nul

echo.
echo [3] 開啟瀏覽器...
start http://localhost:3000

echo.
echo ========================================
echo   ✅ 網頁版已啟動！
echo ========================================
echo.
echo 瀏覽器應該已經開啟
echo 如果沒有，請手動訪問：
echo.
echo   http://localhost:3000
echo.
echo ========================================
echo.
echo 按任意鍵關閉伺服器...
pause >nul

powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
echo.
echo 伺服器已關閉
pause