# 萬用轉檔工具 - GUI 版本建置指南

## 📦 快速開始

### 1. 準備環境
```bash
# 執行準備腳本，自動檢查並安裝所需元件
prepare-build.bat
```

### 2. 測試桌面應用程式
```bash
# 測試 Electron GUI 版本
test-electron.bat

# 或使用 npm 命令
npm run electron
```

### 3. 建立可攜帶版本
```bash
# 建立單一可執行檔（無需安裝）
build-portable.bat

# 或使用 npm 命令
npm run build-portable
```

### 4. 建立完整發布版本
```bash
# 建立安裝程式 + 可攜帶版
build-all.bat

# 或使用 npm 命令
npm run dist
```

## 🎯 版本說明

### 可攜帶版本（Portable）
- **檔案名稱**: `萬用轉檔工具-portable.exe`
- **檔案大小**: 約 150-200 MB
- **特點**:
  - 單一執行檔，無需安裝
  - 包含所有必要元件（含 FFmpeg）
  - 可放在隨身碟中使用
  - 適合臨時使用或分享給他人

### 安裝程式版本（Setup）
- **檔案名稱**: `萬用轉檔工具 Setup x.x.x.exe`
- **檔案大小**: 約 100-150 MB
- **特點**:
  - 標準 Windows 安裝程式
  - 建立開始選單和桌面捷徑
  - 可選擇安裝位置
  - 適合長期使用

## 📂 檔案結構

```
universal-converter/
├── dist/                    # 輸出目錄（打包後的檔案）
│   ├── 萬用轉檔工具-portable.exe
│   └── 萬用轉檔工具 Setup 1.0.0.exe
├── electron-main.js         # Electron 主程序
├── electron-preload.js      # 預載腳本
├── server.js               # 後端伺服器
├── public/                 # 前端資源
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── icon.png/ico
├── src/                    # 轉換器核心
│   └── converters/
└── package.json           # 專案配置
```

## 🚀 部署到其他電腦

### 方法一：使用可攜帶版本（推薦）
1. 執行 `build-portable.bat` 建立可攜帶版本
2. 在 `dist` 資料夾找到 `萬用轉檔工具-portable.exe`
3. 將此檔案複製到目標電腦
4. 直接執行即可使用

**優點**:
- 最簡單的部署方式
- 不需要任何依賴項
- 包含 FFmpeg，支援完整功能

### 方法二：使用安裝程式
1. 執行 `build-all.bat` 建立安裝程式
2. 將 `萬用轉檔工具 Setup x.x.x.exe` 複製到目標電腦
3. 執行安裝程式
4. 從開始選單或桌面捷徑啟動

### 方法三：複製整個專案（開發用）
1. 複製整個 `universal-converter` 資料夾
2. 在目標電腦安裝 Node.js
3. 執行以下命令：
```bash
npm install
npm run electron
```

## ⚙️ 自訂配置

### 修改應用程式資訊
編輯 `package.json`:
```json
{
  "name": "your-app-name",
  "version": "2.0.0",
  "description": "您的描述"
}
```

### 修改打包配置
編輯 `electron-builder.yml`:
```yaml
productName: 您的產品名稱
appId: com.yourcompany.yourapp
```

### 自訂圖標
1. 準備 256x256 的 PNG 圖片
2. 放置到 `public/icon.png`
3. 執行 `node generate-icons.js` 生成各種尺寸

## 🛠️ 故障排除

### 問題：打包失敗
**解決方案**:
```bash
# 清理並重新安裝
rm -rf node_modules
npm install
npm install electron@28.0.0 --save-dev
npm install electron-builder@24.9.1 --save-dev
```

### 問題：FFmpeg 未包含在打包檔案中
**解決方案**:
1. 確認 FFmpeg 安裝在 `C:\ffmpeg`
2. 檢查 `package.json` 的 `extraResources` 設定
3. 手動複製 FFmpeg 到 `dist/win-unpacked/resources/ffmpeg`

### 問題：應用程式無法在其他電腦執行
**可能原因**:
- 缺少 Visual C++ Redistributable
- Windows 版本太舊（需要 Windows 10 或以上）
- 防毒軟體阻擋

**解決方案**:
- 安裝 [Visual C++ Redistributable](https://support.microsoft.com/en-us/help/2977003/)
- 將程式加入防毒軟體白名單

## 📋 命令參考

| 命令 | 說明 |
|------|------|
| `npm run electron` | 開發模式執行 |
| `npm run electron-dev` | 開發模式（含除錯工具） |
| `npm run build-win` | 建立 Windows 安裝程式 |
| `npm run build-portable` | 建立可攜帶版本 |
| `npm run pack` | 打包但不建立安裝程式 |
| `npm run dist` | 建立所有發布版本 |

## 📝 注意事項

1. **檔案大小**: 打包後的檔案較大（150-200MB），因為包含了：
   - Chromium 瀏覽器引擎
   - Node.js 執行環境
   - FFmpeg 影音處理工具
   - 所有 npm 依賴項

2. **防毒軟體**: 某些防毒軟體可能會誤報，需要：
   - 添加到白名單
   - 或使用數位簽章（需要購買憑證）

3. **系統需求**:
   - Windows 10 或以上
   - 64 位元系統
   - 至少 4GB RAM
   - 500MB 可用硬碟空間

## 🔐 進階：數位簽章（選用）

如果要發布給更多用戶，建議添加數位簽章：

1. 購買代碼簽章憑證
2. 在 `package.json` 添加簽章配置：
```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password"
  }
}
```

## 📚 相關資源

- [Electron 官方文檔](https://www.electronjs.org/docs)
- [Electron Builder 文檔](https://www.electron.build/)
- [FFmpeg 官網](https://ffmpeg.org/)

## 💡 提示

- 建議使用可攜帶版本進行分發，最為簡單方便
- 首次打包可能需要下載 Electron 二進制檔案，請耐心等待
- 打包完成後，建議在虛擬機或其他電腦測試
- 可以使用 [NSIS](https://nsis.sourceforge.io/) 自訂安裝程式界面

---

如有問題，請查看錯誤訊息或聯絡開發者。