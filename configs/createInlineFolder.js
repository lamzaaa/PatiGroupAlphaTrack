import fs from "fs"
import clc from "cli-color"
import inquirer from "inquirer"
const ui = new inquirer.ui.BottomBar()
import clipboardy from "clipboardy"

function createInlineFolder(folderName) {
	if (folderName === undefined || folderName === null) {
		ui.log.write(clc.xterm(204)("Please enter Folder name **"))
		process.exit(1)
	}
	const defaultPath = `./src/components/${folderName}`
	const initialFile = `./src/pages`
	let content = `extends ../views/layouts/default.pug
	\nblock vars
	- var title = ''
	- var bodyClass = ''
	\nblock main`

	const defaultContent_1 = (folderName) => {
		content += `\n\tinclude ../components/${folderName}/${folderName}`
		return content
	}
	const defaultContent_2 = (folderName, type) => {
		let mergeContent = ""
		mergeContent = `${content}\n\tinclude ../components/${folderName}/${type}/${folderName}${type}`
		return mergeContent
	}
	const defaultContent_3 = (numSections) => {
		for (let i = 1; i <= numSections; i++) {
			content += `\n\tinclude ../components/${folderName}/${folderName}-${i}/${folderName}-${i}`
		}
		return content
	}

	function completeOutput(options) {
		process.stdout.write(clc.move.down(1))
		if (options.length === 1) {
			ui.log.write(`Page 1 ~> ${clc.xterm(45)(options[0])}`)
			clipboardy.writeSync(options[0])
			ui.log.write(`"${clc.xterm(4)(options[0])}" copied to clipboard`)
		} else {
			const clipboardText = options.join("\n")
			clipboardy.writeSync(clipboardText)
			options.forEach((option, index) => {
				ui.log.write(`Page ${index + 1} ~> ${clc.xterm(45)(option)}`)
				ui.log.write(`--> ${clc.xterm(4)(option)} copied to clipboard`)
				if (index !== options.length - 1) ui.log.write("\n")
			})
		}
	}

	const question = [
		{
			name: `1. Single folder and files`,
			value: 1,
		},
		{
			name: `2. List folder and files`,
			value: 2,
		},
		{
			name: `3. Multiple sections`,
			value: 3,
		},
	]
	inquirer
		.prompt([
			{
				type: "list",
				name: "option",
				message: "Enter the name of the folder to create:",
				choices: question,
			},
		])
		.then((answers) => {
			if (answers.option === 1) {
				// Create initial file
				fs.writeFileSync(
					`${initialFile}/${folderName}.pug`,
					defaultContent_1(folderName)
				)
				fs.mkdirSync(defaultPath)
				fs.writeFileSync(`${defaultPath}/${folderName}.pug`, "")
				fs.writeFileSync(`${defaultPath}/${folderName}.sass`, "")
				completeOutput([`${folderName}.html`])
			} else if (answers.option === 2) {
				// Create initial file
				fs.writeFileSync(
					`${initialFile}/${folderName}List.pug`,
					defaultContent_2(folderName, "List")
				)
				fs.writeFileSync(
					`${initialFile}/${folderName}Detail.pug`,
					defaultContent_2(folderName, "Detail")
				)
				completeOutput([
					`${folderName}List.html`,
					`${folderName}Detail.html`,
				])

				fs.mkdirSync(defaultPath)
				fs.mkdirSync(`${defaultPath}/List`)
				fs.writeFileSync(
					`${defaultPath}/List/${folderName}List.pug`,
					""
				)
				fs.writeFileSync(
					`${defaultPath}/List/${folderName}List.sass`,
					""
				)
				fs.mkdirSync(`${defaultPath}/Detail`)
				fs.writeFileSync(
					`${defaultPath}/Detail/${folderName}Detail.pug`,
					""
				)
				fs.writeFileSync(
					`${defaultPath}/Detail/${folderName}Detail.sass`,
					""
				)
			} else if (answers.option === 3) {
				inquirer
					.prompt([
						{
							type: "number",
							name: "value",
							message: clc.blueBright(
								"Enter the number of sections you want to create:"
							),
						},
					])
					.then((numberOfSections) => {
						const numSections = parseInt(numberOfSections.value, 10)
						fs.writeFileSync(
							`${initialFile}/${folderName}.pug`,
							defaultContent_3(numberOfSections.value)
						)
						fs.mkdirSync(defaultPath)
						completeOutput([`${folderName}.html`])
						if (isNaN(numSections)) {
							console.log(
								clc.redBright(
									"Invalid input. Please enter a valid number."
								)
							)
						} else {
							for (let i = 1; i <= numSections; i++) {
								const sectionPath = `${defaultPath}/${folderName}-${i}`
								fs.mkdirSync(sectionPath)
								fs.writeFileSync(
									`${sectionPath}/${folderName}-${i}.pug`,
									`section.${folderName.toLowerCase()}-${i}.section`
								)
								fs.writeFileSync(
									`${sectionPath}/${folderName}-${i}.sass`,
									""
								)
							}
							ui.log.write("Creating files")
						}
					})
			}
			if (answers.option > 3) {
				console.log(answers.option)
				ui.log.write(clc.xterm(204)("Please chose again"))
			}
		})
		.catch((error) => {
			console.log(error)
			if (error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
			} else {
				// Something else went wrong
			}
		})
}

console.log("-----------------------")
console.log(clc.greenBright("Running createInlineFolder..."))
console.log("-----------------------")
const folderName = process.argv[2]
createInlineFolder(folderName)
