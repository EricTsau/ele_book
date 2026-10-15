import {expect} from '@playwright/test';
import {books} from '../../public/books.js';
import {speechBeats} from '../../public/speech-sync.js';
import {speechCues} from '../../public/speech-cues.js';
export const bookFor=id=>{const book=books.find(b=>b.id===id);if(!book)throw new Error(`Unknown book ${id}`);return book;};
export const total=id=>bookFor(id).chapters.length;
export const tag=(id,index)=>`${String(index+1).padStart(2,'0')} / ${String(total(id)).padStart(2,'0')}`;
export const originalIndex=(id,sourceIndex)=>{const index=bookFor(id).chapters.findIndex(c=>c.kind==='story'&&c.storyIndex===sourceIndex);if(index<0)throw new Error(`Missing original ${id}/${sourceIndex}`);return index;};
export const timelineKey=(id,index)=>`${id==='three-little-pigs'?'pigs':id}-${index}`;
export async function expectAudio(page,role,file){
 await expect(page.locator('#story-audio')).toHaveAttribute('data-role',role);
 if(file)await expect(page.locator('#story-audio')).toHaveAttribute('src',new RegExp(`${file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`));
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0&&a.error===null&&Number.isFinite(a.duration)),{timeout:15000}).toBe(true);
}
export async function beatsFor(page,id,index){
 const chapter=bookFor(id).chapters[index];
 const duration=await page.evaluate(key=>window.__timelines[key].duration(),timelineKey(id,index));
 return speechBeats(chapter,speechCues[chapter.id],duration);
}
export const beatRole=beat=>beat.kind==='line'?'line':beat.paragraph===0?'opening':'closing';
export const beatFile=(chapter,beat)=>`${chapter.audioKey}-${beat.kind}-${beat.index}.mp3`;
// Seek the actual media to EOF; never synthesize ended or advance GSAP directly.
export async function advanceAudioBeat(page,{last=false}={}){
 const audio=page.locator('#story-audio'),src=await audio.getAttribute('src');
 await expect.poll(()=>audio.evaluate(a=>!a.paused&&a.error===null&&Number.isFinite(a.duration)),{timeout:15000}).toBe(true);
 await audio.evaluate(a=>{a.currentTime=Math.max(0,a.duration-.03);});
 if(last)await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','播放動畫');
 else await expect.poll(()=>audio.getAttribute('src'),{timeout:10000}).not.toBe(src);
}
export async function finishOpening(page,id,index){
 const c=bookFor(id).chapters[index],beats=await beatsFor(page,id,index);
 for(const beat of beats){
  await expectAudio(page,beatRole(beat),beatFile(c,beat));
  if(beat.kind==='line')return;
  await advanceAudioBeat(page);
 }
 throw new Error(`No character line in ${c.id}`);
}
// The development server does not implement byte ranges. Serve real MP3 bytes
// with the media range semantics Chrome needs for genuine end-of-file seeking.
export async function enableAudioSeeking(page){
 const cache=new Map();
 await page.route(/\/audio\/.*\.mp3(?:\?.*)?$/,async route=>{
  const request=route.request(),url=request.url();let bytes=cache.get(url);
  if(!bytes){const headers={...request.headers()};delete headers.range;const response=await route.fetch({headers});if(!response.ok()){await route.fulfill({response});return;}bytes=await response.body();cache.set(url,bytes);}
  const match=/^bytes=(\d+)-(\d*)$/.exec(request.headers().range||'');
  const headers={'content-type':'audio/mpeg','accept-ranges':'bytes'};
  if(match){const start=Number(match[1]),end=Math.min(bytes.length-1,match[2]?Number(match[2]):bytes.length-1);if(start>=bytes.length){await route.fulfill({status:416,headers:{...headers,'content-range':`bytes */${bytes.length}`},body:''});return;}await route.fulfill({status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${bytes.length}`},body:bytes.subarray(start,end+1)});}
  else await route.fulfill({status:200,headers,body:bytes});
 });
}
