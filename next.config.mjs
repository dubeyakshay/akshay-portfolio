/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdf-parse (pdfjs) must not be bundled by webpack — load it natively in Node
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
