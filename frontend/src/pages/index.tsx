import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>MestresMusic - Conectando você aos mestres da música</title>
        <meta name="description" content="Plataforma que conecta alunos e professores de música. Encontre o professor ideal ou compartilhe seu conhecimento musical." />
        <meta name="keywords" content="música, aulas, professores, instrumentos, aprender música" />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-gray-950">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/5"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Conectando você aos{' '}
                  <span className="text-orange-500">mestres da música</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  A plataforma que une alunos e professores de música. 
                  Encontre o professor ideal para sua jornada musical ou compartilhe seu conhecimento.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register?type=student">
                    <Button size="lg" className="w-full sm:w-auto">
                      🎓 Quero Aprender
                    </Button>
                  </Link>
                  <Link href="/register?type=professor">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      🎵 Quero Ensinar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Por que escolher o MestresMusic?
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Uma plataforma completa para conectar a comunidade musical brasileira
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Busca Inteligente
                  </h3>
                  <p className="text-gray-400">
                    Encontre professores por instrumento, estilo musical, localização e preço. 
                    Filtros avançados para encontrar o match perfeito.
                  </p>
                </Card>

                <Card className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Perfis Completos
                  </h3>
                  <p className="text-gray-400">
                    Professores com portfólios detalhados, vídeos, certificações e avaliações. 
                    Transparência total para sua escolha.
                  </p>
                </Card>

                <Card className="text-center">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Qualidade Garantida
                  </h3>
                  <p className="text-gray-400">
                    Professores verificados, sistema de avaliações e suporte dedicado. 
                    Sua experiência musical em boas mãos.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* For Students Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Para <span className="text-orange-500">Alunos</span>
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Encontre seu professor ideal</h4>
                        <p className="text-gray-400">Busque por instrumento, estilo e localização</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Aulas presenciais ou online</h4>
                        <p className="text-gray-400">Flexibilidade total para seu aprendizado</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Contato direto</h4>
                        <p className="text-gray-400">Converse diretamente com os professores</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?type=student">
                    <Button size="lg">Começar a Aprender</Button>
                  </Link>
                </div>
                
                <Card className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 border-orange-500/20">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Cadastro Gratuito para Alunos
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Crie sua conta gratuitamente e comece a explorar nossa comunidade de professores.
                    </p>
                    <div className="text-sm text-gray-400">
                      ✓ Acesso completo à plataforma<br/>
                      ✓ Contato direto com professores<br/>
                      ✓ Sem taxas ou comissões
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* For Teachers Section */}
          <section className="py-20 bg-gray-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 order-2 lg:order-1">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Planos Premium para Professores
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Destaque-se na plataforma e alcance mais alunos com nossos planos premium.
                    </p>
                    <div className="text-sm text-gray-400 text-left">
                      ✓ Perfil em destaque<br/>
                      ✓ Badge "Professor Premium"<br/>
                      ✓ Analytics detalhadas<br/>
                      ✓ Suporte prioritário
                    </div>
                  </div>
                </Card>

                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Para <span className="text-orange-500">Professores</span>
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Crie seu portfólio completo</h4>
                        <p className="text-gray-400">Vídeos, certificações e materiais didáticos</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Alcance mais alunos</h4>
                        <p className="text-gray-400">Seja encontrado por alunos em toda sua região</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-orange-500 mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="text-white font-medium">Gerencie seu negócio</h4>
                        <p className="text-gray-400">Ferramentas para organizar suas aulas</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?type=professor">
                    <Button size="lg">Começar a Ensinar</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
                <div className="py-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Pronto para começar sua jornada musical?
                  </h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Junte-se à comunidade MestresMusic e descubra um mundo de possibilidades musicais.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Criar Conta Gratuita
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Já tenho conta
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
}