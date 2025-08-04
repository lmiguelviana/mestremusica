# 🚀 Guia Completo de Deploy - MestresMusic

## 🎯 **Objetivo: Colocar a Plataforma no Ar Esta Semana**

Este guia vai te levar do código local para uma plataforma funcionando na internet, processando pagamentos reais e gerando receita.

---

## 📋 **Checklist Pré-Deploy**

### **✅ Verificações Locais**
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Backend rodando em `http://localhost:3001`
- [ ] Banco de dados conectado (Neon)
- [ ] Todas as migrações aplicadas
- [ ] Sistema de pagamentos testado localmente

### **🔧 Contas Necessárias**
- [ ] Conta no Stripe (stripe.com)
- [ ] Conta na Vercel (vercel.com) - Frontend
- [ ] Conta no Railway (railway.app) - Backend
- [ ] Domínio personalizado (opcional)

---

## 🏗️ **Passo 1: Configurar Stripe para Produção**

### **1.1 Criar Conta Stripe**
1. Acesse [stripe.com](https://stripe.com)
2. Clique em "Criar conta"
3. Preencha os dados da sua empresa
4. Complete a verificação de identidade

### **1.2 Configurar Webhooks**
1. No dashboard do Stripe, vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   - **URL:** `https://seu-backend.railway.app/api/payments/webhook/stripe`
   - **Events:** Selecione:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Copie o **Webhook Secret** (whsec_...)

### **1.3 Obter Chaves de API**
1. Vá em **Developers > API keys**
2. Copie:
   - **Publishable key** (pk_live_...)
   - **Secret key** (sk_live_...)

---

## 🌐 **Passo 2: Deploy do Backend (Railway)**

### **2.1 Preparar o Backend**
```bash
cd backend
```

### **2.2 Criar railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health"
  }
}
```

### **2.3 Adicionar Scripts no package.json**
```json
{
  "scripts": {
    "build": "tsc",
    "start:prod": "node dist/server.js",
    "postinstall": "npx prisma generate && npx prisma migrate deploy"
  }
}
```

### **2.4 Deploy no Railway**
1. Acesse [railway.app](https://railway.app)
2. Conecte sua conta GitHub
3. Clique em **New Project > Deploy from GitHub repo**
4. Selecione seu repositório
5. Escolha a pasta `backend`
6. Configure as variáveis de ambiente:

```env
# Database (já configurado no Neon)
DATABASE_URL=sua_url_do_neon
DIRECT_URL=sua_url_direta_do_neon

# JWT
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui

# Stripe PRODUÇÃO
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# Configurações
NODE_ENV=production
PORT=3001
```

7. Clique em **Deploy**
8. Anote a URL do seu backend: `https://seu-backend.railway.app`

---

## 🎨 **Passo 3: Deploy do Frontend (Vercel)**

### **3.1 Preparar o Frontend**
```bash
cd frontend
```

### **3.2 Configurar next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### **3.3 Deploy na Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Clique em **New Project**
4. Selecione seu repositório
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
6. Configure as variáveis de ambiente:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica
```

7. Clique em **Deploy**
8. Anote a URL do seu frontend: `https://seu-projeto.vercel.app`

---

## 🔄 **Passo 4: Configurar CORS e Integrações**

### **4.1 Atualizar CORS no Backend**
No arquivo `backend/src/server.ts`, configure:

```typescript
app.use(cors({
  origin: [
    'https://seu-projeto.vercel.app',
    'http://localhost:3000' // Para desenvolvimento
  ],
  credentials: true
}));
```

### **4.2 Atualizar Webhook URL no Stripe**
1. Volte ao dashboard do Stripe
2. Vá em **Developers > Webhooks**
3. Edite o endpoint criado
4. Atualize a URL para: `https://seu-backend.railway.app/api/payments/webhook/stripe`

---

## 🧪 **Passo 5: Testes em Produção**

### **5.1 Teste Completo do Fluxo**
1. Acesse sua plataforma: `https://seu-projeto.vercel.app`
2. Cadastre-se como professor
3. Crie um perfil completo
4. Teste o agendamento de aula
5. Teste o pagamento com cartão de teste:
   - **Cartão:** 4242 4242 4242 4242
   - **CVC:** 123
   - **Data:** 12/34

### **5.2 Verificar Logs**
- **Railway:** Vá no dashboard e verifique os logs
- **Vercel:** Vá na aba Functions e verifique erros
- **Stripe:** Vá em Developers > Logs

---

## 🎯 **Passo 6: Configurar Domínio Personalizado (Opcional)**

### **6.1 Comprar Domínio**
- Registro.br (para .com.br)
- GoDaddy, Namecheap (para .com)

