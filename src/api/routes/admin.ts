
import express from 'express';
import { 
  getDashboard, 
  getUsers, 
  getUserById, 
  addUser, 
  updateUserById, 
  removeUser, 
  getSystemSettings, 
  updateSystemSettings 
} from '../controllers/adminController';
import { authenticate, authorize, requirePermission } from '../middleware/auth';

// Criar um router
const router = express.Router();

// Aplicar middleware de autenticação para todas as rotas
router.use(authenticate);

// Aplicar verificação de papel de administrador para todas as rotas
router.use(authorize('admin'));

// Rotas para gerenciamento de usuários
router.get('/dashboard', requirePermission('read:system-settings'), getDashboard);
router.get('/users', requirePermission('read:system-settings'), getUsers);
router.get('/users/:id', requirePermission('read:system-settings'), getUserById);
router.post('/users', requirePermission('create:users'), addUser);
router.put('/users/:id', requirePermission('update:system-settings'), updateUserById);
router.delete('/users/:id', requirePermission('delete:users'), removeUser);

// Rotas para configurações do sistema
router.get('/settings', requirePermission('read:system-settings'), getSystemSettings);
router.put('/settings', requirePermission('update:system-settings'), updateSystemSettings);

// Exportar as rotas
export const adminRoutes = router;