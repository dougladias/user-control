// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removi a opção 'swcMinify' que não é mais reconhecida no Next.js 15
  reactStrictMode: true,
  // Configuração para ambiente de desenvolvimento: API interna
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*', // Redireciona para o backend
      },
    ];
  },
};

export default nextConfig;