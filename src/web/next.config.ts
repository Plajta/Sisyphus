import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.privezemenakup.cz",
			},
		],
	},
};

export default nextConfig;
