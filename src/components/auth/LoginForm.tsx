
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Adicionando log para depuração
      console.log('Tentando fazer login com:', email);
      
      const success = await login(email, password);
      
      if (!success) {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      // Adicionando formulário de login
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu email"
          fullWidth
          required
        />
        
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          fullWidth
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Entrar
        </Button>
      </form>
      
      // Adicionando credenciais de teste
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Credenciais de teste:</p>
        <p>Estagiário: intern@example.com / password123</p>
        <p>Gerente: manager@example.com / password123</p>
        <p>Admin: admin@example.com / password123</p>
      </div>
    </div>
  );
}