// 全域變數
let selectedFiles = [];
let currentFileType = 'all';
let supportedFormats = {};

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const fileList = document.getElementById('fileList');
const filesContainer = document.getElementById('filesContainer');
const conversionOptions = document.getElementById('conversionOptions');
const outputFormat = document.getElementById('outputFormat');
const advancedOptions = document.getElementById('advancedOptions');
const convertBtn = document.getElementById('convertBtn');
const progressArea = document.getElementById('progressArea');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsArea = document.getElementById('resultsArea');
const resultsContainer = document.getElementById('resultsContainer');
const resetBtn = document.getElementById('resetBtn');

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadSupportedFormats();
    setupEventListeners();
});

// 載入支援的格式
async function loadSupportedFormats() {
    try {
        const response = await fetch('/api/formats');
        
        // 檢查回應類型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('伺服器回應格式錯誤');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        supportedFormats = await response.json();
        console.log('成功載入支援的格式:', supportedFormats);
    } catch (error) {
        console.error('載入格式失敗:', error);
        // 使用預設格式
        supportedFormats = {
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
        };
        console.log('使用預設格式配置');
    }
}

// 設定事件監聽器
function setupEventListeners() {
    // 檔案類型選擇
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFileType = e.target.dataset.type;
            updateOutputFormats();
        });
    });

    // 檔案選擇
    selectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // 拖放功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // 輸出格式變更
    outputFormat.addEventListener('change', updateAdvancedOptions);

    // 轉換按鈕
    convertBtn.addEventListener('click', startConversion);

    // 重置按鈕
    resetBtn.addEventListener('click', resetApp);

    // 音量滑桿
    const volumeSlider = document.getElementById('audioVolume');
    const volumeValue = document.getElementById('volumeValue');
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
            volumeValue.textContent = e.target.value;
        });
    }
}

// 處理檔案選擇
function handleFileSelect(e) {
    handleFiles(e.target.files);
}

// 處理檔案
function handleFiles(files) {
    if (files.length === 0) return;

    // 限制檔案數量
    if (files.length > 10) {
        showError('最多只能選擇10個檔案');
        return;
    }

    selectedFiles = Array.from(files);
    
    // 檢查檔案大小
    const oversizedFiles = selectedFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        showError('部分檔案超過100MB限制');
        return;
    }

    displayFiles();
    detectFileType();
    updateOutputFormats();
    
    fileList.style.display = 'block';
    conversionOptions.style.display = 'block';
}

