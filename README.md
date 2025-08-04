# MestresMusic

**Conectando você aos mestres da música**

MestresMusic é uma plataforma SaaS que funciona como um marketplace conectando alunos e professores de música no Brasil. Oferece um ambiente integrado e moderno para descoberta, agendamento, pagamento e comunicação.

## 🎵 Características

- **Design Moderno**: Interface elegante com tema escuro e acentos laranja
- **Portfólio Completo**: Professores podem exibir certificações, materiais PDF e links do YouTube
- **Agendamento Inteligente**: Sistema de calendário com disponibilidade em tempo real
- **Pagamentos Seguros**: Integração com Stripe para transações seguras
- **Busca Avançada**: Filtros por instrumento, estilo, preço e localização

## 🏗️ Arquitetura

### Backend
- **Node.js** + **TypeScript** + **Express.js**
- **Prisma ORM** + **PostgreSQL** (Neon Database)
- **JWT** para autenticação
- **Stripe** para pagamentos
- **AWS S3** para armazenamento de arquivos

### Frontend
- **React 18** + **Next.js 14** + **TypeScript**
- **Tailwind CSS** com tema customizado
- **Zustand** para gerenciamento de estado
- **React Query** para cache de dados

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- PostgreSQL (ou conta Neon Database)
- Conta Stripe (para pagamentos)
- Conta AWS (para armazenamento)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd mestresmusic
```

2. **Configure o Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
```

3. **Configure o Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure as variáveis de ambiente no .env.local
```

4. **Configure o Banco de Dados**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

5. **Execute em Desenvolvimento**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Estrutura do Projeto

```
mestresmusic/
├── backend/
│   ├── src/
│   │   ├── modules/          # Módulos de funcionalidade
│   │   ├── shared/           # Utilitários compartilhados
│   │   ├── database/         # Configuração do banco
│   │   └── config/           # Configurações
│   ├── prisma/               # Schema e migrações
│   └── tests/                # Testes
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas Next.js
│   │   ├── hooks/            # Hooks customizados
│   │   ├── services/         # Serviços de API
│   │   └── types/            # Tipos TypeScript
│   └── public/               # Arquivos estáticos
└── docs/                     # Documentação
```

## 🎨 Design System

### Cores
- **Fundo Principal**: `#0a0a0a` (Preto profundo)
- **Fundo Secundário**: `#1a1a1a` (Cinza escuro)
- **Cards**: `#2a2a2a` (Cinza médio)
- **Accent Principal**: `#ff6b35` (Laranja vibrante)
- **Texto**: `#ffffff` (Branco)

### Tipografia
- **Fonte**: Inter (sans-serif)
- **Hierarquia**: Títulos em branco, subtítulos em cinza claro

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Executar build de produção
npm run test         # Executar testes
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:seed      # Popular banco com dados iniciais
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar build de produção
npm run lint         # Linting
npm run type-check   # Verificação de tipos
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

MestresMusic Team - contato@mestresmusic.com

Link do Projeto: [https://github.com/mestresmusic/platform](https://github.com/mestresmusic/platform)