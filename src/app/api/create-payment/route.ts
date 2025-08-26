import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// --- INÍCIO DA CORREÇÃO ---
// Importa o cliente e a interface de preferência da nova SDK
import { MercadoPagoConfig, Preference } from 'mercadopago';
// --- FIM DA CORREÇÃO ---
import prisma from '@/lib/prisma';

// --- INÍCIO DA CORREÇÃO ---
// Cria um novo cliente de configuração com o seu Access Token
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
// --- FIM DA CORREÇÃO ---

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const preferenceData = {
    items: [
      {
        id: 'controle-contas-app-01',
        title: 'Controle de Contas - Acesso Vitalício',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 19.90,
      },
    ],
    back_urls: {
        success: `${process.env.NEXTAUTH_URL}/download`,
        failure: `${process.env.NEXTAUTH_URL}/`,
        pending: `${process.env.NEXTAUTH_URL}/`,
    },
    auto_return: 'approved',
    external_reference: user.id, 
    notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
  };

  try {
    // --- INÍCIO DA CORREÇÃO ---
    // Cria uma instância do controlador de Preferências e chama o método create
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });
    // --- FIM DA CORREÇÃO ---
    
    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}