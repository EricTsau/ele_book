import {test,expect} from '@playwright/test';
import {tag} from './helpers.mjs';
test('soundscape produces audio, ducks under narration, and stops on pause, mute, and close',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 await expect(page.locator('#sound-toggle')).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>window.__storySound.inspect().energy)).toBeGreaterThan(.000001);
 await expect.poll(()=>page.evaluate(()=>window.__storySound.inspect().ducked)).toBe(true);
 await page.locator('#play-pause').click();
 expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
 await page.locator('#play-pause').click();
 await expect.poll(()=>page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBeGreaterThan(0);
 await page.locator('#sound-toggle').click();
 expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
 await expect(page.locator('#sound-toggle')).toHaveAttribute('aria-pressed','false');
 await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
 await page.locator('#sound-toggle').click();await page.locator('#close-reader').click();
 expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
});
test('unsupported Web Audio leaves stories and voice controls usable',async({page})=>{
 await page.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});
 await page.goto('/');await page.locator('#hero-read').click();await expect(page.locator('#reader-title')).toHaveText('三隻小豬');
 await expect(page.locator('#sound-toggle')).toBeDisabled();await page.locator('#next').click();await expect(page.locator('#chapter-tag')).toHaveText(tag('three-little-pigs',1));
 expect(await page.evaluate(()=>window.__storySound.inspect().available)).toBe(false);
});
