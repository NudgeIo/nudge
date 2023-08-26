/** @type {import('next').NextConfig} */
// const nextConfig = {

  
// }

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['yt3.googleusercontent.com','yt3.ggpht.com','i.ytimg.com'],
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  }
};