import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }
  
  // Encontra o ID do usuário no nosso banco de dados
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const preference = {
    items: [
      {
        title: 'Controle de Contas - Acesso Vitalício',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 19.90,
      },
    ],
    back_urls: {
        success: `${process.env.NEXTAUTH_URL}/download`, // Redireciona para a página de download
        failure: `${process.env.NEXTAUTH_URL}/`,
        pending: `${process.env.NEXTAUTH_URL}/`,
    },
    auto_return: 'approved',
    // INFORMAÇÃO CRUCIAL: Passamos o ID do nosso usuário para o Mercado Pago
    external_reference: user.id, 
    // URL que o Mercado Pago vai notificar quando o pagamento for aprovado
    notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return NextResponse.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}