# 建立 Mac 版本指南

由於 Windows 系統限制，無法直接在 Windows 上建立完整的 Mac 應用程式。
以下是幾種解決方案：

## 方案 1：在 Mac 上建立（推薦）

### 步驟：
1. 將整個專案資料夾複製到 Mac
2. 安裝 Node.js（如果還沒安裝）
3. 開啟終端機，進入專案資料夾
4. 執行以下命令：

```bash
# 安裝依賴
npm install

# 建立 Mac 版本
npm run build-mac

# 或使用打包腳本
node build-with-packager.js darwin
```

## 方案 2：使用 GitHub Actions 自動建立

我已經準備好 GitHub Actions 設定檔，可以自動建立各平台版本：

### 設定步驟：
1. 推送程式碼到 GitHub
2. 啟用 GitHub Actions
3. 每次推送會自動建立所有平台版本
4. 從 Releases 下載

## 方案 3：使用跨平台建置服務

使用如 Electron Forge 或 electron-builder 的雲端建置服務。

## 臨時解決方案：共用程式碼

Mac 使用者可以：

1. **下載原始碼**
   ```bash
   git clone https://github.com/kimy06171/universal-converter.git
   cd universal-converter
   ```

2. **安裝並執行**
   ```bash
   npm install
   npm run electron
   ```

3. **建立 Mac 應用程式**
   ```bash
   npm run build-mac
   ```

## Mac 版本特性

建立後的 Mac 版本會有：
- `.app` 應用程式套件
- 支援 macOS 深色模式
- Retina 顯示器支援
- 原生 macOS 體驗

## 系統需求

- macOS 10.10 或更新版本
- 支援 Intel 和 Apple Silicon (M1/M2) 處理器