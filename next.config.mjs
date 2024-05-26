/** @type {import('next').NextConfig} */

import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = (await import('@ducanh2912/next-pwa')).default({
      dest: 'public',
      register: true,
      skipWaiting: true,
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;
