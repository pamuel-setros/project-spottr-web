import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.68.59'],
  // The shared-workout preview card reads the Archivo display font from disk at
  // request time (readFile + process.cwd()); make sure the deploy bundles it.
  outputFileTracingIncludes: {
    '/w/**': ['./assets/fonts/**/*'],
  },
  async headers() {
    return [
      {
        // Apple's CDN requires the AASA file to be served as JSON (the file is
        // extensionless, so it would default to octet-stream). Enables universal
        // links: camera-scanning a gym QR (spottrfit.com/g/<slug>) opens the app.
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
};

export default nextConfig;
