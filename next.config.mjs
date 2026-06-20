/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // هذا هو السطر الجديد اللي ضفناه عشان الـ APK
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig