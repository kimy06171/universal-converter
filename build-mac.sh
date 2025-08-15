#!/bin/bash

echo "========================================="
echo "   建立 Mac 應用程式"
echo "========================================="
echo ""

# 檢查環境
if [ "$(uname)" != "Darwin" ]; then
    echo "⚠️  此腳本需要在 macOS 上執行"
    echo "如果您使用 Windows，請使用："
    echo "npm run build-mac"
    exit 1
fi

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 請先安裝 Node.js"
    exit 1
fi

# 安裝依賴
if [ ! -d "node_modules" ]; then
    echo "📦 安裝依賴..."
    npm install
fi

# 安裝 electron-packager（如果尚未安裝）
if [ ! -d "node_modules/electron-packager" ]; then
    echo "📦 安裝 electron-packager..."
    npm install electron-packager --save-dev
fi

# 產生 Mac 圖標
if [ ! -f "public/icon.icns" ]; then
    echo "🎨 產生 Mac 圖標..."
    
    # 如果有 icon.png，使用它來產生 icns
    if [ -f "public/icon.png" ]; then
        # 建立 iconset 資料夾
        mkdir -p public/icon.iconset
        
        # 產生不同大小的圖標
        sips -z 16 16     public/icon.png --out public/icon.iconset/icon_16x16.png
        sips -z 32 32     public/icon.png --out public/icon.iconset/icon_16x16@2x.png
        sips -z 32 32     public/icon.png --out public/icon.iconset/icon_32x32.png
        sips -z 64 64     public/icon.png --out public/icon.iconset/icon_32x32@2x.png
        sips -z 128 128   public/icon.png --out public/icon.iconset/icon_128x128.png
        sips -z 256 256   public/icon.png --out public/icon.iconset/icon_128x128@2x.png
        sips -z 256 256   public/icon.png --out public/icon.iconset/icon_256x256.png
        sips -z 512 512   public/icon.png --out public/icon.iconset/icon_256x256@2x.png
        sips -z 512 512   public/icon.png --out public/icon.iconset/icon_512x512.png
        sips -z 1024 1024 public/icon.png --out public/icon.iconset/icon_512x512@2x.png
        
        # 產生 icns 檔案
        iconutil -c icns public/icon.iconset -o public/icon.icns
        
        echo "✅ 圖標產生完成"
    else
        echo "⚠️  找不到 icon.png，將使用預設圖標"
    fi
fi

# 開始打包
echo ""
echo "🔨 開始打包應用程式..."
echo "這可能需要幾分鐘時間..."
echo ""

# 執行打包
node build-with-packager.js darwin

# 檢查是否成功
if [ -d "dist-final/Universal-Converter-darwin-x64" ]; then
    echo ""
    echo "✅ 打包成功！"
    echo ""
    echo "📁 應用程式位置："
    echo "dist-final/Universal-Converter-darwin-x64/Universal-Converter.app"
    echo ""
    echo "使用方式："
    echo "1. 將 Universal-Converter.app 拖到 Applications 資料夾"
    echo "2. 雙擊執行"
    echo ""
    echo "注意："
    echo "- 第一次執行可能需要在「系統偏好設定」>「安全性與隱私」中允許"
    echo "- 如果出現「無法打開」，請右鍵點擊並選擇「打開」"
    echo ""
    
    # 詢問是否要建立 DMG
    read -p "是否要建立 DMG 安裝檔？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "建立 DMG..."
        
        # 建立 DMG（需要額外工具）
        if command -v create-dmg &> /dev/null; then
            create-dmg \
                --volname "Universal Converter" \
                --window-size 600 400 \
                --icon-size 100 \
                --icon "Universal-Converter.app" 200 150 \
                --app-drop-link 400 150 \
                "Universal-Converter.dmg" \
                "dist-final/Universal-Converter-darwin-x64/"
            
            echo "✅ DMG 建立成功：Universal-Converter.dmg"
        else
            echo "需要安裝 create-dmg："
            echo "npm install -g create-dmg"
            echo "或"
            echo "brew install create-dmg"
        fi
    fi
else
    echo "❌ 打包失敗"
    echo "請檢查錯誤訊息"
    exit 1
fi