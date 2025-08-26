'use client';
import { useState } from 'react';

export default function DownloadButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            // Chama nossa API segura para baixar o arquivo
            const response = await fetch('/api/download-apk');
            if (!response.ok) {
                throw new Error('Falha no download');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'controle-de-contas.apk'; // Nome do arquivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert('Não foi possível baixar o arquivo. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 inline-block disabled:bg-gray-400"
        >
            {isLoading ? 'Baixando...' : 'Baixar o App (APK)'}
        </button>
    );
}