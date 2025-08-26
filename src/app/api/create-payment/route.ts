import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prisma } from '@/lib/prisma'; // Importação correta
import { authOptions } from '../auth/[...nextauth]/route'; // Importa authOptions

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
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}```

#### **Arquivo 2: `src/app/api/webhooks/mercadopago/route.ts` (Código Completo)**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma'; // Importação correta

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
}