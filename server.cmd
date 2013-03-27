@echo off
@setlocal 

if exist %~dp0\out rmdir /s /q %~dp0\out
mkdir %~dp0\out

PATH=%~dp0\tools;%PATH%;
set NODE_PATH=%~dp0\

node node_modules\coffee-script\bin\coffee node_modules\docpad\bin\docpad run

