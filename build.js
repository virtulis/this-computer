import { mkdir, readdir, readFile, writeFile } from 'fs/promises';

async function main() {
	
	const args = process.argv.slice(2);
	
	if (args.length != 4) {
		console.log('Usage: node build.js base_host ip4_host ip6_host root_dir');
		return;
	}
	
	const [BASE_HOST, IP4_HOST, IP6_HOST, DIST_DIR] = args;
	const vars = { BASE_HOST, IP4_HOST, IP6_HOST, DIST_DIR };
	console.log(vars);
	
	await mkdir('dist', { recursive: true });
	await mkdir('conf', { recursive: true });
	
	const files = await readdir('template');
	for (const fn of files) {
		let src = await readFile(`template/${fn}`, 'utf-8');
		for (const [key, val] of Object.entries(vars)) {
			src = src.replaceAll(key, val);
		}
		const out = fn.match(/\.conf$/) ? 'conf' : 'dist';
		await writeFile(`${out}/${fn}`, src);
	}
	
}

await main();
