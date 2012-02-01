@echo off

node.exe -v > nul || PATH=%PATH%;%~dp0\tools
node node_modules\coffee-script\bin\coffee node_modules\docpad\bin\docpad generate

