@echo off
echo ========================================
echo    MestresMusic - Iniciar Sistema
echo ========================================
echo.

echo Verificando se o sistema foi configurado...

if not exist "backend\.env" (
    echo ❌ Backend nao configurado!
    echo Execute setup-backend.bat primeiro
    pause
    exit /b 1
)

if not exist "frontend\.env.local" (
    echo ❌ Frontend nao configurado!
    echo Execute setup-frontend.bat primeiro
    pause
    exit /b 1
)

echo ✅ Sistema configurado!
echo.
echo 🚀 Iniciando Backend e Frontend...
echo.
echo ⚠️  Dois terminais serao abertos:
echo    - Terminal 1: Backend (porta 3001)
echo    - Terminal 2: Frontend (porta 3000)
echo.
echo Aguarde alguns segundos para os servidores iniciarem...
echo.

REM Iniciar backend em nova janela
start "MestresMusic Backend" cmd /k "cd backend && npm run dev"

REM Aguardar 3 segundos
timeout /t 3 /nobreak >nul

REM Iniciar frontend em nova janela
start "MestresMusic Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Servidores iniciados!
echo.
echo 🌐 Acesse o sistema em:
echo    http://localhost:3000
echo.
echo 🔑 Credenciais de teste:
echo    Professor: professor1@teste.com / 123456
echo    Aluno:     aluno1@teste.com / 123456
echo.
echo Para parar os servidores, feche as janelas dos terminais
echo ou pressione Ctrl+C em cada uma
echo.
pause