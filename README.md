# 萬用轉檔工具 Universal Converter

一個強大的跨平台檔案轉換工具，支援圖片、影音、文檔等多種格式轉換。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Web-lightgrey.svg)

## ✨ 特色功能

- 🖼️ **圖片轉換** - 支援 JPG, PNG, GIF, BMP, WebP 等格式互轉
- 📄 **PDF 專業處理** - 完整的 PDF 轉換、合併、分割、壓縮功能
- 🎬 **影片處理** - MP4, AVI, MOV, MKV 等格式轉換
- 🎵 **音訊轉換** - MP3, WAV, FLAC, AAC 等格式支援
- 🌐 **三種網頁版本** - 簡單版、進階版、PDF 專業版
- 💻 **跨平台** - 支援 Windows、macOS、Linux
- 🔒 **隱私安全** - 所有處理都在本地完成，不上傳檔案
- 🆓 **完全免費** - 無限制、無浮水印、無需訂閱

## 🚀 快速開始

### 網頁版（推薦）

最簡單的使用方式，無需安裝任何軟體。提供三種版本：

#### 版本選擇
- **簡單版** (`web-converter.html`) - 基本圖片轉換
- **進階版** (`web-converter-advanced.html`) - 多功能工具箱
- **PDF 專業版** (`web-converter-pdf.html`) - 完整 PDF 處理

#### 使用方式
1. 下載專案
2. 選擇適合的版本開啟
3. 直接在瀏覽器中使用

### 桌面版

#### Windows
```bash
# 開啟網頁版選擇器
開啟網頁版.bat

# 快速啟動桌面版
RUN-GUI.bat

# 建立可攜式版本
QUICK-PORTABLE-BUILD.bat
```

#### macOS / Linux
```bash
# 給予執行權限
chmod +x run-mac.sh
chmod +x open-converter.sh

# 啟動（Mac 專用）
./run-mac.sh

# 跨平台啟動器
./open-converter.sh
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

### PDF（網頁版專業功能）
- **圖片轉 PDF**: 多張圖片合併為單一 PDF
- **PDF 轉圖片**: 每頁轉換為獨立圖片
- **合併 PDF**: 多個 PDF 合併為一個
- **分割 PDF**: 按頁數或範圍分割
- **壓縮 PDF**: 減少檔案大小
- **文字轉 PDF**: 純文字轉換為 PDF

### 影片（桌面版）
- **輸入**: MP4, AVI, MOV, MKV, WebM, FLV
- **輸出**: MP4, AVI, MOV, MKV, WebM

### 音訊（桌面版）
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

## 🎯 網頁版本比較

| 功能 | 簡單版 | 進階版 | PDF 專業版 |
|------|--------|--------|------------|
| 圖片轉換 | ✅ | ✅ | ❌ |
| 圖片調整大小 | ✅ | ✅ | ❌ |
| 批次處理 | ✅ | ✅ | ✅ |
| PDF 處理 | ❌ | 基本 | ✅ 完整 |
| 文字工具 | ❌ | ✅ | ❌ |
| Base64 編碼 | ❌ | ✅ | ❌ |
| QR Code | ❌ | ✅ | ❌ |
| 檔案大小 | 最小 | 中等 | 較大 |

## 🆚 與其他服務比較

| 特點 | 本工具 | SmallPDF | ILovePDF | Adobe Online |
|------|--------|----------|----------|--------------|
| 價格 | 免費 | 付費 | 付費 | 訂閱制 |
| 檔案限制 | 無 | 有 | 有 | 有 |
| 浮水印 | 無 | 付費版無 | 付費版無 | 無 |
| 隱私 | 本地處理 | 雲端 | 雲端 | 雲端 |
| 網路需求 | 不需要 | 需要 | 需要 | 需要 |

## 📄 授權

MIT License

## 🙏 致謝

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF 讀取和顯示
- [jsPDF](https://github.com/parallax/jsPDF) - PDF 產生
- [FFmpeg](https://ffmpeg.org/) - 影音處理
- [Sharp](https://sharp.pixelplumbing.com/) - 圖片處理
- [Electron](https://www.electronjs.org/) - 桌面應用程式框架
