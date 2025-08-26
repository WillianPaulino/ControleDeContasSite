import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
// --- CORREÇÃO AQUI ---
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    
    try {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        const userId = paymentInfo.external_reference;
        
        await prisma.user.update({
          where: { id: userId },
          data: { hasPaid: true },
        });
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ status: 'ok' });
}```

#### **Arquivo 4: `src/app/download/page.tsx` (Código Completo)**
```tsx
import { getServerSession } from "next-auth";
// --- CORREÇÃO AQUI ---
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Importa authOptions

// Esta função roda NO SERVIDOR antes da página ser enviada para o cliente.
async function hasAccess(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true }
    });
    return user?.hasPaid ?? false;
}

export default async function DownloadPage() {
    // Passa authOptions para garantir que a sessão correta seja obtida
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