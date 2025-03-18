
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { managerRoutes } from './routes/manager';
import { internRoutes } from './routes/intern';

// Criar a aplicação Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware básico
app.use(helmet()); // Segurança
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/intern', internRoutes);

// Rota de teste/saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Middleware de tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});

export default app;