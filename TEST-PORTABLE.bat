@echo off
chcp 65001 >nul
cls
echo ========================================
echo   測試可攜式版本
echo ========================================
echo.

cd /d "%~dp0"

:: 檢查可攜式版本
if exist "Universal-Converter-Portable\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ✅ 找到可攜式版本
    echo.
    echo 位置：Universal-Converter-Portable\Universal-Converter-win32-x64\
    echo.
    
    :: 顯示檔案資訊
    for %%I in ("Universal-Converter-Portable\Universal-Converter-win32-x64\Universal-Converter.exe") do (
        echo 執行檔：%%~nxI
        echo 大小：%%~zI bytes
        echo 修改日期：%%~tI
    )
    
    echo.
    echo 正在啟動程式...
    echo.
    echo 注意事項：
    echo - 程式會在瀏覽器中開啟
    echo - 第一次執行可能需要允許防火牆
    echo - 關閉此視窗會結束程式
    echo.
    echo 按 Ctrl+C 可以停止程式
    echo.
    
    :: 啟動程式
    start "" "Universal-Converter-Portable\Universal-Converter-win32-x64\Universal-Converter.exe"
    
    echo.
    echo 程式已啟動！
    echo.
    echo 如果程式沒有自動開啟，請手動開啟瀏覽器並訪問：
    echo http://localhost:3456
    echo.
    
) else (
    echo ❌ 找不到可攜式版本
    echo.
    echo 請先執行以下其中一個腳本來建立可攜式版本：
    echo - QUICK-PORTABLE-BUILD.bat（快速建立）
    echo - BUILD-PORTABLE-COMPLETE.bat（完整建立）
    echo.
)

pause