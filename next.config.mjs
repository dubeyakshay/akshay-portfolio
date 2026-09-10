/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // keep the PDF extractor out of the webpack bundle — load it natively in Node
    serverComponentsExternalPackages: ["unpdf"],
  },
};

export default nextConfig;
