import {test,expect} from '@playwright/test';
import {books} from '../../public/books.js';
import {tag,originalIndex,timelineKey,expectAudio,enableAudioSeeking,beatsFor,beatRole,beatFile,advanceAudioBeat} from './helpers.mjs';
test.beforeEach(async({page})=>enableAudioSeeking(page));
for(const book of books){
 test(`${book.title}: all expanded 3D pages render and automatically speak`,async({page})=>{
  test.setTimeout(Math.max(120000,book.chapters.length*25000));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.locator(`[data-action="read"][data-id="${book.id}"]`).first().click();
  await expect(page.locator('#reader-title')).toHaveText(book.title);
  for(let i=0;i<book.chapters.length;i++){
   if(i){await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');}
   await expect(page.locator('#chapter-tag')).toHaveText(tag(book.id,i));
   await expect(page.locator('#story-copy')).toContainText(book.chapters[i].title);
   expect(await page.evaluate(()=>window.__storybook3d.inspect().webgl)).toBe(true);
   expect(await page.evaluate(()=>window.__storybook3d.inspect().active)).toBe(i);
   const props=await page.evaluate(()=>window.__storybook3d.inspect().props);
   for(const p of props)expect(p.meshes,`${book.id}/${i}: empty ${p.kind}`).toBeGreaterThan(0);
   const key=timelineKey(book.id,i),duration=await page.evaluate(key=>window.__timelines[key].duration(),key);
   if(book.chapters[i].kind!=='story')expect(duration).toBe(20);
   else if(book.id==='three-little-pigs')expect(duration).toBeGreaterThan(0);
   else expect(duration).toBe(16);
   const chapter=book.chapters[i],beats=await beatsFor(page,book.id,i);
   for(const [beatIndex,beat] of beats.entries()){
    await expectAudio(page,beatRole(beat),beatFile(chapter,beat));
    await expect(page.locator('#dialogue span')).toHaveText(beat.text);
    await expect(page.locator('#voice-status')).toBeEmpty();
    // Real audio progress owns scene time, including buffering and media seeks.
    await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration*.4;});
    await expect.poll(()=>page.evaluate(({key,beat})=>{
     const a=document.querySelector('#story-audio'),tl=window.__timelines[key];
     const expected=beat.start+(beat.end-beat.start)*a.currentTime/a.duration;
     return Math.abs(tl.time()-expected);
    },{key,beat}),{timeout:5000}).toBeLessThan(.15);
    const frame=await page.evaluate(key=>({paused:window.__timelines[key].paused(),actors:window.__storybook3d.inspect().actors}),key);
    expect(frame.paused).toBe(true);
    for(const actor of frame.actors)for(const coordinate of actor.position)expect(Number.isFinite(coordinate)).toBe(true);
    await advanceAudioBeat(page,{last:beatIndex===beats.length-1});
   }
   // With real speech complete, deterministic scrubbing still returns the same pose.
   const motion=await page.evaluate(key=>{
    const tl=window.__timelines[key];
    const samples=[1.2,4,7,10,13.5].map(t=>{tl.pause(t,true);return window.__storybook3d.inspect().actors.map(a=>a.position);});
    tl.pause(1.2,true);const replay=window.__storybook3d.inspect().actors.map(a=>a.position);
    tl.pause(tl.duration(),true);return {samples,replay};
   },key);
   for(const sample of motion.samples)for(const p of sample)for(const v of p)expect(Number.isFinite(v)).toBe(true);
   motion.samples[0].forEach((p,j)=>p.forEach((v,k)=>expect(motion.replay[j][k]).toBeCloseTo(v,4)));
   if(i===book.chapters.length-1){
    expect(book.chapters[i].kind).toBe('reflection');
    await expect(page.locator('#reflection-panel')).toBeVisible();
    await expect(page.locator('#reflection-question')).toHaveText(book.chapters[i].reflection.question);
    await expect(page.locator('#reflection-action')).toHaveText(book.chapters[i].reflection.action);
   }
   await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','播放動畫');
  }
  await page.locator('#next').click();await expect(page.locator('#reader')).not.toBeVisible();
  expect(errors).toEqual([]);
 });
}
test('switching books preserves separate progress and favorites',async({page})=>{
 await page.goto('/');await expect(page.locator('.book-card')).toHaveCount(31);
 await page.locator('[data-action="favorite"][data-id="ugly-duckling"]').click();
 await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();
 const remembered=originalIndex('red-riding-hood',3);
 await page.locator(`[data-page="${remembered}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.locator('[data-action="read"][data-id="ugly-duckling"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText(tag('ugly-duckling',0));
 await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.reload();await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText(tag('red-riding-hood',remembered));await page.locator('#close-reader').click();
 await page.locator('#favorite-filter').click();await expect(page.locator('.book-card')).toHaveCount(1);await expect(page.locator('.book-card h3')).toHaveText('醜小鴨');
});

test('classic and original shelves have distinct labels and story sources',async({page})=>{
 await page.goto('/');
 await page.locator('#collection-filter').selectOption('original');
 await expect(page.locator('.book-card')).toHaveCount(10);
 await expect(page.locator('.mini-tag').first()).toContainText('原創故事');
 await page.locator('.book-card [data-action="read"]').first().click();
 await expect(page.locator('#reader-series')).toHaveText('小葉原創故事');
 await expect(page.locator('#story-provenance')).toContainText('新創作');
 await page.locator('#close-reader').click();
 await page.locator('#collection-filter').selectOption('classic');
 await expect(page.locator('.book-card')).toHaveCount(21);
 await page.locator('#search').fill('烏鴉喝水');
 await page.locator('.book-card [data-action="read"]').first().click();
 await expect(page.locator('#story-provenance a')).toHaveAttribute('href','https://www.gutenberg.org/ebooks/11339');
});

test('story action travels to the jar and actually raises its water',async({page})=>{
 await page.goto('/');await page.locator('[data-action="read"][data-id="thirsty-crow"]').first().click();
 const chapter=await page.evaluate(async()=>{const {books}=await import('/books.js');return books.find(b=>b.id==='thirsty-crow').chapters.findIndex(c=>c.action==='pour');});
 expect(chapter).toBeGreaterThanOrEqual(0);
 await page.locator(`[data-page="${chapter}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.locator('#play-pause').click();
 const sample=await page.evaluate(({chapter})=>{
  const tl=window.__timelines[`thirsty-crow-${chapter}`];tl.pause();tl.seek(1);const before=window.__storybook3d.inspect();tl.seek(13.5);const after=window.__storybook3d.inspect();return {before,after,duration:tl.duration()};
 },{chapter});
 expect(sample.after.effects.water.position[1]).toBeGreaterThan(sample.before.effects.water.position[1]+.3);
 expect(Math.hypot(sample.after.actors[0].position[0]-sample.before.actors[0].position[0],sample.after.actors[0].position[2]-sample.before.actors[0].position[2])).toBeGreaterThan(.5);
 expect(sample.duration).toBe(16);
});
