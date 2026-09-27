import { readFile, writeFile, mkdir } from 'node:fs/promises';
const src=await readFile('src/data/itPodcastEpisodes.ts','utf8');
const re=/\{ id: '([^']+)', title: '([^']+)', show: '([^']+)', tags:/g;
const reDoubleShow=/\{ id: '([^']+)', title: '([^']+)', show: "([^"]+)", tags:/g;
const episodes=[];
for(const m of src.matchAll(re))episodes.push({id:m[1],title:m[2],show:m[3]});
for(const m of src.matchAll(reDoubleShow))episodes.push({id:m[1],title:m[2],show:m[3]});
if(episodes.length!==25)throw new Error('expected 25, got '+episodes.length);
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const toks=s=>new Set(norm(s).split(' ').filter(x=>x.length>1));
const sim=(a,b)=>{const A=toks(a),B=toks(b);if(!A.size||!B.size)return 0;let n=0;for(const x of A)if(B.has(x))n++;return n/Math.max(A.size,B.size)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function resolve(e){let best=null;for(const country of ['AU','US']){const u='https://itunes.apple.com/search?term='+encodeURIComponent(e.title+' '+e.show)+'&media=podcast&entity=podcastEpisode&limit=50&country='+country;let res;for(let a=0;a<4;a++){res=await fetch(u,{headers:{'user-agent':'DCS-PD-offline-audit/1.0'}});if(res.ok)break;await sleep(1800*(a+1))}if(!res?.ok)continue;const data=await res.json();for(const x of data.results||[]){if(!x.episodeUrl||!x.trackName)continue;const ts=norm(x.trackName)===norm(e.title)?1:sim(x.trackName,e.title);const ss=Math.max(sim(x.collectionName||'',e.show),sim(x.artistName||'',e.show));const score=ts*.82+ss*.18;const r={...e,matchedTitle:x.trackName,matchedShow:x.collectionName||x.artistName||'',audio:x.episodeUrl,feed:x.feedUrl||null,titleScore:+ts.toFixed(3),showScore:+ss.toFixed(3),score:+score.toFixed(3),titleExact:norm(x.trackName)===norm(e.title)};if(!best||r.score>best.score)best=r}await sleep(500)}return best}
const results=[];for(let i=0;i<episodes.length;i++){const r=await resolve(episodes[i]);results.push(r||{...episodes[i],notFound:true});console.log(i+1,'/',episodes.length,JSON.stringify(r?{title:r.title,match:r.matchedTitle,show:r.matchedShow,score:r.score,audio:r.audio}:{title:episodes[i].title,notFound:true}));await sleep(600)}
const safe=results.filter(r=>r.audio&&(r.titleExact||(r.titleScore>=.68&&r.showScore>=.5)));await mkdir('research',{recursive:true});await writeFile('research/offline-podcast-sources.json',JSON.stringify({generatedAt:new Date().toISOString(),total:episodes.length,safeCount:safe.length,results},null,2));console.log('SUMMARY',JSON.stringify({total:episodes.length,safe:safe.length,unresolved:episodes.length-safe.length}));
