import {test,expect} from '@playwright/test';
import {books} from '../../public/books.js';
for(const book of books.slice(1)){
 test(`${book.title}: all six 3D chapters render and automatically speak`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.locator(`[data-action="read"][data-id="${book.id}"]`).first().click();
  await expect(page.locator('#reader-title')).toHaveText(book.title);
  for(let i=0;i<book.chapters.length;i++){
   if(i){await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');}
   await expect(page.locator('#chapter-tag')).toHaveText(`${String(i+1).padStart(2,'0')} / 06`);
   await expect(page.locator('#story-copy')).toContainText(book.chapters[i].title);
   expect(await page.evaluate(()=>window.__storybook3d.inspect().webgl)).toBe(true);
   expect(await page.evaluate(()=>window.__storybook3d.inspect().active)).toBe(i);
   const props=await page.evaluate(()=>window.__storybook3d.inspect().props);
   for(const p of props)expect(p.meshes,`${book.id}/${i}: empty ${p.kind}`).toBeGreaterThan(0);
   expect(await page.evaluate(({id,i})=>window.__timelines[`${id}-${i}`].duration(),{id:book.id,i})).toBe(16);
   await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0&&a.error===null)).toBe(true);
   const motion=await page.evaluate(({id,i})=>{
    const tl=window.__timelines[`${id}-${i}`];tl.pause();document.querySelector('#story-audio').pause();
    const samples=[1.2,4,7,10,13.5].map(t=>{tl.seek(t,true);return window.__storybook3d.inspect().actors.map(a=>a.position);});
    tl.seek(1.2,true);const replay=window.__storybook3d.inspect().actors.map(a=>a.position);
    let distance=0;for(const sample of samples)sample.forEach((p,j)=>{distance=Math.max(distance,Math.hypot(...p.map((v,k)=>v-samples[0][j][k])));});
    return {distance,start:samples[0],replay};
   },{id:book.id,i});
   expect(motion.distance,`${book.title} chapter ${i+1} must travel through the scene`).toBeGreaterThan(.35);
   motion.start.forEach((p,j)=>p.forEach((v,k)=>expect(motion.replay[j][k]).toBeCloseTo(v,4)));
  }
  await page.locator('#next').click();await expect(page.locator('#reader')).not.toBeVisible();
  expect(errors).toEqual([]);
 });
}
test('switching books preserves separate progress and favorites',async({page})=>{
 await page.goto('/');await expect(page.locator('.book-card')).toHaveCount(31);
 await page.locator('[data-action="favorite"][data-id="ugly-duckling"]').click();
 await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();
 await page.locator('[data-page="3"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.locator('[data-action="read"][data-id="ugly-duckling"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText('01 / 06');
 await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.reload();await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText('04 / 06');await page.locator('#close-reader').click();
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
