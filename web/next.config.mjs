/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Enable the WebAssembly produced by wasm-pack (output: web/lib/pkg).
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
