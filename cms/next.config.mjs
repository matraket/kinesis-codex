/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: true
  },
  outputFileTracingIncludes: {
    '/api/**': ['./lib/**/*', './store/**/*']
  }
};

export default nextConfig;
