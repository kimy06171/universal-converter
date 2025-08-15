# 萬用轉檔工具 Universal Converter

一個強大的跨平台檔案轉換工具，支援圖片、影音、文檔等多種格式轉換。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Web-lightgrey.svg)

## ✨ 特色功能

- 🖼️ **圖片轉換** - 支援 JPG, PNG, GIF, BMP, WebP 等格式互轉
- 🎬 **影片處理** - MP4, AVI, MOV, MKV 等格式轉換
- 🎵 **音訊轉換** - MP3, WAV, FLAC, AAC 等格式支援
- 📄 **文檔處理** - PDF, DOCX, TXT, CSV 格式轉換
- 🌐 **網頁版** - 無需安裝，直接在瀏覽器使用
- 💻 **跨平台** - 支援 Windows、macOS、Linux
- 🔒 **隱私安全** - 所有處理都在本地完成，不上傳檔案

## 🚀 快速開始

### 網頁版（推薦）

最簡單的使用方式，無需安裝任何軟體：

1. 下載專案
2. 開啟 `web-converter.html`（簡單版）或 `web-converter-advanced.html`（進階版）
3. 直接在瀏覽器中使用

### 桌面版

#### Windows
```bash
# 快速啟動
RUN-GUI.bat

# 建立可攜式版本
QUICK-PORTABLE-BUILD.bat
```

#### macOS
```bash
# 安裝依賴
npm install

# 啟動應用程式
npm run electron

# 建立 Mac 應用程式
npm run build-mac
```

## 📦 安裝

### 系統需求

- **作業系統**: Windows 10+, macOS 10.14+, 或現代瀏覽器
- **Node.js**: 14.0 或更高版本（僅桌面版需要）
- **記憶體**: 至少 4GB RAM

### 安裝步驟

1. 克隆專案
```bash
git clone https://github.com/kimy06171/universal-converter.git
cd universal-converter
```

2. 安裝依賴（桌面版）
```bash
npm install
```

3. 啟動應用程式
```bash
npm start  # 啟動伺服器版本
npm run electron  # 啟動桌面版本
```

## 🌍 支援格式

### 圖片
- **輸入**: JPG, PNG, GIF, BMP, WebP, TIFF, SVG
- **輸出**: JPG, PNG, WebP, GIF, BMP

### 影片
- **輸入**: MP4, AVI, MOV, MKV, WebM, FLV
- **輸出**: MP4, AVI, MOV, MKV, WebM

### 音訊
- **輸入**: MP3, WAV, FLAC, AAC, OGG, M4A
- **輸出**: MP3, WAV, FLAC, AAC, OGG

### 文檔
- **輸入**: PDF, DOCX, TXT, XLSX, CSV
- **輸出**: PDF, TXT, HTML

## 📱 跨平台支援

| 平台 | 網頁版 | 桌面版 | 狀態 |
|------|--------|--------|------|
| Windows | ✅ | ✅ | 完全支援 |
| macOS | ✅ | ✅ | 完全支援 |
| Linux | ✅ | ⚠️ | 測試中 |
| iOS/Android | ✅ | ❌ | 僅網頁版 |

## 📄 授權

MIT License
