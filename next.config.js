const runtimeCaching = require("next-pwa/cache");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	// runtimeCaching,
	buildExcludes: [/middleware-manifest.json$/],
});

module.exports = withPWA({
	webpack: (config) => {
		config.plugins.push(
			new CopyPlugin({
				patterns: [
					{
						from: path.join(
							__dirname,
							"node_modules/ionicons/dist/ionicons/svg"
						),
						to: path.join(__dirname, "public/svg"),
					},
				],
			})
		);
		return config;
	},
});
