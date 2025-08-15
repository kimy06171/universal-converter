@echo off
echo Testing server...
echo.

echo [1] Testing health endpoint:
curl -s http://localhost:3456/api/health
echo.
echo.

echo [2] Testing formats endpoint:
curl -s http://localhost:3456/api/formats | findstr "image"
echo.
echo.

echo [3] Testing root page:
curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:3456/
echo.
echo.

echo [4] Opening in browser:
start http://localhost:3456

pause