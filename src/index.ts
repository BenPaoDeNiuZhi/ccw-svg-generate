/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { UAParser } from 'ua-parser-js';

function parseExpression(token:any, ctx:any) {
	let param: string;
	console.log(JSON.stringify(token));
	if (token.hasOwnProperty('type')) {
		switch (token.type) {
			case 'concat': // type:concat params:["hello","ua"]
				const funcParams = token?.params || [];
				let ret = '';
				for (let dat of funcParams) {
					ret += parseExpression(dat, ctx);
				}
				return ret;
		}
		param = JSON.stringify(token);
	} else {
		switch (token) {
			case 'ip':
				param = ctx.ip;
				break;
			case 'ua':
				param = ctx.uaRaw;
				break;
			case 'ua.device.modal': //型号
				param = ctx.ua.device.model || 'unknown';
				break;
			case 'ua.device.type': //类型
				param = ctx.ua.device.type || 'unknown';
				break;
			case 'ua.device.vendor': //厂商
				param = ctx.ua.device.vendor || 'unknown';
				break;
			default:
				param = token.toString();
		}
	}
	return param;
}

async function generateV1(
	pattern: string,
	params: [string | { type: string; hasOwnProperty: () => boolean }],
	req: { headers: Headers }
): Promise<string> {
	let dat = pattern;
	console.log(JSON.stringify(params));
	const ip = req.headers.get('x-real-ip') || 'unknown';
	const uaRaw = req.headers.get('user-agent') || 'unknown';
	const ua = UAParser(uaRaw);

	for (let i of params) {
		let param: string = parseExpression(i, {
			ip: ip,
			ua: ua,
			uaRaw: uaRaw,
		});
		dat = dat.replace(/(?<!%)%s/, param);
	}
	dat = dat.replaceAll('%%', '%');
	console.log(dat);
	return dat;
}

export default {
	async fetch(req:any, env:any, ctx:any) {
		const url = new URL(req.url);
		if(url.pathname.endsWith('v1')){
			let template: string, params;
			try {
				template = url.searchParams.get('template') || url.searchParams.get('t') || '未传入数据';
				params = JSON.parse(url.searchParams.get('params') || url.searchParams.get('param') || '[]');
			} catch (e: any) {
				return new Response('解析参数与模板时出错' + e.toString(), {
					headers: {
						'Content-type': 'text/plain; charset=utf-8',
					},
					status: 500,
				});
			} finally {
			}
			const dat = await generateV1(template, params, req);
			return new Response(dat, {
				headers: {
					'Content-type': url.searchParams.get('type') || 'image/svg+xml; charset=utf-8',
				},
			});
		}
	},
};
