const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const isElectron = process.env.ELECTRON_MODE === 'true';

// 設定 FFmpeg 路徑（如果在 Electron 環境中）
if (isElectron && process.env.FFMPEG_PATH) {
    process.env.PATH = `${path.dirname(process.env.FFMPEG_PATH)};${process.env.PATH}`;
}

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
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    },
    fileFilter: (req, file, cb) => {
        // 接受所有檔案類型
        cb(null, true);
    }
});

// 匯入轉換器
const imageConverter = require('./src/converters/imageConverter');
const videoConverter = require('./src/converters/videoConverter');
const audioConverter = require('./src/converters/audioConverter');
const documentConverter = require('./src/converters/documentConverter');

// 根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 獲取支援的格式
app.get('/api/formats', (req, res) => {
    res.json({
        image: {
            input: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'],
            output: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff']
        },
        video: {
            input: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v'],
            output: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif']
        },
        audio: {
            input: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
            output: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
        },
        document: {
            input: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'xlsx', 'csv'],
            output: ['pdf', 'docx', 'txt', 'html', 'rtf']
        }
    });
});

// 檔案上傳和轉換
app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '請上傳檔案' });
        }

        const { outputFormat } = req.body;
        if (!outputFormat) {
            return res.status(400).json({ error: '請指定輸出格式' });
        }

        const inputPath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase().slice(1);
        const outputId = uuidv4();
        const outputPath = path.join('output', `${outputId}.${outputFormat}`);

        let result;
        
        // 根據檔案類型選擇轉換器
        const fileType = getFileType(fileExt);
        
        switch (fileType) {
            case 'image':
                result = await imageConverter.convert(inputPath, outputPath, outputFormat);
                break;
            case 'video':
                result = await videoConverter.convert(inputPath, outputPath, outputFormat);
                break;
            case 'audio':
                result = await audioConverter.convert(inputPath, outputPath, outputFormat);
                break;
            case 'document':
                result = await documentConverter.convert(inputPath, outputPath, outputFormat, fileExt);
                break;
            default:
                throw new Error(`不支援的檔案類型: ${fileExt}`);
        }

        // 清理上傳的檔案
        await fs.unlink(inputPath).catch(console.error);

        res.json({
            success: true,
            message: '轉換成功',
            downloadUrl: `/api/download/${outputId}.${outputFormat}`,
            filename: `converted_${Date.now()}.${outputFormat}`
        });

    } catch (error) {
        console.error('轉換錯誤:', error);
        
        // 清理檔案
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        
        res.status(500).json({
            error: '轉換失敗',
            message: error.message
        });
    }
});

// 下載轉換後的檔案
app.get('/api/download/:filename', async (req, res) => {
    try {
        const filePath = path.join('output', req.params.filename);
        
        // 檢查檔案是否存在
        await fs.access(filePath);
        
        res.download(filePath, (err) => {
            if (err) {
                console.error('下載錯誤:', err);
                res.status(500).json({ error: '下載失敗' });
            }
            
            // 下載完成後刪除檔案
            fs.unlink(filePath).catch(console.error);
        });
    } catch (error) {
        res.status(404).json({ error: '檔案不存在' });
    }
});

// 批次轉換
app.post('/api/batch-convert', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '請上傳檔案' });
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
                    downloadUrl: `/api/download/${outputId}.${outputFormat}`,
                    filename: `${path.basename(file.originalname, path.extname(file.originalname))}.${outputFormat}`
                });

                // 清理上傳的檔案
                await fs.unlink(inputPath).catch(console.error);
                
            } catch (error) {
                errors.push({
                    file: file.originalname,
                    error: error.message
                });
                
                // 清理失敗的檔案
                await fs.unlink(file.path).catch(console.error);
            }
        }

        res.json({
            success: true,
            results,
            errors
        });

    } catch (error) {
        console.error('批次轉換錯誤:', error);
        
        // 清理所有檔案
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(console.error);
            }
        }
        
        res.status(500).json({
            error: '批次轉換失敗',
            message: error.message
        });
    }
});

// 判斷檔案類型
function getFileType(ext) {
    const types = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg'],
        video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v'],
        audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
        document: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'xlsx', 'xls', 'csv']
    };

    for (const [type, extensions] of Object.entries(types)) {
        if (extensions.includes(ext)) {
            return type;
        }
    }
    
    return null;
}

// 錯誤處理中間件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '檔案大小超過限制 (最大 100MB)' });
        }
    }
    res.status(500).json({ error: '伺服器錯誤', message: error.message });
});

// 啟動伺服器
const startServer = async () => {
    await ensureDirectories();
    
    app.listen(PORT, () => {
        console.log(`萬用轉檔工具伺服器運行於 http://localhost:${PORT}`);
        console.log('支援格式:');
        console.log('- 圖片: JPG, PNG, GIF, WebP, BMP, TIFF, SVG');
        console.log('- 影片: MP4, AVI, MOV, MKV, WebM, FLV');
        console.log('- 音訊: MP3, WAV, FLAC, AAC, OGG, M4A');
        console.log('- 文檔: PDF, DOCX, TXT, RTF, XLSX, CSV');
        
        // 如果在 Electron 環境中，發送準備就緒訊息
        if (isElectron && process.send) {
            process.send('server-ready');
        }
    });
};

// 處理未捕獲的錯誤
process.on('uncaughtException', (error) => {
    console.error('伺服器未捕獲的錯誤:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('伺服器未處理的 Promise 拒絕:', error);
});

startServer().catch(console.error);