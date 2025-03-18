// src/api/controllers/internController.ts
import { Request, Response } from 'express';
import { InternDashboardData } from '@/types';

// Obter dados do dashboard do estagiário
export const getDashboard = (req: Request, res: Response) => {
  try {
    const dashboardData: InternDashboardData = {
      tasks: 5,
      pendingReports: 2,
      announcements: [
        'Entrega de relatório semanal até sexta-feira',
        'Reunião de equipe na próxima segunda-feira',
        'Novo treinamento disponível na plataforma'
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao obter dashboard do estagiário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Método para obter as tarefas do estagiário
export const getTasks = (req: Request, res: Response) => {
  try {
    const tasks = [
      { id: 1, title: 'Completar relatório semanal', deadline: '2023-06-09', status: 'pending' },
      { id: 2, title: 'Revisar documentação', deadline: '2023-06-10', status: 'in-progress' },
      { id: 3, title: 'Atualizar base de conhecimento', deadline: '2023-06-15', status: 'pending' }
    ];

    res.json(tasks);
  } catch (error) {
    console.error('Erro ao obter tarefas do estagiário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};