import {test,expect} from '@playwright/test';

test('wolf stays outside while every pig is visible inside each attacked house',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();
 for(const index of [4,5,6]){
  const state=await page.evaluate(i=>{
   Object.values(window.__timelines).forEach(t=>t.pause());
   const world=window.__storybook3d,s=world.scenes[i];world.show(i);window.__timelines[`pigs-${i}`].pause(6,true);
   const inside=p=>Math.abs(p.x-s.house.position.x)<.975&&Math.abs(p.z-s.house.position.z)<.75;
   return {pigs:s.pigs.map(a=>inside(a.root.position)),wolf:inside(s.wolf.root.position),cutaway:!!s.interior};
  },index);
  expect(state.pigs,`house ${index}: pigs must shelter inside`).not.toContain(false);
  expect(state.wolf).toBe(false);expect(state.cutaway).toBe(true);
 }
});

test('indoor animation renders on desktop and mobile, and room changes with the chapter',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const size of [{width:1100,height:820},{width:390,height:844}]){
  await page.setViewportSize(size);await page.goto('/');
  await page.locator('[data-action="read"][data-id="cinderella"]').first().click();
  await page.locator('[data-page="2"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
  const result=await page.evaluate(()=>{const s=window.__storybook3d.scenes[2],tl=window.__timelines['cinderella-2'];tl.pause(4,true);const a=s.pigs[0].root.position.toArray();tl.pause(9,true);return {kind:s.interior?.spec.kind,a,b:s.pigs[0].root.position.toArray(),floor:s.interior?.floor.visible};});
  expect(result.kind).toBe('palace');expect(result.floor).toBe(true);expect(result.a).not.toEqual(result.b);
  expect(await page.evaluate(()=>window.__storybook3d.inspect().pageTextSurfaces)).toBe(0);
  await page.locator('.story-transcript summary').click();await expect(page.locator('#story-copy')).toBeVisible();await expect(page.locator('#story-copy')).toContainText('音樂亮起的夜晚');
  await page.locator('[data-page="1"]').click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
  expect(await page.evaluate(()=>!!window.__storybook3d.scenes[1].interior)).toBe(false);
 }
 expect(errors).toEqual([]);
});

test('full spread camera retains tall actions on desktop and mobile',async({page})=>{
 for(const size of [{width:1100,height:820},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const [id,index] of [['jack-and-beanstalk',2],['bremen-musicians',3]]){
   await page.goto('/');await page.locator(`[data-action="read"][data-id="${id}"]`).first().click();
   const bounds=await page.evaluate(async({id,index})=>{
    const T=await import('/vendor/three.module.js'),w=window.__storybook3d;
    Object.values(window.__timelines).forEach(t=>t.pause());w.show(index);window.__timelines[`${id}-${index}`].pause(8,true);
    const state=w.inspect(),camera=new T.PerspectiveCamera(35,state.cameraAspect,.1,80);camera.position.fromArray(state.camera);camera.lookAt(new T.Vector3().fromArray(state.cameraTarget));camera.updateMatrixWorld();
    const scene=w.scenes[index];scene.root.updateMatrixWorld(true);const points=[];
    for(const actor of scene.pigs){const box=new T.Box3().setFromObject(actor.root);for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])points.push(new T.Vector3(x,y,z).project(camera).toArray());}
    return points;
   },{id,index});
   for(const p of bounds){expect(Math.abs(p[0]),`${id} horizontal crop`).toBeLessThan(1);expect(Math.abs(p[1]),`${id} vertical crop`).toBeLessThan(1);}
  }
 }
});
