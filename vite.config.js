import vituum from "vituum"
import pug from "@vituum/vite-plugin-pug"
import tailwindcss from "@tailwindcss/vite"
import { sassImportsShortcut } from "./configs/shortcut"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import { ignoreAssetsPlugin } from "./configs/ignore-assets"

export default ({ mode }) => {
	const isCssOnly = mode === "css-only"
	const isJsOnly = mode === "js-only"

	// Base plugins that are always needed
	const basePlugins = [
		vituum(),
		pug({
			root: "./src",
			options: {
				pretty: true,
			},
		}),
	]

	const conditionalPlugins = []
	if (!isJsOnly) {
		conditionalPlugins.push(tailwindcss(), sassImportsShortcut())
	}
	if (!isCssOnly) {
		conditionalPlugins.push(
			ViteImageOptimizer({
				// /* pass your config */
			})
		)
	}

	const plugins = [...basePlugins, ...conditionalPlugins]

	if (isJsOnly) {
		plugins.push(
			ignoreAssetsPlugin({
				ignorePatterns: [".css", ".scss", ".sass", "styles/"],
			})
		)
	}

	if (isCssOnly) {
		plugins.push(
			ignoreAssetsPlugin({
				ignorePatterns: [
					".js",
					".ts",
					"scripts/",
					"img/",
					"fonts/.woff2",
				],
			})
		)
	}

	return {
		base: "",
		server: {
			port: 3939,
		},
		css: {
			preprocessorOptions: {
				sass: {
					silenceDeprecations: [
						"import",
						"slash-div",
						"global-builtin",
					],
					quietDeps: true,
				},
			},
		},
		plugins: plugins,
		build: {
			// Your existing build configuration
			rollupOptions: {
				external: (id) => {
					return (
						id.includes("fonts/") ||
						(id.includes("img/") && !id.endsWith(".js"))
					)
				},
				output: {
					entryFileNames: `scripts/[name].js`,
					chunkFileNames: `scripts/[name].js`,
					assetFileNames: (assetInfo) => {
						if (isJsOnly) {
							return "assets/[name].[ext]"
						}
						if (
							(assetInfo.name &&
								assetInfo.name.endsWith(".css")) ||
							(assetInfo.name && assetInfo.name.endsWith(".sass"))
						) {
							return "styles/[name].[ext]"
						}
						return "assets/[name].[ext]"
					},
				},
			},
			polyfillModulePreload: false,
		},
	}
}
