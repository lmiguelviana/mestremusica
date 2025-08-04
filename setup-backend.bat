@echo off
echo ========================================
echo    MestresMusic - Setup Backend
echo ========================================
echo.

cd backend

echo 📦 Instalando dependencias do backend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas com sucesso!
echo.

echo 📄 Copiando arquivo de configuracao...
if not exist .env (
    copy .env.example .env
    echo ✅ Arquivo .env criado!
    echo.
    echo ⚠️  IMPORTANTE: Configure as variaveis no arquivo backend\.env
    echo    - DATABASE_URL: URL do seu banco PostgreSQL
    echo    - JWT_SECRET: Chave secreta com pelo menos 32 caracteres
    echo    - STRIPE_SECRET_KEY: Chave secreta do Stripe (opcional para testes)
    echo.
    echo 📝 Exemplo de configuracao minima:
    echo DATABASE_URL="postgresql://username:password@localhost:5432/mestresmusic"
    echo JWT_SECRET="sua-chave-super-secreta-com-pelo-menos-32-caracteres"
    echo.
    pause
) else (
    echo ✅ Arquivo .env ja existe!
)
echo.

echo 🗄️  Configurando banco de dados...
echo Executando migracoes...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ Erro ao executar migracoes
    echo Verifique se o DATABASE_URL esta correto no arquivo .env
    pause
    exit /b 1
)
echo ✅ Migracoes executadas!
echo.

echo 🔧 Gerando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar cliente Prisma
    pause
    exit /b 1
)
echo ✅ Cliente Prisma gerado!
echo.

echo 🌱 Populando banco com dados de teste...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ Erro ao popular banco de dados
    pause
    exit /b 1
)
echo ✅ Banco populado com dados de teste!
echo.

echo ========================================
echo ✅ BACKEND CONFIGURADO COM SUCESSO!
echo ========================================
echo.
echo 🔑 Credenciais de teste criadas:
echo    Admin: admin@mestresmusic.com / 123456
echo    Aluno: aluno1@teste.com / 123456
echo    Professor: professor1@teste.com / 123456
echo.
echo 🚀 Para iniciar o servidor backend:
echo    cd backend
echo    npm run dev
echo.
echo 🌐 O backend estara disponivel em:
echo    http://localhost:3001
echo    Health check: http://localhost:3001/health
echo.
pause