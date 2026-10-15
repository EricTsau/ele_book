import {test,expect} from '@playwright/test';
import {enableAudioSeeking} from './helpers.mjs';

test('opening audio advances the scene immediately and pause holds both clocks',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>a.currentTime)).toBeGreaterThan(.1);
 const before=await page.evaluate(()=>window.__timelines['pigs-0'].time());
 await expect.poll(()=>page.evaluate(()=>window.__timelines['pigs-0'].time())).toBeGreaterThan(before+.015);
 await page.locator('#play-pause').click();
 const paused=await page.evaluate(()=>({time:window.__timelines['pigs-0'].time(),audio:document.querySelector('#story-audio').currentTime}));
 await page.waitForTimeout(300);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(paused.time);
 expect(await page.locator('#story-audio').evaluate(a=>a.currentTime)).toBe(paused.audio);
});

test('the wolf blows and the house falls during the matching spoken line',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();
 await page.locator('[data-page="4"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 // Advance genuine recordings in order; never trigger a synthetic ended event.
 for(let i=0;i<15;i++){
  const audio=page.locator('#story-audio');await expect.poll(()=>audio.evaluate(a=>Number.isFinite(a.duration)&&!a.paused&&a.error===null)).toBe(true);
  const src=await audio.getAttribute('src');if(src.endsWith('line-2.mp3'))break;
  await audio.evaluate(a=>{a.currentTime=a.duration-.03;});await expect.poll(()=>audio.getAttribute('src')).not.toBe(src);
 }
 await expect(page.locator('#story-audio')).toHaveAttribute('src',/scene-4-line-2.mp3$/);
 expect(await page.evaluate(()=>window.__storybook3d.inspect().houseScale)).toBe(1);
 const moment=await page.evaluate(async()=>{
  const a=document.querySelector('#story-audio');a.playbackRate=.5;
  const seeked=new Promise(resolve=>a.addEventListener('seeked',resolve,{once:true}));a.currentTime=a.duration*.85;await seeked;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const w=window.__storybook3d,s=w.scenes[4];
  const state={src:a.getAttribute('src'),playing:!a.paused,text:document.querySelector('#dialogue').textContent,time:window.__timelines['pigs-4'].time(),scale:s.house.scale.y,tilt:s.house.rotation.z,wind:s.windMaterial.opacity};
  document.querySelector('#play-pause').click();return state;
 });
 expect(moment.src).toContain('scene-4-line-2.mp3');expect(moment.playing).toBe(true);expect(moment.text).toContain('那我就用力吹');
 expect(moment.time).toBeGreaterThan(8.6);expect(moment.time).toBeLessThan(9.3);
 expect(moment.scale).toBeLessThan(1);expect(moment.tilt).toBeGreaterThan(0);expect(moment.wind).toBeGreaterThan(0);
 await page.screenshot({path:test.info().outputPath('wolf-speaking-and-house-falling.png')});
 await page.locator('#close-reader').click();
 expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 expect(await page.evaluate(()=>window.__storybook3d.inspect().running)).toBe(false);
});

test('reduced motion can enable narration from the first sentence after opening muted',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('#hero-read').click();
 await page.locator('#voice-toggle').click();await page.locator('#next').click();
 await page.locator('#voice-toggle').click();
 await expect(page.locator('#story-audio')).toHaveAttribute('src',/scene-1-sentence-0.mp3$/);
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0)).toBe(true);
 expect(await page.evaluate(()=>window.__timelines['pigs-1'].progress())).toBe(1);
});
test('an old resume rejection cannot skip a sentence on the new page',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();await page.locator('#play-pause').click();
 await page.evaluate(()=>{const a=document.querySelector('#story-audio');window.savedPlay=a.play.bind(a);a.play=()=>new Promise((_,reject)=>{window.rejectOldPlay=reject;});});
 await page.locator('#play-pause').click();await page.evaluate(()=>{document.querySelector('#story-audio').play=window.savedPlay;});
 await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('#story-audio')).toHaveAttribute('src',/scene-1-sentence-0.mp3$/);
 await page.evaluate(()=>window.rejectOldPlay(new Error('delayed old playback failure')));await page.waitForTimeout(250);
 await expect(page.locator('#story-audio')).toHaveAttribute('src',/scene-1-sentence-0.mp3$/);
});

test('muting during a character gesture leaves the main story paused',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();await page.locator('#actor-controls button').first().click();
 await page.locator('#voice-toggle').click();await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','播放動畫');
 const before=await page.evaluate(()=>window.__timelines['pigs-0'].time());await page.waitForTimeout(350);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(before);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].paused())).toBe(true);
});
