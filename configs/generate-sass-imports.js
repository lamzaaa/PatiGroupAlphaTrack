import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function findSassFiles(dir, basePath = "") {
	const imports = []

	try {
		const files = fs.readdirSync(dir, { withFileTypes: true })

		for (const file of files) {
			const fullPath = path.join(dir, file.name)
			const relativePath = path.join(basePath, file.name)

			if (file.isDirectory()) {
				imports.push(...findSassFiles(fullPath, relativePath))
			} else if (
				file.name.endsWith(".sass") ||
				file.name.endsWith(".scss")
			) {
				const importPath = relativePath
					.replace(/\\/g, "/")
					.replace(/\.(sass|scss)$/, "")
				imports.push(`@import "${importPath}"`)
			}
		}
	} catch (error) {
		console.log(`Directory ${dir} not found, skipping...`)
	}

	return imports
}

function generatePageImports(pageDir, pageName) {
	const pageSassFile = path.join(pageDir, `${pageName.toLowerCase()}.sass`)

	const pageImports = findSassFiles(pageDir)

	// Filter out self-imports for this specific page
	const childImports = pageImports.filter((imp) => {
		const lowerPageName = pageName.toLowerCase()
		return (
			!imp.includes(`"${pageName}"`) &&
			!imp.includes(`"${lowerPageName}"`) &&
			!imp.endsWith(`/${pageName}`) &&
			!imp.endsWith(`/${lowerPageName}`)
		)
	})

	// Check if there's a single sass file matching the page name
	const singleSassFile = path.join(pageDir, `${pageName}.sass`)
	const hasSingleFile = fs.existsSync(singleSassFile)

	if (
		childImports.length > 1 ||
		(childImports.length === 1 && !hasSingleFile)
	) {
		// Multiple children OR one child that's not the main file → Generate index file
		const pageContent = [
			`// Auto-generated ${pageName} component imports`,
			`// Generated on: ${new Date().toISOString()}`,
			"// Run 'npm run generate-imports' to regenerate",
			"",
			...childImports,
			"",
		].join("\n")

		fs.writeFileSync(pageSassFile, pageContent)
		console.log(
			`✅ Generated ${
				childImports.length
			} child imports in ${pageName.toLowerCase()}.sass`
		)

		if (childImports.length > 0) {
			console.log(`${pageName} child imports:`)
			childImports.forEach((imp) => console.log(`  ${imp}`))
		}

		return {
			type: "index",
			path: `../components/${pageName}/${pageName.toLowerCase()}`,
		}
	} else if (hasSingleFile) {
		// Single file exists → Import directly
		console.log(`✅ Found single ${pageName}.sass file`)
		return {
			type: "direct",
			path: `../components/${pageName}/${pageName}`,
		}
	}

	return null
}

function generateComponentImports() {
	const componentsDir = path.join(__dirname, "../src/components")
	const mainSassFile = path.join(__dirname, "../src/styles/main.sass")

	// Get all page directories
	const pageDirectories = []
	try {
		const files = fs.readdirSync(componentsDir, { withFileTypes: true })

		for (const file of files) {
			if (file.isDirectory()) {
				pageDirectories.push({
					name: file.name,
					path: path.join(componentsDir, file.name),
				})
			}
		}
	} catch (error) {
		console.log(`Components directory not found: ${componentsDir}`)
		return
	}

	// Generate imports for each page
	const mainImports = []
	for (const page of pageDirectories) {
		const result = generatePageImports(page.path, page.name)
		if (result) {
			mainImports.push(`@import "${result.path}"`)
		}
	}

	// Update main.sass with all page imports
	let existingContent = ""
	if (fs.existsSync(mainSassFile)) {
		existingContent = fs.readFileSync(mainSassFile, "utf8")
	}

	// Split content and find insertion points
	const lines = existingContent.split("\n")
	const coreImportIndex = lines.findIndex((line) =>
		line.includes("_core/___coreImport")
	)
	const tailwindIndex = lines.findIndex((line) =>
		line.includes("@tailwind base")
	)

	// Build new content with all page imports
	const beforeComponents = lines.slice(0, coreImportIndex + 1)
	const afterComponents = lines.slice(tailwindIndex)

	const newContent = [
		...beforeComponents,
		"",
		"// Auto-generated component imports",
		`// Generated on: ${new Date().toISOString()}`,
		"// Run 'npm run generate-imports' to regenerate",
		...mainImports,
		"",
		...afterComponents,
	].join("\n")

	fs.writeFileSync(mainSassFile, newContent)

	console.log(`✅ Updated main.sass with ${mainImports.length} page imports`)
	console.log("Main imports:")
	mainImports.forEach((imp) => console.log(`  ${imp}`))
}

generateComponentImports()
