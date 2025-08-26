import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton"; // Criaremos este componente

async function hasAccess(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true }
    });
    return user?.hasPaid ?? false;
}

export default async function DownloadPage() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        // Se não estiver logado, manda para a página inicial
        redirect('/');
    }

    const userHasAccess = await hasAccess(session.user.email);

    if (!userHasAccess) {
        // Se está logado mas não pagou, mostra uma mensagem de erro.
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
                    <p className="text-lg">Você precisa adquirir o produto para acessar esta página.</p>
                </div>
            </div>
        );
    }
    
    // Se está logado E pagou, mostra a página de download.
    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Download Liberado!</h1>
                <p className="text-lg mb-6">Obrigado pela sua compra! Clique no botão abaixo para baixar o aplicativo.</p>
                
                {/* O botão agora é um componente cliente para interatividade */}
                <DownloadButton />

                <div className="mt-8 text-left bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-bold">Instruções Importantes</p>
                    <p className="text-sm">Para instalar, você talvez precise habilitar a opção &apos;Instalar de fontes desconhecidas&apos; nas configurações de segurança do seu Android.</p>
                </div>
            </div>
        </div>
    );
}