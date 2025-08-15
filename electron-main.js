const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;
const PORT = 3456; // 使用不同的端口避免衝突
const isDev = process.argv.includes('--dev');

// 設定 FFmpeg 路徑
function setupFFmpegPath() {
    // 如果是打包後的應用程式
    if (app.isPackaged) {
        const ffmpegPath = path.join(process.resourcesPath, 'ffmpeg', 'bin');
        process.env.PATH = `${ffmpegPath};${process.env.PATH}`;
        process.env.FFMPEG_PATH = path.join(ffmpegPath, 'ffmpeg.exe');
        process.env.FFPROBE_PATH = path.join(ffmpegPath, 'ffprobe.exe');
    } else {
        // 開發環境使用系統的 FFmpeg
        process.env.FFMPEG_PATH = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
        process.env.FFPROBE_PATH = 'C:\\ffmpeg\\bin\\ffprobe.exe';
    }
}

// 啟動後端伺服器
function startServer() {
    return new Promise((resolve, reject) => {
        const serverPath = path.join(__dirname, 'server.js');
        
        // 檢查檔案是否存在
        if (!fs.existsSync(serverPath)) {
            console.error('Server file not found:', serverPath);
            reject(new Error('找不到伺服器檔案'));
            return;
        }
        
        // 設定環境變數
        const env = {
            ...process.env,
            PORT: PORT,
            ELECTRON_MODE: 'true',
            NODE_ENV: isDev ? 'development' : 'production'
        };

        // 決定 Node 執行檔路徑
        let nodeExecutable = 'node';
        
        // 如果是打包後的應用程式，使用內建的 Node
        if (app.isPackaged) {
            // Electron 打包後自帶 Node.js 環境，直接使用 process.execPath
            const { fork } = require('child_process');
            
            console.log('Starting server in packaged mode...');
            serverProcess = fork(serverPath, [], {
                env: env,
                silent: false,
                cwd: __dirname
            });
            
            serverProcess.on('message', (msg) => {
                console.log('Server message:', msg);
                if (msg === 'server-ready') {
                    resolve();
                }
            });
            
            serverProcess.on('error', (error) => {
                console.error('Server error:', error);
                reject(error);
            });
            
            // 超時後也繼續
            setTimeout(() => {
                console.log('Server timeout reached, continuing anyway...');
                resolve();
            }, 5000);
            
            return;
        }

        // 開發模式使用 spawn
        console.log('Starting server in development mode...');
        serverProcess = spawn(nodeExecutable, [serverPath], {
            env: env,
            cwd: __dirname,
            shell: true,
            stdio: ['inherit', 'pipe', 'pipe']
        });

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
            const output = data.toString();
            if (output.includes('伺服器運行於') || output.includes('Server running')) {
                resolve();
            }
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        serverProcess.on('error', (error) => {
            console.error('Failed to start server:', error);
            reject(error);
        });

        // 設定超時
        setTimeout(() => {
            console.log('Server timeout reached, continuing anyway...');
            resolve();
        }, 5000);
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
            contextIsolation: true,
            preload: path.join(__dirname, 'electron-preload.js')
        },
        icon: path.join(__dirname, 'public', 'icon.png'),
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
                    label: '開啟檔案',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile', 'multiSelections'],
                            filters: [
                                { name: '所有檔案', extensions: ['*'] },
                                { name: '圖片', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
                                { name: '影片', extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm'] },
                                { name: '音訊', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'] },
                                { name: '文檔', extensions: ['pdf', 'docx', 'txt', 'xlsx', 'csv'] }
                            ]
                        }).then(result => {
                            if (!result.canceled) {
                                mainWindow.webContents.send('files-selected', result.filePaths);
                            }
                        });
                    }
                },
                { type: 'separator' },
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
            label: '編輯',
            submenu: [
                { label: '復原', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
                { type: 'separator' },
                { label: '剪下', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: '複製', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: '貼上', accelerator: 'CmdOrCtrl+V', role: 'paste' }
            ]
        },
        {
            label: '檢視',
            submenu: [
                {
                    label: '全螢幕',
                    accelerator: 'F11',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                },
                {
                    label: '開發者工具',
                    accelerator: 'F12',
                    visible: isDev,
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
                    label: '使用說明',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '使用說明',
                            message: '萬用轉檔工具',
                            detail: '支援多種格式的檔案轉換：\n\n' +
                                    '• 圖片：JPG, PNG, GIF, WebP, BMP\n' +
                                    '• 影片：MP4, AVI, MOV, MKV, WebM\n' +
                                    '• 音訊：MP3, WAV, FLAC, AAC, OGG\n' +
                                    '• 文檔：PDF, DOCX, TXT, XLSX, CSV\n\n' +
                                    '拖放檔案或使用選單開啟檔案，選擇輸出格式後開始轉換。',
                            buttons: ['確定']
                        });
                    }
                },
                { type: 'separator' },
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
        
        // 開發模式自動開啟開發者工具
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // 處理視窗關閉
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 處理外部連結
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// IPC 通訊處理
ipcMain.handle('get-app-path', () => {
    return app.getPath('userData');
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('open-folder', async (event, folderPath) => {
    shell.openPath(folderPath);
});

// 應用程式事件處理
app.whenReady().then(async () => {
    setupFFmpegPath();
    
    try {
        console.log('Starting server...');
        await startServer();
        console.log('Server started successfully');
        
        // 等待一下確保伺服器完全啟動
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        createWindow();
    } catch (error) {
        console.error('Failed to start application:', error);
        dialog.showErrorBox('啟動錯誤', '無法啟動應用程式伺服器');
        app.quit();
    }
});

app.on('window-all-closed', () => {
    // 關閉伺服器
    if (serverProcess) {
        serverProcess.kill();
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

// 應用程式關閉前清理
app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});

// 處理未捕獲的錯誤
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    dialog.showErrorBox('錯誤', error.message);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});