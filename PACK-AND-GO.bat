@echo off
chcp 65001 >nul
cls
echo ========================================
echo   萬用轉檔工具 - 打包帶走
echo ========================================
echo.
echo 此腳本將協助您打包程式，方便攜帶到其他電腦使用
echo.

cd /d "%~dp0"

:: 檢查可攜式版本是否存在
if not exist "Universal-Converter-Portable\Universal-Converter-win32-x64\Universal-Converter.exe" (
    echo ⚠️ 找不到可攜式版本，正在建立...
    echo.
    call QUICK-PORTABLE-BUILD.bat
    if errorlevel 1 (
        echo 建立失敗，請檢查錯誤訊息
        pause
        exit /b 1
    )
)

echo ✅ 可攜式版本已就緒
echo.
echo 選擇打包方式：
echo.
echo [1] 建立 ZIP 壓縮檔（推薦，檔案較小）
echo [2] 建立 7Z 壓縮檔（壓縮率更高）
echo [3] 複製到 USB 隨身碟
echo [4] 開啟資料夾手動處理
echo.

choice /C 1234 /M "請選擇"

if errorlevel 4 goto OPENFOLDER
if errorlevel 3 goto COPYUSB
if errorlevel 2 goto CREATE7Z
if errorlevel 1 goto CREATEZIP

:CREATEZIP
echo.
echo 建立 ZIP 壓縮檔...
powershell -NoProfile -Command "& {Compress-Archive -Path 'Universal-Converter-Portable\Universal-Converter-win32-x64' -DestinationPath 'Universal-Converter-Portable.zip' -Force}"
if exist "Universal-Converter-Portable.zip" (
    echo.
    echo ✅ ZIP 檔案建立成功！
    echo 📦 檔案名稱：Universal-Converter-Portable.zip
    echo 💾 檔案位置：%cd%\Universal-Converter-Portable.zip
    echo.
    echo 您現在可以：
    echo - 將 ZIP 檔案複製到 USB 隨身碟
    echo - 上傳到雲端硬碟（Google Drive、OneDrive 等）
    echo - 透過 Email 或其他方式分享
    echo.
    echo 在其他電腦使用時：
    echo 1. 解壓縮 ZIP 檔案
    echo 2. 執行 Universal-Converter.exe
)
goto END

:CREATE7Z
echo.
echo 建立 7Z 壓縮檔...
if exist "%ProgramFiles%\7-Zip\7z.exe" (
    "%ProgramFiles%\7-Zip\7z.exe" a -t7z "Universal-Converter-Portable.7z" "Universal-Converter-Portable\Universal-Converter-win32-x64\*" -mx=9
    echo ✅ 7Z 檔案建立成功！
) else (
    echo ⚠️ 未安裝 7-Zip，改用 ZIP 格式
    goto CREATEZIP
)
goto END

:COPYUSB
echo.
echo 請插入 USB 隨身碟...
echo.
echo 可用的磁碟機：
wmic logicaldisk where drivetype=2 get deviceid, volumename, size

echo.
set /p USBDRIVE="請輸入 USB 磁碟機代號（例如 E:）："

if exist "%USBDRIVE%\" (
    echo.
    echo 複製檔案到 %USBDRIVE%\Universal-Converter...
    xcopy "Universal-Converter-Portable\Universal-Converter-win32-x64" "%USBDRIVE%\Universal-Converter\" /E /I /Y
    echo.
    echo ✅ 複製完成！
    echo.
    echo 在其他電腦使用時：
    echo 1. 插入 USB 隨身碟
    echo 2. 開啟 Universal-Converter 資料夾
    echo 3. 執行 Universal-Converter.exe
) else (
    echo ❌ 找不到指定的磁碟機
)
goto END

:OPENFOLDER
echo.
echo 開啟資料夾...
explorer "Universal-Converter-Portable\Universal-Converter-win32-x64"
echo.
echo 您可以手動：
echo - 將整個資料夾複製到您想要的位置
echo - 使用您偏好的壓縮軟體打包
echo - 上傳到雲端或網路硬碟
goto END

:END
echo.
echo ========================================
echo   使用提示
echo ========================================
echo.
echo 📌 系統需求：
echo    - Windows 10 或更新版本（64位元）
echo    - 至少 4GB RAM
echo    - 約 200MB 儲存空間
echo.
echo 📌 注意事項：
echo    - 第一次執行可能需要允許防火牆
echo    - 不需要安裝任何其他軟體
echo    - 完全離線運作，不需要網路
echo.
echo 📌 支援格式：
echo    - 圖片：JPG, PNG, GIF, BMP, WebP
echo    - 影片：MP4, AVI, MOV, MKV, WebM
echo    - 音訊：MP3, WAV, FLAC, AAC, OGG
echo    - 文檔：PDF, DOCX, TXT, XLSX, CSV
echo.
pause