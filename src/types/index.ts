
// Tipos de usuários do sistema
export type Role = 'intern' | 'manager' | 'admin';

// Interface para usuário com senha (para banco de dados)
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

// Interface para usuário sem senha (para respostas API)
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

// Interface para requisição de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface para resposta de autenticação
export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// Interface para o payload do token JWT
export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// Interface para dados do dashboard de estagiário
export interface InternDashboardData {
  tasks: number;
  pendingReports: number;
  announcements: string[];
}

// Interface para dados do dashboard de gerente
export interface ManagerDashboardData {
  teamMembers: number;
  activeProjects: number;
  completionRate: number;
  recentActivities: {
    id: number;
    user: string;
    action: string;
    date: string;
  }[];
}

// Interface para dados do dashboard de administrador
export interface AdminDashboardData {
  totalUsers: number;
  usersByRole: {
    admins: number;
    managers: number;
    interns: number;
  };
  systemStatus: string;
  lastBackup: string;
}