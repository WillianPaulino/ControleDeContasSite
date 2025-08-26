'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function BuyButton() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handlePurchase = async () => {
        if (status === 'unauthenticated') {
            // Se não estiver logado, redireciona para o login do Google
            signIn('google');
            return;
        }

        if (status === 'authenticated') {
            setIsLoading(true);
            try {
                // Chama nossa API para criar a preferência de pagamento
                const res = await fetch('/api/create-payment', { method: 'POST' });
                if (!res.ok) throw new Error('Falha ao criar pagamento');
                
                const { init_point } = await res.json();
                // Redireciona o usuário para o checkout do Mercado Pago
                window.location.href = init_point;
            } catch (error) {
                console.error(error);
                alert('Ocorreu um erro. Tente novamente.');
                setIsLoading(false);
            }
        }
    };

    if (status === 'loading') {
        return <button className="bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl">Carregando...</button>;
    }

    return (
        <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300 disabled:bg-gray-400"
        >
            {isLoading ? 'Processando...' : 'Garantir meu Acesso'}
        </button>
    );
}