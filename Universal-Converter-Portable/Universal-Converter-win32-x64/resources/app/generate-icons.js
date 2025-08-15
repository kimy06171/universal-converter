const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
    console.log('生成應用程式圖標...');
    
    const svgPath = path.join(__dirname, 'public', 'icon.svg');
    const pngPath = path.join(__dirname, 'public', 'icon.png');
    const icoPath = path.join(__dirname, 'public', 'icon.ico');
    
    try {
        // 檢查 SVG 是否存在
        try {
            await fs.access(svgPath);
        } catch {
            console.log('找不到 icon.svg，使用預設圖標');
            
            // 建立一個簡單的預設圖標
            const defaultIcon = Buffer.from(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="#667eea"/>
                    <text x="128" y="140" font-family="Arial" font-size="120" font-weight="bold" 
                          fill="white" text-anchor="middle">C</text>
                </svg>
            `);
            
            await fs.writeFile(svgPath, defaultIcon);
        }
        
        // 生成 PNG (256x256)
        console.log('生成 PNG 圖標...');
        await sharp(svgPath)
            .resize(256, 256)
            .png()
            .toFile(pngPath);
        console.log('✓ icon.png 已生成');
        
        // 生成多個尺寸的 PNG 用於 ICO
        console.log('生成 ICO 圖標...');
        const sizes = [16, 32, 48, 64, 128, 256];
        const icoImages = [];
        
        for (const size of sizes) {
            const buffer = await sharp(svgPath)
                .resize(size, size)
                .png()
                .toBuffer();
            icoImages.push(buffer);
        }
        
        // 注意：這裡簡化處理，實際的 ICO 生成需要特殊的格式
        // 暫時只複製 PNG 作為 ICO（Windows 可以接受）
        await fs.copyFile(pngPath, icoPath);
        console.log('✓ icon.ico 已生成（簡化版）');
        
        console.log('\n圖標生成完成！');
        
    } catch (error) {
        console.error('生成圖標時發生錯誤:', error);
        
        // 建立基本的備用圖標
        console.log('建立備用圖標...');
        
        // 建立一個簡單的彩色方塊作為圖標
        const fallbackIcon = await sharp({
            create: {
                width: 256,
                height: 256,
                channels: 4,
                background: { r: 102, g: 126, b: 234, alpha: 1 }
            }
        })
        .png()
        .toBuffer();
        
        await fs.writeFile(pngPath, fallbackIcon);
        await fs.writeFile(icoPath, fallbackIcon);
        
        console.log('✓ 備用圖標已建立');
    }
}

// 執行生成
if (require.main === module) {
    generateIcons().catch(console.error);
}

module.exports = generateIcons;