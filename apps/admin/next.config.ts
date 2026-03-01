import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@beads-bonita/core",
    "@beads-bonita/supabase",
    "@beads-bonita/ui",
  ],
};

export default nextConfig;