// 顯示檔案列表
function displayFiles() {
    filesContainer.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = getFileIcon(file.name);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${fileIcon}</span>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFile(${index})">移除</button>
        `;
        
        filesContainer.appendChild(fileItem);
    });
}

// 移除檔案
function removeFile(index) {
    selectedFiles.splice(index, 1);
    
    if (selectedFiles.length === 0) {
        fileList.style.display = 'none';
        conversionOptions.style.display = 'none';
    } else {
        displayFiles();
        detectFileType();
        updateOutputFormats();
    }
}

// 偵測檔案類型
function detectFileType() {
    if (selectedFiles.length === 0) return;
    
    const extensions = selectedFiles.map(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ext;
    });
    
    // 判斷主要檔案類型
    const types = extensions.map(ext => {
        if (supportedFormats.image?.input.includes(ext)) return 'image';
        if (supportedFormats.video?.input.includes(ext)) return 'video';
        if (supportedFormats.audio?.input.includes(ext)) return 'audio';
        if (supportedFormats.document?.input.includes(ext)) return 'document';
        return 'unknown';
    });
    
    // 如果所有檔案都是同一類型，自動選擇該類型
    const uniqueTypes = [...new Set(types)];
    if (uniqueTypes.length === 1 && uniqueTypes[0] !== 'unknown') {
        currentFileType = uniqueTypes[0];
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === currentFileType) {
                btn.classList.add('active');
            }
        });
    }
}

// 更新輸出格式選項
function updateOutputFormats() {
    outputFormat.innerHTML = '<option value="">請選擇輸出格式</option>';
    
    let formats = [];
    
    if (currentFileType === 'all') {
        // 顯示所有格式
        Object.values(supportedFormats).forEach(category => {
            if (category.output) {
                formats = formats.concat(category.output);
            }
        });
        formats = [...new Set(formats)]; // 去重
    } else if (supportedFormats[currentFileType]) {
        formats = supportedFormats[currentFileType].output || [];
    }
    
    formats.forEach(format => {
        const option = document.createElement('option');
        option.value = format;
        option.textContent = format.toUpperCase();
        outputFormat.appendChild(option);
    });
}

// 更新進階選項
function updateAdvancedOptions() {
    const format = outputFormat.value;
    if (!format) {
        advancedOptions.style.display = 'none';
        return;
    }
    
    // 隱藏所有選項面板
    document.querySelectorAll('.options-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // 根據檔案類型顯示對應選項
    if (currentFileType === 'image' || isImageFormat(format)) {
        advancedOptions.style.display = 'block';
        document.querySelector('.image-options').style.display = 'block';
    } else if (currentFileType === 'video' || isVideoFormat(format)) {
        advancedOptions.style.display = 'block';
        document.querySelector('.video-options').style.display = 'block';
    } else if (currentFileType === 'audio' || isAudioFormat(format)) {
        advancedOptions.style.display = 'block';
        document.querySelector('.audio-options').style.display = 'block';
    } else {
        advancedOptions.style.display = 'none';
    }
}

// 判斷格式類型
function isImageFormat(format) {
    return supportedFormats.image?.output.includes(format);
}

function isVideoFormat(format) {
    return supportedFormats.video?.output.includes(format);
}

function isAudioFormat(format) {
    return supportedFormats.audio?.output.includes(format);
}

// 開始轉換
async function startConversion() {
    const format = outputFormat.value;
    if (!format) {
        showError('請選擇輸出格式');
        return;
    }
    
    if (selectedFiles.length === 0) {
        showError('請選擇要轉換的檔案');
        return;
    }
    
    // 顯示進度區域
    progressArea.style.display = 'block';
    resultsArea.style.display = 'none';
    convertBtn.disabled = true;
    
    // 準備表單資料
    const formData = new FormData();
    
    // 批次處理
    if (selectedFiles.length > 1) {
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
    } else {
        formData.append('file', selectedFiles[0]);
    }
    
    formData.append('outputFormat', format);
    
    // 添加進階選項
    addAdvancedOptions(formData);
    
    try {
        updateProgress(0, '開始轉換...');
        
        const endpoint = selectedFiles.length > 1 ? '/api/batch-convert' : '/api/convert';
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            updateProgress(100, '轉換完成！');
            displayResults(result);
        } else {
            throw new Error(result.error || '轉換失敗');
        }
    } catch (error) {
        console.error('轉換錯誤:', error);
        showError(error.message);
        progressArea.style.display = 'none';
    } finally {
        convertBtn.disabled = false;
    }
}

// 添加進階選項到表單
function addAdvancedOptions(formData) {
    // 圖片選項
    if (document.querySelector('.image-options').style.display !== 'none') {
        const quality = document.getElementById('imageQuality').value;
        const width = document.getElementById('imageWidth').value;
        const height = document.getElementById('imageHeight').value;
        const grayscale = document.getElementById('imageGrayscale').checked;
        
        if (quality) formData.append('quality', quality);
        if (width) formData.append('width', width);
        if (height) formData.append('height', height);
        if (grayscale) formData.append('grayscale', 'true');
    }
    
    // 影片選項
    if (document.querySelector('.video-options').style.display !== 'none') {
        const videoBitrate = document.getElementById('videoBitrate').value;
        const audioBitrate = document.getElementById('audioBitrate').value;
        const fps = document.getElementById('videoFps').value;
        const size = document.getElementById('videoSize').value;
        const noAudio = document.getElementById('noAudio').checked;
        
        if (videoBitrate) formData.append('videoBitrate', videoBitrate);
        if (audioBitrate) formData.append('audioBitrate', audioBitrate);
        if (fps) formData.append('fps', fps);
        if (size) formData.append('size', size);
        if (noAudio) formData.append('noAudio', 'true');
    }
    
    // 音訊選項
    if (document.querySelector('.audio-options').style.display !== 'none') {
        const bitrate = document.getElementById('audioBitrateSelect').value;
        const sampleRate = document.getElementById('audioSampleRate').value;
        const channels = document.getElementById('audioChannels').value;
        const volume = document.getElementById('audioVolume').value;
        
        if (bitrate) formData.append('bitrate', bitrate);
        if (sampleRate) formData.append('sampleRate', sampleRate);
        if (channels) formData.append('channels', channels);
        if (volume && volume !== '1') formData.append('volume', volume);
    }
}

// 更新進度
function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressFill.textContent = `${percent}%`;
    progressText.textContent = text;
}

// 顯示結果
function displayResults(result) {
    progressArea.style.display = 'none';
    resultsArea.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    if (result.results) {
        // 批次轉換結果
        result.results.forEach(item => {
            const resultItem = createResultItem(item);
            resultsContainer.appendChild(resultItem);
        });
        
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach(error => {
                const errorItem = createErrorItem(error);
                resultsContainer.appendChild(errorItem);
            });
        }
    } else {
        // 單一檔案轉換結果
        const resultItem = createResultItem({
            originalName: selectedFiles[0].name,
            downloadUrl: result.downloadUrl,
            filename: result.filename
        });
        resultsContainer.appendChild(resultItem);
    }
}

// 建立結果項目
function createResultItem(item) {
    const div = document.createElement('div');
    div.className = 'result-item';
    
    div.innerHTML = `
        <div class="result-info">
            <span class="result-icon">✅</span>
            <div>
                <div class="result-name">${item.filename || item.originalName}</div>
            </div>
        </div>
        <a href="${item.downloadUrl}" class="download-btn" download="${item.filename}">下載</a>
    `;
    
    return div;
}

// 建立錯誤項目
function createErrorItem(error) {
    const div = document.createElement('div');
    div.className = 'error-item';
    div.innerHTML = `❌ ${error.file}: ${error.error}`;
    return div;
}

// 重置應用程式
function resetApp() {
    selectedFiles = [];
    fileInput.value = '';
    fileList.style.display = 'none';
    conversionOptions.style.display = 'none';
    progressArea.style.display = 'none';
    resultsArea.style.display = 'none';
    outputFormat.value = '';
    advancedOptions.style.display = 'none';
    
    // 重置所有輸入欄位
    document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(input => {
        if (input.id !== 'outputFormat') {
            input.value = input.defaultValue || '';
        }
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// 工具函數
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    if (supportedFormats.image?.input.includes(ext)) return '🖼️';
    if (supportedFormats.video?.input.includes(ext)) return '🎬';
    if (supportedFormats.audio?.input.includes(ext)) return '🎵';
    if (supportedFormats.document?.input.includes(ext)) return '📄';
    
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function showError(message) {
    alert(`錯誤: ${message}`);
}