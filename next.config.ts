import type { NextConfig } from "next";

// Self-hosted in Docker (standalone server) instead of Cloudflare Workers.
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
