/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		config.cache = false;
		return config;
	},
};

module.exports = nextConfig;
