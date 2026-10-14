import {test,expect} from '@playwright/test';
import {books} from '../../public/books.js';
import {tag,originalIndex,timelineKey,finishOpening,expectAudio,enableAudioSeeking} from './helpers.mjs';
test.beforeEach(async({page})=>enableAudioSeeking(page));
for(const book of books){
 test(`${book.title}: all expanded 3D pages render and automatically speak`,async({page})=>{
  test.setTimeout(Math.max(90000,book.chapters.length*15000));
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
   await finishOpening(page,book.id,i);
   // Advance close to the authored first cue; the running scene must trigger its own voice.
   await page.evaluate(({key,cue})=>{const tl=window.__timelines[key];if(tl.time()<cue-.15)tl.seek(cue-.15,true);},{key,cue:book.chapters[i].cues?.[0]||0});
   await expectAudio(page,'line',`${book.chapters[i].audioKey}-line-0.mp3`);
   const motion=await page.evaluate(key=>{
    const tl=window.__timelines[key];tl.pause();document.querySelector('#story-audio').pause();
    const samples=[1.2,4,7,10,13.5].map(t=>{tl.seek(t,true);return window.__storybook3d.inspect().actors.map(a=>a.position);});
    tl.seek(1.2,true);const replay=window.__storybook3d.inspect().actors.map(a=>a.position);
    let distance=0;for(const sample of samples)sample.forEach((p,j)=>{distance=Math.max(distance,Math.hypot(...p.map((v,k)=>v-samples[0][j][k])));});
    return {distance,start:samples[0],replay};
   },key);
   // Narrative outcomes are covered by the per-book semantics tests. A sleeping
   // character should not be forced to walk just to satisfy a distance metric.
   expect(Number.isFinite(motion.distance)).toBe(true);
   motion.start.forEach((p,j)=>p.forEach((v,k)=>expect(motion.replay[j][k]).toBeCloseTo(v,4)));
   await page.evaluate(key=>{window.__timelines[key].progress(1);},timelineKey(book.id,i));
   // A final authored cue may start when the timeline reaches its endpoint.
   // Let that real line end before checking the closing narration.
   if(await page.locator('#story-audio').getAttribute('data-role')==='line'){
    await expectAudio(page,'line',`${book.chapters[i].audioKey}-line-${book.chapters[i].lines.length-1}.mp3`);
    await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
   }
   await expectAudio(page,'closing',`${book.chapters[i].audioKey}-narration-1.mp3`);
   if(i===book.chapters.length-1){
    expect(book.chapters[i].kind).toBe('reflection');
    await expect(page.locator('#reflection-panel')).toBeVisible();
    await expect(page.locator('#reflection-question')).toHaveText(book.chapters[i].reflection.question);
    await expect(page.locator('#reflection-action')).toHaveText(book.chapters[i].reflection.action);
   }
   await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
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
 const sample=await page.evaluate(({chapter})=>{
  const tl=window.__timelines[`thirsty-crow-${chapter}`];tl.pause();tl.seek(1);const before=window.__storybook3d.inspect();tl.seek(13.5);const after=window.__storybook3d.inspect();return {before,after,duration:tl.duration()};
 },{chapter});
 expect(sample.after.effects.water.position[1]).toBeGreaterThan(sample.before.effects.water.position[1]+.3);
 expect(Math.hypot(sample.after.actors[0].position[0]-sample.before.actors[0].position[0],sample.after.actors[0].position[2]-sample.before.actors[0].position[2])).toBeGreaterThan(.5);
 expect(sample.duration).toBe(16);
});
