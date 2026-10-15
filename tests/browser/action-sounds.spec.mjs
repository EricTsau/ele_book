import {test,expect} from '@playwright/test';
import {bookFor,beatsFor,beatRole,beatFile,expectAudio,advanceAudioBeat,enableAudioSeeking,originalIndex,timelineKey} from './helpers.mjs';

test.afterEach(async({page})=>{await page.unrouteAll({behavior:'wait'});});

test('new action timbres render audible, finite audio independently of background music',async({page})=>{
 await page.goto('/');
 const results=await page.evaluate(async()=>{
  const {createSoundscape}=await import('/soundscape.js');
  const RealAudio=window.AudioContext,results=[];
  try{
   for(const type of ['thud','tap','stone','crack','snap','creak','paper','cloth','rustle','scrape','snip','splash','pour','rain','bubble','sip','crunch','clock','bell','jingle']){
    const offline=new OfflineAudioContext(1,48000,24000);let gains=0;
    window.AudioContext=function(){return new Proxy(offline,{get(target,key){
     if(key==='state')return 'running';
     if(key==='createGain')return ()=>{const g=target.createGain();if(++gains===2)g.connect=()=>{};return g;}; // disconnect only the bed
     const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
    }});};
    const sound=createSoundscape();sound.unlock();sound.scene({soundCues:[{time:0,type}]});sound.tick(0,true,false);
    const data=(await offline.startRendering()).getChannelData(0);
    results.push({type,finite:data.every(Number.isFinite),peak:Math.max(...data.map(Math.abs)),energy:Math.sqrt(data.reduce((n,v)=>n+v*v,0)/data.length)});
    sound.stop();
   }
  }finally{window.AudioContext=RealAudio;}
  return results;
 });
 for(const result of results){expect(result.finite,result.type).toBe(true);expect(result.energy,result.type).toBeGreaterThan(.0001);expect(result.peak,result.type).toBeLessThan(.5);}
 expect(new Set(results.map(r=>r.energy.toFixed(6))).size).toBeGreaterThan(15);
});

for(const scenario of [
 {id:'three-little-pigs',index:4,type:'crumble',time:8.65},
 {id:'goldilocks',index:2,type:'crack',time:8},
])test(`${scenario.id}: impact follows real narration and animation, and repeats only on replay`,async({page})=>{
 test.setTimeout(90000);await enableAudioSeeking(page);await page.goto('/');
 await page.locator(`[data-action="read"][data-id="${scenario.id}"]`).first().click();
 const index=originalIndex(scenario.id,scenario.index),chapter=bookFor(scenario.id).chapters[index];
 await page.locator(`[data-page="${index}"]`).click();await expect(page.locator('#open-book')).toHaveAttribute('aria-busy','false');
 const beats=await beatsFor(page,scenario.id,index),target=beats.findIndex(b=>b.start<=scenario.time&&b.end>scenario.time);
 expect(target).toBeGreaterThanOrEqual(0);
 const playToImpact=async()=>{
  for(let i=0;i<target;i++){await expectAudio(page,beatRole(beats[i]),beatFile(chapter,beats[i]));await advanceAudioBeat(page);}
  await expectAudio(page,beatRole(beats[target]),beatFile(chapter,beats[target]));
  await page.locator('#story-audio').evaluate((a,{beat,time})=>{a.currentTime=Math.max(0,(time-beat.start)/(beat.end-beat.start)*a.duration-.08);},{beat:beats[target],time:scenario.time});
  await expect.poll(()=>page.evaluate(type=>window.__storySound.inspect().events.filter(e=>e.type===type).length,scenario.type)).toBe(1);
 };
 await playToImpact();
 const frame=await page.evaluate(({key,index})=>{
  const s=window.__storybook3d.scenes[index];return {time:window.__timelines[key].time(),house:s.house?.scale.y,chair:s.effects?.chairSeat?.rotation.z,ducked:window.__storySound.inspect().ducked};
 },{key:timelineKey(scenario.id,index),index});
 expect(frame.time).toBeGreaterThanOrEqual(scenario.time);expect(frame.time).toBeLessThan(scenario.time+1);
 expect(frame.ducked).toBe(true);
 if(scenario.type==='crumble')expect(frame.house).toBeLessThan(1);
 else expect(frame.chair).toBeGreaterThan(0);
 await page.locator('#play-pause').click();
 expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
 const before=await page.evaluate(()=>window.__storySound.inspect().events.length);
 await page.waitForTimeout(200);expect(await page.evaluate(()=>window.__storySound.inspect().events.length)).toBe(before);
 await page.locator('#replay').click();await playToImpact();
 await page.locator('#sound-toggle').click();expect(await page.evaluate(()=>window.__storySound.inspect().activeNodes)).toBe(0);
});

test('seeking skips old effects and muted playback never catches up missed impacts',async({page})=>{
 await page.goto('/');await page.locator('#hero-read').click();await page.locator('#play-pause').click();
 const result=await page.evaluate(async()=>{
  const {createSoundscape}=await import('/soundscape.js');const sound=createSoundscape();sound.unlock();
  await new Promise(resolve=>setTimeout(resolve,100));
  sound.scene({soundCues:[{time:1,type:'crack'},{time:2,type:'crack'},{time:3,type:'crack'}]});
  sound.tick(0,true);sound.tick(2.05,true);
  const seek=sound.inspect().events.filter(e=>e.type==='crack');
  sound.setEnabled(false);sound.tick(3.05,true);sound.setEnabled(true);sound.tick(3.06,true);
  const mute=sound.inspect().events.filter(e=>e.type==='crack');
  sound.tick(3.06,false);const stopped=sound.inspect().activeNodes;
  sound.scene({soundCues:[{time:0,type:'bell'}]});sound.tick(0,true);
  const replay=sound.inspect().events;sound.stop();
  return {seek,mute,stopped,replay};
 });
 expect(result.seek).toEqual([{type:'crack',time:2}]);
 expect(result.mute).toEqual(result.seek);
 expect(result.stopped).toBe(0);
 expect(result.replay).toContainEqual({type:'bell',time:0});
});
