@echo off
chcp 65001 >nul
cls
echo ========================================
echo   萬用轉檔工具 - 網頁版選擇
echo ========================================
echo.
echo 請選擇要開啟的版本：
echo.
echo [1] 簡單版（基本圖片轉換）
echo [2] 進階版（更多功能）
echo [3] PDF 專業版（完整 PDF 處理）
echo.

choice /C 123 /M "請選擇"

if errorlevel 3 goto PDF
if errorlevel 2 goto ADVANCED
if errorlevel 1 goto SIMPLE

:SIMPLE
echo.
echo 正在開啟簡單版...
start "" "%cd%\web-converter.html"
goto END

:ADVANCED
echo.
echo 正在開啟進階版...
start "" "%cd%\web-converter-advanced.html"
goto END

:PDF
echo.
echo 正在開啟 PDF 專業版...
start "" "%cd%\web-converter-pdf.html"
goto END

:END
echo.
echo ✅ 網頁版已開啟！
echo.
echo 如果瀏覽器沒有自動開啟，請手動開啟：
echo 簡單版：%cd%\web-converter.html
echo 進階版：%cd%\web-converter-advanced.html
echo PDF版：%cd%\web-converter-pdf.html
echo.
echo ========================================
echo   使用說明
echo ========================================
echo.
echo 📌 網頁版特點：
echo    - 無需安裝任何軟體
echo    - 直接在瀏覽器執行
echo    - 完全離線使用
echo    - 檔案不會上傳到網路
echo.
echo 📌 支援功能：
echo    - 圖片格式轉換
echo    - 圖片大小調整
echo    - 批次處理
echo    - Base64 編碼
echo    - JSON 格式化
echo    - 顏色選擇器
echo    - QR Code 產生
echo.
echo 📌 使用方式：
echo    1. 拖放檔案到上傳區域
echo    2. 選擇轉換選項
echo    3. 點擊開始轉換
echo    4. 下載轉換後的檔案
echo.
pause