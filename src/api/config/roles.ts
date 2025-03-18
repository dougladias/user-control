
import { Role } from '@/types';

// Define os papéis disponíveis
export const ROLES = {
  INTERN: 'intern' as Role,
  MANAGER: 'manager' as Role,
  ADMIN: 'admin' as Role
};

// Define as permissões para cada papel
// Ajuste na tipagem para resolver o erro
export const PERMISSIONS: { [key in Role]: string[] } = {
  'intern': [
    'read:basic-data',
    'update:own-profile'
  ],
  'manager': [
    'read:basic-data',
    'read:detailed-data',
    'update:own-profile',
    'update:team-data'
  ],
  'admin': [
    'read:basic-data',
    'read:detailed-data',
    'update:own-profile',
    'update:team-data',
    'update:system-settings',
    'create:users',
    'delete:users'
  ]
};

// Verifica se um papel tem uma permissão específica
export function hasPermission(role: Role, permission: string): boolean {
  return PERMISSIONS[role]?.includes(permission) || false;
}

// Verifica se um papel tem acesso a uma rota específica
export function checkRoleAccess(role: Role, path: string): boolean {
  // Caminhos permitidos para cada papel
  // Ajuste na tipagem para estar consistente com PERMISSIONS
  const allowedPaths: { [key in Role]: string[] } = {
    'intern': ['/intern'],
    'manager': ['/intern', '/manager'],
    'admin': ['/intern', '/manager', '/admin']
  };

  // Obter o primeiro segmento da rota
  const basePath = '/' + path.split('/')[1];
  
  return allowedPaths[role]?.includes(basePath) || false;
}