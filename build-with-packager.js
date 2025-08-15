const packager = require('electron-packager');
const path = require('path');

async function buildApp() {
    console.log('Building portable app with electron-packager...');
    
    const options = {
        dir: '.',
        out: 'dist-packager-new',
        name: 'Universal-Converter',
        platform: 'win32',
        arch: 'x64',
        electronVersion: '28.0.0',
        // icon: path.join(__dirname, 'public', 'icon.ico'), // 暫時跳過圖標
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
        prune: false, // 保留所有依賴，包括原生模組
        win32metadata: {
            CompanyName: 'Universal Converter',
            FileDescription: '萬用轉檔工具',
            OriginalFilename: 'Universal-Converter.exe',
            ProductName: '萬用轉檔工具',
            InternalName: 'Universal-Converter'
        }
    };
    
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

buildApp();