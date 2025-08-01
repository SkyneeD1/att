/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for deployment
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  // Environment configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Allow cross-origin requests for Replit domain
  allowedDevOrigins: ['*.replit.dev', '*.replit.app'],
  
  // Add headers for CORS
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    config.resolve.symlinks = false;
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/.git', '**/replit_modules', '**/.cache'],
    };
    return config;
  },
}

module.exports = nextConfig