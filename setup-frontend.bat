@echo off
echo ========================================
echo    MestresMusic - Setup Frontend
echo ========================================
echo.

cd frontend

echo 📦 Instalando dependencias do frontend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas com sucesso!
echo.

echo 📄 Copiando arquivo de configuracao...
if not exist .env.local (
    copy .env.local.example .env.local
    echo ✅ Arquivo .env.local criado!
    echo.
    echo ⚠️  IMPORTANTE: Configure as variaveis no arquivo frontend\.env.local
    echo    - NEXT_PUBLIC_API_URL: URL da API backend
    echo    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Chave publica do Stripe (opcional)
    echo.
    echo 📝 Configuracao padrao ja aplicada:
    echo NEXT_PUBLIC_API_URL="http://localhost:3001"
    echo.
) else (
    echo ✅ Arquivo .env.local ja existe!
)
echo.

echo ========================================
echo ✅ FRONTEND CONFIGURADO COM SUCESSO!
echo ========================================
echo.
echo 🚀 Para iniciar o servidor frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 🌐 O frontend estara disponivel em:
echo    http://localhost:3000
echo.
echo 📋 Proximos passos:
echo    1. Execute setup-backend.bat (se ainda nao fez)
echo    2. Inicie o backend: cd backend ^&^& npm run dev
echo    3. Inicie o frontend: cd frontend ^&^& npm run dev
echo.
pause