# Solução para Erro de Conexão com Banco Neon

## Problema Identificado
O banco de dados Neon PostgreSQL não está acessível no endpoint:
`ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech:5432`

## Possíveis Causas
1. **Banco pausado**: Bancos Neon gratuitos são pausados após 5 minutos de inatividade
2. **Endpoint desatualizado**: O endpoint pode ter mudado
3. **Problemas de conectividade**: Firewall ou problemas de rede

## Soluções

### Opção 1: Reativar Banco Neon (Recomendado)
1. Acesse o [Console Neon](https://console.neon.tech/)
2. Faça login na sua conta
3. Selecione seu projeto
4. Verifique se o banco está pausado e clique em "Resume" se necessário
5. Copie a nova connection string se ela mudou
6. Atualize o arquivo `.env` com a nova URL

### Opção 2: Usar PostgreSQL Local (Desenvolvimento)
Se você quiser usar um banco local para desenvolvimento:

```bash
# Instalar PostgreSQL localmente
# Windows: https://www.postgresql.org/download/windows/
# Ou usar Docker:
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mestresmusic -p 5432:5432 -d postgres:15
```

Depois atualize o `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mestresmusic?schema=public"
```

### Opção 3: Usar Supabase (Alternativa Gratuita)
Supabase oferece PostgreSQL gratuito com melhor disponibilidade:

1. Crie conta em https://supabase.com/
2. Crie um novo projeto
3. Copie a connection string
4. Atualize o `.env`

## Comandos para Testar Conexão

```bash
# Testar conexão
npx prisma db push

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Visualizar banco (opcional)
npx prisma studio
```

## Próximos Passos
1. Escolha uma das opções acima
2. Atualize a DATABASE_URL no arquivo `.env`
3. Execute `npx prisma db push` para sincronizar o schema
4. Execute `npx prisma generate` para gerar o cliente
5. Reinicie o servidor com `npm run dev`