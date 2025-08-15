@echo off
chcp 65001 >nul
cls
echo ========================================
echo   重新打包並執行轉檔工具
echo ========================================
echo.

echo [1] 關閉所有舊程序...
taskkill /F /IM Universal-Converter.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2] 刪除舊的打包檔案...
if exist "dist-packager-new" (
    rmdir /s /q "dist-packager-new"
    echo ✅ 已刪除舊版本
)

echo.
echo [3] 重新打包應用程式...
echo 這可能需要幾分鐘時間...
call npm run build-packager

echo.
echo [4] 檢查打包結果...
if exist "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ✅ 打包成功！
    
    echo.
    echo [5] 啟動應用程式...
    start "" "dist-packager-new\Universal-Converter-win32-x64\Universal-Converter.exe"
    
    echo.
    echo ========================================
    echo   應用程式已啟動！
    echo ========================================
    echo.
    echo 視窗應該已經開啟
    echo 如果看到黑色畫面，請按 F12 開啟開發者工具檢查錯誤
    echo.
) else (
    echo ❌ 打包失敗
    echo 請檢查 npm 是否安裝正確
)

pause