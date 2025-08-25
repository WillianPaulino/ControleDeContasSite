import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-gray-800">
      {/* Seção do Herói (Principal) */}
      <header className="bg-blue-800 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-2">Controle de Contas</h1>
          <h2 className="text-2xl mb-8">A maneira mais simples de organizar suas finanças.</h2>
          {/* O link de pagamento irá aqui */}
          <a
            href="#preco" // Link interno para a seção de preço
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Comprar Agora
          </a>
        </div>
      </header>

      {/* Seção de Funcionalidades */}
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

        {/* Seção com Imagem do App */}
        <div className="mt-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
             {/* Adicione um screenshot do seu app na pasta 'public' */}
            <Image src="/app-screenshot.png" alt="Screenshot do App Controle de Contas" width={500} height={500} className="rounded-lg shadow-2xl"/>
          </div>
          <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
            <h3 className="text-3xl font-bold mb-4">Tudo na Palma da Sua Mão</h3>
            <p className="text-lg">Nosso aplicativo foi desenhado para ser intuitivo e fácil de usar. Organize suas finanças em minutos, não em horas. Disponível para Android.</p>
          </div>
        </div>
      </main>

      {/* Seção de Preço e CTA */}
      <section id="preco" className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Acesso Vitalício por um Preço Único</h3>
          <p className="text-5xl font-bold text-blue-800 mb-6">R$ 9,9</p>
          <a
            href="https://mpago.la/1qn7xpt" // Passo 3.2
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300"
          >
            Garantir meu Acesso
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-6 text-center">
              <p>&copy; {new Date().getFullYear()} Controle de Contas. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
}