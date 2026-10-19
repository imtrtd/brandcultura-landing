/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site (no API routes, server actions, middleware or dynamic SSR),
  // so we use Next's static export. `next build` writes plain files to ./out,
  // which Cloudflare Pages serves directly. Vercel also supports static exports.
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
