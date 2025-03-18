
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

// Componente DashboardLayout
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated, logout, hasPermission } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Verificar permissão de acesso
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Controle de Acesso</h1>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <div className="text-sm text-gray-400">Logado como</div>
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-gray-400">{getRoleName(user?.role)}</div>
        </div>
               
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getLinksByRole(user?.role).map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={logout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle(user?.role)}
            </h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Função para obter o nome exibido do papel
function getRoleName(role?: Role): string {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'manager':
      return 'Gerente';
    case 'intern':
      return 'Estagiário';
    default:
      return 'Usuário';
  }
}

// Função para obter o título da página baseado no papel
function getPageTitle(role?: Role): string {
  switch (role) {
    case 'admin':
      return 'Painel do Administrador';
    case 'manager':
      return 'Painel do Gerente';
    case 'intern':
      return 'Painel do Estagiário';
    default:
      return 'Dashboard';
  }
}

// Função para obter os links baseados no papel
function getLinksByRole(role?: Role): { label: string; path: string }[] {
  const links = [];
  
  // Links comuns
  links.push({ label: 'Perfil', path: '/profile' });
  
  // Links específicos por papel
  switch (role) {
    case 'admin':
      links.unshift(
        { label: 'Dashboard', path: '/admin' },
        { label: 'Usuários', path: '/admin/users' },
        { label: 'Configurações', path: '/admin/settings' }
      );
      break;
    case 'manager':
      links.unshift(
        { label: 'Dashboard', path: '/manager' },
        { label: 'Equipe', path: '/manager/team' },
        { label: 'Projetos', path: '/manager/projects' }
      );
      break;
    case 'intern':
      links.unshift(
        { label: 'Dashboard', path: '/intern' },
        { label: 'Tarefas', path: '/intern/tasks' }
      );
      break;
  }
  
  return links;
}