### **6.2 Configurar DNS**
1. **Frontend (Vercel):**
   - Adicione domínio no projeto Vercel
   - Configure DNS: CNAME para vercel-dns.com

2. **Backend (Railway):**
   - Adicione domínio customizado no Railway
   - Configure DNS: CNAME para railway.app

---

## 📊 **Passo 7: Monitoramento e Analytics**

### **7.1 Configurar Monitoramento**
```bash
# Instalar ferramentas de monitoramento
npm install @sentry/nextjs @sentry/node
```

### **7.2 Google Analytics (Opcional)**
1. Crie conta no Google Analytics
2. Adicione o tracking ID nas variáveis de ambiente
3. Configure eventos de conversão

---

## 🚀 **Passo 8: Lançamento Soft**

### **8.1 Teste com Usuários Beta**
1. Recrute 5-10 professores de música
2. Ofereça 1 mês gratuito
3. Colete feedback
4. Ajuste problemas

### **8.2 Primeiros Pagamentos Reais**
1. Configure Stripe para modo live
2. Processe os primeiros pagamentos
3. Monitore as comissões (10%)
4. Verifique transferências bancárias

---

## 💰 **Passo 9: Começar a Faturar**

### **9.1 Estratégia de Lançamento**
1. **Semana 1:** Testes beta com 5 professores
2. **Semana 2:** Lançamento para 20 professores
3. **Semana 3:** Marketing digital básico
4. **Semana 4:** Análise de métricas e otimização

### **9.2 Metas Iniciais**
- **Mês 1:** 10 professores ativos, 50 aulas
- **Mês 2:** 25 professores ativos, 150 aulas
- **Mês 3:** 50 professores ativos, 400 aulas

### **9.3 Receita Projetada**
- **Ticket médio:** R$ 80/aula
- **Comissão:** 10% = R$ 8/aula
- **Meta mês 1:** R$ 400 de receita
- **Meta mês 3:** R$ 3.200 de receita

---

## 🔧 **Comandos Úteis para Deploy**

### **Verificar Status**
```bash
# Verificar build do frontend
cd frontend && npm run build

# Verificar build do backend
cd backend && npm run build

# Testar produção localmente
npm run start:prod
```

### **Logs e Debug**
```bash
# Ver logs do Railway
railway logs

# Ver logs da Vercel
vercel logs

# Testar webhook localmente
stripe listen --forward-to localhost:3001/api/payments/webhook/stripe
```

---

## 🆘 **Troubleshooting Comum**

### **Erro de CORS**
- Verifique se as URLs estão corretas no CORS
- Confirme se as variáveis de ambiente estão configuradas

### **Webhook não funciona**
- Verifique se a URL do webhook está acessível
- Confirme o webhook secret
- Verifique logs do backend

### **Pagamento não confirma**
- Verifique se o webhook foi recebido
- Confirme se o lessonId está correto
- Verifique logs de erro no Stripe

### **Build falha**
- Verifique se todas as dependências estão no package.json
- Confirme se as variáveis de ambiente estão configuradas
- Verifique se o TypeScript compila sem erros

---

## ✅ **Checklist Final de Deploy**

### **Backend**
- [ ] Deploy no Railway funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados conectado
- [ ] Webhooks do Stripe funcionando
- [ ] CORS configurado corretamente

### **Frontend**
- [ ] Deploy na Vercel funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Integração com backend funcionando
- [ ] Stripe carregando corretamente
- [ ] Todas as páginas acessíveis

### **Integrações**
- [ ] Stripe configurado para produção
- [ ] Webhooks recebendo eventos
- [ ] Pagamentos sendo processados
- [ ] Emails sendo enviados (se configurado)
- [ ] WhatsApp redirecionando corretamente

### **Testes**
- [ ] Cadastro de professor funcionando
- [ ] Busca de professores funcionando
- [ ] Agendamento de aula funcionando
- [ ] Pagamento com cartão funcionando
- [ ] Dashboard financeiro funcionando
- [ ] Responsividade em mobile

---

## 🎉 **Parabéns!**

Seguindo este guia, sua plataforma estará **no ar e processando pagamentos reais** em poucos dias!

**Próximos passos após o deploy:**
1. Recrutar primeiros professores
2. Processar primeiros pagamentos
3. Coletar feedback dos usuários
4. Otimizar baseado nos dados
5. Escalar o marketing

**Sua plataforma está pronta para gerar receita real! 💰🚀**

---

**Criado em:** Janeiro 2025  
**Status:** Guia Completo de Deploy  
**Tempo Estimado:** 2-3 dias para deploy completo  
**Resultado:** Plataforma funcionando e faturando! 🎯