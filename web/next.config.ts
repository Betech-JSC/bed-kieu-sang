import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
      {
        protocol: "https",
        hostname: "cms.xongnhatayue.vn",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
