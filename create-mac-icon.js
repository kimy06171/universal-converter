const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createMacIcon() {
    console.log('建立 Mac 圖標...');
    
    const iconPath = path.join(__dirname, 'public', 'icon.png');
    
    // Mac 需要的圖標尺寸
    const sizes = [16, 32, 64, 128, 256, 512, 1024];
    const iconsetPath = path.join(__dirname, 'public', 'icon.iconset');
    
    // 建立 iconset 資料夾
    if (!fs.existsSync(iconsetPath)) {
        fs.mkdirSync(iconsetPath, { recursive: true });
    }
    
    // 為每個尺寸建立圖標
    for (const size of sizes) {
        // 標準解析度
        await sharp(iconPath)
            .resize(size, size)
            .toFile(path.join(iconsetPath, `icon_${size}x${size}.png`));
        
        // Retina 解析度（除了 1024）
        if (size <= 512) {
            await sharp(iconPath)
                .resize(size * 2, size * 2)
                .toFile(path.join(iconsetPath, `icon_${size}x${size}@2x.png`));
        }
    }
    
    console.log('✅ Mac 圖標檔案已建立');
    console.log('');
    console.log('注意：');
    console.log('1. 在 Mac 上使用 iconutil 命令將 iconset 轉換為 icns：');
    console.log(`   iconutil -c icns "${iconsetPath}"`);
    console.log('2. 或使用線上工具轉換');
    console.log('3. Windows 上無法直接建立 .icns 檔案');
    
    // 建立簡單的替代方案
    const icnsPath = path.join(__dirname, 'public', 'icon.icns');
    if (!fs.existsSync(icnsPath)) {
        // 複製 PNG 作為臨時方案（打包時會使用 PNG）
        fs.copyFileSync(iconPath, icnsPath);
        console.log('');
        console.log('已建立臨時 icns 檔案（實際上是 PNG）');
    }
}

createMacIcon().catch(console.error);