/** @type {import('next').NextConfig} */

// Where the kcl-diff service lives. Local dev defaults to the :8080 server;
// in production set DIFF_API_URL to the deployed Rust host.
const DIFF_API_URL = process.env.DIFF_API_URL || "http://localhost:8080";

const nextConfig = {
  async rewrites() {
    return [{ source: "/api/diff", destination: `${DIFF_API_URL}/diff` }];
  },
};

export default nextConfig;
