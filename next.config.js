/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.resolve.fallback = {
      fs: false,
    };
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    return config;
  },
  env: {
    WEB_SERVER_IP: "localhost:6010",
    PATH_URL_BACKEND_LOCAL: "http://localhost:6010/api/v1",
    PATH_URL_BACKEND_REMOTE: "http://134.117.214.32/api/v1",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['134.117.214.172'],
    },
  },
  publicRuntimeConfig: {
    defaultTimeout: 500000,
  },
  
};

module.exports = nextConfig;
