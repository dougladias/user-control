// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types'; // Corrigido para importar de @/types

// Não importamos mais de ../api, mas de @/
// Se precisar de funções de API, ajuste para o caminho correto

export default function Home() {
  const [user, setUser] = useState<{ role: Role } | null>(null);
  const router = useRouter();

  // Se precisar verificar o papel do usuário, use os valores corretos definidos no tipo Role
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
      {user && (
        <>
          {user.role === 'admin' && (
            <div>
              <h2>Administração</h2>
              <p>Você tem acesso total ao sistema.</p>
            </div>
          )}
          
          {user.role === 'manager' && (
            <div>
              <h2>Gerente</h2>
              <p>Você tem acesso moderado ao sistema.</p>
            </div>
          )}
          
          {user.role === 'intern' && (
            <div>
              <h2>Estagiário</h2>
              <p>Você tem acesso básico ao sistema.</p>
            </div>
          )}
        </>
      )}
      
      {!user && (
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