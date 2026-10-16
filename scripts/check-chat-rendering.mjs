// Pixel regression for the actual shared bubble stylesheet. No site JavaScript required.
// Reuse PLAYWRIGHT_MODULE; optional BROWSER_CHANNEL and CHAT_ARTIFACT_DIR.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const css=fs.readFileSync(new URL('../src/styles/editorial/chat-bubble.css',import.meta.url),'utf8');
const output=process.env.CHAT_ARTIFACT_DIR;
if(output)fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const variants=[{name:'left',className:'im-bubble-left',light:[255,255,255],dark:[44,44,44]}, {name:'wechat',className:'im-bubble-right im-wechat-right',light:[149,236,105],dark:[43,122,45]}, {name:'qq',className:'im-bubble-right im-qq-right',light:[18,183,245],dark:[2,136,209]}];
let cases=0;
const failures=[];
const summaries=[];
try{
 for(const dpr of [1,1.25,2,2.625,3]){
  const context=await browser.newContext({viewport:{width:1000,height:720},deviceScaleFactor:dpr});
  const page=await context.newPage();
  for(const zoom of [1,1.25,2,4])for(const offset of [0,.5])for(const dark of [false,true])for(const variant of variants){
   const label=`${variant.name}/${dark?'dark':'light'}/dpr${dpr}/zoom${zoom}/offset${offset}`;
   await page.setContent(`<style>${css}</style><style>html{zoom:${zoom};color-scheme:${dark?'dark':'only light'}}body{margin:0;background:#eee}.im-bubble-container{box-sizing:border-box;position:absolute;left:${40+offset}px;top:${24+offset}px;width:180px;height:72px}</style><div class="${dark?'dark':''}"><div class="im-message-row"><div class="im-bubble-container ${variant.className}"><div class="im-bubble-content"></div></div></div></div>`);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const bubble=page.locator('.im-bubble-container');
   const rect=await bubble.boundingBox();
   const source=await bubble.evaluate(el=>getComputedStyle(el).borderImageSource);
   assert.notEqual(source,'none',label+': frame must be present');
   const markup=decodeURIComponent(source.slice(source.indexOf(',')+1).replace(/"\)$/,''));
   assert.equal((markup.match(/<path\b/g)||[]).length,1,label+': one path must define both fill and outline');
   const clip={x:Math.floor(rect.x)-Math.ceil(12*zoom),y:Math.floor(rect.y)-Math.ceil(3*zoom),width:Math.ceil(rect.width+28*zoom),height:Math.ceil(rect.height+10*zoom)};
   const png=await page.screenshot({clip,animations:'disabled'});
   const actualDpr=await page.evaluate(()=>devicePixelRatio);
   const stats=await page.evaluate(async({png,rect,clip,dpr,zoom,expected,right})=>{
    const im=new Image();im.src='data:image/png;base64,'+png;await im.decode();const canvas=document.createElement('canvas');canvas.width=im.width;canvas.height=im.height;const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let different=0,maxDelta=0;
    const startX=right?rect.x+rect.width-7.5*zoom:rect.x+3.5*zoom;
    const endX=right?rect.x+rect.width-3.5*zoom:rect.x+7.5*zoom;
    for(let y=Math.ceil((rect.y+7*zoom-clip.y)*dpr);y<Math.floor((rect.y+33*zoom-clip.y)*dpr);y++)for(let x=Math.ceil((startX-clip.x)*dpr);x<Math.floor((endX-clip.x)*dpr);x++){
     const index=(y*canvas.width+x)*4;const delta=Math.max(...expected.map((v,c)=>Math.abs(v-pixels[index+c])));if(delta>0)different++;maxDelta=Math.max(maxDelta,delta);
    }
    return {different,maxDelta};
   },{png:png.toString('base64'),rect,clip,dpr:actualDpr,zoom,expected:dark?variant.dark:variant.light,right:variant.name!=='left'});
   cases++;if(stats.maxDelta>1){failures.push({label,...stats});if(output)fs.writeFileSync(path.join(output,'failure-'+cases+'.png'),png);}
   if(output&&dpr===3&&zoom===4&&offset===.5)fs.writeFileSync(path.join(output,variant.name+'-'+(dark?'dark':'light')+'-4x.png'),png);
  }
  await context.close();
 }
 // Decode failure must retain the native closed border and identical layout.
 {
  const context=await browser.newContext({viewport:{width:320,height:160},deviceScaleFactor:2});const page=await context.newPage();
  await page.setContent(`<style>${css}</style><style>body{margin:20px;background:#eee}.im-bubble-container{box-sizing:border-box;position:relative;width:180px;height:72px}</style><div class="im-message-row"><div class="im-bubble-container im-bubble-left"></div></div>`);
  const bubble=page.locator('.im-bubble-container');const before=await bubble.boundingBox();
  await bubble.evaluate(el=>el.style.setProperty('border-image-source','none','important'));
  const normal=await bubble.screenshot();
  await bubble.evaluate(el=>el.style.setProperty('border-image-source','url("data:image/svg+xml,invalid")','important'));
  await page.waitForTimeout(100);
  const unavailable=await bubble.screenshot();
  assert.ok(normal.equals(unavailable),'a failed image must render exactly the native rectangle fallback');
  assert.deepEqual(await bubble.boundingBox(),before,'frame decoding must not change text/container layout');
  assert.equal(await bubble.evaluate(el=>getComputedStyle(el).borderLeftStyle),'solid');
  assert.equal(await bubble.evaluate(el=>getComputedStyle(el).borderLeftWidth),'2px');
  await context.close();
 }
 assert.deepEqual(failures,[],JSON.stringify(failures));
 summaries.push({channel:process.env.BROWSER_CHANNEL||'chrome',cases,internalFringes:failures.length,nativeFallback:true});
 if(output)fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summaries,null,2));
 console.log('[chat rendering] '+cases+' theme/variant/DPR/zoom/subpixel cases passed; no internal patch fringe; native image-failure fallback preserves layout');
}finally{await browser.close();}
