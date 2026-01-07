import * as ftp from 'basic-ftp';
import ora from 'ora';
import cliColor from 'cli-color';
import inquirer from 'inquirer';
import { readdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';

/**
 * Config
 */

const folderLocal = 'dist';
const folderUpload = '/public_html/wp-content/themes/CanhCamTheme';

const client = new ftp.Client();
client.ftp.verbose = false;
const spinner = ora();

// --- Helper Functions ---

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function checkFolderDist() {
	const folderCheck = fs.existsSync(folderLocal);
	if (folderCheck) {
		return true;
	} else {
		console.error(
			cliColor.red(
				`\nError: Could not read the ${cliColor.bgRedBright(
					`"${folderLocal}"`
				)} directory. Please run ${cliColor.bgGreen.white(
					'npm run build'
				)} first.`
			)
		);
		process.exit(1);
	}
}

async function getDistFolders() {
	try {
		const dirents = await readdir(folderLocal, { withFileTypes: true });
		return dirents
			.filter(dirent => dirent.isDirectory())
			.map(dirent => {
				return {
					name: path.join(folderLocal, dirent.name),
					value: dirent.name,
				};
			});
	} catch (error) {
		console.error(
			cliColor.red(
				`\nError: Could not read the "${folderLocal}" directory. Please run "npm run build" first.`
			)
		);
		process.exit(1);
	}
}

// --- Main Interactive Deploy Function ---

async function interactiveDeploy() {
	const ftpConfig = {
		host: '',
		user: '',
		password: '',
		secure: false,
	};

	let shouldRetry = true;
	while (shouldRetry) {
		shouldRetry = false;

		try {
			spinner.start(`Connecting to ${ftpConfig.host}...`);
			await client.access(ftpConfig);
			const systemInfo = client.ftp.system
				? ` (${cliColor.cyan(client.ftp.system)})`
				: '';

			spinner.succeed(
				`Connected as ${cliColor.yellow(ftpConfig.user)}${systemInfo}`
			);

			let lastUploadedFolder = null;
			let running = true;

			while (running) {
				const folders = await getDistFolders();
				if (folders.length === 0) {
					spinner.warn(
						`No sub-folders found in "${cliColor.bold.bgRedBright(
							folderLocal
						)}" directory.`
					);
					running = false;
					continue;
				}

				const { folderToUpload } = await inquirer.prompt([
					{
						type: 'rawlist',
						name: 'folderToUpload',
						message: lastUploadedFolder
							? `Last upload: ${cliColor.green(
									lastUploadedFolder
							  )}. Select an option:`
							: 'Select a folder to upload:',
						choices: [
							...folders,
							new inquirer.Separator(),
							{ name: 'Refresh Folder', value: 'refreshFolder' },
							new inquirer.Separator(),
							{ name: 'Exit', value: 'exit' },
						],
					},
				]);

				if (folderToUpload === 'refreshFolder') {
					spinner.info('Refreshing folder list...');
					continue;
				}

				if (folderToUpload === 'exit') {
					running = false;
					continue;
				}

				await uploadSelectedFolder(folderToUpload);
				lastUploadedFolder = folderToUpload;
			}
		} catch (err) {
			spinner.fail(`❌ An error occurred: ${err.message}`);

			// Check if the error was a connection loss.
			if (client.closed) {
				const { reconnect } = await inquirer.prompt([
					{
						type: 'confirm',
						name: 'reconnect',
						message: 'Connection lost. Try to reconnect?',
						default: true,
					},
				]);

				if (reconnect) {
					shouldRetry = true; // Set the flag to re-run the outer while-loop
					spinner.info('Attempting to reconnect...');
				}
			}
		} finally {
			// Only close the client if we are not retrying and it's still open.
			if (!shouldRetry && !client.closed) {
				client.close();
				spinner.warn('Connection closed.');
			}
		}
	}
}

async function uploadSelectedFolder(folderName) {
	let currentFileProgress = { name: null, totalBytes: 0 };
	const localPath = path.join(folderLocal, folderName);
	const remotePath = path.join(folderUpload, folderName);

	// Set up the progress tracker for each upload
	client.trackProgress(info => {
		if (
			info.name !== currentFileProgress.name &&
			currentFileProgress.name !== null
		) {
			// console.log(info)
			spinner.succeed(
				`Uploaded ${cliColor.bold.green(
					currentFileProgress.name
				)} (${cliColor.bold.redBright(
					formatBytes(currentFileProgress.totalBytes)
				)})`
			);
		}
		const percentage =
			info.bytesOverall === 0
				? '0'
				: Number((info.bytes / info.bytesOverall) * 100).toFixed(2);

		spinner.text = `Uploading ${info.name} | ${cliColor.bold.green(
			percentage + '%'
		)}`;
		if (!spinner.isSpinning) spinner.start();
		currentFileProgress = { name: info.name, totalBytes: info.bytes };
	});

	try {
		spinner.start(`Preparing to upload '${folderName}'...`);
		await client.ensureDir(remotePath);
		await client.uploadFromDir(localPath, remotePath);

		if (currentFileProgress.name) {
			spinner.succeed(
				`Uploaded ${cliColor.bold.green(
					currentFileProgress.name
				)} (${cliColor.bold.redBright(
					formatBytes(currentFileProgress.totalBytes)
				)})`
			);
			spinner.info('--------------------------------');
			spinner.succeed(
				`Uploaded ${cliColor.bold.green(localPath)} -> '${remotePath}'`
			);
		} else {
			spinner.warn(`No files found to upload in '${localPath}'.`);
		}
	} catch (uploadError) {
		spinner.fail(`Failed to upload '${folderName}': ${uploadError.message}`);
		throw uploadError;
	} finally {
		client.trackProgress();
	}
}
(async () => {
	const isFolderDistExit = checkFolderDist();
	if (isFolderDistExit) {
		interactiveDeploy();
	}
})();
