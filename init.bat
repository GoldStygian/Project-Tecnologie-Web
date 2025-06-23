@echo off
cd /d "%~dp0Frontend\streetcats"
echo === Installazione dipendenze frontend ===
npm install

cd /d "%~dp0backend"
echo === Installazione dipendenze backend ===
npm install