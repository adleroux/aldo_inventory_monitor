@echo off
REM Start websocketd with inventory.rb
echo Starting websocketd...
start bin\websocketd.exe --port=8080 ruby lib\inventory.rb

REM Change directory to the root of the Rails app
cd /d %~dp0

REM Start Rails server
echo Starting Rails server...
start cmd /k "rails server"

echo All services started. Press any key to exit...
pause
