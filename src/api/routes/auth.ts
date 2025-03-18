// src/api/routes/auth.ts
import express from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

// Criar um router
const router = express.Router();

// Rota pública para login
router.post('/login', login);

// Rota protegida para obter o perfil do usuário atual
router.get('/me', authenticate, getCurrentUser);

// Exportar as rotas
export const authRoutes = router;