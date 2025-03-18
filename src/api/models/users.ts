// src/api/models/users.ts
import bcrypt from 'bcryptjs';
import { User, UserResponse } from '@/types';

// Usuários mock (simulando um banco de dados)
const users: User[] = [
  {
    id: 1,
    name: 'Admin Teste',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: 2,
    name: 'Gerente Teste',
    email: 'manager@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'manager',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 3,
    name: 'Estagiário Teste',
    email: 'intern@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'intern',
    createdAt: new Date('2023-02-01')
  }
];

// Funções do "repositório" de usuários
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser: User = {
    id: users.length + 1,
    ...userData,
    password: bcrypt.hashSync(userData.password, 10),
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
};

export const getUserList = (): UserResponse[] => {
  return users.map(user => sanitizeUser(user));
};

export const updateUser = (id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  if (userData.password) {
    userData.password = bcrypt.hashSync(userData.password, 10);
  }
  
  users[index] = { ...users[index], ...userData };
  return users[index];
};

export const deleteUser = (id: number): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;
  
  users.splice(index, 1);
  return true;
};

// Função auxiliar para remover a senha
export const sanitizeUser = (user: User): UserResponse => {
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    createdAt: user.createdAt.toISOString()
  };
};