const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 給渲染進程
contextBridge.exposeInMainWorld('electronAPI', {
    // 檔案操作
    onFilesSelected: (callback) => {
        ipcRenderer.on('files-selected', (event, files) => callback(files));
    },
    
    // 取得應用程式路徑
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    
    // 顯示儲存對話框
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    
    // 開啟資料夾
    openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
    
    // 平台資訊
    platform: process.platform,
    
    // 版本資訊
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
});

// 當 DOM 載入完成時
window.addEventListener('DOMContentLoaded', () => {
    // 可以在這裡添加一些初始化代碼
    console.log('Electron Preload Script Loaded');
    console.log('Platform:', process.platform);
    console.log('Electron Version:', process.versions.electron);
});