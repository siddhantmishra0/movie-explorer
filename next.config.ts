import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["image.tmdb.org"],
	},
	// Opt into static generation with ISR where components/pages use fetch with `revalidate`
};

export default nextConfig;
