import { execSync } from 'child_process';

export function sassImportsShortcut() {
	return {
		name: 'sass-imports-shortcut',
		configureServer(server) {
			// Override the shortcuts to add our custom one
			server.bindCLIShortcuts = function ({ print = true } = {}) {
				if (!server.httpServer || !process.stdin.isTTY || process.env.CI) {
					return;
				}

				if (!process.stdin.setRawMode) {
					return;
				}

				const shortcuts = [
					{
						key: 'r',
						description: 'restart the server',
						async action() {
							await server.restart();
						},
					},
					{
						key: 'u',
						description: 'show server url',
						action() {
							server.printUrls();
						},
					},
					{
						key: 'o',
						description: 'open in browser',
						action() {
							server.openBrowser();
						},
					},
					{
						key: 'c',
						description: 'clear console',
						action() {
							server.config.logger.clearScreen('error');
						},
					},
					{
						key: 'g', // Our custom shortcut
						description: 'generate sass imports',
						action() {
							console.log('\n🔄 Generating Sass imports...');
							try {
								execSync('npm run generate-imports', {
									stdio: 'inherit',
								});
								console.log('✅ Sass imports generated successfully!\n');
							} catch (error) {
								console.error('❌ Error generating imports:', error.message);
							}
						},
					},
					{
						key: '[',
						description: 'build CSS',
						action() {
							console.log('\n🔄 Building CSS...');
							try {
								execSync('npm run build:css', {
									stdio: 'inherit',
								});
								console.log('✅ CSS build successfully!\n');
							} catch (error) {
								console.error('❌ Error building CSS:', error.message);
							}
						},
					},
					{
						key: ']',
						description: 'build JS',
						action() {
							console.log('\n🔄 Building JS...');
							try {
								execSync('npm run build:js', {
									stdio: 'inherit',
								});
								console.log('✅ Build JS successfully!\n');
							} catch (error) {
								console.error('❌ Error building JS:', error.message);
							}
						},
					},
					{
						key: 'p',
						description: 'optimize images',
						action() {
							console.log('\n🔄 Optimizing images...');
							try {
								execSync('npm run optimize-images', {
									stdio: 'inherit',
								});
							} catch (error) {
								console.error('❌ Error optimizing images:', error.message);
							}
						},
					},
					{
						key: 'q',
						description: 'quit',
						action() {
							process.exit();
						},
					},
				];

				let actionRunning = false;
				let pendingShortcut = null; // Add this to track pending shortcut

				const onInput = async input => {
					// ctrl+c or ctrl+d
					if (input === '\x03' || input === '\x04') {
						process.exit();
					}

					if (actionRunning) return;

					// Handle Enter key
					if (input === '\r' || input === '\n') {
						if (pendingShortcut) {
							actionRunning = true;
							await pendingShortcut.action();
							actionRunning = false;
							pendingShortcut = null;
						}
						return;
					}

					// Handle help
					if (input === 'h') {
						console.log(
							[
								'',
								'  Shortcuts',
								...shortcuts.map(
									shortcut =>
										`⇢ press ${shortcut.key} + enter to ${shortcut.description}`
								),
							].join('\n')
						);
						return;
					}

					// Find shortcut but don't execute yet
					const shortcut = shortcuts.find(shortcut => shortcut.key === input);

					if (shortcut) {
						pendingShortcut = shortcut;
						console.log(`Press Enter to ${shortcut.description}...`);
					} else {
						// Reset pending shortcut if invalid key is pressed
						pendingShortcut = null;
					}
				};

				process.stdin.setRawMode(true);
				process.stdin.on('data', onInput).setEncoding('utf8');

				if (print) {
					console.log(
						[
							'',
							'  Shortcuts',
							...shortcuts.map(
								shortcut =>
									`  ⇢ press ${shortcut.key} + enter to ${shortcut.description}`
							),
						].join('\n')
					);
				}
			};
		},
	};
}
