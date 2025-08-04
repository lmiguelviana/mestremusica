@echo off
title MestresMusic - Verificação do Sistema
color 0B

echo.
echo ========================================
echo    🔍 MESTRESMUSIC - VERIFICAÇÃO
echo ========================================
echo.

echo 📋 Verificando estrutura do projeto...
echo.

REM Verificar pastas principais
if exist "backend" (
    echo ✅ Pasta backend encontrada
) else (
    echo ❌ Pasta backend NÃO encontrada
)

if exist "frontend" (
    echo ✅ Pasta frontend encontrada
) else (
    echo ❌ Pasta frontend NÃO encontrada
)

if exist "docs" (
    echo ✅ Pasta docs encontrada
) else (
    echo ❌ Pasta docs NÃO encontrada
)

echo.
echo 📦 Verificando dependências...
echo.

REM Verificar node_modules
if exist "backend\node_modules" (
    echo ✅ Dependências do backend instaladas
) else (
    echo ❌ Dependências do backend NÃO instaladas
    echo 💡 Execute: cd backend && npm install
)

if exist "frontend\node_modules" (
    echo ✅ Dependências do frontend instaladas
) else (
    echo ❌ Dependências do frontend NÃO instaladas
    echo 💡 Execute: cd frontend && npm install
)

echo.
echo 🔧 Verificando arquivos de configuração...
echo.

REM Verificar arquivos .env
if exist "backend\.env" (
    echo ✅ Arquivo backend\.env encontrado
) else (
    echo ⚠️  Arquivo backend\.env NÃO encontrado
    if exist "backend\.env.example" (
        echo 💡 Arquivo de exemplo disponível: backend\.env.example
    )
)

if exist "frontend\.env.local" (
    echo ✅ Arquivo frontend\.env.local encontrado
) else (
    echo ⚠️  Arquivo frontend\.env.local NÃO encontrado
    if exist "frontend\.env.local.example" (
        echo 💡 Arquivo de exemplo disponível: frontend\.env.local.example
    )
)

echo.
echo 🗄️  Verificando banco de dados...
echo.

if exist "backend\prisma\schema.prisma" (
    echo ✅ Schema do Prisma encontrado
) else (
    echo ❌ Schema do Prisma NÃO encontrado
)

if exist "backend\prisma\migrations" (
    echo ✅ Pasta de migrações encontrada
) else (
    echo ❌ Pasta de migrações NÃO encontrada
)

echo.
echo 🌐 Verificando se os serviços estão rodando...
echo.

REM Verificar se as portas estão em uso
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo ✅ Frontend rodando na porta 3000
) else (
    echo ⚠️  Frontend NÃO está rodando na porta 3000
)

netstat -ano | findstr :3001 >nul
if not errorlevel 1 (
    echo ✅ Backend rodando na porta 3001
) else (
    echo ⚠️  Backend NÃO está rodando na porta 3001
)

echo.
echo 📚 Verificando documentação...
echo.

if exist "docs\DOCUMENTACAO_COMPLETA_IMPLEMENTACAO.md" (
    echo ✅ Documentação completa disponível
) else (
    echo ❌ Documentação completa NÃO encontrada
)

if exist "docs\CONFIGURACAO_PAGAMENTOS.md" (
    echo ✅ Guia de pagamentos disponível
) else (
    echo ❌ Guia de pagamentos NÃO encontrado
)

if exist "docs\GUIA_DEPLOY_PRODUCAO.md" (
    echo ✅ Guia de deploy disponível
) else (
    echo ❌ Guia de deploy NÃO encontrado
)

echo.
echo 🎯 Verificando arquivos principais...
echo.

REM Verificar arquivos principais do backend
if exist "backend\src\server.ts" (
    echo ✅ Servidor backend encontrado
) else (
    echo ❌ Servidor backend NÃO encontrado
)

if exist "backend\package.json" (
    echo ✅ Package.json do backend encontrado
) else (
    echo ❌ Package.json do backend NÃO encontrado
)

REM Verificar arquivos principais do frontend
if exist "frontend\src\pages\index.tsx" (
    echo ✅ Página inicial do frontend encontrada
) else (
    echo ❌ Página inicial do frontend NÃO encontrada
)

if exist "frontend\package.json" (
    echo ✅ Package.json do frontend encontrado
) else (
    echo ❌ Package.json do frontend NÃO encontrado
)

echo.
echo ========================================
echo    🎵 VERIFICAÇÃO CONCLUÍDA
echo ========================================
echo.

echo 💡 Comandos disponíveis:
echo    - iniciar-mestresmusic.bat (Iniciar sistema)
echo    - parar-mestresmusic.bat (Parar sistema)
echo    - verificar-sistema.bat (Esta verificação)
echo.

pause