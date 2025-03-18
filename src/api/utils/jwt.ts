// src/api/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types';

// Em produção, use variáveis de ambiente para o segredo
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';
const JWT_EXPIRES_IN = '24h';

// Gera um token JWT com base no payload
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

// Verifica e decodifica um token JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    return null;
  }
}