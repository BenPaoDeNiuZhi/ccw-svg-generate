/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

function generate(pattern,param,req){
  let dat=pattern
  console.log(param)
  const ip=req.headers.get("x-real-ip")
  for(let i of param){
    console.log(i)
    if(i=="ip"){
      dat = dat.replace("%s",ip)
    }
  }
  console.log(dat)
  return dat
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url)
    return new Response(
      generate(
        url.searchParams.get("template"),
        JSON.parse(url.searchParams.get("param")),
        req
      ),{
        headers:{
          "Content-type":"image/svg+xml"
        }
      }
    );
  }
};