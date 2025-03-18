// src/app/intern/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { InternDashboardData } from '@/types';

export default function InternPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<InternDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/intern/dashboard', {
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Estagiário</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Resumo</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Tarefas Pendentes:</span>
                  <span className="ml-2 font-medium">{dashboard.tasks}</span>
                </div>
                <div>
                  <span className="text-gray-600">Relatórios Pendentes:</span>
                  <span className="ml-2 font-medium">{dashboard.pendingReports}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Anúncios</h2>
              {dashboard.announcements.length > 0 ? (
                <ul className="space-y-2">
                  {dashboard.announcements.map((announcement, index) => (
                    <li key={index} className="pb-2 border-b border-gray-100">
                      {announcement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum anúncio no momento.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </div>
    </DashboardLayout>
  );
}