@echo off
echo Creating desktop shortcut...

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Universal Converter.lnk'); $Shortcut.TargetPath = 'C:\Users\user\OneDrive\tuf18\universal-converter\dist-packager\Universal-Converter-win32-x64\Universal-Converter.exe'; $Shortcut.WorkingDirectory = 'C:\Users\user\OneDrive\tuf18\universal-converter\dist-packager\Universal-Converter-win32-x64'; $Shortcut.Description = 'Universal File Converter'; $Shortcut.Save()"

echo.
echo ✅ Desktop shortcut created!
echo Look for "Universal Converter" on your desktop
pause