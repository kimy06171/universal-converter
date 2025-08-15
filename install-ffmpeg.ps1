# FFmpeg 自動安裝腳本 (PowerShell 版本)
# 需要以系統管理員身分執行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FFmpeg 自動安裝程式 (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查是否已安裝
try {
    $ffmpegVersion = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "FFmpeg 已經安裝！" -ForegroundColor Green
        Write-Host $ffmpegVersion
        Read-Host "按 Enter 鍵結束"
        exit 0
    }
} catch {
    Write-Host "FFmpeg 尚未安裝，開始安裝程序..." -ForegroundColor Yellow
}

# 檢查管理員權限
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "[錯誤] 此腳本需要管理員權限執行" -ForegroundColor Red
    Write-Host "請右鍵點擊 PowerShell，選擇「以系統管理員身分執行」" -ForegroundColor Yellow
    Write-Host "然後執行以下命令：" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy Bypass -Scope Process -Force; .\install-ffmpeg.ps1" -ForegroundColor Cyan
    Read-Host "按 Enter 鍵結束"
    exit 1
}

# 設定變數
$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$downloadPath = "$env:TEMP\ffmpeg.zip"
$installPath = "C:\ffmpeg"
$extractPath = "$env:TEMP\ffmpeg-extract"

# 設定 TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

try {
    # 1. 下載 FFmpeg
    Write-Host "1. 正在下載 FFmpeg..." -ForegroundColor Green
    Write-Host "   這可能需要幾分鐘，請耐心等待..." -ForegroundColor Gray
    
    $ProgressPreference = 'SilentlyContinue'  # 加速下載
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $downloadPath -UseBasicParsing
    $ProgressPreference = 'Continue'
    
    if (-not (Test-Path $downloadPath)) {
        throw "下載失敗！"
    }
    
    # 2. 解壓縮
    Write-Host ""
    Write-Host "2. 正在解壓縮..." -ForegroundColor Green
    
    if (Test-Path $extractPath) {
        Remove-Item $extractPath -Recurse -Force
    }
    
    Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force
    
    # 找到解壓縮後的資料夾
    $extractedFolder = Get-ChildItem -Path $extractPath -Directory | Where-Object { $_.Name -like "ffmpeg-*" } | Select-Object -First 1
    
    if (-not $extractedFolder) {
        throw "解壓縮失敗！"
    }
    
    # 3. 安裝
    Write-Host ""
    Write-Host "3. 正在安裝到 $installPath..." -ForegroundColor Green
    
    # 如果目標資料夾已存在，先刪除
    if (Test-Path $installPath) {
        Write-Host "   移除舊版本..." -ForegroundColor Gray
        Remove-Item $installPath -Recurse -Force
    }
    
    # 移動到安裝位置
    Move-Item -Path $extractedFolder.FullName -Destination $installPath -Force
    
    if (-not (Test-Path "$installPath\bin\ffmpeg.exe")) {
        throw "安裝失敗！"
    }
    
    # 4. 設定環境變數
    Write-Host ""
    Write-Host "4. 正在設定環境變數..." -ForegroundColor Green
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
    $ffmpegBinPath = "$installPath\bin"
    
    if ($currentPath -notlike "*$ffmpegBinPath*") {
        $newPath = "$currentPath;$ffmpegBinPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, [EnvironmentVariableTarget]::Machine)
        
        # 也更新當前會話的 PATH
        $env:Path = "$env:Path;$ffmpegBinPath"
        
        Write-Host "   環境變數已更新！" -ForegroundColor Green
    } else {
        Write-Host "   環境變數已存在，跳過..." -ForegroundColor Gray
    }
    
    # 5. 清理
    Write-Host ""
    Write-Host "5. 清理暫存檔案..." -ForegroundColor Green
    
    Remove-Item $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    
    # 完成
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   FFmpeg 安裝完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "安裝位置：$installPath" -ForegroundColor White
    Write-Host ""
    Write-Host "正在驗證安裝..." -ForegroundColor Yellow
    
    # 驗證安裝
    & "$installPath\bin\ffmpeg.exe" -version
    
    Write-Host ""
    Write-Host "[重要] 請關閉並重新開啟命令提示字元或 PowerShell" -ForegroundColor Yellow
    Write-Host "       以使環境變數生效！" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "[錯誤] $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "請手動從以下網址下載：" -ForegroundColor Yellow
    Write-Host $ffmpegUrl -ForegroundColor Cyan
    
    # 清理失敗的檔案
    Remove-Item $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
}

Read-Host "按 Enter 鍵結束"