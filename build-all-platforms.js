const packager = require('electron-packager');
const path = require('path');
const fs = require('fs');

async function buildAllPlatforms() {
    console.log('========================================');
    console.log('  建立跨平台應用程式');
    console.log('========================================\n');
    
    const baseOptions = {
        dir: '.',
        out: 'dist-all-platforms',
        name: 'Universal-Converter',
        electronVersion: '28.0.0',
        overwrite: true,
        asar: false,
        ignore: [
            /^\/dist/,
            /^\/dist-packager/,
            /^\/dist-all-platforms/,
            /^\/\.git/,
            /^\/\.gitignore/,
            /^\/README\.md/,
            /^\/build-/,
            /^\/BUILD-/,
            /^\/test-/,
            /^\/TEST-/,
            /^\/.*\.bat$/,
            /^\/.*\.ps1$/,
            /^\/.*\.sh$/,
            /^\/electron-main\.js$/
        ],
        prune: false
    };
    
    // 要建立的平台
    const platforms = [
        {
            name: 'Windows (64-bit)',
            platform: 'win32',
            arch: 'x64',
            icon: path.join(__dirname, 'public', 'icon.ico')
        },
        {
            name: 'macOS (Intel)',
            platform: 'darwin',
            arch: 'x64',
            icon: path.join(__dirname, 'public', 'icon.icns')
        },
        {
            name: 'macOS (Apple Silicon)',
            platform: 'darwin',
            arch: 'arm64',
            icon: path.join(__dirname, 'public', 'icon.icns')
        },
        {
            name: 'Linux (64-bit)',
            platform: 'linux',
            arch: 'x64',
            icon: path.join(__dirname, 'public', 'icon.png')
        }
    ];
    
    const results = [];
    
    for (const config of platforms) {
        console.log(`\n建立 ${config.name} 版本...`);
        
        const options = {
            ...baseOptions,
            platform: config.platform,
            arch: config.arch
        };
        
        // 添加平台特定設定
        if (config.platform === 'darwin') {
            options.darwinDarkModeSupport = true;
            options.osxSign = false;
            options.osxNotarize = false;
        } else if (config.platform === 'win32') {
            options.win32metadata = {
                CompanyName: 'Universal Converter',
                FileDescription: '萬用轉檔工具',
                OriginalFilename: 'Universal-Converter.exe',
                ProductName: '萬用轉檔工具',
                InternalName: 'Universal-Converter'
            };
        }
        
        // 如果圖標檔案存在，添加圖標
        if (config.icon && fs.existsSync(config.icon)) {
            options.icon = config.icon;
        }
        
        try {
            const appPaths = await packager(options);
            console.log(`✅ ${config.name} 建立成功！`);
            console.log(`   位置：${appPaths[0]}`);
            results.push({
                platform: config.name,
                path: appPaths[0],
                success: true
            });
        } catch (error) {
            console.error(`❌ ${config.name} 建立失敗：${error.message}`);
            results.push({
                platform: config.name,
                error: error.message,
                success: false
            });
        }
    }
    
    // 顯示總結
    console.log('\n========================================');
    console.log('  建立總結');
    console.log('========================================\n');
    
    results.forEach(result => {
        if (result.success) {
            console.log(`✅ ${result.platform}`);
            console.log(`   ${result.path}`);
        } else {
            console.log(`❌ ${result.platform}: ${result.error}`);
        }
    });
    
    // 建立使用說明
    const instructions = `
========================================
跨平台版本使用說明
========================================

已建立的版本：
${results.filter(r => r.success).map(r => `- ${r.platform}`).join('\n')}

如何在不同平台使用：

【Windows】
1. 複製 Universal-Converter-win32-x64 資料夾
2. 執行 Universal-Converter.exe

【macOS (Intel Mac)】
1. 複製 Universal-Converter-darwin-x64 資料夾
2. 開啟 Universal-Converter.app
3. 如果出現安全警告，到「系統偏好設定」>「安全性與隱私」允許執行

【macOS (Apple Silicon/M1/M2)】
1. 複製 Universal-Converter-darwin-arm64 資料夾
2. 開啟 Universal-Converter.app
3. 如果出現安全警告，到「系統偏好設定」>「安全性與隱私」允許執行

【Linux】
1. 複製 Universal-Converter-linux-x64 資料夾
2. 給予執行權限：chmod +x Universal-Converter
3. 執行：./Universal-Converter

注意事項：
- macOS 版本未簽名，首次執行可能需要允許
- Linux 版本需要圖形界面環境（X11 或 Wayland）
- 所有版本都包含必要的依賴，無需額外安裝
`;
    
    fs.writeFileSync('dist-all-platforms/使用說明.txt', instructions, 'utf8');
    console.log('\n使用說明已儲存至 dist-all-platforms/使用說明.txt');
}

buildAllPlatforms().catch(console.error);