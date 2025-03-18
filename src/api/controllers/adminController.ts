
import { Request, Response } from 'express';
import { AdminDashboardData } from '@/types';
import { 
  getUserList, 
  findUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  sanitizeUser 
} from '../models/users';

// Obter dados do dashboard do administrador
export const getDashboard = (req: Request, res: Response): void => {
  try {
    const dashboardData: AdminDashboardData = {
      totalUsers: 15,
      usersByRole: {
        admins: 2,
        managers: 3,
        interns: 10
      },
      systemStatus: 'Operational',
      lastBackup: '2023-06-04T23:00:00Z'
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao obter dashboard do administrador:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter lista de todos os usuários
export const getUsers = (req: Request, res: Response): void => {
  try {
    const users = getUserList();
    res.json(users);
  } catch (error) {
    console.error('Erro ao obter lista de usuários:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter usuário específico por ID
export const getUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const user = findUserById(Number(id));
    
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('Erro ao obter usuário por ID:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Criar novo usuário
export const addUser = (req: Request, res: Response): void => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificações básicas
    if (!name || !email || !password || !role) {
      res.status(400).json({ 
        message: 'Dados incompletos. Nome, email, senha e papel são obrigatórios' 
      });
      return;
    }
    
    // Verificar se email já existe
    const existingUser = findUserById(Number(email));
    if (existingUser) {
      res.status(409).json({ message: 'Email já está em uso' });
      return;
    }
    
    // Criar usuário
    const newUser = createUser({ name, email, password, role });
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualizar usuário existente
export const updateUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    
    // Validar existência do usuário
    const existingUser = findUserById(Number(id));
    if (!existingUser) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    
    // Atualizar usuário
    const updatedUser = updateUser(Number(id), { name, email, password, role });
    
    if (!updatedUser) {
      res.status(500).json({ message: 'Falha ao atualizar usuário' });
      return;
    }
    
    res.json({
      message: 'Usuário atualizado com sucesso',
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Remover usuário
export const removeUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    // Validar existência do usuário
    const existingUser = findUserById(Number(id));
    if (!existingUser) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    
    // Não permitir que um administrador exclua a si mesmo
    if (req.user?.id === Number(id)) {
      res.status(403).json({ 
        message: 'Não é permitido excluir seu próprio usuário' 
      });
      return;
    }
    
    // Excluir usuário
    const success = deleteUser(Number(id));
    
    if (!success) {
      res.status(500).json({ message: 'Falha ao excluir usuário' });
      return;
    }
    
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter configurações do sistema
export const getSystemSettings = (req: Request, res: Response): void => {
  try {
    const settings = {
      appName: 'Sistema de Controle de Acesso',
      version: '1.0.0',
      maintenanceMode: false,
      backupSchedule: '0 0 * * *', // Cron expression: diariamente à meia-noite
      sessionTimeout: 60, // minutos
      loggingLevel: 'info',
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'],
      maxFileSize: 5 // MB
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Erro ao obter configurações do sistema:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualizar configurações do sistema
export const updateSystemSettings = (req: Request, res: Response): void => {
  try {
    const { 
      maintenanceMode, 
      sessionTimeout, 
      loggingLevel, 
      backupSchedule 
    } = req.body;
    
    // Em uma implementação real, aqui atualizaríamos no banco de dados
    
    res.json({ 
      message: 'Configurações do sistema atualizadas com sucesso',
      settings: {
        appName: 'Sistema de Controle de Acesso',
        version: '1.0.0',
        maintenanceMode: maintenanceMode ?? false,
        backupSchedule: backupSchedule ?? '0 0 * * *',
        sessionTimeout: sessionTimeout ?? 60,
        loggingLevel: loggingLevel ?? 'info',
        allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'],
        maxFileSize: 5
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações do sistema:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};