import {test,expect} from '@playwright/test';
import {books} from '../../public/books.js';
import {tag,expectAudio} from './helpers.mjs';

test('all books show uninterrupted original chapters followed by one reflection',async({page})=>{
 test.setTimeout(180000);await page.goto('/');const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [n,b]of books.entries()){
  await page.locator(`[data-action="read"][data-id="${b.id}"]`).first().click();
  if(n===0)await page.locator('#voice-toggle').click();
  const originals=b.chapters.filter(c=>c.kind==='story');
  await expect(page.locator('#chapter-dots button')).toHaveCount(originals.length+1);
  const labels=await page.locator('#chapter-dots button').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
  originals.forEach((c,i)=>expect(labels[i]).toBe(`第 ${i+1} 章：${c.title}`));
  await expect(page.locator('#reflection-panel')).toBeHidden();
  await page.locator(`[data-page="${originals.length}"]`).click();
  await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('#reflection-question')).toHaveText(b.chapters.at(-1).reflection.question);
  await page.locator('#close-reader').click();
 }
 expect(errors).toEqual([]);
});

test('a retired insert bookmark opens the next plot event and its original audio',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('little-leaf:library:v2',JSON.stringify({version:3,books:{'red-riding-hood':{page:1,pageId:'red-riding-hood:bridge-route',started:true,favorite:true}}})));
 await page.goto('/');await page.locator('[data-action="read"][data-id="red-riding-hood"]').first().click();
 await expect(page.locator('#chapter-tag')).toHaveText(tag('red-riding-hood',1));
 await expectAudio(page,'opening','scene-1-sentence-0.mp3');
 await expect(page.locator('#reflection-panel')).toBeHidden();
});
