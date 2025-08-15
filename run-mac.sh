#!/bin/bash

echo "========================================="
echo "   萬用轉檔工具 - Mac 版本"
echo "========================================="
echo ""

# 檢查 Node.js 是否安裝
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js"
    echo "請先安裝 Node.js: https://nodejs.org/"
    exit 1
fi

# 檢查 npm 是否安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm"
    echo "請先安裝 Node.js 和 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 檢查並安裝依賴
if [ ! -d "node_modules" ]; then
    echo "📦 安裝依賴套件..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 安裝失敗"
        exit 1
    fi
fi

# 檢查 FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg 未安裝"
    echo "建議使用 Homebrew 安裝: brew install ffmpeg"
    echo ""
fi

# 產生圖標（如果不存在）
if [ ! -f "public/icon.icns" ]; then
    echo "🎨 產生應用程式圖標..."
    node generate-icons.js
fi

echo ""
echo "選擇啟動方式："
echo "1) 網頁版（推薦）"
echo "2) Electron 桌面版"
echo "3) 伺服器版本"
echo ""
read -p "請選擇 (1-3): " choice

case $choice in
    1)
        echo "開啟網頁版..."
        open web-converter.html
        ;;
    2)
        echo "啟動 Electron 應用程式..."
        npm run electron
        ;;
    3)
        echo "啟動伺服器..."
        echo "伺服器將運行在 http://localhost:3000"
        npm start
        ;;
    *)
        echo "無效選擇"
        exit 1
        ;;
esac