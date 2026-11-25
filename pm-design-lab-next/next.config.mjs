/** @type {import('next').NextConfig} */
export default {
  // The lab is a client-side prototype: every design renders in the browser only.
  reactStrictMode: true,
  images: { unoptimized: true },
  // Hide the Next.js dev badge (it sits bottom-left, over designs like the Dialer 2.0 status pill)
  devIndicators: false,
}
