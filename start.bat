@echo off
REM Avvia frontend con Angular
start cmd /k "cd /d %~dp0Frontend\streetcats && npm start"

REM Avvio backend con Node
start cmd /k "cd /d %~dp0backend && npm start"