const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

class VideoConverter {
    constructor() {
        this.supportedFormats = {
            input: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpg', 'mpeg', '3gp'],
            output: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif']
        };
    }

    async convert(inputPath, outputPath, outputFormat, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                // 驗證輸出格式
                if (!this.supportedFormats.output.includes(outputFormat)) {
                    reject(new Error(`不支援的輸出格式: ${outputFormat}`));
                    return;
                }

                let command = ffmpeg(inputPath);

                // 設定輸出格式
                if (outputFormat === 'gif') {
                    // GIF特殊處理
                    command
                        .fps(options.fps || 10)
                        .size(options.size || '320x240')
                        .outputOptions([
                            '-vf',
                            `fps=${options.fps || 10},scale=${options.width || 320}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
                            '-loop',
                            options.loop !== undefined ? options.loop : '0'
                        ]);
                } else {
                    // 視訊編碼設定
                    if (options.videoCodec) {
                        command.videoCodec(options.videoCodec);
                    } else {
                        // 預設編碼
                        switch (outputFormat) {
                            case 'mp4':
                                command.videoCodec('libx264');
                                break;
                            case 'webm':
                                command.videoCodec('libvpx');
                                break;
                            case 'avi':
                                command.videoCodec('mpeg4');
                                break;
                        }
                    }

                    // 音訊編碼設定
                    if (options.audioCodec) {
                        command.audioCodec(options.audioCodec);
                    } else {
                        // 預設音訊編碼
                        switch (outputFormat) {
                            case 'mp4':
                                command.audioCodec('aac');
                                break;
                            case 'webm':
                                command.audioCodec('libvorbis');
                                break;
                        }
                    }

                    // 視訊品質設定
                    if (options.videoBitrate) {
                        command.videoBitrate(options.videoBitrate);
                    }

                    // 音訊品質設定
                    if (options.audioBitrate) {
                        command.audioBitrate(options.audioBitrate);
                    }

                    // 解析度設定
                    if (options.size) {
                        command.size(options.size);
                    }

                    // FPS設定
                    if (options.fps) {
                        command.fps(options.fps);
                    }

                    // 影片裁剪
                    if (options.startTime) {
                        command.setStartTime(options.startTime);
                    }

                    if (options.duration) {
                        command.setDuration(options.duration);
                    }

                    // 音量調整
                    if (options.volume) {
                        command.audioFilters(`volume=${options.volume}`);
                    }

                    // 旋轉
                    if (options.rotate) {
                        command.videoFilters(`rotate=${options.rotate}*PI/180`);
                    }

                    // 去除音訊
                    if (options.noAudio) {
                        command.noAudio();
                    }

                    // 去除視訊
                    if (options.noVideo) {
                        command.noVideo();
                    }
                }

                // 執行轉換
                command
                    .on('start', (commandLine) => {
                        console.log('開始轉換:', commandLine);
                    })
                    .on('progress', (progress) => {
                        if (progress.percent) {
                            console.log(`轉換進度: ${progress.percent.toFixed(2)}%`);
                        }
                    })
                    .on('end', async () => {
                        try {
                            const stats = await fs.stat(outputPath);
                            resolve({
                                success: true,
                                outputPath,
                                size: stats.size,
                                format: outputFormat
                            });
                        } catch (error) {
                            resolve({
                                success: true,
                                outputPath,
                                format: outputFormat
                            });
                        }
                    })
                    .on('error', (err) => {
                        console.error('影片轉換錯誤:', err);
                        reject(new Error(`影片轉換失敗: ${err.message}`));
                    })
                    .save(outputPath);

            } catch (error) {
                reject(new Error(`影片轉換失敗: ${error.message}`));
            }
        });
    }

    // 提取音訊
    async extractAudio(inputPath, outputPath, format = 'mp3') {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .noVideo()
                .audioCodec(format === 'mp3' ? 'libmp3lame' : 'copy')
                .on('end', () => {
                    resolve({ success: true, outputPath });
                })
                .on('error', (err) => {
                    reject(new Error(`音訊提取失敗: ${err.message}`));
                })
                .save(outputPath);
        });
    }

    // 獲取影片資訊
    async getMetadata(inputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) {
                    reject(new Error(`無法讀取影片資訊: ${err.message}`));
                    return;
                }

                const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

                resolve({
                    duration: metadata.format.duration,
                    size: metadata.format.size,
                    bitrate: metadata.format.bit_rate,
                    format: metadata.format.format_name,
                    video: videoStream ? {
                        codec: videoStream.codec_name,
                        width: videoStream.width,
                        height: videoStream.height,
                        fps: eval(videoStream.r_frame_rate),
                        bitrate: videoStream.bit_rate
                    } : null,
                    audio: audioStream ? {
                        codec: audioStream.codec_name,
                        sampleRate: audioStream.sample_rate,
                        channels: audioStream.channels,
                        bitrate: audioStream.bit_rate
                    } : null
                });
            });
        });
    }

    // 生成縮圖
    async generateThumbnail(inputPath, outputPath, timestamp = '00:00:01') {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .screenshots({
                    timestamps: [timestamp],
                    filename: path.basename(outputPath),
                    folder: path.dirname(outputPath),
                    size: '320x240'
                })
                .on('end', () => {
                    resolve({ success: true, outputPath });
                })
                .on('error', (err) => {
                    reject(new Error(`縮圖生成失敗: ${err.message}`));
                });
        });
    }

    // 合併影片
    async mergeVideos(inputPaths, outputPath, format = 'mp4') {
        return new Promise((resolve, reject) => {
            const command = ffmpeg();

            // 添加所有輸入檔案
            inputPaths.forEach(inputPath => {
                command.input(inputPath);
            });

            command
                .on('end', () => {
                    resolve({ success: true, outputPath });
                })
                .on('error', (err) => {
                    reject(new Error(`影片合併失敗: ${err.message}`));
                })
                .mergeToFile(outputPath);
        });
    }

    // 壓縮影片
    async compress(inputPath, outputPath, quality = 'medium') {
        const qualitySettings = {
            low: { videoBitrate: '500k', audioBitrate: '96k' },
            medium: { videoBitrate: '1000k', audioBitrate: '128k' },
            high: { videoBitrate: '2000k', audioBitrate: '192k' }
        };

        const settings = qualitySettings[quality] || qualitySettings.medium;

        return this.convert(inputPath, outputPath, 'mp4', {
            videoCodec: 'libx264',
            audioCodec: 'aac',
            videoBitrate: settings.videoBitrate,
            audioBitrate: settings.audioBitrate
        });
    }
}

module.exports = new VideoConverter();