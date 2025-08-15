const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;
let server;
const PORT = 3456;

// 建立 Express 伺服器
function createServer() {
    const expressApp = express();
    
    // 靜態檔案服務
    expressApp.use(express.static(path.join(__dirname, 'public')));
    
    // API 路由
    expressApp.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: '伺服器運行中' });
    });
    
    expressApp.get('/api/formats', (req, res) => {
        res.json({
            image: {
                input: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'],
                output: ['jpg', 'png', 'webp', 'gif', 'bmp']
            },
            video: {
                input: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'],
                output: ['mp4', 'avi', 'mov', 'mkv', 'webm']
            },
            audio: {
                input: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
                output: ['mp3', 'wav', 'flac', 'aac', 'ogg']
            },
            document: {
                input: ['pdf', 'docx', 'txt', 'rtf', 'xlsx', 'csv'],
                output: ['pdf', 'txt', 'html']
            }
        });
    });
    
    // 檔案上傳和轉換
    const multer = require('multer');
    const upload = multer({ dest: 'uploads/' });
    
    expressApp.post('/api/convert', upload.single('file'), async (req, res) => {
        try {
            // 簡單回應，實際轉換邏輯可以後續加入
            res.json({
                success: true,
                message: '檔案已接收',
                filename: req.file.originalname
            });
        } catch (error) {
            res.status(500).json({ error: '轉換失敗' });
        }
    });
    
    server = expressApp.listen(PORT, () => {
        console.log(`伺服器運行於 http://localhost:${PORT}`);
    });
}

// 建立主視窗
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: '萬用轉檔工具',
        backgroundColor: '#ffffff'
    });
    
    // 設定選單
    const template = [
        {
            label: '檔案',
            submenu: [
                {
                    label: '重新載入',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                { type: 'separator' },
                {
                    label: '結束',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '檢視',
            submenu: [
                {
                    label: '開發者工具',
                    accelerator: 'F12',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        },
        {
            label: '說明',
            submenu: [
                {
                    label: '關於',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '關於',
                            message: '萬用轉檔工具',
                            detail: '版本：1.0.0\n\n一個強大的本地檔案轉換工具。',
                            buttons: ['確定']
                        });
                    }
                }
            ]
        }
    ];
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    
    // 載入應用程式
    mainWindow.loadURL(`http://localhost:${PORT}`);
    
    // 處理視窗關閉
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 應用程式事件處理
app.whenReady().then(() => {
    // 啟動伺服器
    createServer();
    
    // 等待伺服器啟動後建立視窗
    setTimeout(() => {
        createWindow();
    }, 1000);
});

app.on('window-all-closed', () => {
    if (server) {
        server.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});