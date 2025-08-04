import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create instruments
  const instruments = await Promise.all([
    prisma.instrument.upsert({
      where: { name: 'Violão' },
      update: {},
      create: { name: 'Violão' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Piano' },
      update: {},
      create: { name: 'Piano' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Guitarra' },
      update: {},
      create: { name: 'Guitarra' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Baixo' },
      update: {},
      create: { name: 'Baixo' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Bateria' },
      update: {},
      create: { name: 'Bateria' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Canto' },
      update: {},
      create: { name: 'Canto' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Violino' },
      update: {},
      create: { name: 'Violino' },
    }),
    prisma.instrument.upsert({
      where: { name: 'Saxofone' },
      update: {},
      create: { name: 'Saxofone' },
    }),
  ]);

  console.log('✅ Instruments created');

  // Create premium plans
  const premiumPlans = await Promise.all([
    prisma.premiumPlan.upsert({
      where: { name: 'Básico' },
      update: {},
      create: {
        name: 'Básico',
        description: 'Perfil destacado nos resultados de busca',
        price: 29.90,
        duration: 30,
        features: [
          'Perfil destacado',
          'Badge "Professor Verificado"',
          'Até 5 materiais PDF',
          'Analytics básicas'
        ],
      },
    }),
    prisma.premiumPlan.upsert({
      where: { name: 'Premium' },
      update: {},
      create: {
        name: 'Premium',
        description: 'Máxima visibilidade e recursos avançados',
        price: 49.90,
        duration: 30,
        features: [
          'Perfil em destaque no topo',
          'Badge "Professor Premium"',
          'Materiais PDF ilimitados',
          'Analytics avançadas',
          'Suporte prioritário',
          'Links do YouTube ilimitados'
        ],
      },
    }),
    prisma.premiumPlan.upsert({
      where: { name: 'Anual' },
      update: {},
      create: {
        name: 'Anual',
        description: 'Plano Premium com desconto anual',
        price: 499.90,
        duration: 365,
        features: [
          'Todos os recursos Premium',
          '2 meses grátis',
          'Consultoria personalizada',
          'Acesso antecipado a novos recursos'
        ],
      },
    }),
  ]);

  console.log('✅ Premium plans created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mestresmusic.com' },
    update: {},
    create: {
      email: 'admin@mestresmusic.com',
      passwordHash: adminPassword,
      name: 'Administrador MestresMusic',
      type: 'ADMIN',
    },
  });

  console.log('✅ Admin user created');

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.create({
    data: {
      email: 'aluno@exemplo.com',
      passwordHash: studentPassword,
      name: 'João Silva',
      type: 'STUDENT',
      student: {
        create: {
          phone: '(11) 99999-9999',
          preferences: {
            instruments: ['Violão', 'Piano'],
            styles: ['Rock', 'Pop', 'Clássico']
          }
        }
      }
    },
    include: {
      student: true
    }
  });

  console.log('✅ Sample student created');

  // Create sample professor
  const professorPassword = await bcrypt.hash('professor123', 10);
  const professorUser = await prisma.user.create({
    data: {
      email: 'professor@exemplo.com',
      passwordHash: professorPassword,
      name: 'Maria Santos',
      type: 'PROFESSOR',
      professor: {
        create: {
          biography: 'Professora de música com mais de 10 anos de experiência, especializada em violão e piano.',
          experience: 'Formada em Música pela UNESP, com especialização em Educação Musical.',
          methodology: 'Metodologia personalizada focada no desenvolvimento individual de cada aluno.',
          baseHourlyRate: 80.00,
          onlineAvailable: true,
          inPersonLocation: 'São Paulo, SP',
          approvalStatus: 'APPROVED',
          phone: '(11) 98888-8888',
          whatsapp: '5511988888888',
          youtubeUrl: 'https://youtube.com/@mariasantosmusic',
          instagramUrl: 'https://instagram.com/mariasantosmusic',
          instruments: {
            create: [
              {
                instrument: { connect: { name: 'Violão' } },
                proficiencyLevel: 'avancado'
              },
              {
                instrument: { connect: { name: 'Piano' } },
                proficiencyLevel: 'intermediario'
              }
            ]
          },
          certifications: {
            create: [
              {
                title: 'Licenciatura em Música',
                institution: 'UNESP',
                year: 2010,
                description: 'Formação completa em Educação Musical'
              },
              {
                title: 'Especialização em Violão Clássico',
                institution: 'Conservatório de Tatuí',
                year: 2015
              }
            ]
          },
          achievements: {
            create: [
              {
                title: '1º Lugar - Festival de Música de Campos do Jordão',
                description: 'Categoria violão solo',
                year: 2018,
                type: 'AWARD'
              }
            ]
          },
          youtubeMusicLinks: {
            create: [
              {
                title: 'Aula de Violão para Iniciantes',
                youtubeUrl: 'https://youtube.com/watch?v=example1',
                description: 'Tutorial básico de acordes',
                category: 'TUTORIAL'
              },
              {
                title: 'Apresentação - Villa Lobos',
                youtubeUrl: 'https://youtube.com/watch?v=example2',
                description: 'Performance de música clássica brasileira',
                category: 'PERFORMANCE'
              }
            ]
          }
        }
      }
    },
    include: {
      professor: {
        include: {
          instruments: {
            include: {
              instrument: true
            }
          },
          certifications: true,
          achievements: true,
          youtubeMusicLinks: true
        }
      }
    }
  });

  console.log('✅ Sample professor created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Created:');
  console.log(`- ${instruments.length} instruments`);
  console.log(`- ${premiumPlans.length} premium plans`);
  console.log('- 1 admin user (admin@mestresmusic.com / admin123)');
  console.log('- 1 sample student (aluno@exemplo.com / student123)');
  console.log('- 1 sample professor (professor@exemplo.com / professor123)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });