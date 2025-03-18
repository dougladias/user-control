// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/types';
import { jwtDecode } from 'jwt-decode';

// Interface para o payload do token decodificado
interface DecodedToken {
  id: number;
  email: string;
  role: Role;
  exp: number;
}

// Rotas que não exigem autenticação
const publicRoutes = ['/', '/login', '/register'];

// Rotas permitidas por papel
const roleBasedRoutes: Record<Role, string[]> = {
  admin: ['/admin', '/manager', '/intern', '/profile'],
  manager: ['/manager', '/intern', '/profile'],
  intern: ['/intern', '/profile']
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Permitir acesso a rotas de API sem redirecionamento
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Permitir acesso a arquivos estáticos
  if (
    path.includes('/_next') ||
    path.includes('/favicon.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.svg')
  ) {
    return NextResponse.next();
  }
  
  // Permitir acesso a rotas públicas
  if (publicRoutes.some(route => path === route || path.startsWith(`${route}/`))) {
    return NextResponse.next();
  }
  
  // Verificar token de autenticação
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  try {
    // Decodificar o token
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Verificar se o token expirou
    if (decoded.exp < Date.now() / 1000) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Verificar se o usuário tem acesso à rota
    const userRole = decoded.role;
    const allowedPaths = roleBasedRoutes[userRole] || [];
    
    const hasAccess = allowedPaths.some(route => path.startsWith(route));
    
    if (!hasAccess) {
      // Redirecionar para a página inicial apropriada com base no papel
      const homePath = roleBasedRoutes[userRole][0];
      const url = new URL(homePath, request.url);
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configurar quais rotas o middleware deve ser aplicado
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};