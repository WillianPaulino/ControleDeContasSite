import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// URL DO SEU APK NO GITHUB RELEASES
const APK_URL = "https://github.com/WillianPaulino/ControleDeContasSite/releases/download/v1.0/ControleDeContas.apk";

async function hasAccess(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true }
    });
    return user?.hasPaid ?? false;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return new NextResponse('Não autorizado', { status: 401 });
    }

    const userHasAccess = await hasAccess(session.user.email);
    if (!userHasAccess) {
        return new NextResponse('Acesso negado', { status: 403 });
    }

    // O servidor busca o APK e o entrega ao cliente, sem expor a URL.
    const response = await fetch(APK_URL);
    if (!response.ok) {
        return new NextResponse('Arquivo não encontrado no servidor', { status: 500 });
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': `attachment; filename="controle-de-contas.apk"`,
        },
    });
}