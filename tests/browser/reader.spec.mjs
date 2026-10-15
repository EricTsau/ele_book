import {test,expect} from '@playwright/test';
import {total,tag,originalIndex,timelineKey} from './helpers.mjs';
const pigs='three-little-pigs';
test('read the entire story, replay, bookmark, and close without background animation',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('#hero-read').click();
 await expect(page.locator('#reader')).toBeVisible();
 await expect(page.locator('#previous')).toBeDisabled();
 await expect(page.locator('#story-copy')).toContainText('走吧');
 await page.locator('#play-pause').click();
 const before=await page.evaluate(()=>window.__timelines['pigs-0'].time());
 await page.waitForTimeout(200);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(before);
 await page.locator('#replay').click();
 await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','暫停動畫');
 for(let i=1;i<total(pigs);i++){
  await page.locator('#next').click();
  await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,i));
  await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
  if(i===originalIndex(pigs,7))await expect(page.locator('#story-copy')).toContainText('最好的家');
 }
 await expect(page.locator('#reflection-panel')).toBeVisible();
 await expect(page.locator('#reflection-question')).not.toBeEmpty();
 await expect(page.locator('#reflection-action')).not.toBeEmpty();
 await page.locator('#next').click();await expect(page.locator('#reader')).not.toBeVisible();
 expect(await page.evaluate(()=>Object.values(window.__timelines).every(t=>t.paused()))).toBe(true);
 expect(await page.evaluate(()=>window.__storybook3d.inspect().running)).toBe(false);
 await page.reload();await expect(page.locator('#reading-status')).toContainText('已讀完');
 await page.locator('#card-read').click();await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,total(pigs)-1));
 await page.keyboard.press('Escape');await expect(page.locator('#reader')).not.toBeVisible();
 expect(errors).toEqual([]);
});
test('catalog search, favorite, and persistence',async({page})=>{
 await page.goto('/');await page.locator('#favorite-filter').click();await expect(page.locator('#empty-state')).toBeVisible();
 await page.locator('#reset-filter').click();await page.locator('#favorite').click();await page.reload();
 await expect(page.locator('#favorite')).toHaveAttribute('aria-pressed','true');
 await page.locator('#favorite-filter').click();await expect(page.locator('#book-card')).toBeVisible();
 await page.locator('#search').fill('不存在的書');await expect(page.locator('#empty-title')).toHaveText('找不到這個故事');
 await page.locator('#reset-filter').click();await expect(page.locator('#book-card')).toBeVisible();
});
test('mobile fits viewport, has character dialogue, keyboard navigation and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#hero-read').click();await expect(page.locator('#play-pause')).toBeDisabled();
 await expect(page.locator('#dialogue')).toContainText('小豬弟弟');
 expect(await page.locator('#reader').evaluate(el=>el.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#actor-controls button').first().click();await expect(page.locator('#dialogue')).toContainText('最快完成');
 await page.keyboard.press('ArrowRight');await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,1));
 await page.keyboard.press('ArrowLeft');await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,0));
});
test('wolf knocks down straw and wood, brick remains standing; rapid turns are bounded',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 const strawIndex=originalIndex(pigs,4),brickIndex=originalIndex(pigs,6);
 await page.locator(`[data-page="${strawIndex}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 const straw=await page.evaluate(key=>{const t=window.__timelines[key];t.pause(10);return window.__storybook3d.inspect().houseScale;},timelineKey(pigs,strawIndex));
 expect(straw).toBeLessThan(.5);
 await page.locator(`[data-page="${brickIndex}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 const brick=await page.evaluate(key=>{window.__timelines[key].pause(10);return window.__storybook3d.inspect().houseScale;},timelineKey(pigs,brickIndex));
 expect(brick).toBe(1);
 await page.locator('#next').dblclick();await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,brickIndex+1));
 await expect(page.locator('#reader')).toBeVisible();
});
test('blocked storage remains usable when system voices are unavailable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});Object.defineProperty(window,'speechSynthesis',{value:undefined});});
 await page.goto('/');await page.locator('#hero-read').click();await expect(page.locator('#voice-toggle')).toHaveAttribute('aria-pressed','true');
 await page.locator('#next').click();await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,1));
});
test('automatic page turn advances once and stops after closing',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();await page.locator('#voice-toggle').click();await page.locator('#auto-toggle').click();
 await page.evaluate(()=>{window.__timelines['pigs-0'].progress(1);});
 // Check the three-second dwell and the animated turn as separate phases.
 await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','true',{timeout:5000});
 await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,1),{timeout:5000});
 await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.evaluate(()=>{window.__timelines['pigs-1'].progress(1);});await page.locator('#close-reader').click();
 await page.waitForTimeout(3200);
 expect(await page.evaluate(()=>Object.values(window.__timelines).every(t=>t.paused()))).toBe(true);
 await page.locator('#card-read').click();await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,1));
});
test('touch swipe turns a page but vertical reading does not',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('#hero-read').click();
 await page.evaluate(() => { const el=document.getElementById('open-book'); el.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:280,clientY:260})]})); });
 await page.evaluate(() => { const el=document.getElementById('open-book'); el.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:280,clientY:100})]})); });
 await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,0));
 await page.evaluate(() => { const el=document.getElementById('open-book'); el.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:280,clientY:260})]})); });
 await page.evaluate(() => { const el=document.getElementById('open-book'); el.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:80,clientY:255})]})); });
 await expect(page.locator('#chapter-tag')).toHaveText(tag(pigs,1));
});
test('character click preserves story time; closing cancels gestures',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();await page.locator('#actor-controls button').first().click();
 const before=await page.evaluate(()=>window.__timelines['pigs-0'].time());
 await page.waitForTimeout(250);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(before);
 await expect(page.locator('#dialogue')).toContainText('最快完成');
 await page.locator('#close-reader').click();
 const closed=await page.evaluate(()=>window.__timelines['pigs-0'].time());await page.waitForTimeout(250);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(closed);
});
test('bundled Mandarin dialogue plays without system voices and stops when closed',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{value:undefined});});
 await page.goto('/');await page.locator('#hero-read').click();
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0)).toBe(true);
 await page.locator('#close-reader').click();
 expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
});
