import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable external packages for server components (Next.js 15 format)
  serverExternalPackages: ['googleapis'],
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Environment variables configuration
  env: {
    GOOGLE_SHEETS_PROJECT_ID: process.env.GOOGLE_SHEETS_PROJECT_ID,
    GOOGLE_SHEETS_PRIVATE_KEY_ID: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEETS_CLIENT_ID: process.env.GOOGLE_SHEETS_CLIENT_ID,
    DEFAULT_SPREADSHEET_ID: process.env.DEFAULT_SPREADSHEET_ID,
  },
  
  // Webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle Google APIs on server side
      config.externals = [...(config.externals || []), 'googleapis'];
    }
    return config;
  },
  
  // Headers for better security
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
