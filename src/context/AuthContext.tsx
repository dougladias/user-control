
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Role, UserResponse } from '@/types';

// Interface para o contexto de autenticação
interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticação ao iniciar
  useEffect(() => {
    // Simulação de verificação de token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Em um ambiente real, faríamos uma chamada à API aqui
        // Por enquanto, vamos simular um login bem-sucedido se houver um token
        
        try {
          // Simular uma verificação de token
          const userString = localStorage.getItem('user');
          if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Iniciando login para:', email);

      // Para fins de demonstração, vamos simular uma API de login
      // Em produção, substitua isso por uma chamada real à API
      
      // Simular usuários para demonstração
      const demoUsers = [
        { id: 1, email: 'admin@example.com', password: 'password123', name: 'Admin Teste', role: 'admin' as Role, createdAt: new Date().toISOString() },
        { id: 2, email: 'manager@example.com', password: 'password123', name: 'Gerente Teste', role: 'manager' as Role, createdAt: new Date().toISOString() },
        { id: 3, email: 'intern@example.com', password: 'password123', name: 'Estagiário Teste', role: 'intern' as Role, createdAt: new Date().toISOString() }
      ];

      // Encontrar usuário
      const user = demoUsers.find(u => u.email === email);
      
      if (!user) {
        console.error('Usuário não encontrado');
        return false;
      }

      // Verificar senha
      if (user.password !== password) {
        console.error('Senha incorreta');
        return false;
      }

      // Gerar token fictício
      const token = `fake-jwt-token-${user.id}-${Date.now()}`;
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('token', token);
      
      // Remover a senha antes de salvar o usuário
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Atualizar estado
      setUser(userWithoutPassword);

      // Redirecionar com base na função
      console.log('Login bem-sucedido. Redirecionando para:', user.role);
      
      setTimeout(() => {
        // Redirecionar para a página correspondente ao papel do usuário
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'manager') {
          router.push('/manager');
        } else {
          router.push('/intern');
        }
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Map de permissões por papel
    const permissionsMap: Record<Role, string[]> = {
      intern: [
        'read:basic-data',
        'update:own-profile'
      ],
      manager: [
        'read:basic-data',
        'read:detailed-data',
        'update:own-profile',
        'update:team-data'
      ],
      admin: [
        'read:basic-data',
        'read:detailed-data',
        'update:own-profile',
        'update:team-data',
        'update:system-settings',
        'create:users',
        'delete:users'
      ]
    };

    return permissionsMap[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}