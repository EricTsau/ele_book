import {test,expect} from '@playwright/test';
test('asking a character to speak does not rewind the story or rebuild fallen houses',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 await page.locator('[data-page="4"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.evaluate(()=>{window.__timelines['pigs-4'].pause(12);});
 const before=await page.evaluate(()=>window.__storybook3d.inspect().houseScale);
 await page.locator('#actor-controls button').last().click();await page.waitForTimeout(350);
 expect(await page.evaluate(()=>window.__timelines['pigs-4'].time())).toBe(12);
 expect(await page.evaluate(()=>window.__storybook3d.inspect().houseScale)).toBe(before);
});
test('closely spaced story cues wait for the current spoken line instead of cutting it off',async({page})=>{
 await page.goto('/');await page.locator('[data-action="read"][data-id="tortoise-and-hare"]').first().click();
 await page.locator('[data-page="4"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 await page.evaluate(()=>{window.__timelines['tortoise-and-hare-4'].play(7.8);});
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0)).toBe(true);
 await page.waitForTimeout(1000);
 expect(await page.locator('#story-audio').getAttribute('src')).toContain('line-0.mp3');
 await expect.poll(()=>page.locator('#story-audio').getAttribute('src'),{timeout:10000}).toContain('line-1.mp3');
});
test('pig construction starts with an unbuilt house and finishes with a standing house',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 for(const chapter of [1,2,3]){
  const values=await page.evaluate(i=>{const tl=window.__timelines[`pigs-${i}`];tl.pause(.8);const start=window.__storybook3d.scenes[i].house.scale.y;tl.pause(14);return {start,end:window.__storybook3d.scenes[i].house.scale.y};},chapter);
  expect(values.start).toBeLessThan(.15);expect(values.end).toBe(1);
 }
});
