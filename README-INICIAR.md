# 🚀 Como Iniciar o MestresMusic

## 📁 Arquivos .bat Criados

### **🎯 iniciar-mestresmusic.bat**
**Inicia todo o sistema automaticamente**

- ✅ Verifica se as pastas existem
- ✅ Instala dependências se necessário
- ✅ Cria arquivos .env se não existirem
- ✅ Aplica migrações do banco
- ✅ Inicia backend na porta 3001
- ✅ Inicia frontend na porta 3000
- ✅ Abre em janelas separadas

### **🛑 parar-mestresmusic.bat**
**Para todo o sistema**

- ✅ Finaliza processos Node.js
- ✅ Libera portas 3000 e 3001
- ✅ Limpa processos em execução

### **🔍 verificar-sistema.bat**
**Verifica se tudo está configurado**

- ✅ Checa estrutura de pastas
- ✅ Verifica dependências instaladas
- ✅ Confere arquivos de configuração
- ✅ Testa conexões de banco
- ✅ Verifica se serviços estão rodando

---

## 🎯 **Como Usar**

### **1. Primeira Execução**
```bash
# 1. Execute a verificação
verificar-sistema.bat

# 2. Inicie o sistema
iniciar-mestresmusic.bat
```

### **2. Uso Diário**
```bash
# Iniciar
iniciar-mestresmusic.bat

# Parar
parar-mestresmusic.bat
```

---

## 🌐 **URLs do Sistema**

Após iniciar com `iniciar-mestresmusic.bat`:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Documentação:** Pasta `docs/`

---

## ⚙️ **Configuração Inicial**

### **1. Configurar Backend (.env)**
Edite o arquivo `backend/.env`:

```env
# Database (Neon)
DATABASE_URL="sua_url_do_neon_aqui"
DIRECT_URL="sua_url_direta_do_neon_aqui"

# JWT
JWT_SECRET="seu-jwt-secret-super-seguro"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro"

# Stripe (Teste)
STRIPE_SECRET_KEY="sk_test_sua_chave_stripe"
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret"
```

### **2. Configurar Frontend (.env.local)**
Edite o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_stripe
```

---

## 🔧 **Solução de Problemas**

### **Erro: "Pasta não encontrada"**
- Certifique-se de estar na pasta raiz do projeto
- Verifique se as pastas `backend` e `frontend` existem

### **Erro: "Dependências não instaladas"**
- Execute `verificar-sistema.bat` primeiro
- O script `iniciar-mestresmusic.bat` instala automaticamente

### **Erro: "Porta em uso"**
- Execute `parar-mestresmusic.bat` primeiro
- Ou reinicie o computador

### **Erro: "Banco de dados"**
- Verifique se o arquivo `.env` está configurado
- Confirme se a URL do Neon está correta
- Execute as migrações manualmente: `cd backend && npx prisma migrate dev`

---

## 📚 **Documentação Completa**

Após iniciar o sistema, consulte:

- `docs/DOCUMENTACAO_COMPLETA_IMPLEMENTACAO.md`
- `docs/CONFIGURACAO_PAGAMENTOS.md`
- `docs/GUIA_DEPLOY_PRODUCAO.md`
- `docs/SISTEMA_COMPLETO_RESUMO.md`

---

## 🎉 **Sistema Pronto!**

Com estes arquivos .bat, você pode:

- ✅ **Iniciar** o sistema completo com 1 clique
- ✅ **Parar** todos os serviços facilmente
- ✅ **Verificar** se tudo está funcionando
- ✅ **Desenvolver** sem complicações

**Duplo clique em `iniciar-mestresmusic.bat` e comece a usar! 🚀**