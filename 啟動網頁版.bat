@echo off
chcp 65001 >nul
cls
echo ========================================
echo   萬用轉檔工具 - 網頁版
echo ========================================
echo.
echo 正在開啟網頁版轉檔工具...
echo.

cd /d "%~dp0"

:: 直接開啟 HTML 檔案
start "" "web-converter.html"

echo ✅ 網頁版已開啟！
echo.
echo 如果瀏覽器沒有自動開啟，請手動開啟：
echo %cd%\web-converter.html
echo.
echo ========================================
echo   功能說明
echo ========================================
echo.
echo ✅ 支援的功能：
echo    - 圖片格式轉換（JPG, PNG, WebP, GIF, BMP）
echo    - 圖片品質調整
echo    - 圖片大小調整
echo    - 批次處理
echo.
echo ⚠️ 限制：
echo    - 影片和音訊轉換需要伺服器版本
echo    - PDF功能有限
echo.
echo 📌 優點：
echo    - 無需安裝任何軟體
echo    - 直接在瀏覽器執行
echo    - 可離線使用
echo    - 檔案不會上傳到網路
echo.
pause