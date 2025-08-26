import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; // Importação correta
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Importa authOptions

async function hasAccess(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true }
    });
    return user?.hasPaid ?? false;
}

export default async function DownloadPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect('/');
    }

    const userHasAccess = await hasAccess(session.user.email);

    if (!userHasAccess) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-lg mx-4">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
                    <p className="text-lg">Você ainda não adquiriu este produto. Por favor, realize a compra para liberar o download.</p>
                </div>
            </div>
        );
    }
    
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