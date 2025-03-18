
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { ManagerDashboardData } from '@/types';

export default function ManagerPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<ManagerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/manager/dashboard', {
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
        <h1 className="text-2xl font-bold mb-6">Dashboard do Gerente</h1>
              
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
          // Adicionando mais dois cards
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Membros da Equipe</h2>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-blue-600">{dashboard.teamMembers}</div>
                  <div className="ml-2 text-sm text-gray-500">profissionais</div>
                </div>
              </div>

              // Adicionando mais dois cards
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Projetos Ativos</h2>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-green-600">{dashboard.activeProjects}</div>
                  <div className="ml-2 text-sm text-gray-500">em andamento</div>
                </div>
              </div>
              
              // Adicionando mais dois cards
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Taxa de Conclusão</h2>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-purple-600">{dashboard.completionRate}%</div>
                  <div className="ml-2 text-sm text-gray-500">de tarefas</div>
                </div>
              </div>
            </div>
            
            // Adicionando mais dois cards
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Atividades Recentes</h2>
              {dashboard.recentActivities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboard.recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{activity.user}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{activity.action}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {new Date(activity.date).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma atividade recente.</p>
              )}
            </div>
            
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                  Ver Membros da Equipe
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
                  Gerenciar Projetos
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
                  Gerar Relatórios
                </button>
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