@echo off
rem Abre o site da Transportadora Azul no navegador (http://localhost:5600).
rem Deixe esta janela aberta enquanto estiver vendo o site. Para parar, feche a janela.
cd /d "%~dp0"
start "" http://localhost:5600/
node scripts\serve.mjs 5600
