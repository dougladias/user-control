// src/api/routes/manager.ts
import express from 'express';
import { getDashboard, getTeamMembers, getProjects, updateTeamMember } from '../controllers/managerController';
import { authenticate, authorize, requirePermission } from '../middleware/auth';

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rotas para gerentes (também acessíveis por admins)
router.get('/dashboard', 
  authorize(['manager', 'admin']),
  requirePermission('read:detailed-data'),
  getDashboard
);

router.get('/team', 
  authorize(['manager', 'admin']),
  requirePermission('read:detailed-data'),
  getTeamMembers
);

router.get('/projects', 
  authorize(['manager', 'admin']),
  requirePermission('read:detailed-data'),
  getProjects
);

router.put('/team/:id', 
  authorize(['manager', 'admin']),
  requirePermission('update:team-data'),
  updateTeamMember
);

export const managerRoutes = router;