// src/app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirecionar usuário já autenticado para sua página apropriada
      const redirectPath = user.role === 'admin' 
        ? '/admin' 
        : user.role === 'manager' 
          ? '/manager' 
          : '/intern';
      
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  // Não mostrar o formulário se já estiver autenticado (vai redirecionar)
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <h1 className="text-center text-3xl font-bold mb-6 text-blue-600">
          Sistema de Controle de Acesso
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}