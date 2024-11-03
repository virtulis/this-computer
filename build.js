import { mkdir, readdir, readFile, writeFile, realpath } from 'fs/promises';

async function main() {

	const { default: config } = await import('./config.js');

	await mkdir('dist', { recursive: true });
	await mkdir('conf', { recursive: true });

	const BASE_DIR = await realpath(process.cwd());
	const DIST_DIR = await realpath('dist');
	const CONF_DIR = await realpath('conf');
	const [BASE_HOST, IP4_HOST, IP6_HOST, PONG_PORT] = [config.baseHost, config.ipv4Host, config.ipv4Host, config.pongServerPort];
	const CONFIG_JSON = JSON.stringify(config);

	const vars = { BASE_HOST, IP4_HOST, IP6_HOST, BASE_DIR, DIST_DIR, CONF_DIR, PONG_PORT, CONFIG_JSON };
	console.log(vars);

	const files = await readdir('template');
	for (const fn of files) {
		let src = await readFile(`template/${fn}`, 'utf-8');
		for (const [key, val] of Object.entries(vars)) {
			src = src.replaceAll(key, val);
		}
		const out = fn.match(/\.(conf|service)$/) ? 'conf' : 'dist';
		await writeFile(`${out}/${fn}`, src);
	}

}

await main();
