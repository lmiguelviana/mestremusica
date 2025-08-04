import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.lesson.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.professorInstrument.deleteMany();
  await prisma.professorAvailability.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.instrument.deleteMany();
  await prisma.premiumPlan.deleteMany();

  console.log('🧹 Dados existentes removidos');

  // Criar instrumentos
  const instruments = await Promise.all([
    prisma.instrument.create({ data: { name: 'Violão' } }),
    prisma.instrument.create({ data: { name: 'Guitarra' } }),
    prisma.instrument.create({ data: { name: 'Piano' } }),
    prisma.instrument.create({ data: { name: 'Bateria' } }),
    prisma.instrument.create({ data: { name: 'Baixo' } }),
    prisma.instrument.create({ data: { name: 'Violino' } }),
    prisma.instrument.create({ data: { name: 'Saxofone' } }),
    prisma.instrument.create({ data: { name: 'Flauta' } }),
    prisma.instrument.create({ data: { name: 'Canto' } }),
    prisma.instrument.create({ data: { name: 'Ukulele' } }),
  ]);

  console.log('🎵 Instrumentos criados');

  // Criar planos premium
  const premiumPlans = await Promise.all([
    prisma.premiumPlan.create({
      data: {
        name: 'Básico',
        description: 'Perfil destacado na busca',
        price: 29.90,
        duration: 30,
        features: ['Perfil destacado', 'Suporte por email'],
        isActive: true,
      },
    }),
    prisma.premiumPlan.create({
      data: {
        name: 'Premium',
        description: 'Perfil premium com recursos avançados',
        price: 49.90,
        duration: 30,
        features: ['Perfil destacado', 'Badge premium', 'Suporte prioritário', 'Estatísticas avançadas'],
        isActive: true,
      },
    }),
    prisma.premiumPlan.create({
      data: {
        name: 'VIP',
        description: 'Todos os recursos premium',
        price: 99.90,
        duration: 30,
        features: ['Todos os recursos premium', 'Consultoria personalizada', 'Suporte 24/7'],
        isActive: true,
      },
    }),
  ]);

  console.log('💎 Planos premium criados');

  // Criar usuários de teste
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Criar alunos
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `aluno${i}@teste.com`,
        passwordHash: hashedPassword,
        name: `Aluno ${i}`,
        type: 'STUDENT',
        isActive: true,
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        phone: `(11) 9999${i.toString().padStart(4, '0')}`,
        address: `Rua do Aluno ${i}, 123`,
        preferences: {
          genres: ['Rock', 'Pop', 'MPB'],
          level: 'iniciante',
        },
      },
    });

    students.push({ user, student });
  }

  console.log('👨‍🎓 Alunos criados');

  // Criar professores
  const professors = [];
  const professorNames = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Ferreira',
    'Lucia Rodrigues',
    'Rafael Lima',
    'Fernanda Alves',
  ];

  for (let i = 0; i < professorNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `professor${i + 1}@teste.com`,
        passwordHash: hashedPassword,
        name: professorNames[i],
        type: 'PROFESSOR',
        isActive: true,
      },
    });

    const professor = await prisma.professor.create({
      data: {
        userId: user.id,
        biography: `Sou ${professorNames[i]}, professor de música com mais de 10 anos de experiência. Apaixonado por ensinar e compartilhar conhecimento musical.`,
        experience: `${10 + i} anos de experiência em ensino musical`,
        methodology: 'Metodologia personalizada focada no desenvolvimento individual de cada aluno',
        baseHourlyRate: 50 + (i * 10),
        onlineAvailable: true,
        inPersonLocation: i % 2 === 0 ? 'São Paulo - SP' : null,
        approvalStatus: 'APPROVED',
        averageRating: 4.5 + (Math.random() * 0.5),
        totalReviews: Math.floor(Math.random() * 50) + 10,
        youtubeUrl: i % 3 === 0 ? 'https://youtube.com/@professor' + (i + 1) : null,
        instagramUrl: i % 2 === 0 ? 'https://instagram.com/professor' + (i + 1) : null,
        phone: `(11) 8888${(i + 1).toString().padStart(4, '0')}`,
        whatsapp: `11888${(i + 1).toString().padStart(6, '0')}`,
        isPremium: i < 3, // Primeiros 3 são premium
        premiumPlanId: i < 3 ? premiumPlans[i % 3].id : null,
        premiumExpiresAt: i < 3 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      },
    });

    // Associar instrumentos aos professores
    const professorInstruments = [];
    const numInstruments = Math.floor(Math.random() * 3) + 1; // 1-3 instrumentos
    const selectedInstruments = instruments
      .sort(() => 0.5 - Math.random())
      .slice(0, numInstruments);

    for (const instrument of selectedInstruments) {
      await prisma.professorInstrument.create({
        data: {
          professorId: professor.id,
          instrumentId: instrument.id,
          proficiencyLevel: ['iniciante', 'intermediario', 'avancado'][Math.floor(Math.random() * 3)],
        },
      });
    }

    // Criar disponibilidade para o professor
    const daysOfWeek = [1, 2, 3, 4, 5]; // Segunda a sexta
    for (const day of daysOfWeek) {
      await prisma.professorAvailability.create({
        data: {
          professorId: professor.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isRecurring: true,
        },
      });
    }

    professors.push({ user, professor });
  }

  console.log('👨‍🏫 Professores criados');

  // Criar algumas aulas de exemplo
  const lessons = [];
  for (let i = 0; i < 10; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const professor = professors[Math.floor(Math.random() * professors.length)];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)); // Próximos 30 dias
    startDate.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0); // 9h às 18h

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hora de aula

    const lesson = await prisma.lesson.create({
      data: {
        studentId: student.student.id,
        professorId: professor.professor.id,
        startDateTime: startDate,
        endDateTime: endDate,
        durationMinutes: 60,
        totalPrice: professor.professor.baseHourlyRate,
        status: ['PENDING', 'CONFIRMED', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
        lessonType: Math.random() > 0.5 ? 'ONLINE' : 'IN_PERSON',
        studentNotes: i % 3 === 0 ? 'Gostaria de focar em técnicas básicas' : null,
        studentName: student.user.name,
        studentEmail: student.user.email,
        studentPhone: student.student.phone,
      },
    });

    lessons.push(lesson);
  }

  console.log('📚 Aulas de exemplo criadas');

  // Criar alguns pagamentos
  for (let i = 0; i < 5; i++) {
    const lesson = lessons[i];

    await prisma.payment.create({
      data: {
        lessonId: lesson.id,
        amount: lesson.totalPrice,
        currency: 'BRL',
        status: 'COMPLETED',
        paymentMethod: Math.random() > 0.5 ? 'card' : 'pix',
      },
    });
  }

  console.log('💳 Pagamentos de exemplo criados');

  // Criar usuário admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mestresmusic.com',
      passwordHash: hashedPassword,
      name: 'Administrador',
      type: 'ADMIN',
      isActive: true,
    },
  });

  console.log('👑 Usuário admin criado');

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log(`- ${instruments.length} instrumentos`);
  console.log(`- ${premiumPlans.length} planos premium`);
  console.log(`- ${students.length} alunos`);
  console.log(`- ${professors.length} professores`);
  console.log(`- ${lessons.length} aulas`);
  console.log(`- 5 pagamentos`);
  console.log(`- 1 usuário admin`);

  console.log('\n🔑 Credenciais de teste:');
  console.log('Admin: admin@mestresmusic.com / 123456');
  console.log('Aluno: aluno1@teste.com / 123456');
  console.log('Professor: professor1@teste.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });