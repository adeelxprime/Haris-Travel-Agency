@echo off
title Haris Travel Agency Server
cd /d "%~dp0"
echo ========================================================
echo   Starting Haris Travel Agency Website & Admin Panel...
echo ========================================================
echo.
echo Website URL:  http://localhost:3000
echo Admin Panel:  http://localhost:3000/admin (Password: 569646)
echo.
start http://localhost:3000
node server.js
pause
