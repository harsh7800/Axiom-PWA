import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // This line
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dkuzirpnfhuckpfriciw.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },

  /* config options here */
};

export default nextConfig;
