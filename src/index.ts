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
import { tokenize } from 'tokenizer.ts';
import { exec } from 'execute.ts';
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
    let strParams = []

    for (let i of params) {
        let param: string = parseExpression(i, {
            ip: ip,
            ua: ua,
            uaRaw: uaRaw,
        });
        strParams.push(param)
        
    }
    dat = fillParam(dat,strParams)
    console.log(dat);
    return dat;
}

async function generateV2(template,params,req){
    return JSON.stringify({
        template:template,
        params:params,
        ctx:await generateContext(req)
    })
}


async function generateContext(req){
    const ip = req.headers.get('x-real-ip') || 'unknown';
    const uaRaw = req.headers.get('user-agent') || 'unknown';
    const uaObj = UAParser(uaRaw);
    let locationObj={}
    if(ip !== "unknown"){
        const locationRes = await fetch("https://ip9.com.cn/get?ip="+ip)
        const lj = await locationRes.json()
        if(lj.ret == 200){
            locationObj = lj.data
        }
    }
    return {
        ip:ip,
        uaRaw:uaRaw,
        "ua":uaRaw,
        uaObj:uaObj,
        "ua.device.modal":uaObj.device.modal || "unknown",
        "ua.device.type":uaObj.device.type || "unknown",
        "ua.device.vendor":uaObj.device.vendor || "unknown",
        location:locationObj,
        "location.country":locationObj.country || "unknown",
        "location.prov":locationObj.prov || "unknown",
        "location.city":locationObj.city || "unknown",
        "location.area":locationObj.area || "unknown",
    }
}

export function fillParam(template,params){
    for (let param of params){
        template = template.replace(/(?<!%)%s/, param);
    }
    template = template.replaceAll('%%', '%');
    return template
}

export default {
    async fetch(req:any, env:any, ctx:any) {
        const url = new URL(req.url);

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
        } finally {}

        if(url.pathname.endsWith('v1')){
            const dat = await generateV1(template, params, req);
            return new Response(dat, {
                headers: {
                    'Content-type': url.searchParams.get('type') || 'image/svg+xml; charset=utf-8',
                },
            });
        }else{// v2
            //const dat = JSON.stringify([template,params])
            const dat = await generateV2(template,params,req)
            return new Response(dat, {
                headers: {
                    'Content-type': url.searchParams.get('type') || 'image/svg+xml; charset=utf-8',
                },
            });
        }
    },
};
