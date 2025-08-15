const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

class AudioConverter {
    constructor() {
        this.supportedFormats = {
            input: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'webm'],
            output: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus']
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

                // 設定音訊編碼
                switch (outputFormat) {
                    case 'mp3':
                        command.audioCodec('libmp3lame');
                        if (options.bitrate) {
                            command.audioBitrate(options.bitrate);
                        } else {
                            command.audioBitrate('192k');
                        }
                        break;
                    case 'wav':
                        command.audioCodec('pcm_s16le');
                        break;
                    case 'flac':
                        command.audioCodec('flac');
                        if (options.compressionLevel) {
                            command.outputOptions(`-compression_level ${options.compressionLevel}`);
                        }
                        break;
                    case 'aac':
                        command.audioCodec('aac');
                        if (options.bitrate) {
                            command.audioBitrate(options.bitrate);
                        } else {
                            command.audioBitrate('192k');
                        }
                        break;
                    case 'ogg':
                        command.audioCodec('libvorbis');
                        if (options.quality) {
                            command.outputOptions(`-qscale:a ${options.quality}`);
                        }
                        break;
                    case 'm4a':
                        command.audioCodec('aac');
                        command.format('m4a');
                        if (options.bitrate) {
                            command.audioBitrate(options.bitrate);
                        } else {
                            command.audioBitrate('192k');
                        }
                        break;
                    case 'opus':
                        command.audioCodec('libopus');
                        if (options.bitrate) {
                            command.audioBitrate(options.bitrate);
                        } else {
                            command.audioBitrate('128k');
                        }
                        break;
                }

                // 取樣率設定
                if (options.sampleRate) {
                    command.audioFrequency(options.sampleRate);
                }

                // 聲道設定
                if (options.channels) {
                    command.audioChannels(options.channels);
                }

                // 音量調整
                if (options.volume) {
                    command.audioFilters(`volume=${options.volume}`);
                }

                // 裁剪音訊
                if (options.startTime) {
                    command.setStartTime(options.startTime);
                }

                if (options.duration) {
                    command.setDuration(options.duration);
                }

                // 淡入淡出效果
                if (options.fadeIn) {
                    command.audioFilters(`afade=t=in:st=0:d=${options.fadeIn}`);
                }

                if (options.fadeOut && options.duration) {
                    const fadeStart = parseFloat(options.duration) - parseFloat(options.fadeOut);
                    command.audioFilters(`afade=t=out:st=${fadeStart}:d=${options.fadeOut}`);
                }

                // 均衡器
                if (options.equalizer) {
                    const eq = options.equalizer;
                    command.audioFilters(`equalizer=f=${eq.frequency}:t=${eq.type || 'q'}:w=${eq.width || 1}:g=${eq.gain}`);
                }

                // 降噪
                if (options.denoise) {
                    command.audioFilters('highpass=f=200,lowpass=f=3000');
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
                        console.error('音訊轉換錯誤:', err);
                        reject(new Error(`音訊轉換失敗: ${err.message}`));
                    })
                    .save(outputPath);

            } catch (error) {
                reject(new Error(`音訊轉換失敗: ${error.message}`));
            }
        });
    }

    // 獲取音訊資訊
    async getMetadata(inputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) {
                    reject(new Error(`無法讀取音訊資訊: ${err.message}`));
                    return;
                }

                const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
                
                if (!audioStream) {
                    reject(new Error('找不到音訊串流'));
                    return;
                }

                resolve({
                    duration: metadata.format.duration,
                    size: metadata.format.size,
                    bitrate: metadata.format.bit_rate,
                    format: metadata.format.format_name,
                    codec: audioStream.codec_name,
                    sampleRate: audioStream.sample_rate,
                    channels: audioStream.channels,
                    channelLayout: audioStream.channel_layout,
                    audioBitrate: audioStream.bit_rate
                });
            });
        });
    }

    // 合併音訊
    async mergeAudio(inputPaths, outputPath, format = 'mp3') {
        return new Promise((resolve, reject) => {
            const command = ffmpeg();

            // 添加所有輸入檔案
            inputPaths.forEach(inputPath => {
                command.input(inputPath);
            });

            // 設定輸出格式
            switch (format) {
                case 'mp3':
                    command.audioCodec('libmp3lame').audioBitrate('192k');
                    break;
                case 'wav':
                    command.audioCodec('pcm_s16le');
                    break;
                case 'flac':
                    command.audioCodec('flac');
                    break;
                default:
                    command.audioCodec('copy');
            }

            command
                .on('end', () => {
                    resolve({ success: true, outputPath });
                })
                .on('error', (err) => {
                    reject(new Error(`音訊合併失敗: ${err.message}`));
                })
                .mergeToFile(outputPath);
        });
    }

    // 分割音訊
    async splitAudio(inputPath, outputDir, segmentTime = 60) {
        return new Promise((resolve, reject) => {
            const outputPattern = path.join(outputDir, 'segment_%03d.mp3');

            ffmpeg(inputPath)
                .outputOptions([
                    '-f', 'segment',
                    '-segment_time', segmentTime,
                    '-c', 'copy'
                ])
                .on('end', () => {
                    resolve({ success: true, outputPattern });
                })
                .on('error', (err) => {
                    reject(new Error(`音訊分割失敗: ${err.message}`));
                })
                .save(outputPattern);
        });
    }

    // 音訊正規化
    async normalize(inputPath, outputPath, targetLevel = -23) {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioFilters(`loudnorm=I=${targetLevel}:TP=-1.5:LRA=11`)
                .audioCodec('copy')
                .on('end', () => {
                    resolve({ success: true, outputPath });
                })
                .on('error', (err) => {
                    reject(new Error(`音訊正規化失敗: ${err.message}`));
                })
                .save(outputPath);
        });
    }

    // 變速處理
    async changeSpeed(inputPath, outputPath, speed = 1.0) {
        return new Promise((resolve, reject) => {
            const tempo = speed;
            const pitch = 1.0; // 保持音高不變

            ffmpeg(inputPath)
                .audioFilters(`atempo=${tempo}`)
                .on('end', () => {
                    resolve({ success: true, outputPath, speed });
                })
                .on('error', (err) => {
                    reject(new Error(`變速處理失敗: ${err.message}`));
                })
                .save(outputPath);
        });
    }

    // 提取音訊片段
    async extractSegment(inputPath, outputPath, startTime, endTime) {
        const duration = endTime - startTime;
        
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .setStartTime(startTime)
                .setDuration(duration)
                .audioCodec('copy')
                .on('end', () => {
                    resolve({ success: true, outputPath, duration });
                })
                .on('error', (err) => {
                    reject(new Error(`音訊片段提取失敗: ${err.message}`));
                })
                .save(outputPath);
        });
    }
}

module.exports = new AudioConverter();