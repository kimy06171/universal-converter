@echo off
echo ========================================
echo   萬用轉檔工具啟動程式
echo ========================================
echo.

echo 正在檢查 Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未找到 Node.js，請先安裝 Node.js
    echo 下載網址: https://nodejs.org/
    pause
    exit /b 1
)

echo 正在檢查 FFmpeg...
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未找到 FFmpeg，影音轉換功能將無法使用
    echo 下載網址: https://ffmpeg.org/download.html
    echo.
)

echo 正在檢查依賴套件...
if not exist node_modules (
    echo 首次執行，正在安裝依賴套件...
    call npm install
    if %errorlevel% neq 0 (
        echo [錯誤] 套件安裝失敗
        pause
        exit /b 1
    )
)

echo.
echo 正在啟動伺服器...
echo ========================================
echo.
echo 伺服器啟動成功後，請開啟瀏覽器訪問:
echo http://localhost:3000
echo.
echo 按 Ctrl+C 停止伺服器
echo ========================================
echo.

npm start