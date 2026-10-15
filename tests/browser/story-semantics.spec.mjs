import {test,expect} from '@playwright/test';
import {originalIndex,finishOpening,expectAudio,timelineKey,enableAudioSeeking,beatsFor,beatRole,beatFile,advanceAudioBeat,bookFor} from './helpers.mjs';
test.beforeEach(async({page})=>enableAudioSeeking(page));
test('asking a character to speak does not rewind the story or rebuild fallen houses',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 const id='three-little-pigs',index=originalIndex(id,4),key=timelineKey(id,index);
 await page.locator(`[data-page="${index}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.locator('#play-pause').click();
 await page.evaluate(key=>{window.__timelines[key].pause(12,true);},key);
 const before=await page.evaluate(()=>window.__storybook3d.inspect().houseScale);
 await page.locator('#actor-controls button').last().click();await page.waitForTimeout(350);
 expect(await page.evaluate(key=>window.__timelines[key].time(),key)).toBe(12);
 expect(await page.evaluate(()=>window.__storybook3d.inspect().houseScale)).toBe(before);
});
test('closely spaced story cues wait for the current spoken line instead of cutting it off',async({page})=>{
 await page.goto('/');await page.locator('[data-action="read"][data-id="tortoise-and-hare"]').first().click();
 const id='tortoise-and-hare',index=originalIndex(id,4),key=timelineKey(id,index);
 await page.locator(`[data-page="${index}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await finishOpening(page,id,index);
 const chapter=bookFor(id).chapters[index],beats=await beatsFor(page,id,index);
 const first=beats.findIndex(b=>b.kind==='line'&&b.index===0);
 await expectAudio(page,'line',beatFile(chapter,beats[first]));
 await page.waitForTimeout(1000);
 expect(await page.locator('#story-audio').getAttribute('src')).toContain('line-0.mp3');
 // Finish each intervening real sentence before the second authored line.
 for(let n=first;n<beats.length-1;n++){
  await advanceAudioBeat(page);
  const next=beats[n+1];await expectAudio(page,beatRole(next),beatFile(chapter,next));
  if(next.kind==='line'&&next.index===1)return;
 }
 throw new Error('Second character line was not reached');
});
test('pig construction starts with an unbuilt house and finishes with a standing house',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 for(const sourceIndex of [1,2,3]){
  const chapter=originalIndex('three-little-pigs',sourceIndex);
  const values=await page.evaluate(i=>{const tl=window.__timelines[`pigs-${i}`];tl.pause(.8);const start=window.__storybook3d.scenes[i].house.scale.y;tl.pause(14);return {start,end:window.__storybook3d.scenes[i].house.scale.y};},chapter);
  expect(values.start).toBeLessThan(.15);expect(values.end).toBe(1);
 }
});
