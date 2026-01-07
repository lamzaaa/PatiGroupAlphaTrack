import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

async function generateImage() {
	const files = await glob('public/img/**/*.{jpg,png}');
	if (files.length === 0) {
		console.log('No new images to optimize');
		return;
	}

	await Promise.all(
		files.map(async file => {
			const outputDir = path.dirname(file);
			// .replace('public', 'optimizeImages');

			try {
				await imagemin([file], {
					destination: outputDir,
					plugins: [imageminWebp({ quality: 50 })],
				});

				console.log(`✅ Optimized ${file}. Deleting original...`);
				await fs.unlink(file);
			} catch (error) {
				throw error;
			}
		})
	);

	console.log('🎉 All images optimized and originals deleted successfully!');
}

generateImage();
