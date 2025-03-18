// src/api/controllers/managerController.ts
import { Request, Response } from 'express';
import { ManagerDashboardData } from '@/types';

// Obter dados do dashboard do gerente
export const getDashboard = (req: Request, res: Response) => {
  try {
    const dashboardData: ManagerDashboardData = {
      teamMembers: 5,
      activeProjects: 3,
      completionRate: 78, // em porcentagem
      recentActivities: [
        { id: 1, user: 'João Silva', action: 'Completou relatório semanal', date: '2023-06-05T14:30:00Z' },
        { id: 2, user: 'Maria Oliveira', action: 'Iniciou novo projeto', date: '2023-06-05T10:15:00Z' },
        { id: 3, user: 'Carlos Souza', action: 'Atualizou status da tarefa', date: '2023-06-04T16:45:00Z' },
        { id: 4, user: 'Ana Pereira', action: 'Enviou documento para revisão', date: '2023-06-04T11:20:00Z' }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao obter dashboard do gerente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter dados da equipe
export const getTeamMembers = (req: Request, res: Response) => {
  try {
    const teamMembers = [
      { id: 1, name: 'João Silva', role: 'Estagiário', email: 'joao@example.com', performance: 85 },
      { id: 2, name: 'Maria Oliveira', role: 'Estagiária', email: 'maria@example.com', performance: 92 },
      { id: 3, name: 'Carlos Souza', role: 'Estagiário', email: 'carlos@example.com', performance: 78 },
      { id: 4, name: 'Ana Pereira', role: 'Estagiária', email: 'ana@example.com', performance: 88 },
      { id: 5, name: 'Lucas Santos', role: 'Estagiário', email: 'lucas@example.com', performance: 80 }
    ];

    res.json(teamMembers);
  } catch (error) {
    console.error('Erro ao obter membros da equipe:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter projetos ativos
export const getProjects = (req: Request, res: Response) => {
  try {
    const projects = [
      { 
        id: 1, 
        name: 'Implementação do Sistema CRM', 
        startDate: '2023-05-01', 
        deadline: '2023-07-15',
        progress: 65,
        teamMembers: [1, 2, 3]
      },
      { 
        id: 2, 
        name: 'Atualização do Site', 
        startDate: '2023-05-15', 
        deadline: '2023-06-15',
        progress: 80,
        teamMembers: [4, 5]
      },
      { 
        id: 3, 
        name: 'Análise de Dados de Vendas', 
        startDate: '2023-06-01', 
        deadline: '2023-06-30',
        progress: 20,
        teamMembers: [2, 3]
      }
    ];

    res.json(projects);
  } catch (error) {
    console.error('Erro ao obter projetos:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualizar status de um membro da equipe
export const updateTeamMember = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performance } = req.body;

    // Em uma implementação real, aqui atualizaríamos no banco de dados
    
    res.json({ 
      message: `Desempenho do membro de ID ${id} atualizado para ${performance}` 
    });
  } catch (error) {
    console.error('Erro ao atualizar membro da equipe:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};