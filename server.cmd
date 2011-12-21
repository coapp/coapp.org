@echo off

if exist %~dp0\out rmdir /s /q %~dp0\out
mkdir %~dp0\out

node.exe -v > nul || PATH=%PATH%;%~dp0\tools
node node_modules\coffee-script\bin\coffee node_modules\docpad\bin\docpad run

