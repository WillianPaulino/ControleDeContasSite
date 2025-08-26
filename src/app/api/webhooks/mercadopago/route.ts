import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';
import prisma from '@/lib/prisma';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    
    try {
      const payment = await mercadopago.payment.findById(paymentId);
      
      if (payment.body.status === 'approved') {
        const userId = payment.body.external_reference;
        
        // Atualiza o usuário no nosso banco de dados, marcando que ele pagou
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