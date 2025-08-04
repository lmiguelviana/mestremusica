@echo off
title MestresMusic - Parar Sistema
color 0C

echo.
echo ========================================
echo    🛑 MESTRESMUSIC - PARAR SISTEMA
echo ========================================
echo.

echo 🔍 Procurando processos do MestresMusic...
echo.

REM Matar processos Node.js que podem estar rodando o sistema
echo 🔧 Parando processos do backend...
taskkill /f /im node.exe 2>nul
if errorlevel 1 (
    echo ⚠️  Nenhum processo Node.js encontrado
) else (
    echo ✅ Processos Node.js finalizados
)

echo.
echo 🎨 Parando processos do frontend...
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq MestresMusic*" 2>nul

echo.
echo 🧹 Limpando processos na porta 3000 e 3001...
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /f /pid %%a 2>nul
    )
    echo ✅ Porta 3000 liberada
)

netstat -ano | findstr :3001 >nul
if not errorlevel 1 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /f /pid %%a 2>nul
    )
    echo ✅ Porta 3001 liberada
)

echo.
echo ✅ Sistema MestresMusic parado com sucesso!
echo.
echo 💡 Para iniciar novamente, execute: iniciar-mestresmusic.bat
echo.

pause