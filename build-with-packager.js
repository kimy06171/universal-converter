const packager = require('electron-packager');
const path = require('path');

async function buildApp(platform = 'win32') {
    const platformName = platform === 'darwin' ? 'Mac' : 'Windows';
    console.log(`Building ${platformName} app with electron-packager...`);
    
    const baseOptions = {
        dir: '.',
        out: 'dist-final',
        name: 'Universal-Converter',
        electronVersion: '28.0.0',
        overwrite: true,
        asar: false, // 不使用 asar，避免原生模組問題
        ignore: [
            /^\/dist/,
            /^\/dist-packager/,
            /^\/\.git/,
            /^\/\.gitignore/,
            /^\/README\.md/,
            /^\/build-/,
            /^\/BUILD-/,
            /^\/test-/,
            /^\/TEST-/,
            /^\/.*\.bat$/,
            /^\/.*\.ps1$/,
            /^\/diagnose/,
            /^\/create/,
            /^\/CREATE/,
            /^\/RUN/,
            /^\/OPEN/,
            /^\/rebuild/,
            /^\/electron-main\.js$/ // 使用 simple 版本
        ],
        prune: false // 保留所有依賴，包括原生模組
    };
    
    // 平台特定設定
    let options;
    if (platform === 'darwin') {
        options = {
            ...baseOptions,
            platform: 'darwin',
            arch: 'x64',
            icon: path.join(__dirname, 'public', 'icon.icns'), // Mac 圖標
            darwinDarkModeSupport: true,
            osxSign: false, // 跳過簽名（需要開發者證書）
            osxNotarize: false // 跳過公證（需要 Apple 開發者帳號）
        };
    } else {
        options = {
            ...baseOptions,
            platform: 'win32',
            arch: 'x64',
            // icon: path.join(__dirname, 'public', 'icon.ico'), // Windows 圖標
            win32metadata: {
                CompanyName: 'Universal Converter',
                FileDescription: '萬用轉檔工具',
                OriginalFilename: 'Universal-Converter.exe',
                ProductName: '萬用轉檔工具',
                InternalName: 'Universal-Converter'
            }
        };
    }
    
    try {
        const appPaths = await packager(options);
        console.log('Build successful!');
        console.log('App created at:', appPaths[0]);
        console.log('\n要建立可攜帶版，請將整個資料夾壓縮成 ZIP 檔案');
        return appPaths[0];
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// 從命令列參數取得平台
const platform = process.argv[2] || 'win32';
buildApp(platform);