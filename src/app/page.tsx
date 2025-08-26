import Image from 'next/image';
import BuyButton from './BuyButton';
import AuthButton from './AuthButton'; // Importa o botão de autenticação

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-gray-800">
      <header className="bg-blue-800 text-white">
        {/* NOVO: Barra de navegação com o botão de login */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Controle de Contas</div>
          <AuthButton />
        </nav>
        <div className="container mx-auto px-6 pt-16 pb-24 text-center">
          <h1 className="text-5xl font-bold mb-2">A maneira mais simples de organizar suas finanças.</h1>
          <h2 className="text-2xl mb-8">Tenha o controle total na palma da sua mão.</h2>
          <a
            href="#preco"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Ver Planos
          </a>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold text-center mb-12">Funcionalidades Incríveis</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold mb-2">Dashboard Inteligente</h4>
            <p>Visualize seus gastos com gráficos interativos e tenha uma visão clara do seu saldo mensal.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold mb-2">Controle de Contas</h4>
            <p>Nunca mais esqueça uma data de vencimento. Receba alertas e mantenha tudo em dia.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold mb-2">Relatórios Completos</h4>
            <p>Filtre suas transações por semana, mês ou ano e entenda para onde seu dinheiro está indo.</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <Image src="/app-screenshot.png" alt="Screenshot do App Controle de Contas" width={500} height={500} className="rounded-lg shadow-2xl"/>
          </div>
          <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
            <h3 className="text-3xl font-bold mb-4">Tudo na Palma da Sua Mão</h3>
            <p className="text-lg">Nosso aplicativo foi desenhado para ser intuitivo e fácil de usar. Organize suas finanças em minutos, não em horas. Disponível para Android.</p>
          </div>
        </div>
      </main>
      
      <section id="preco" className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Acesso Vitalício por um Preço Único</h3>
          <p className="text-5xl font-bold text-blue-800 mb-6">R$ 9,99</p>
          <BuyButton />
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-6 text-center">
              <p>&copy; {new Date().getFullYear()} Controle de Contas. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
}