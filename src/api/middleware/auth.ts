
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { hasPermission } from '../config/roles';
import { Role } from '@/types';

// Estender a interface Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
      };
    }
  }
}

// Middleware para verificar autenticação
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Obter o cabeçalho de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token de autenticação não fornecido' });
      return; // Note que não retornamos a resposta, apenas chamamos res.status().json() e depois retornamos void
    }

    // Extrair e verificar o token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Token inválido ou expirado' });
      return;
    }

    // Adicionar usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Falha na autenticação' });
  }
};

// Middleware para verificar papel
export const authorize = (roles: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ 
          message: 'Acesso negado. Você não tem permissão para este recurso.'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro de autorização:', error);
      res.status(403).json({ message: 'Falha na autorização' });
    }
  };
};

// Middleware para verificar permissão específica
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      if (!hasPermission(req.user.role, permission)) {
        res.status(403).json({ 
          message: `Acesso negado. Você não tem a permissão: ${permission}`
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro de verificação de permissão:', error);
      res.status(403).json({ message: 'Falha na verificação de permissão' });
    }
  };
};