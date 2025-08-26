import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton";

// Esta função roda NO SERVIDOR antes da página ser enviada para o cliente.
async function hasAccess(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true } // Pega apenas o campo que nos interessa
    });
    // Retorna true se o usuário existir e hasPaid for true.
    return user?.hasPaid ?? false;
}

export default async function DownloadPage() {
    // Pega a sessão do usuário no lado do servidor
    const session = await getServerSession();

    // 1. VERIFICA SE O USUÁRIO ESTÁ LOGADO
    if (!session?.user?.email) {
        // Se não estiver logado, manda de volta para a página inicial
        redirect('/');
    }

    // 2. VERIFICA SE O USUÁRIO LOGADO PAGOU
    const userHasAccess = await hasAccess(session.user.email);

    if (!userHasAccess) {
        // Se está logado mas não pagou, mostra uma mensagem de "Acesso Negado".
        // Esta pessoa não consegue nem ver o botão de download.
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
                    <p className="text-lg">Você ainda não adquiriu este produto. Por favor, realize a compra para liberar o download.</p>
                </div>
            </div>
        );
    }
    
    // 3. SE AMBAS AS VERIFICAÇÕES PASSAREM, MOSTRA A PÁGINA
    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Download Liberado!</h1>
                <p className="text-lg mb-6">Obrigado pela sua compra! Clique no botão abaixo para baixar o aplicativo.</p>
                
                <DownloadButton />

                <div className="mt-8 text-left bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-bold">Instruções Importantes</p>
                    <p className="text-sm">Para instalar, você talvez precise habilitar a opção &apos;Instalar de fontes desconhecidas&apos; nas configurações de segurança do seu Android.</p>
                </div>
            </div>
        </div>
    );
}