/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove header X-Powered-By (segurança + reduz noise em logs)
  poweredByHeader: false,

  // Reduzir logs desnecessários em produção
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // React Strict Mode mantém ativo para detectar problemas em dev
  reactStrictMode: true,
};

export default nextConfig;