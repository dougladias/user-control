
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboardData } from '@/types';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar dados do dashboard');
        }

        const data = await response.json();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // Renderização condicional com base no estado de carregamento e erro / Banco de dados
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Administrador</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        ) : dashboard ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm text-gray-500 uppercase">Total de Usuários</h2>
                <div className="mt-2 text-3xl font-bold text-blue-600">{dashboard.totalUsers}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm text-gray-500 uppercase">Administradores</h2>
                <div className="mt-2 text-3xl font-bold text-purple-600">{dashboard.usersByRole.admins}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm text-gray-500 uppercase">Gerentes</h2>
                <div className="mt-2 text-3xl font-bold text-green-600">{dashboard.usersByRole.managers}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm text-gray-500 uppercase">Estagiários</h2>
                <div className="mt-2 text-3xl font-bold text-yellow-600">{dashboard.usersByRole.interns}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Status do Sistema</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {dashboard.systemStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Último Backup</span>
                    <span className="text-gray-800">
                      {new Date(dashboard.lastBackup).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Distribuição de Usuários</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                        Admins
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {Math.round((dashboard.usersByRole.admins / dashboard.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div style={{ width: `${(dashboard.usersByRole.admins / dashboard.totalUsers) * 100}%` }} 
                         className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                  </div>
                  
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                        Gerentes
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {Math.round((dashboard.usersByRole.managers / dashboard.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                    <div style={{ width: `${(dashboard.usersByRole.managers / dashboard.totalUsers) * 100}%` }} 
                         className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                  </div>
                  
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-100">
                        Estagiários
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-yellow-600">
                        {Math.round((dashboard.usersByRole.interns / dashboard.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                    <div style={{ width: `${(dashboard.usersByRole.interns / dashboard.totalUsers) * 100}%` }} 
                         className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                  </div>
                </div>
              </div>
            </div>

            // Sidebar com ações administrativas
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Ações Administrativas</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="primary">Gerenciar Usuários</Button>
                <Button variant="secondary">Configurações</Button>
                <Button variant="success">Backup Manual</Button>
                <Button variant="danger">Manutenção</Button>
              </div>
            </div>
          </>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </div>
    </DashboardLayout>
  );
}