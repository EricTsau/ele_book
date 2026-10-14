import {expect} from '@playwright/test';
import {books} from '../../public/books.js';
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
export async function finishOpening(page,id,index){
 const c=bookFor(id).chapters[index];await expectAudio(page,'opening',`${c.audioKey}-narration-0.mp3`);
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=Math.max(0,a.duration-.03);});
 await expect.poll(()=>page.evaluate(key=>!window.__timelines[key].paused(),timelineKey(id,index)),{timeout:5000}).toBe(true);
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
