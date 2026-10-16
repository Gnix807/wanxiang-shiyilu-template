// Reuse PLAYWRIGHT_MODULE and point BASE_URL at a production preview.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const baseURL=process.env.BASE_URL||'http://127.0.0.1:3000';
const showcasePath=process.env.SHOWCASE_PATH||'/posts/2026-09-22-editorial-components/';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const failures=[];
const citationPath=process.env.CITATION_PATH||'';
function check(name,condition,details){if(!condition)failures.push(name+': '+details);}
try{
 for(const profile of [
  {name:'no-script',javaScriptEnabled:false,width:390},
  {name:'old-css',missingCSS:true,missingDOM:true,stripLayers:true,width:320},
  {name:'missing-dialog',missingDOM:true,width:390},
  {name:'missing-property-registration',missingProperty:true,stripProperties:true,width:390},
  {name:'old-css-desktop-dark',missingCSS:true,missingDOM:true,stripLayers:true,dark:true,width:1366},
  {name:'manual-private',reader:true,storageBlocked:true,width:390},
  {name:'module-failure',blockModules:true,width:390},
  {name:'partial-module-failure',partialModules:true,width:390},
 ]){
  const context=await browser.newContext({viewport:{width:profile.width,height:900},javaScriptEnabled:profile.javaScriptEnabled!==false,reducedMotion:'reduce'});
  await context.route('**/*',route=>{
   const request=route.request(); const url=new URL(request.url());
   if(url.origin!==new URL(baseURL).origin)return route.abort();
   if(profile.blockModules&&request.resourceType()==='script')return route.abort();
   if(profile.partialModules&&/\/PageBanner\.[^/]+\.js$/.test(url.pathname))return route.abort();
   return route.continue();
  });
  await context.addInitScript(profile=>{
   if(profile.dark)localStorage.setItem('theme','dark');
   if(profile.missingProperty)Object.defineProperty(CSS,'registerProperty',{value:undefined,configurable:true});
   if(profile.missingCSS){const supports=CSS.supports.bind(CSS);CSS.supports=function(property,value){if(property==='color'&&/revert-layer|oklch|color-mix/.test(value||''))return false;return supports(property,value);};}
   if(profile.missingDOM){Object.defineProperty(window,'IntersectionObserver',{value:undefined,configurable:true});if(window.HTMLDialogElement)HTMLDialogElement.prototype.showModal=undefined;}
   if(profile.storageBlocked)for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{configurable:true,get(){throw new DOMException('Storage disabled','SecurityError');}});
   if(profile.stripLayers||profile.stripProperties){const strip=()=>{for(const sheet of document.styleSheets){try{for(let i=sheet.cssRules.length-1;i>=0;i--)if((profile.stripLayers&&/^@layer/.test(sheet.cssRules[i].cssText))||(profile.stripProperties&&/^@property/.test(sheet.cssRules[i].cssText)))sheet.deleteRule(i);}catch{}}};document.addEventListener('DOMContentLoaded',strip);window.addEventListener('load',strip);}
  },profile);
  const page=await context.newPage(); const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto(baseURL+showcasePath+(profile.reader?'?reader=1':''),{waitUntil:'load'});
  if(profile.blockModules||profile.partialModules)await page.waitForTimeout(6500);
  else await page.waitForTimeout(300);
  const state=await page.evaluate(()=>({
   mode:document.documentElement.getAttribute('data-reading-mode'),
   heading:document.querySelector('h1')?.textContent.trim(),
   panes:[...document.querySelectorAll('.tab-pane')].map(element=>({visible:element.getBoundingClientRect().height>0,text:element.textContent.trim().length})),
   overflow:document.documentElement.scrollWidth-innerWidth,
   dark:document.documentElement.classList.contains('dark'),
   notes:[...document.querySelectorAll('[data-sidenote-id] > .footnote-popover')].map(note=>({visible:note.getBoundingClientRect().height>0&&getComputedStyle(note).visibility==='visible'&&Number(getComputedStyle(note).opacity)>0,text:note.textContent.trim().length})),
   loadingHidden:getComputedStyle(document.getElementById('resource-progress')).display==='none',
   chatGaps:[...document.querySelectorAll('.im-chat-window .im-message-row')].map(row=>{const avatar=row.querySelector('.im-avatar').getBoundingClientRect(),bubble=row.querySelector('.im-bubble-container').getBoundingClientRect();return row.querySelector('.im-bubble-right')?avatar.left-bubble.right:bubble.left-avatar.right;}),
   spacerHeight:document.querySelector('.navbar-spacer').getBoundingClientRect().height,
   frames:[...document.querySelectorAll('.im-chat-window .im-bubble-container')].map(bubble=>({source:getComputedStyle(bubble).borderImageSource,oldTail:!!bubble.querySelector('.im-bubble-tail'),border:parseFloat(getComputedStyle(bubble).borderLeftWidth)})),
   nav:[...document.querySelectorAll('.compat-reader-nav a')].map(link=>({href:link.getAttribute('href'),visible:link.getBoundingClientRect().width>0})),
  }));
  check(profile.name+' content',!!state.heading&&state.panes.length>0,'article heading and tabs must be present');
  check(profile.name+' sidenotes',state.notes.length>0&&state.notes.every(note=>note.visible||!note.text),'author sidenote text must be readable without hover/dialog APIs');
  const note=page.locator('[data-sidenote-id] > .footnote-popover').first();
  if(await note.isVisible()){
   await note.scrollIntoViewIfNeeded();const before=await note.boundingBox();await note.hover();const after=await note.boundingBox();
   check(profile.name+' static sidenotes',Math.abs(before.x-after.x)<1&&after.width>=Math.min(220,profile.width/2),'notes must keep a readable width and remain still on hover');
  }
  check(profile.name+' panels',state.panes.every(pane=>pane.visible||!pane.text),'all tab content must remain readable');
  check(profile.name+' loading overlay',state.loadingHidden,'loading overlays must not cover the reader');
  check(profile.name+' header spacer',state.spacerHeight===0,'fixed navigation spacer must collapse in reading mode');
  check(profile.name+' chat spacing',state.chatGaps.every(gap=>Math.abs(gap-10)<0.2),'avatar spacing must not stack native gap with fallback margins');
  check(profile.name+' chat outlines',state.frames.every(frame=>!frame.oldTail&&frame.source!=='none'&&frame.border===2),'chat bubbles must retain their complete outline without overlay patches');
  check(profile.name+' layout',state.overflow<=1,'horizontal page overflow '+state.overflow+'px');
  check(profile.name+' navigation',state.nav.some(link=>link.visible&&link.href.startsWith('/posts')),'plain article archive link must be visible');
  if(profile.dark)check(profile.name+' theme',state.dark,'saved dark preference must be retained');
  if(profile.javaScriptEnabled!==false)check(profile.name+' fallback',state.mode==='compat','compatibility reader must activate');
  if(profile.reader){
   check(profile.name+' storage',!errors.some(message=>/Storage disabled|sessionStorage|localStorage/.test(message)),'storage restrictions must not throw');
   await page.locator('[data-reader-theme]').click();
   check(profile.name+' theme control',await page.evaluate(()=>document.documentElement.classList.contains('dark')),'native reader theme control must work without storage');
   if(await page.locator('.compat-reader-nav a[href^="/posts"]').count()){
    const marker=await page.evaluate(()=>window.__readerDocumentMarker=Math.random());
    await page.locator('.compat-reader-nav a[href^="/posts"]').first().click();await page.waitForURL(url=>/^\/posts\/?$/.test(url.pathname));
    check(profile.name+' native navigation',await page.evaluate(()=>window.__readerDocumentMarker)!==marker,'reader navigation must reload using native links');
    check(profile.name+' persistence',await page.evaluate(()=>document.documentElement.getAttribute('data-reading-mode'))==='compat','reader choice must survive blocked storage');
   }
  }
  console.log(JSON.stringify({profile:profile.name,mode:state.mode,hiddenPanes:state.panes.filter(pane=>!pane.visible&&pane.text).length,overflow:state.overflow,errors}));
  await context.close();
 }
 if(citationPath){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await context.route('**/*',route=>{const url=new URL(route.request().url());return url.origin!==new URL(baseURL).origin||/\/PageBanner\.[^/]+\.js$/.test(url.pathname)?route.abort():route.continue();});
  const page=await context.newPage();
  await page.goto(baseURL+citationPath,{waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-reading-mode')==='compat',null,{timeout:10000});
  const link=page.locator('a[data-target-id]').first();
  const targetId=await link.getAttribute('data-target-id');
  check('partial citation href',await link.getAttribute('href')==='#'+targetId,'failed popovers must restore their native reference links');
  check('partial citation semantics',await link.getAttribute('role')===null,'a native link must not retain dialog/button semantics');
  await link.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(id=>location.hash==='#'+id,targetId);
  check('partial citation keyboard',await page.evaluate(()=>location.hash)==='#'+targetId,'Enter must reach the reference without stale popover handlers');
  await page.evaluate(()=>history.replaceState(null,'',location.pathname));
  await link.click();
  await page.waitForFunction(id=>location.hash==='#'+id,targetId);
  check('partial citation click',await page.evaluate(()=>location.hash)==='#'+targetId,'a click must use the native reference target');
  await context.close();
  console.log('[compatibility] partial module failure preserves citation links, click and Enter navigation');
 }
 {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin?route.continue():route.abort());
  const page=await context.newPage();const requests=[];
  page.on('request',request=>{if(/compat-reader.*\.css/.test(request.url()))requests.push(request.url());});
  await page.goto(baseURL,{waitUntil:'load'});await page.waitForTimeout(350);
  check('standard CSS budget',requests.length===0,'modern browser must not download fallback CSS');
  check('standard navigation',await page.locator('.compat-reader-nav').isHidden(),'normal header must retain its layout');
  await page.locator('footer [data-reader-toggle]').click();await page.waitForURL(url=>url.searchParams.get('reader')==='1');
  check('manual reader entry',await page.evaluate(()=>document.documentElement.getAttribute('data-reading-mode'))==='compat','manual escape hatch must activate native reading');
  await page.locator('.compat-reader-nav [data-reader-toggle]').click();await page.waitForURL(url=>url.searchParams.get('reader')==='0');
  check('manual reader exit',await page.evaluate(()=>document.documentElement.getAttribute('data-reading-mode'))==='standard','reader must let the user return to normal layout');
  await context.close();
 }
 {
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin?route.continue():route.abort());
  const page=await context.newPage();
  for(const path of ['/', '/posts/', '/about/', '/talks/']){
   await page.goto(baseURL+path,{waitUntil:'load'});
   const result=await page.evaluate(()=>{const main=document.getElementById('main-content');return {text:main?.innerText.trim().length||0,width:document.documentElement.scrollWidth-innerWidth,archive:[...document.querySelectorAll('main a[href^="/posts/"]')].length};});
   check('no-script route '+path,result.text>30&&result.width<=1,'main content and native links must be readable');
   if(path==='/posts/')check('no-script full archive',result.archive>=2,'archive must expose both template sample articles');
  }
  await context.close();
 }
}finally{await browser.close();}
assert.deepEqual(failures,[],failures.join('\n'));
console.log('[compatibility] no-script, missing capabilities, failed modules, private storage and native reading navigation passed');
