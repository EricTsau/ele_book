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
   await expect.poll(()=>page.locator('#story-audio').evaluate(a=>!a.paused&&a.currentTime>0&&a.error===null)).toBe(true);
  }
  await page.locator('#next').click();await expect(page.locator('#reader')).not.toBeVisible();
  expect(errors).toEqual([]);
 });
}
test('switching books preserves separate progress and favorites',async({page})=>{
 await page.goto('/');await expect(page.locator('.book-card')).toHaveCount(11);
 await page.locator('[data-action="favorite"][data-id="ugly-duckling"]').click();
 await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();
 await page.locator('[data-page="3"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.locator('[data-action="read"][data-id="ugly-duckling"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText('01 / 06');
 await page.locator('#next').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');await page.locator('#close-reader').click();
 await page.reload();await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();await expect(page.locator('#chapter-tag')).toHaveText('04 / 06');await page.locator('#close-reader').click();
 await page.locator('#favorite-filter').click();await expect(page.locator('.book-card')).toHaveCount(1);await expect(page.locator('.book-card h3')).toHaveText('醜小鴨');
});
