# Requirements Document

## Introduction

**MestresMusic** é uma plataforma SaaS de escola de música que funciona como um marketplace conectando alunos e mestres da música no Brasil, oferecendo um ambiente integrado para descoberta, agendamento, pagamento e comunicação. Similar ao modelo do iFood, a plataforma facilita a conexão direta entre quem quer aprender música e quem ensina, proporcionando uma experiência completa e profissional para ambos os lados.

O sistema será acessível via navegador web, sem necessidade de instalação local, operando com modelo de receita baseado em comissões sobre as aulas agendadas e assinaturas premium para professores.

## Requirements

### Requirement 1

**User Story:** Como um aluno interessado em aprender música, eu quero me cadastrar na plataforma, para que eu possa acessar professores e agendar aulas.

#### Acceptance Criteria

1. WHEN um visitante acessa a página de cadastro THEN o sistema SHALL exibir um formulário com campos para nome, email, senha e confirmação de senha
2. WHEN um visitante preenche todos os campos obrigatórios e submete o formulário THEN o sistema SHALL criar uma conta de aluno e enviar email de confirmação
3. WHEN um aluno confirma seu email THEN o sistema SHALL ativar a conta e redirecionar para o dashboard do aluno
4. IF um email já estiver cadastrado THEN o sistema SHALL exibir mensagem de erro informando que o email já existe

### Requirement 2

**User Story:** Como um professor de música, eu quero me cadastrar na plataforma, para que eu possa oferecer minhas aulas e gerenciar meus alunos.

#### Acceptance Criteria

1. WHEN um visitante seleciona cadastro como professor THEN o sistema SHALL exibir formulário com campos básicos (nome, email, senha) e campos específicos (instrumentos, experiência, biografia)
2. WHEN um professor completa o cadastro THEN o sistema SHALL criar o perfil com status "pendente de aprovação" e área de portfólio vazia
3. WHEN um administrador aprova um perfil de professor THEN o sistema SHALL ativar a conta e notificar o professor por email
4. WHEN um professor faz login pela primeira vez THEN o sistema SHALL redirecionar para configuração completa do perfil e portfólio

### Requirement 3

**User Story:** Como um aluno, eu quero buscar professores por instrumento e filtros, para que eu possa encontrar o professor ideal para minhas necessidades.

#### Acceptance Criteria

1. WHEN um aluno acessa a página de busca THEN o sistema SHALL exibir lista de professores aprovados com filtros disponíveis
2. WHEN um aluno aplica filtros (instrumento, preço, localização) THEN o sistema SHALL atualizar os resultados em tempo real
3. WHEN um aluno clica em um professor THEN o sistema SHALL exibir o perfil completo com informações, mídia e disponibilidade
4. IF nenhum professor corresponder aos filtros THEN o sistema SHALL exibir mensagem informativa

### Requirement 4

**User Story:** Como um aluno, eu quero agendar uma aula com um professor, para que eu possa ter uma sessão de ensino personalizada.

#### Acceptance Criteria

1. WHEN um aluno seleciona um horário disponível no calendário do professor THEN o sistema SHALL exibir formulário de agendamento com detalhes da aula
2. WHEN um aluno confirma o agendamento THEN o sistema SHALL criar a aula com status "pendente" e redirecionar para pagamento
3. WHEN o pagamento é processado com sucesso THEN o sistema SHALL confirmar a aula e notificar ambas as partes
4. IF o horário não estiver mais disponível THEN o sistema SHALL informar o conflito e sugerir horários alternativos

### Requirement 5

**User Story:** Como um aluno, eu quero pagar por uma aula de forma segura, para que eu possa confirmar meu agendamento.

#### Acceptance Criteria

1. WHEN um aluno é redirecionado para pagamento THEN o sistema SHALL exibir resumo da aula e opções de pagamento (cartão, PIX)
2. WHEN um aluno insere dados de pagamento válidos THEN o sistema SHALL processar a transação via gateway de pagamento
3. WHEN o pagamento é aprovado THEN o sistema SHALL confirmar a aula e exibir comprovante
4. IF o pagamento falhar THEN o sistema SHALL manter a aula como "pendente" e permitir nova tentativa

### Requirement 6

**User Story:** Como um professor, eu quero gerenciar minha disponibilidade, para que os alunos possam agendar aulas nos meus horários livres.

#### Acceptance Criteria

1. WHEN um professor acessa gerenciamento de disponibilidade THEN o sistema SHALL exibir calendário semanal editável
2. WHEN um professor define horários disponíveis THEN o sistema SHALL salvar a configuração e tornar os slots visíveis para agendamento
3. WHEN um professor bloqueia um horário THEN o sistema SHALL remover o slot da disponibilidade pública
4. WHEN uma aula é agendada THEN o sistema SHALL automaticamente bloquear o horário correspondente

