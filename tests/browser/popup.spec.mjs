import {test,expect} from '@playwright/test';
test('reader renders a real 3D book with depth and autoplay on page entry',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 await expect(page.locator('#story-canvas')).toBeVisible();
 const info=await page.evaluate(()=>window.__storybook3d.inspect());
 expect(info.webgl).toBe(true);expect(info.meshes).toBeGreaterThan(30);expect(info.bookDepth).toBeGreaterThan(0);
 await page.locator('#play-pause').click();
 await page.locator('#next').click();await expect(page.locator('#chapter-tag')).toHaveText('02 / 08');
 await expect(page.locator('#play-pause')).toHaveAttribute('aria-label','暫停動畫');
 await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0)).toBe(true);
 const time=await page.evaluate(()=>window.__timelines['pigs-1'].time());await page.waitForTimeout(200);
 expect(await page.evaluate(()=>window.__timelines['pigs-1'].time())).toBeGreaterThan(time);
});
test('dragging changes the perspective of the book',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 const start=await page.evaluate(()=>window.__storybook3d.inspect().camera);
 const canvas=page.locator('#story-canvas');const box=await canvas.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+130,box.y+box.height/2+10,{steps:8});await page.mouse.up();
 const end=await page.evaluate(()=>window.__storybook3d.inspect().camera);
 expect(end).not.toEqual(start);
});
