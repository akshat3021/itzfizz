// GitHub Pages serves project sites from /<repo-name>, so the deploy workflow
// passes that path in. Locally it stays empty and the site runs at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // fully static HTML/CSS/JS -> ./out
  basePath,
  trailingSlash: true,
  images: { unoptimized: true }, // no image server on GitHub Pages
}

export default nextConfig
