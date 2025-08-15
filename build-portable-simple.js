const builder = require('electron-builder');
const path = require('path');

async function buildPortable() {
    console.log('Building portable version...');
    
    try {
        await builder.build({
            targets: builder.Platform.WINDOWS.createTarget('portable'),
            config: {
                appId: 'com.universal.converter',
                productName: '萬用轉檔工具',
                directories: {
                    output: 'dist'
                },
                files: [
                    'electron-main.js',
                    'electron-preload.js',
                    'server.js',
                    'src/**/*',
                    'public/**/*',
                    'node_modules/**/*',
                    '.env'
                ],
                extraResources: [
                    {
                        from: 'C:/ffmpeg/bin',
                        to: 'ffmpeg/bin',
                        filter: ['*.exe', '*.dll']
                    }
                ],
                win: {
                    target: 'portable',
                    icon: 'public/icon.ico'
                },
                portable: {
                    artifactName: 'Universal-Converter-Portable.exe'
                },
                compression: 'normal',
                nsis: {
                    differentialPackage: false
                }
            }
        });
        
        console.log('Build successful!');
        console.log('Portable file: dist/Universal-Converter-Portable.exe');
        
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildPortable();