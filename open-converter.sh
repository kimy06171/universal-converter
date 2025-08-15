#!/bin/bash

# 跨平台啟動腳本 - 自動偵測作業系統

echo "========================================="
echo "   萬用轉檔工具 - 跨平台啟動器"
echo "========================================="
echo ""

# 偵測作業系統
OS="Unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    OPEN_CMD="open"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    OPEN_CMD="xdg-open"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="Windows"
    OPEN_CMD="start"
else
    echo "⚠️  無法識別的作業系統: $OSTYPE"
    echo "請手動開啟 HTML 檔案"
    exit 1
fi

echo "✅ 偵測到作業系統: $OS"
echo ""

# 顯示選單
echo "請選擇要開啟的版本："
echo ""
echo "1) 🎯 簡單版 - 基本圖片轉換"
echo "2) 🚀 進階版 - 多功能工具"
echo "3) 📄 PDF 專業版 - 完整 PDF 處理"
echo "4) 📊 全部開啟（在不同分頁）"
echo ""

read -p "請選擇 (1-4): " choice

# 執行選擇
case $choice in
    1)
        echo "開啟簡單版..."
        $OPEN_CMD web-converter.html
        echo "✅ 已開啟簡單版"
        ;;
    2)
        echo "開啟進階版..."
        $OPEN_CMD web-converter-advanced.html
        echo "✅ 已開啟進階版"
        ;;
    3)
        echo "開啟 PDF 專業版..."
        $OPEN_CMD web-converter-pdf.html
        echo "✅ 已開啟 PDF 專業版"
        ;;
    4)
        echo "開啟所有版本..."
        $OPEN_CMD web-converter.html
        $OPEN_CMD web-converter-advanced.html
        $OPEN_CMD web-converter-pdf.html
        echo "✅ 已開啟所有版本"
        ;;
    *)
        echo "❌ 無效的選擇"
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "   功能對比"
echo "========================================="
echo ""
echo "簡單版："
echo "  • 圖片格式轉換"
echo "  • 調整大小和品質"
echo "  • 批次處理"
echo ""
echo "進階版："
echo "  • 簡單版所有功能"
echo "  • Base64 編碼/解碼"
echo "  • JSON 格式化"
echo "  • QR Code 產生器"
echo "  • 顏色選擇器"
echo ""
echo "PDF 專業版："
echo "  • 圖片轉 PDF"
echo "  • PDF 轉圖片"
echo "  • 合併/分割 PDF"
echo "  • 壓縮 PDF"
echo "  • 文字轉 PDF"
echo ""
echo "提示：所有版本都完全離線運作，不需要網路連線"
echo ""