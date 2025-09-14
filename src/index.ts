/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

async function generate(
	pattern: string,
	params: [string | { type: string; hasOwnProperty: () => boolean }],
	req: { headers: Headers }
): Promise<string> {
	let dat = pattern;
	console.log(params);
	const ip = req.headers.get('x-real-ip') || 'unknown';
	const ua = req.headers.get('user-agent') || 'unknown';

	for (let i of params) {
		console.log(i);
		let param: string;
		if (i.hasOwnProperty('type')) {
			param = JSON.stringify(i);
		} else {
			switch (i) {
				case 'ip':
					param = ip;
					break;
				case 'ua':
					param = ua;
					break;
				default:
					param = '%%s';
			}
		}
		dat = dat.replace(/(?<!%)%s/, param);
	}
	dat = dat.replaceAll('%%', '%');
	console.log(dat);
	return dat;
}

export default {
	async fetch(req, env, ctx) {
		const url = new URL(req.url);
		const dat = await generate(
			url.searchParams.get('template') || '未传入数据',
			JSON.parse(url.searchParams.get('params') || url.searchParams.get('param') || '[]'),
			req
		);
		return new Response(dat, {
			headers: {
				'Content-type': url.searchParams.get('type') || 'image/svg+xml',
			},
		});
	},
};
