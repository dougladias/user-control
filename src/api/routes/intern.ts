
import express from 'express';
import { getDashboard, getTasks } from '../controllers/internController';
import { authenticate, authorize, requirePermission } from '../middleware/auth';
import { ROLES } from '../config/roles';

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rotas para estagiários (também acessíveis por gerentes e admins)
router.get('/dashboard', 
  authorize(['intern', 'manager', 'admin']), 
  requirePermission('read:basic-data'),
  getDashboard
);
// Rotas para estagiários (também acessíveis por gerentes e admins)
router.get('/tasks', 
  authorize(['intern', 'manager', 'admin']), 
  requirePermission('read:basic-data'),
  getTasks
);

export const internRoutes = router;