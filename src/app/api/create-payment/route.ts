import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

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
        unit_price: 10.00,
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
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}