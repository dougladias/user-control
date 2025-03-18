
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types';
import AdminLayout from '@/app/components/AdminLayout';
import ManagerLayout from '@/app/components/ManagerLayout';
import InternLayout from '@/app/components/InternLayout';

// O componente Home é um componente funcional que renderiza o layout com base na permissão do usuário.
export default function Home() {
  const [user, setUser] = useState<{ role: Role } | null>(null);
  const router = useRouter();

  const renderLayout = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminLayout />;
      case 'manager':
        return <ManagerLayout />;
      case 'intern':
        return <InternLayout />;
      default:
        return null;
    }
  };

  // Página Inicial do Controle de Acesso
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
      {user ? (
        renderLayout()
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sistema de Controle de Acesso</h1>
          <p className="mb-6">Faça login para acessar o sistema</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
}