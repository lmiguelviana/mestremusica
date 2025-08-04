const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createMoreProfessors() {
  console.log('🎵 Criando mais professores de teste...');

  try {
    // Buscar instrumentos existentes
    const instruments = await prisma.instrument.findMany();
    const instrumentMap = {};
    instruments.forEach(inst => {
      instrumentMap[inst.name] = inst.id;
    });

    // Dados dos professores
    const professorsData = [
      {
        name: 'João Silva',
        email: 'joao.silva@mestresmusic.com',
        password: 'professor123',
        biography: 'Guitarrista profissional com 15 anos de experiência. Especialista em rock, blues e jazz. Formado em Música Popular pela UNICAMP.',
        experience: 'Músico profissional desde 2008, já tocou em diversas bandas e eventos. Professor há 8 anos.',
        methodology: 'Metodologia prática focada no desenvolvimento técnico e criativo do aluno.',
        baseHourlyRate: '90',
        onlineAvailable: true,
        inPersonLocation: 'Rio de Janeiro, RJ',
        phone: '(21) 99999-1111',
        whatsapp: '5521999991111',
        youtubeUrl: 'https://youtube.com/@joaosilvamusic',
        instagramUrl: 'https://instagram.com/joaosilvamusic',
        instruments: [
          { name: 'Guitarra', level: 'avancado' },
          { name: 'Violão', level: 'avancado' }
        ]
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@mestresmusic.com',
        password: 'professor123',
        biography: 'Pianista clássica e popular. Professora há 12 anos, especializada em iniciantes e intermediários. Formada pelo Conservatório de Música.',
        experience: 'Formada em Piano Clássico, com especialização em Música Popular. Professora certificada há mais de 10 anos.',
        methodology: 'Ensino personalizado combinando técnica clássica com repertório popular.',
        baseHourlyRate: '75',
        onlineAvailable: true,
        inPersonLocation: 'São Paulo, SP',
        phone: '(11) 98888-2222',
        whatsapp: '5511988882222',
        youtubeUrl: 'https://youtube.com/@anacostapiano',
        instagramUrl: 'https://instagram.com/anacostapiano',
        instruments: [
          { name: 'Piano', level: 'avancado' }
        ]
      },
      {
        name: 'Carlos Drummond',
        email: 'carlos.drummond@mestresmusic.com',
        password: 'professor123',
        biography: 'Baterista profissional e produtor musical. Especialista em rock, pop e música brasileira. Mais de 20 anos de carreira.',
        experience: 'Baterista de estúdio e shows ao vivo. Produtor musical e professor há 15 anos.',
        methodology: 'Foco na coordenação motora, leitura musical e desenvolvimento do groove.',
        baseHourlyRate: '85',
        onlineAvailable: false,
        inPersonLocation: 'Belo Horizonte, MG',
        phone: '(31) 97777-3333',
        whatsapp: '5531977773333',
        youtubeUrl: 'https://youtube.com/@carlosdrummond',
        instagramUrl: 'https://instagram.com/carlosdrummond',
        instruments: [
          { name: 'Bateria', level: 'avancado' }
        ]
      },
      {
        name: 'Lucia Melodia',
        email: 'lucia.melodia@mestresmusic.com',
        password: 'professor123',
        biography: 'Cantora lírica e popular. Professora de canto há 10 anos, especializada em técnica vocal e interpretação.',
        experience: 'Cantora profissional formada em Canto Lírico. Professora de técnica vocal certificada.',
        methodology: 'Desenvolvimento da técnica vocal, respiração e interpretação musical.',
        baseHourlyRate: '95',
        onlineAvailable: true,
        inPersonLocation: 'Porto Alegre, RS',
        phone: '(51) 96666-4444',
        whatsapp: '5551966664444',
        youtubeUrl: 'https://youtube.com/@luciamelodiacanto',
        instagramUrl: 'https://instagram.com/luciamelodiacanto',
        instruments: [
          { name: 'Canto', level: 'avancado' }
        ]
      },
      {
        name: 'Roberto Baixista',
        email: 'roberto.baixista@mestresmusic.com',
        password: 'professor123',
        biography: 'Baixista de jazz e música brasileira. Professor experiente com foco em groove e harmonia.',
        experience: 'Baixista profissional há 18 anos. Professor de contrabaixo elétrico e acústico.',
        methodology: 'Ensino de groove, walking bass, slap e técnicas avançadas de baixo.',
        baseHourlyRate: '70',
        onlineAvailable: true,
        inPersonLocation: 'Salvador, BA',
        phone: '(71) 95555-5555',
        whatsapp: '5571955555555',
        youtubeUrl: 'https://youtube.com/@robertobaixista',
        instagramUrl: 'https://instagram.com/robertobaixista',
        instruments: [
          { name: 'Baixo', level: 'avancado' }
        ]
      },
      {
        name: 'Fernanda Violino',
        email: 'fernanda.violino@mestresmusic.com',
        password: 'professor123',
        biography: 'Violinista clássica formada pela UFRJ. Professora dedicada ao ensino de violino para todas as idades.',
        experience: 'Violinista de orquestra e professora particular há 8 anos. Especialista em música clássica.',
        methodology: 'Técnica clássica de violino com repertório diversificado e progressivo.',
        baseHourlyRate: '100',
        onlineAvailable: true,
        inPersonLocation: 'Brasília, DF',
        phone: '(61) 94444-6666',
        whatsapp: '5561944446666',
        youtubeUrl: 'https://youtube.com/@fernandaviolino',
        instagramUrl: 'https://instagram.com/fernandaviolino',
        instruments: [
          { name: 'Violino', level: 'avancado' }
        ]
      }
    ];

    // Criar professores
    for (const professorData of professorsData) {
      console.log(`Criando professor: ${professorData.name}`);

      // Hash da senha
      const hashedPassword = await bcrypt.hash(professorData.password, 12);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name: professorData.name,
          email: professorData.email,
          passwordHash: hashedPassword,
          type: 'PROFESSOR',
          isActive: true,
        },
      });

      // Criar perfil do professor
      const professor = await prisma.professor.create({
        data: {
          userId: user.id,
          biography: professorData.biography,
          experience: professorData.experience,
          methodology: professorData.methodology,
          baseHourlyRate: professorData.baseHourlyRate,
          onlineAvailable: professorData.onlineAvailable,
          inPersonLocation: professorData.inPersonLocation,
          approvalStatus: 'APPROVED',
          phone: professorData.phone,
          whatsapp: professorData.whatsapp,
          youtubeUrl: professorData.youtubeUrl,
          instagramUrl: professorData.instagramUrl,
          isPremium: Math.random() > 0.5, // 50% chance de ser premium
        },
      });

      // Associar instrumentos
      for (const instrument of professorData.instruments) {
        const instrumentId = instrumentMap[instrument.name];
        if (instrumentId) {
          await prisma.professorInstrument.create({
            data: {
              professorId: professor.id,
              instrumentId: instrumentId,
              proficiencyLevel: instrument.level,
            },
          });
        }
      }

      // Criar algumas certificações
      await prisma.certification.create({
        data: {
          professorId: professor.id,
          title: `Certificação em ${professorData.instruments[0].name}`,
          institution: 'Conservatório de Música',
          year: 2015 + Math.floor(Math.random() * 8),
          description: 'Certificação profissional em ensino musical.',
        },
      });

      // Criar alguns links do YouTube
      await prisma.youtubeMusicLink.create({
        data: {
          professorId: professor.id,
          title: `${professorData.instruments[0].name} - Demonstração`,
          youtubeUrl: `https://youtube.com/watch?v=demo${professor.id}`,
          category: 'PERFORMANCE',
          description: 'Vídeo demonstrativo das habilidades musicais.',
        },
      });

      console.log(`✅ Professor ${professorData.name} criado com sucesso!`);
    }

    console.log('\n🎉 Todos os professores foram criados com sucesso!');
    console.log('\n📊 Resumo:');
    
    const totalProfessors = await prisma.professor.count();
    const totalUsers = await prisma.user.count();
    
    console.log(`- Total de usuários: ${totalUsers}`);
    console.log(`- Total de professores: ${totalProfessors}`);
    console.log(`- Professores aprovados: ${await prisma.professor.count({ where: { approvalStatus: 'APPROVED' } })}`);

  } catch (error) {
    console.error('❌ Erro ao criar professores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMoreProfessors();