import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@mediapipe/pose',
    '@mediapipe/camera_utils',
    '@mediapipe/drawing_utils',
  ],
};

export default nextConfig;
