# 快速安裝 FFmpeg 腳本
Write-Host "正在安裝 FFmpeg..." -ForegroundColor Green

# 設定 TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# 下載並安裝
$url = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$zip = "$env:TEMP\ffmpeg.zip"
$dest = "C:\ffmpeg"

Write-Host "下載中..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing

Write-Host "解壓縮中..." -ForegroundColor Yellow
Expand-Archive -Path $zip -DestinationPath "$env:TEMP\ffmpeg-temp" -Force
$folder = Get-ChildItem "$env:TEMP\ffmpeg-temp" -Directory | Select-Object -First 1
Move-Item -Path $folder.FullName -Destination $dest -Force

Write-Host "設定環境變數..." -ForegroundColor Yellow
$path = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($path -notlike "*C:\ffmpeg\bin*") {
    [Environment]::SetEnvironmentVariable("Path", "$path;C:\ffmpeg\bin", "Machine")
}

# 清理
Remove-Item $zip -Force
Remove-Item "$env:TEMP\ffmpeg-temp" -Recurse -Force

Write-Host "完成！請重新開啟 PowerShell" -ForegroundColor Green