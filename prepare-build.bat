@echo off
echo ========================================
echo   準備打包環境
echo ========================================
echo.

echo 1. 檢查 Node.js 環境...
node --version >nul 2>&1
if errorlevel 1 (
    echo [錯誤] 未找到 Node.js，請先安裝 Node.js
    pause
    exit /b 1
)
echo    ✓ Node.js 已安裝

echo.
echo 2. 檢查 FFmpeg...
if exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo    ✓ FFmpeg 已安裝
) else (
    echo    ✗ FFmpeg 未安裝（影音轉換功能將無法使用）
)

echo.
echo 3. 安裝專案依賴項...
if not exist node_modules (
    echo    正在安裝基礎依賴項...
    npm install
)
echo    ✓ 基礎依賴項已安裝

echo.
echo 4. 安裝 Electron 依賴項...
if not exist node_modules\electron (
    echo    正在安裝 Electron...
    npm install electron@28.0.0 --save-dev
    npm install electron-builder@24.9.1 --save-dev
)
echo    ✓ Electron 已安裝

echo.
echo 5. 建立必要的目錄...
if not exist uploads mkdir uploads
if not exist output mkdir output
echo    ✓ 目錄已建立

echo.
echo 6. 生成圖標檔案...
if not exist public\icon.png (
    echo    [提示] 需要 PNG 格式的圖標
    echo    請將圖標檔案放置在 public\icon.png
)
if not exist public\icon.ico (
    echo    [提示] 需要 ICO 格式的圖標（Windows 用）
    echo    請將圖標檔案放置在 public\icon.ico
)

echo.
echo ========================================
echo   環境準備完成！
echo ========================================
echo.
echo 您現在可以執行：
echo.
echo 測試應用程式：
echo   npm run electron
echo.
echo 建立可攜帶版本：
echo   npm run build-portable
echo   或執行 build-portable.bat
echo.
echo 建立所有版本：
echo   npm run dist
echo   或執行 build-all.bat
echo.
pause