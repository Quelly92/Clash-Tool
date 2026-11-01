// Development-only runner: use an installed Playwright and Chromium.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3,permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];const requests=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>requests.push(r.url()));
 const base=process.env.TEST_URL||'http://127.0.0.1:8765/potion-calculator/';
 await page.goto(base);await page.waitForFunction(()=>document.querySelector('#offline').textContent==='Ready offline');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 const fill=async(d,h,m,n)=>{for(const [id,value] of Object.entries({days:d,hours:h,minutes:m,potions:n})) await page.locator('#'+id).fill(String(value));};
 const output=()=>page.locator('#completion').innerText();
 for(const [mode,d,h,m,n,expected] of [
  ['research',2,12,30,1,'1d 13h 30m'],['builder',2,12,30,1,'2d 3h 30m'],
  ['research',0,12,0,1,'30m'],['builder',0,4,0,1,'24m'],
  ['research',0,25,0,1,'2h'],['research',0,25,0,2,'1h 2m 30s']]) {
  await page.locator('#'+mode).click();await fill(d,h,m,n);assert.equal(await output(),expected);
 }
 await page.locator('#copy').click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/1h 2m 30s/);
 await page.locator('#plus').click();assert.equal(await page.locator('#potions').inputValue(),'3');
 await page.locator('#minus').click();assert.equal(await page.locator('#potions').inputValue(),'2');
 for(const bad of ['-1','1.5','abc','1000001']) {await page.locator('#days').fill(bad);assert.equal(await output(),'—');assert.equal(await page.locator('#copy').isDisabled(),true);}
 await page.getByRole('button',{name:'Clear',exact:true}).click();assert.equal(await output(),'0s');assert.equal(await page.locator('#potions').inputValue(),'1');
 await fill(0,0,1,1);assert.equal(await output(),'2.5s');
 await fill(1000000,1000000,1000000,1000000);assert.ok(!(await output()).includes('NaN'));
 await page.locator('#builder').click();await page.reload();assert.equal(await page.locator('#builder').getAttribute('aria-selected'),'true');
 await page.locator('#builder').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#research').getAttribute('aria-selected'),'true');
 await fill(2,12,30,1);
 for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390]]) {
  await page.setViewportSize({width,height});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`horizontal overflow ${width}`);
  if(height>=667) assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),true,`vertical overflow ${width}×${height}`);
  assert.equal(await page.evaluate(()=>[...document.querySelectorAll('button,input,summary')].every(e=>e.getBoundingClientRect().height>=44)),true);
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/potion-mobile.png'});
 await context.setOffline(true);await page.reload();assert.equal(await page.locator('h1').innerText(),'Potion Time');
 await fill(0,25,0,2);assert.equal(await output(),'1h 2m 30s');
 await page.locator('#builder').click();await fill(0,4,0,1);assert.equal(await output(),'24m');
 await page.goto(base+'?installed=1');assert.equal(await page.locator('h1').innerText(),'Potion Time');
 assert.deepEqual(errors,[]);assert.ok(requests.every(url=>url.startsWith(new URL(base).origin)));
 console.log('PASS: six UI cases, copy, stepping, invalid inputs, reset, fractions, huge input, tab memory/keyboard, 5 viewports, 44px targets, offline reload/calculation/query navigation, no page errors or external requests.');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
