@echo off
echo ========================================
echo    MestresMusic - Setup Completo
echo ========================================
echo.
echo Este script vai configurar todo o projeto automaticamente
echo Certifique-se de ter Node.js e PostgreSQL instalados
echo.
pause

echo 🔧 Configurando Backend...
call setup-backend.bat
if %errorlevel% neq 0 (
    echo ❌ Erro na configuracao do backend
    pause
    exit /b 1
)

echo.
echo 🎨 Configurando Frontend...
call setup-frontend.bat
if %errorlevel% neq 0 (
    echo ❌ Erro na configuracao do frontend
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🎉 SETUP COMPLETO FINALIZADO!
echo ========================================
echo.
echo 🚀 Para iniciar o sistema completo:
echo.
echo 1. Abra um terminal e execute:
echo    cd backend ^&^& npm run dev
echo.
echo 2. Abra outro terminal e execute:
echo    cd frontend ^&^& npm run dev
echo.
echo 🌐 URLs do sistema:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health
echo.
echo 🔑 Credenciais de teste:
echo    Admin:     admin@mestresmusic.com / 123456
echo    Aluno:     aluno1@teste.com / 123456
echo    Professor: professor1@teste.com / 123456
echo.
echo 📚 Documentacao disponivel em:
echo    docs/INTEGRACAO_BACKEND_FRONTEND_CORRIGIDA.md
echo.
pause