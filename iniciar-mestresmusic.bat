@echo off
title MestresMusic - Sistema Completo
color 0A

echo.
echo ========================================
echo    🎵 MESTRESMUSIC - SISTEMA COMPLETO
echo ========================================
echo.
echo 🚀 Iniciando o sistema...
echo.

REM Verificar se as pastas existem
if not exist "backend" (
    echo ❌ Pasta 'backend' não encontrada!
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Pasta 'frontend' não encontrada!
    pause
    exit /b 1
)

echo 📦 Verificando dependências...
echo.

REM Verificar se node_modules existe no backend
if not exist "backend\node_modules" (
    echo 📥 Instalando dependências do backend...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências do backend!
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Dependências do backend instaladas!
    echo.
)

REM Verificar se node_modules existe no frontend
if not exist "frontend\node_modules" (
    echo 📥 Instalando dependências do frontend...
    cd frontend
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências do frontend!
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Dependências do frontend instaladas!
    echo.
)

echo 🔧 Verificando configurações...
echo.

REM Verificar arquivo .env do backend
if not exist "backend\.env" (
    echo ⚠️  Arquivo .env não encontrado no backend!
    echo 📋 Copiando arquivo de exemplo...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✅ Arquivo .env criado! Configure suas variáveis.
    ) else (
        echo ❌ Arquivo .env.example não encontrado!
        echo 💡 Crie o arquivo backend\.env com suas configurações.
    )
    echo.
)

REM Verificar arquivo .env.local do frontend
if not exist "frontend\.env.local" (
    echo ⚠️  Arquivo .env.local não encontrado no frontend!
    echo 📋 Copiando arquivo de exemplo...
    if exist "frontend\.env.local.example" (
        copy "frontend\.env.local.example" "frontend\.env.local" >nul
        echo ✅ Arquivo .env.local criado! Configure suas variáveis.
    ) else (
        echo ❌ Arquivo .env.local.example não encontrado!
        echo 💡 Crie o arquivo frontend\.env.local com suas configurações.
    )
    echo.
)

echo 🗄️  Aplicando migrações do banco de dados...
cd backend
call npx prisma migrate deploy
if errorlevel 1 (
    echo ⚠️  Erro ao aplicar migrações. Continuando...
)
call npx prisma generate
cd ..
echo.

echo 🎯 Iniciando serviços...
echo.
echo 📍 Backend rodará em: http://localhost:3001
echo 📍 Frontend rodará em: http://localhost:3000
echo.
echo ⚡ Pressione Ctrl+C para parar os serviços
echo.

REM Criar arquivo temporário para controlar os processos
echo. > temp_processes.txt

REM Iniciar backend em nova janela
start "MestresMusic Backend" cmd /k "cd backend && echo 🔧 Iniciando Backend... && npm run dev"

REM Aguardar 3 segundos
timeout /t 3 /nobreak >nul

REM Iniciar frontend em nova janela
start "MestresMusic Frontend" cmd /k "cd frontend && echo 🎨 Iniciando Frontend... && npm run dev"

echo ✅ Serviços iniciados com sucesso!
echo.
echo 🌐 Acesse: http://localhost:3000
echo 📊 API: http://localhost:3001
echo.
echo 📚 Documentação disponível em:
echo    - docs/DOCUMENTACAO_COMPLETA_IMPLEMENTACAO.md
echo    - docs/CONFIGURACAO_PAGAMENTOS.md
echo    - docs/GUIA_DEPLOY_PRODUCAO.md
echo.
echo 💡 Para parar o sistema, feche as janelas do backend e frontend
echo.
echo ========================================
echo    🎵 MESTRESMUSIC RODANDO COM SUCESSO!
echo ========================================
echo.

pause