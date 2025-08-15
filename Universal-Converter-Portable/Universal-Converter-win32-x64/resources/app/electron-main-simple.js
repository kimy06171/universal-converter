const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// 引入轉換器
const imageConverter = require('./src/converters/imageConverter');
const videoConverter = require('./src/converters/videoConverter');
const audioConverter = require('./src/converters/audioConverter');
const documentConverter = require('./src/converters/documentConverter');

let mainWindow;
const PORT = 3456;

// 設定 FFmpeg 路徑
function setupFFmpegPath() {
    if (app.isPackaged) {
        const ffmpegPath = path.join(process.resourcesPath, 'ffmpeg', 'bin');
        process.env.PATH = `${ffmpegPath};${process.env.PATH}`;
        process.env.FFMPEG_PATH = path.join(ffmpegPath, 'ffmpeg.exe');
        process.env.FFPROBE_PATH = path.join(ffmpegPath, 'ffprobe.exe');
    } else {
        process.env.FFMPEG_PATH = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
        process.env.FFPROBE_PATH = 'C:\\ffmpeg\\bin\\ffprobe.exe';
    }
}

// 建立 Express 伺服器
function createServer() {
    const server = express();
    
    // 確保目錄存在
    const ensureDirectories = async () => {
        const dirs = ['uploads', 'output'];
        for (const dir of dirs) {
            try {
                await fs.access(dir);
            } catch {
                await fs.mkdir(dir, { recursive: true });
            }
        }
    };
    
    // 設定 CORS
    server.use(cors({
        origin: '*',
        credentials: true
    }));
    
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    
    // 設定檔案上傳
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            await ensureDirectories();
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueId = uuidv4();
            const ext = path.extname(file.originalname);
            cb(null, `${uniqueId}${ext}`);
        }
    });
    
    const upload = multer({ 
        storage,
        limits: {
            fileSize: 500 * 1024 * 1024 // 500MB
        }
    });
    
    // 檔案類型判斷
    function getFileType(extension) {
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
        const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
        const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
        const documentExts = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'xlsx', 'xls', 'csv'];
        
        if (imageExts.includes(extension)) return 'image';
        if (videoExts.includes(extension)) return 'video';
        if (audioExts.includes(extension)) return 'audio';
        if (documentExts.includes(extension)) return 'document';
        return 'unknown';
    }
    
    // API 路由 - 放在靜態檔案之前
    server.get('/api/health', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'ok', message: '伺服器運行中' });
    });
    
    server.get('/api/formats', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
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
    
    server.post('/api/convert', upload.array('files', 10), async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: '請選擇檔案' });
            }
            
            const { outputFormat } = req.body;
            if (!outputFormat) {
                return res.status(400).json({ error: '請指定輸出格式' });
            }
            
            const results = [];
            const errors = [];
            
            for (const file of req.files) {
                try {
                    const inputPath = file.path;
                    const fileExt = path.extname(file.originalname).toLowerCase().slice(1);
                    const outputId = uuidv4();
                    const outputPath = path.join('output', `${outputId}.${outputFormat}`);
                    
                    const fileType = getFileType(fileExt);
                    
                    switch (fileType) {
                        case 'image':
                            await imageConverter.convert(inputPath, outputPath, outputFormat);
                            break;
                        case 'video':
                            await videoConverter.convert(inputPath, outputPath, outputFormat);
                            break;
                        case 'audio':
                            await audioConverter.convert(inputPath, outputPath, outputFormat);
                            break;
                        case 'document':
                            await documentConverter.convert(inputPath, outputPath, outputFormat, fileExt);
                            break;
                        default:
                            throw new Error(`不支援的檔案類型: ${fileExt}`);
                    }
                    
                    results.push({
                        originalName: file.originalname,
                        outputPath: outputPath,
                        outputId: outputId,
                        downloadUrl: `/api/download/${outputId}.${outputFormat}`
                    });
                    
                    // 清理上傳的檔案
                    await fs.unlink(inputPath).catch(console.error);
                    
                } catch (error) {
                    console.error(`轉換錯誤 (${file.originalname}):`, error);
                    errors.push({
                        file: file.originalname,
                        error: error.message
                    });
                }
            }
            
            res.json({
                success: results.length > 0,
                results,
                errors
            });
            
        } catch (error) {
            console.error('轉換處理錯誤:', error);
            res.status(500).json({ error: '轉換失敗', message: error.message });
        }
    });
    
    server.get('/api/download/:filename', async (req, res) => {
        try {
            const filePath = path.join('output', req.params.filename);
            await fs.access(filePath);
            res.download(filePath);
        } catch (error) {
            res.status(404).json({ error: '檔案不存在' });
        }
    });
    
    // 靜態檔案服務 - 放在所有 API 路由之後
    server.use(express.static('public'));
    
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
app.whenReady().then(async () => {
    setupFFmpegPath();
    
    try {
        // 建立並啟動伺服器
        const server = createServer();
        
        // 確保目錄存在
        const dirs = ['uploads', 'output'];
        for (const dir of dirs) {
            try {
                await fs.access(dir);
            } catch {
                await fs.mkdir(dir, { recursive: true });
            }
        }
        
        // 啟動伺服器
        server.listen(PORT, () => {
            console.log(`伺服器運行於 http://localhost:${PORT}`);
            
            // 建立視窗
            createWindow();
        });
        
    } catch (error) {
        console.error('Failed to start application:', error);
        dialog.showErrorBox('啟動錯誤', '無法啟動應用程式');
        app.quit();
    }
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
    dialog.showErrorBox('錯誤', error.message);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});