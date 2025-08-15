const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');

let mainWindow;
const PORT = 3456;

// 建立簡單的 HTTP 伺服器
function createServer() {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        console.log('Request:', pathname);
        
        // API 路由
        if (pathname === '/api/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', message: '伺服器運行中' }));
            return;
        }
        
        if (pathname === '/api/formats') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
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
            }));
            return;
        }
        
        // 靜態檔案服務
        // 如果是根路徑，使用 index.html
        if (pathname === '/') {
            pathname = '/index.html';
        }
        
        // 移除開頭的斜線並建立檔案路徑
        const relativePath = pathname.slice(1);
        let filePath = path.join(__dirname, 'public', relativePath);
        
        // 檢查檔案是否存在
        console.log('Trying to serve:', filePath);
        
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found:', filePath);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>404 - 找不到頁面</h1><p>路徑：${pathname}</p><p>檔案：${filePath}</p>`);
                return;
            }
            
            // 判斷 Content-Type
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html; charset=utf-8',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            };
            
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            // 讀取並發送檔案
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end('伺服器錯誤');
                    return;
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            });
        });
    });
    
    server.listen(PORT, () => {
        console.log(`伺服器運行於 http://localhost:${PORT}`);
    });
    
    return server;
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
        backgroundColor: '#ffffff',
        show: false
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
    
    // 當視窗準備好時顯示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    
    // 處理視窗關閉
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 應用程式事件處理
app.whenReady().then(() => {
    // 啟動伺服器
    createServer();
    
    // 等待一下確保伺服器啟動
    setTimeout(() => {
        createWindow();
    }, 1000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// 處理未捕獲的錯誤
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});