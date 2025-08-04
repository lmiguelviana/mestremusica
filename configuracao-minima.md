# ⚡ Configuração Mínima - MestresMusic

## 🚀 Setup Rápido (5 minutos)

### **1. Pré-requisitos**
- ✅ Node.js 18+ instalado
- ✅ PostgreSQL instalado e rodando
- ✅ Git instalado

### **2. Configuração Automática (Windows)**
```bash
# Clone o projeto
git clone https://github.com/lmiguelviana/mestremusica.git
cd mestremusica

# Execute o setup completo
setup-completo.bat

# Inicie o sistema
iniciar-sistema.bat
```

### **3. Configuração Manual**

#### **Backend (.env)**
```env
# Banco de dados (OBRIGATÓRIO)
DATABASE_URL="postgresql://postgres:senha@localhost:5432/mestresmusic"

# JWT (OBRIGATÓRIO)
JWT_SECRET="minha-chave-super-secreta-com-mais-de-32-caracteres-para-jwt"

# Servidor
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Stripe (OPCIONAL para testes)
STRIPE_SECRET_KEY="sk_test_sua_chave_stripe"
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret"
```

#### **Frontend (.env.local)**
```env
# API (OBRIGATÓRIO)
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Stripe (OPCIONAL)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publica_stripe"

# App
NEXT_PUBLIC_APP_NAME="MestresMusic"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **4. Comandos de Setup**
```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run dev

# Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

### **5. Teste o Sistema**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001/health
- **Login:** professor1@teste.com / 123456

---

## 🔧 Configuração do PostgreSQL

### **Opção 1: PostgreSQL Local**
```sql
-- Conecte no PostgreSQL e execute:
CREATE DATABASE mestresmusic;
CREATE USER mestresmusic WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE mestresmusic TO mestresmusic;
```

**DATABASE_URL:**
```
postgresql://mestresmusic:senha123@localhost:5432/mestresmusic
```

### **Opção 2: Neon Database (Grátis)**
1. Acesse: https://neon.tech
2. Crie conta gratuita
3. Crie novo projeto
4. Copie a CONNECTION STRING
5. Use no DATABASE_URL

### **Opção 3: Docker PostgreSQL**
```bash
docker run --name mestresmusic-db -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=mestresmusic -p 5432:5432 -d postgres:15
```

---

## 🎯 Configuração Mínima para Funcionar

### **Apenas para testar (sem pagamentos):**
```env
# backend/.env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/mestresmusic"
JWT_SECRET="chave-secreta-com-pelo-menos-32-caracteres-aqui"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### **Para produção completa:**
- Adicione chaves do Stripe
- Configure SendGrid para emails
- Configure AWS S3 para uploads

---

## 🆘 Problemas Comuns

### **Erro: "relation does not exist"**
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### **Erro: "JWT_SECRET not configured"**
- Verifique se JWT_SECRET tem pelo menos 32 caracteres
- Reinicie o servidor backend

### **Erro: "ECONNREFUSED 5432"**
- PostgreSQL não está rodando
- Verifique DATABASE_URL
- Teste conexão: `psql -h localhost -U postgres`

### **Erro: "Module not found"**
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

---

## ✅ Checklist de Funcionamento

- [ ] PostgreSQL rodando
- [ ] Backend iniciado (porta 3001)
- [ ] Frontend iniciado (porta 3000)
- [ ] Health check: http://localhost:3001/health
- [ ] Login funciona: professor1@teste.com / 123456
- [ ] Dashboard carrega sem erros
- [ ] Busca de professores funciona

---

**🎉 Sistema funcionando? Parabéns!**
**❌ Ainda com problemas? Verifique os logs dos terminais**