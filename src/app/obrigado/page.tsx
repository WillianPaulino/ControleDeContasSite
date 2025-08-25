export default function ObrigadoPage() {
    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Pagamento Aprovado!</h1>
                <p className="text-lg mb-6">Obrigado por adquirir o Controle de Contas. Clique no botão abaixo para baixar o aplicativo.</p>
                <a
                    href="https://github.com/WillianPaulino/ControleDeContasSite/releases/download/v1.0/ControleDeContas.apk" // Lembre-se de colocar seu link aqui
                    className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 inline-block"
                >
                    Baixar o App (APK)
                </a>
                <div className="mt-8 text-left bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-bold">Instruções Importantes</p>
                    {/* --- CORREÇÃO AQUI --- */}
                    {/* Usamos o código de escape '&apos;' para o apóstrofo/aspa simples */}
                    <p className="text-sm">Para instalar, você talvez precise habilitar a opção &apos;Instalar de fontes desconhecidas&apos; nas configurações de segurança do seu Android.</p>
                </div>
            </div>
        </div>
    );
}