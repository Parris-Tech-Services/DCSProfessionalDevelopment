import { chromium } from 'playwright';
import { readFile, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execute=promisify(execFile);

const url=process.env.PRODUCTION_URL || 'https://dcs-professional-development.vercel.app/';
const source=await readFile('src/data/itPodcastEpisodes.ts','utf8');
const rowRe=/\{ id: '([^']+)',(?: audio: "([^"]+)",)? title: '([^']+)', show:/g;
const episodes=[...source.matchAll(rowRe)].map((m,index)=>({id:m[1],audio:m[2]||null,title:m[3],index}));
const direct=episodes.filter(e=>e.audio);
const requested=process.env.EPISODE_TITLE || '';
const selected=requested?direct.filter(e=>e.title===requested):(process.env.ALL_EPISODES==='1'?direct:direct.slice(0,1));
if(!selected.length)throw new Error('No direct-audio DCS episode selected');

const output='offline-evidence'; await mkdir(output,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const options={headless:true,ignoreDefaultArgs:['--mute-audio'],viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',serviceWorkers:'allow'};
const state=page=>page.locator('audio').evaluate(a=>({time:a.currentTime,duration:a.duration,paused:a.paused,readyState:a.readyState,src:a.currentSrc,error:a.error?.message||null}));
async function openEpisode(page,e){
  await page.evaluate(({index})=>localStorage.setItem('dcs-pd-independent-podcast-v1',JSON.stringify({currentIndex:index})),e);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Open IT support podcasts'}).click();
  await page.getByRole('heading',{name:e.title,exact:true}).waitFor();
}
async function waitForDeployment(page,e){
  const deadline=Date.now()+8*60_000;
  while(Date.now()<deadline){
    try{
      await openEpisode(page,e);
      const b=page.getByRole('button',{name:/Download offline|Offline saved|Retry offline download/});
      if(await b.count())return;
    }catch{}
    await sleep(15000); await page.goto(url,{waitUntil:'domcontentloaded'});
  }
  throw new Error('Production never exposed DCS offline podcast build');
}
async function isolate(context,page,evidence,label){
  await context.setOffline(true);
  const failed=await page.evaluate(async()=>{try{await fetch('https://example.com/?offline='+crypto.randomUUID(),{mode:'no-cors',cache:'no-store'});return false}catch{return true}});
  assert(failed,'Uncached network probe unexpectedly succeeded');
  for(const worker of context.serviceWorkers()){
    assert(await worker.evaluate(async()=>{try{await fetch('https://example.com/?worker='+crypto.randomUUID(),{mode:'no-cors',cache:'no-store'});return false}catch{return true}}),'Service worker retained network access');
  }
  evidence.push({step:label,networkProbeFailed:true});
}
async function playback(page,evidence,label){
  const audio=page.locator('audio'); await audio.waitFor(); await audio.evaluate(a=>a.play());
  const before=await state(page); await sleep(10000); const after=await state(page);
  assert(!after.paused&&!after.error&&after.readyState>=2&&after.time-before.time>7,'Offline playback did not progress');
  const target=Math.min(after.duration*.65,after.duration-30); assert(target>60,'Episode too short for meaningful seek');
  await audio.evaluate((a,t)=>{a.currentTime=t},target); await sleep(7000); const sought=await state(page);
  assert(sought.time>target+4&&!sought.error&&!sought.paused,'Playback failed after seek');
  await audio.evaluate(a=>a.pause()); const paused=await state(page); await sleep(2500); const held=await state(page);
  assert(held.paused&&Math.abs(held.time-paused.time)<.25,'Pause failed');
  await audio.evaluate(a=>a.play()); await sleep(5000); const resumed=await state(page);
  assert(!resumed.paused&&!resumed.error&&resumed.time-held.time>3,'Resume failed');
  evidence.push({step:label,before,after,target,sought,paused,held,resumed});
  const recording=join(output,label.replaceAll(' ','-')+'.wav');
  await execute('ffmpeg',['-y','-f','pulse','-i','offline_test.monitor','-t','5',recording]);
  const {stderr}=await execute('ffmpeg',['-i',recording,'-af','volumedetect','-f','null','-']);
  const peak=stderr.match(/max_volume: ([-\d.]+) dB/); assert(peak&&Number(peak[1])>-85,'No non-silent system audio captured');
  evidence.push({step:label+' system audio',maxDb:Number(peak[1])});
}
const results=[];
for(const e of selected){
 const evidence=[]; const result={title:e.title,status:'FAIL',evidence}; results.push(result); let context;
 try{
  const profile=await mkdtemp(join(tmpdir(),'dcs-podcast-profile-'));
  context=await chromium.launchPersistentContext(profile,options); let page=await context.newPage(); await page.goto(url,{waitUntil:'domcontentloaded'});
  await waitForDeployment(page,e); await page.evaluate(()=>navigator.serviceWorker.ready); await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  let b=page.getByRole('button',{name:/Download offline|Retry offline download/}); if(await b.count()){await b.click(); await page.getByRole('button',{name:/Offline saved/}).waitFor({timeout:300000})}
  const stored=await page.evaluate(async audio=>{const cache=await caches.open('dcs-pd-podcast-audio-v1');const r=await cache.match(audio,{ignoreVary:true});if(!r)return{missing:true};if(r.type==='opaque')return{type:'opaque',hashUnavailable:true};const bytes=await r.arrayBuffer();return{type:r.type,size:bytes.byteLength,contentLength:r.headers.get('content-length'),mime:r.headers.get('content-type'),sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('')}} ,e.audio);
  assert(!stored.missing,'Downloaded DCS episode missing from cache'); evidence.push({step:'stored media',stored});
  await isolate(context,page,evidence,'network disabled'); await page.reload({waitUntil:'domcontentloaded'}); await page.getByRole('button',{name:'Open IT support podcasts'}).click(); await page.getByRole('heading',{name:e.title,exact:true}).waitFor(); await playback(page,evidence,'offline');
  await context.close(); context=null;
  context=await chromium.launchPersistentContext(profile,{...options,offline:true,proxy:{server:'http://127.0.0.1:9'}}); page=await context.newPage(); await page.goto(url,{waitUntil:'domcontentloaded'}); await isolate(context,page,evidence,'restart remains offline'); await page.getByRole('button',{name:'Open IT support podcasts'}).click(); await page.getByRole('heading',{name:e.title,exact:true}).waitFor(); await playback(page,evidence,'restarted');
  if(stored.type==='opaque'){const audio=page.locator('audio');await audio.evaluate(a=>{a.pause();a.currentTime=0;a.playbackRate=16});await audio.evaluate(a=>a.play());const duration=(await state(page)).duration;await page.waitForFunction(()=>document.querySelector('audio')?.ended,{},{timeout:duration/16*1000+60000});const end=await state(page);assert(Math.abs(end.time-duration)<1&&!end.error,'Opaque DCS episode did not fully decode offline');evidence.push({step:'complete opaque episode decoded offline',duration,end})}else{assert(stored.size>100000,'Readable stored media too small');if(stored.contentLength)assert.equal(stored.size,Number(stored.contentLength),'Stored length mismatch')}
  result.status='PASS';
 }catch(error){result.error=error.stack||String(error);console.error(e.title,error)}
 finally{if(context)await context.close();await writeFile(join(output,'results.json'),JSON.stringify(results,null,2))}
}
console.log(JSON.stringify(results,null,2)); if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
