const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageConverter {
    constructor() {
        this.supportedFormats = {
            input: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg'],
            output: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'tif']
        };
    }

    async convert(inputPath, outputPath, outputFormat, options = {}) {
        try {
            // 驗證輸出格式
            if (!this.supportedFormats.output.includes(outputFormat)) {
                throw new Error(`不支援的輸出格式: ${outputFormat}`);
            }

            let converter = sharp(inputPath);

            // 應用選項
            if (options.width || options.height) {
                converter = converter.resize(options.width, options.height, {
                    fit: options.fit || 'inside',
                    withoutEnlargement: true
                });
            }

            if (options.quality) {
                converter = converter.jpeg({ quality: options.quality });
            }

            if (options.rotate) {
                converter = converter.rotate(options.rotate);
            }

            if (options.flip) {
                converter = converter.flip();
            }

            if (options.flop) {
                converter = converter.flop();
            }

            if (options.grayscale) {
                converter = converter.grayscale();
            }

            if (options.blur) {
                converter = converter.blur(options.blur);
            }

            if (options.sharpen) {
                converter = converter.sharpen();
            }

            // 根據輸出格式設定
            switch (outputFormat) {
                case 'jpg':
                case 'jpeg':
                    converter = converter.jpeg({
                        quality: options.quality || 85,
                        progressive: true
                    });
                    break;
                case 'png':
                    converter = converter.png({
                        compressionLevel: options.compressionLevel || 9,
                        progressive: true
                    });
                    break;
                case 'webp':
                    converter = converter.webp({
                        quality: options.quality || 85,
                        lossless: options.lossless || false
                    });
                    break;
                case 'gif':
                    converter = converter.gif({
                        colors: options.colors || 256
                    });
                    break;
                case 'bmp':
                    converter = converter.bmp();
                    break;
                case 'tiff':
                case 'tif':
                    converter = converter.tiff({
                        compression: options.compression || 'jpeg',
                        quality: options.quality || 85
                    });
                    break;
            }

            // 執行轉換
            await converter.toFile(outputPath);

            // 獲取輸出檔案資訊
            const stats = await fs.stat(outputPath);
            const metadata = await sharp(outputPath).metadata();

            return {
                success: true,
                outputPath,
                size: stats.size,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format
            };

        } catch (error) {
            console.error('圖片轉換錯誤:', error);
            throw new Error(`圖片轉換失敗: ${error.message}`);
        }
    }

    // 批次轉換
    async batchConvert(inputPaths, outputDir, outputFormat, options = {}) {
        const results = [];
        const errors = [];

        for (const inputPath of inputPaths) {
            try {
                const filename = path.basename(inputPath, path.extname(inputPath));
                const outputPath = path.join(outputDir, `${filename}.${outputFormat}`);
                
                const result = await this.convert(inputPath, outputPath, outputFormat, options);
                results.push(result);
            } catch (error) {
                errors.push({
                    inputPath,
                    error: error.message
                });
            }
        }

        return { results, errors };
    }

    // 獲取圖片資訊
    async getMetadata(inputPath) {
        try {
            const metadata = await sharp(inputPath).metadata();
            return {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                space: metadata.space,
                channels: metadata.channels,
                depth: metadata.depth,
                density: metadata.density,
                hasAlpha: metadata.hasAlpha,
                orientation: metadata.orientation
            };
        } catch (error) {
            throw new Error(`無法讀取圖片資訊: ${error.message}`);
        }
    }

    // 生成縮圖
    async generateThumbnail(inputPath, outputPath, size = 200) {
        try {
            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 })
                .toFile(outputPath);

            return { success: true, outputPath };
        } catch (error) {
            throw new Error(`縮圖生成失敗: ${error.message}`);
        }
    }

    // 圖片壓縮
    async compress(inputPath, outputPath, quality = 80) {
        try {
            const metadata = await sharp(inputPath).metadata();
            let converter = sharp(inputPath);

            // 根據原始格式壓縮
            switch (metadata.format) {
                case 'jpeg':
                case 'jpg':
                    converter = converter.jpeg({ quality, progressive: true });
                    break;
                case 'png':
                    converter = converter.png({ compressionLevel: 9 });
                    break;
                case 'webp':
                    converter = converter.webp({ quality });
                    break;
                default:
                    // 其他格式轉為JPEG壓縮
                    converter = converter.jpeg({ quality, progressive: true });
            }

            await converter.toFile(outputPath);

            const originalStats = await fs.stat(inputPath);
            const compressedStats = await fs.stat(outputPath);
            const compressionRatio = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(2);

            return {
                success: true,
                originalSize: originalStats.size,
                compressedSize: compressedStats.size,
                compressionRatio: `${compressionRatio}%`
            };
        } catch (error) {
            throw new Error(`圖片壓縮失敗: ${error.message}`);
        }
    }
}

module.exports = new ImageConverter();