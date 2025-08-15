@echo off
echo ========================================
echo   萬用轉檔工具 - 一鍵建立 GUI 版本
echo ========================================
echo.
echo 此腳本將自動完成所有步驟：
echo 1. 安裝依賴項
echo 2. 生成圖標
echo 3. 建立可攜帶版本
echo.
pause

echo.
echo [步驟 1/4] 檢查環境...
echo ----------------------------------------

:: 檢查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [錯誤] 未找到 Node.js
    echo 請先安裝 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js 已安裝

:: 檢查 FFmpeg
if exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo ✓ FFmpeg 已安裝
) else (
    echo ⚠ FFmpeg 未安裝（影音功能將受限）
)

echo.
echo [步驟 2/4] 安裝依賴項...
echo ----------------------------------------

:: 安裝基礎依賴
if not exist node_modules (
    echo 安裝基礎依賴項...
    call npm install
)

:: 安裝 Electron
if not exist node_modules\electron (
    echo 安裝 Electron...
    call npm install electron@28.0.0 --save-dev
)

:: 安裝 Electron Builder
if not exist node_modules\electron-builder (
    echo 安裝打包工具...
    call npm install electron-builder@24.9.1 --save-dev
)

echo ✓ 所有依賴項已安裝

echo.
echo [步驟 3/4] 生成圖標...
echo ----------------------------------------
node generate-icons.js
echo ✓ 圖標已生成

echo.
echo [步驟 4/4] 建立可攜帶版本...
echo ----------------------------------------
echo 這可能需要 3-5 分鐘，請耐心等待...
echo.

:: 清理舊檔案
if exist dist rd /s /q dist

:: 執行打包
call npm run build-portable

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ❌ 建置失敗
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 網路連線問題（需要下載 Electron）
    echo 2. 硬碟空間不足
    echo 3. 防毒軟體阻擋
    echo.
    echo 請檢查錯誤訊息並重試
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 建置成功！
echo ========================================
echo.
echo 可攜帶版本已建立：
echo 📁 dist\萬用轉檔工具-portable.exe
echo.
echo 檔案大小約 150-200 MB
echo.
echo 您可以：
echo 1. 將此檔案複製到任何 Windows 電腦
echo 2. 直接執行，無需安裝
echo 3. 放在隨身碟中隨時使用
echo.
echo 現在要開啟輸出資料夾嗎？
pause

:: 開啟資料夾
explorer dist

echo.
echo 完成！
pause