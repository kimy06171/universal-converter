@echo off
chcp 65001 >nul
cls
echo ========================================
echo   建立可攜帶桌面應用程式
echo ========================================
echo.

cd /d "%~dp0"

echo [步驟 1] 檢查現有的應用程式...
if exist "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ✅ 找到已打包的應用程式！
    echo.
    goto :package
) else (
    echo ❌ 找不到應用程式，開始建立...
    echo.
    goto :build
)

:build
echo [步驟 2] 開始打包應用程式...
call node build-with-packager.js
if %errorlevel% neq 0 (
    echo ❌ 打包失敗！
    pause
    exit /b 1
)
echo ✅ 打包成功！
echo.

:package
echo ========================================
echo   可攜帶版本資訊
echo ========================================
echo.
echo 📁 應用程式位置：
echo    dist-packager-new\Universal-Converter-win32-x64\
echo.
echo 📦 檔案大小：約 170-200 MB
echo.
echo ========================================
echo   如何帶到其他電腦
echo ========================================
echo.
echo 方法 1：使用 USB 隨身碟
echo ───────────────────────
echo 1. 將整個 Universal-Converter-win32-x64 資料夾複製到 USB
echo 2. 在其他電腦插入 USB
echo 3. 直接執行 Universal-Converter.exe
echo.
echo 方法 2：壓縮成 ZIP 檔案（推薦）
echo ───────────────────────
echo 1. 對 Universal-Converter-win32-x64 資料夾按右鍵
echo 2. 選擇「傳送到」→「壓縮的資料夾」
echo 3. 透過雲端硬碟、Email 或 USB 傳輸 ZIP 檔案
echo 4. 在其他電腦解壓縮
echo 5. 執行 Universal-Converter.exe
echo.
echo 方法 3：使用雲端硬碟
echo ───────────────────────
echo 1. 上傳整個資料夾到 Google Drive、OneDrive 等
echo 2. 在其他電腦下載
echo 3. 執行 Universal-Converter.exe
echo.
echo ========================================
echo   注意事項
echo ========================================
echo ✅ 不需要安裝 Node.js
echo ✅ 不需要安裝任何其他軟體
echo ✅ 支援 Windows 10/11 (64位元)
echo ✅ 包含所有必要的檔案
echo.
echo 按 1 - 開啟資料夾位置
echo 按 2 - 測試執行應用程式
echo 按 3 - 結束
echo.
choice /c 123 /n
if %errorlevel% equ 1 (
    explorer "dist-packager-new\Universal-Converter-win32-x64"
)
if %errorlevel% equ 2 (
    start "" "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe"
    echo.
    echo 應用程式已啟動！應該會看到一個獨立的視窗。
)

echo.
pause