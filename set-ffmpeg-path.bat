@echo off
echo ========================================
echo   設定 FFmpeg 環境變數
echo ========================================
echo.
echo FFmpeg 已安裝在 C:\ffmpeg
echo.
echo 請以系統管理員身分執行此檔案來永久設定環境變數
echo.

:: 檢查是否有管理員權限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [注意] 需要系統管理員權限
    echo.
    echo 請右鍵點擊此檔案，選擇「以系統管理員身分執行」
    echo 或手動新增 C:\ffmpeg\bin 到系統 PATH 環境變數
    echo.
    echo 手動設定步驟：
    echo 1. 按 Win+R，輸入 sysdm.cpl
    echo 2. 點擊「進階」標籤
    echo 3. 點擊「環境變數」
    echo 4. 在系統變數中找到 Path，點擊「編輯」
    echo 5. 點擊「新增」，輸入：C:\ffmpeg\bin
    echo 6. 點擊所有視窗的「確定」
    pause
    exit /b 1
)

:: 設定環境變數
echo 正在設定系統環境變數...
setx /M PATH "%PATH%;C:\ffmpeg\bin" >nul 2>&1

echo.
echo ✓ 環境變數設定完成！
echo.
echo 請關閉並重新開啟命令提示字元或 PowerShell
echo 然後執行 ffmpeg -version 來驗證安裝
echo.
pause