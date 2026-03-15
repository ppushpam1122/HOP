/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const BASE_PATH = isProd ? '/Peacock' : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath:    BASE_PATH,
  // No trailing slash — this was causing CSS/JS assets to 404 on GitHub Pages
  assetPrefix: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

module.exports = nextConfig;
