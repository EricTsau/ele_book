import {test,expect} from '@playwright/test';
import {bookFor,total,tag,timelineKey,enableAudioSeeking,expectAudio,beatsFor,beatRole,beatFile,advanceAudioBeat} from './helpers.mjs';
const id='three-little-pigs';
// Auto-turn tests may finish as the next page requests its opening recording.
// Finish those route callbacks before Playwright closes the page.
test.afterEach(async({page})=>{await page.unrouteAll({behavior:'wait'});});
async function reachLast(page){
 const beats=await beatsFor(page,id,0),chapter=bookFor(id).chapters[0];
 for(const [i,beat]of beats.entries()){
  await expectAudio(page,beatRole(beat),beatFile(chapter,beat));
  if(i<beats.length-1)await advanceAudioBeat(page);
 }
 return beats.at(-1);
}

test('every spoken beat finishes in order before automatic turn',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();
 await page.locator('#auto-toggle').click();await reachLast(page);
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,0));
 await advanceAudioBeat(page,{last:true});
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,1),{timeout:7000});
});
test('missing sentence audio skips only that beat and continues the next sentence',async({page})=>{
 await page.route('**/scene-0-sentence-0.mp3',r=>r.fulfill({status:404,body:''}));
 await page.goto('/');await page.locator('#hero-read').click();
 await expectAudio(page,'opening','scene-0-sentence-1.mp3');
 await expect.poll(()=>page.evaluate(()=>window.__timelines['pigs-0'].time()>1.3)).toBe(true);
 await expect(page.locator('#story-copy')).toContainText(bookFor(id).chapters[0].text.split('\n')[0]);
});
test('last spoken beat continues animating and can pause before page completion',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();const beat=await reachLast(page);
 const before=await page.evaluate(()=>window.__timelines['pigs-0'].time());
 await expect.poll(()=>page.evaluate(()=>window.__timelines['pigs-0'].time())).toBeGreaterThan(before+.03);
 expect(before).toBeLessThan(beat.end);
 await page.locator('#play-pause').click();expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 await page.locator('#play-pause').click();await expectAudio(page,beatRole(beat));
 await advanceAudioBeat(page,{last:true});
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].progress())).toBe(1);
});
test('auto enabled during a paused final beat waits for that audio to finish',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();const last=await reachLast(page);
 await page.locator('#play-pause').click();await page.locator('#auto-toggle').click();await page.waitForTimeout(3300);
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,0));expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 await page.locator('#play-pause').click();await expectAudio(page,beatRole(last));await advanceAudioBeat(page,{last:true});
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,1),{timeout:7000});
});
test('character interaction resumes the interrupted sentence at its saved audio position',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();await expectAudio(page,'opening');
 const saved=await page.locator('#story-audio').evaluate(a=>({src:a.getAttribute('src'),time:a.currentTime}));
 await page.locator('#actor-controls button').first().click();
 await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','播放動畫');
 await page.locator('#play-pause').click();await expectAudio(page,'opening');
 await expect(page.locator('#story-audio')).toHaveAttribute('src',saved.src);
 expect(await page.locator('#story-audio').evaluate(a=>a.currentTime)).toBeGreaterThanOrEqual(saved.time);
 await expect(page.locator('#dialogue')).toContainText('森林裡，住著三隻感情很好的小豬。');
});
for(const width of [320,390])test(`reflection remains open with auto enabled at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');await page.locator('#hero-read').click();
 await page.locator('#voice-toggle').click();const last=total(id)-1;
 await page.locator(`[data-page="${last}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.locator('#auto-toggle').click();
 await page.evaluate(key=>{window.__timelines[key].progress(1);},timelineKey(id,last));
 await page.waitForTimeout(3300);await expect(page.locator('#reader')).toBeVisible();
 await expect(page.locator('#reflection-question')).toHaveText(bookFor(id).chapters[last].reflection.question);
 await expect(page.locator('#reflection-action')).toHaveText(bookFor(id).chapters[last].reflection.action);
 expect(await page.locator('#reader').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 await expect(page.locator('#scene-status')).toHaveText('留一點時間，一起聊聊');
});
