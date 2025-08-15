# Mac 版本使用說明

## 🍎 給 Mac 使用者

### 方法 1：從 GitHub 下載原始碼自己建立

1. **下載專案**
```bash
git clone https://github.com/kimy06171/universal-converter.git
cd universal-converter
```

2. **安裝 Node.js**（如果還沒安裝）
- 前往 https://nodejs.org 下載並安裝

3. **安裝依賴套件**
```bash
npm install
```

4. **執行應用程式**（開發模式）
```bash
npm run electron
```

5. **建立 Mac 應用程式**
```bash
npm run build-mac
```

完成後會在 `dist-packager-new` 資料夾中找到 `.app` 檔案

### 方法 2：請朋友幫忙建立

如果您有使用 Mac 的朋友，可以：
1. 請他們下載專案
2. 執行上述步驟
3. 將建立好的 `.app` 檔案傳給您

### 方法 3：使用 GitHub Actions（自動建立）

當我推送更新到 GitHub 時，會自動建立各平台版本。
您可以從 Releases 頁面下載。

## 📱 Mac 版本特色

- **原生應用程式**：不需要瀏覽器
- **深色模式支援**：自動適應系統主題
- **Retina 顯示器**：高解析度支援
- **拖放功能**：直接拖放檔案轉換

## ⚙️ 系統需求

- macOS 10.10 或更新版本
- 支援 Intel Mac (x64)
- 支援 Apple Silicon (M1/M2/M3)

## ⚠️ 安全提示

首次執行時，macOS 可能會顯示安全警告：

1. 如果看到「無法打開，因為它來自未識別的開發者」
2. 前往「系統偏好設定」→「安全性與隱私」
3. 點擊「仍要打開」

或者：
- 在應用程式上按右鍵
- 選擇「打開」
- 在彈出視窗中點擊「打開」

## 📦 檔案大小

- Mac 版本：約 200-250 MB
- 包含所有必要的依賴套件
- 不需要額外安裝軟體