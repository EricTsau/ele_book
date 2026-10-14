import {test,expect} from '@playwright/test';
import {bookFor,total,tag,timelineKey,enableAudioSeeking,expectAudio,finishOpening} from './helpers.mjs';
const id='three-little-pigs';

test('opening can pause and resume; closing finishes before automatic turn',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();
 await expectAudio(page,'opening');
 const opening=await page.evaluate(()=>window.__timelines['pigs-0'].time());
 await page.waitForTimeout(150);expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(opening);
 await page.locator('#play-pause').click();expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 await page.locator('#play-pause').click();await finishOpening(page,id,0);
 await expectAudio(page,'line');
 await page.locator('#auto-toggle').click();
 await page.evaluate(()=>{document.querySelector('#story-audio').pause();window.__timelines['pigs-0'].progress(1);});
 await expectAudio(page,'line',`${bookFor(id).chapters[0].audioKey}-line-2.mp3`);
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
 await expectAudio(page,'closing');await page.waitForTimeout(3200);
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,0));
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,1),{timeout:6000});
});

test('missing opening narration releases animation and leaves readable text',async({page})=>{
 await page.route('**/scene-0-narration-0.mp3',r=>r.fulfill({status:404,body:''}));
 await page.goto('/');await page.locator('#hero-read').click();
 await expect.poll(()=>page.evaluate(()=>window.__timelines['pigs-0'].time()>1.5)).toBe(true);
 await expect(page.locator('#story-copy')).toContainText(bookFor(id).chapters[0].text.split('\n')[0]);
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


test('last dialogue is allowed to finish before closing narration',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();await finishOpening(page,id,0);
 await expectAudio(page,'line');
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>a.ended)).toBe(true);
 await page.evaluate(()=>{const t=window.__timelines['pigs-0'];t.seek(t.duration()-.3,true);t.play();});
 await expectAudio(page,'line',`${bookFor(id).chapters[0].audioKey}-line-2.mp3`);
 await page.waitForTimeout(600);await expect(page.locator('#story-audio')).toHaveAttribute('data-role','line');
 await page.locator('#play-pause').click();expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 await page.locator('#play-pause').click();await expectAudio(page,'line');
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
 await expectAudio(page,'closing');
});

test('enabling auto while closing narration is paused does not skip it',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();await finishOpening(page,id,0);
 await page.evaluate(()=>{document.querySelector('#story-audio').pause();window.__timelines['pigs-0'].progress(1);});
 await expectAudio(page,'line');await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});await expectAudio(page,'closing');
 await page.locator('#play-pause').click();await page.locator('#auto-toggle').click();await page.waitForTimeout(3300);
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,0));
 await expect(page.locator('#story-audio')).toHaveAttribute('data-role','closing');
 expect(await page.locator('#story-audio').evaluate(a=>a.paused)).toBe(true);
 await page.locator('#play-pause').click();await expectAudio(page,'closing');
 await page.locator('#story-audio').evaluate(a=>{a.currentTime=a.duration-.03;});
 await expect(page.locator('#chapter-tag')).toHaveText(tag(id,1),{timeout:6000});
});

test('character interaction preserves the interrupted opening paragraph',async({page})=>{
 await enableAudioSeeking(page);await page.goto('/');await page.locator('#hero-read').click();await expectAudio(page,'opening');
 await page.locator('#actor-controls button').first().click();
 await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','播放動畫');
 await page.locator('#play-pause').click();await expectAudio(page,'opening');
 await expect(page.locator('#dialogue')).toContainText(bookFor(id).chapters[0].narration[0]);
 expect(await page.evaluate(()=>window.__timelines['pigs-0'].time())).toBe(1.2);
 await finishOpening(page,id,0);await expectAudio(page,'line');
});