### Requirement 7

**User Story:** Como um professor, eu quero visualizar minhas aulas agendadas e ganhos, para que eu possa gerenciar meu negócio.

#### Acceptance Criteria

1. WHEN um professor acessa seu dashboard THEN o sistema SHALL exibir próximas aulas, ganhos do mês e estatísticas básicas
2. WHEN um professor visualiza lista de aulas THEN o sistema SHALL mostrar detalhes (data, aluno, status, valor)
3. WHEN uma aula é concluída THEN o professor SHALL poder marcar como "realizada" no sistema
4. WHEN um professor acessa relatório de ganhos THEN o sistema SHALL exibir valores por período com desconto da comissão da plataforma

### Requirement 8

**User Story:** Como um aluno, eu quero visualizar minhas aulas agendadas e histórico, para que eu possa acompanhar meu progresso musical.

#### Acceptance Criteria

1. WHEN um aluno acessa seu dashboard THEN o sistema SHALL exibir próximas aulas e acesso rápido para buscar professores
2. WHEN um aluno visualiza histórico de aulas THEN o sistema SHALL mostrar aulas passadas com detalhes do professor e data
3. WHEN uma aula é concluída THEN o aluno SHALL poder avaliar o professor (funcionalidade futura)
4. WHEN um aluno favorita um professor THEN o sistema SHALL adicionar à lista de favoritos no dashboard

### Requirement 9

**User Story:** Como um administrador, eu quero gerenciar usuários e conteúdo da plataforma, para que eu possa manter a qualidade do serviço.

#### Acceptance Criteria

1. WHEN um administrador acessa o painel admin THEN o sistema SHALL exibir métricas gerais (usuários, aulas, receita)
2. WHEN um administrador visualiza lista de professores pendentes THEN o sistema SHALL permitir aprovar ou rejeitar perfis
3. WHEN um administrador acessa transações THEN o sistema SHALL exibir todos os pagamentos com filtros por data e status
4. WHEN um administrador bloqueia um usuário THEN o sistema SHALL desativar a conta e cancelar aulas futuras

### Requirement 10

**User Story:** Como um professor, eu quero gerenciar meu portfólio com materiais PDF e links do YouTube, para que eu possa mostrar meu trabalho e fornecer recursos aos alunos.

#### Acceptance Criteria

1. WHEN um professor acessa a seção de materiais THEN o sistema SHALL exibir interface para upload de PDFs com opções de visibilidade (público ou apenas alunos matriculados)
2. WHEN um professor faz upload de um PDF THEN o sistema SHALL armazenar o arquivo e permitir categorização (exercícios, teoria, partituras, métodos)
3. WHEN um professor adiciona link do YouTube THEN o sistema SHALL validar a URL e exibir preview do vídeo na seção de músicas do portfólio
4. WHEN um aluno não matriculado tenta acessar material restrito THEN o sistema SHALL exibir mensagem informando que o acesso é apenas para alunos matriculados
5. WHEN um professor organiza seu portfólio THEN o sistema SHALL permitir adicionar certificações, conquistas e formações com upload de comprovantes

### Requirement 11

**User Story:** Como um aluno, eu quero visualizar o portfólio completo do professor, para que eu possa avaliar sua qualificação antes de agendar uma aula.

#### Acceptance Criteria

1. WHEN um aluno acessa o perfil de um professor THEN o sistema SHALL exibir seções organizadas: Sobre, Portfólio, Materiais, Músicas, Avaliações e Disponibilidade
2. WHEN um aluno visualiza a seção de materiais THEN o sistema SHALL mostrar materiais públicos e indicar quantos materiais exclusivos estão disponíveis para alunos matriculados
3. WHEN um aluno acessa a seção de músicas THEN o sistema SHALL exibir links do YouTube organizados por categoria com previews incorporados
4. WHEN um aluno visualiza o portfólio THEN o sistema SHALL mostrar certificações, conquistas e formação do professor de forma organizada e visual

### Requirement 12

**User Story:** Como um usuário da plataforma, eu quero que meus dados sejam protegidos, para que eu tenha segurança ao usar o sistema.

#### Acceptance Criteria

1. WHEN um usuário cria uma senha THEN o sistema SHALL armazenar apenas o hash criptografado
2. WHEN dados sensíveis são transmitidos THEN o sistema SHALL usar conexão HTTPS
3. WHEN um usuário faz login THEN o sistema SHALL gerar token JWT com expiração
4. IF houver tentativas de acesso não autorizado THEN o sistema SHALL registrar logs de segurança