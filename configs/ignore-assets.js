export function ignoreAssetsPlugin(options) {
	return {
		name: "ignore-assets",
		enforce: "pre", // Run this plugin before others
		resolveId(source, importer) {
			if (
				options.ignorePatterns.some((pattern) =>
					source.includes(pattern)
				)
			) {
				// Return a special ID that tells Rollup to resolve this as an empty module
				return "virtual-empty-module"
			}
			return null // Let other plugins handle it
		},
		load(id) {
			if (id === "virtual-empty-module") {
				return "" // Return an empty string as the module content
			}
			return null // Let other plugins handle it
		},
	}
}
