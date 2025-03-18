// src/api/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, sanitizeUser } from '../models/users';
import { generateToken } from '../utils/jwt';
import { LoginRequest } from '@/types';

// Controlador para login
export const login = (req: Request, res: Response): void => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Verificar se o email e a senha foram fornecidos
    if (!email || !password) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    // Buscar o usuário pelo email
    const user = findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Verificar se a senha está correta
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Senha incorreta' });
      return;
    }

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Retornar usuário e token (sem a senha)
    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Controlador para obter perfil do usuário atual
export const getCurrentUser = (req: Request, res: Response): void => {
  try {
    // O middleware de autenticação já adicionou o usuário ao req
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    // Buscar dados completos do usuário
    const user = findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Retornar usuário (sem a senha)
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};