@echo off
REM Avvia il frontend con Angular
start cmd /k "cd /d %~dp0Frontend\streetcats && ng serve"

REM Avvia il backend con Node
start cmd /k "cd /d %~dp0backend && npm start"

REM start cmd /k apre una nuova finestra di terminale e mantiene la finestra aperta dopo l'esecuzione del comando.