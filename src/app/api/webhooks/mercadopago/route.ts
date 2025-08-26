import { NextRequest, NextResponse } from 'next/server';
// --- INÍCIO DA CORREÇÃO ---
import { MercadoPagoConfig, Payment } from 'mercadopago';
// --- FIM DA CORREÇÃO ---
import prisma from '@/lib/prisma';

// --- INÍCIO DA CORREÇÃO ---
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
// --- FIM DA CORREÇÃO ---

export async function POST(req: NextRequest) {
  const body = await req.json();

  // O webhook notifica sobre diferentes tipos de eventos.
  // Estamos interessados apenas em eventos do tipo 'payment'.
  if (body.type === 'payment') {
    const paymentId = body.data.id;
    
    try {
      // --- INÍCIO DA CORREÇÃO ---
      // Cria uma instância do controlador de Pagamentos e busca o pagamento pelo ID
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      // --- FIM DA CORREÇÃO ---
      
      // Se o pagamento foi aprovado, atualizamos nosso banco de dados
      if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        const userId = paymentInfo.external_reference;
        
        await prisma.user.update({
          where: { id: userId },
          data: { hasPaid: true }, // Marca o usuário como 'pago'
        });
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
  }
  
  // Retorna uma resposta 200 OK para o Mercado Pago saber que recebemos a notificação.
  return NextResponse.json({ status: 'ok' });
}