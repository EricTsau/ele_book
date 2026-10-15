import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFixture} from './scene-fixture.mjs';
import {createSoundscape} from '../public/soundscape.js';

test('footsteps follow the actual walking segments, with no steps during sleep',()=>{
 const f=sceneFixture('tortoise-and-hare',3);
 try {
  const cues=f.timeline.data?.motionSounds||[];
  assert.ok(cues.some(c=>c.type==='step'&&c.time>=1.5&&c.time<5.5),'walking turtle must produce motion markers');
  assert.ok(!cues.some(c=>c.type==='step'&&c.time>5.5&&c.time<7),'no footsteps while turtle stops');
 } finally {f.dispose();}
});
test('stationary bedtime scene has fabric sounds without invented footsteps',()=>{
 const f=sceneFixture('princess-and-pea',3),sound=createSoundscape();
 try {
  sound.scene(f.chapter,f.timeline.data?.motionSounds||[]);
  const cues=sound.inspect().cues||[];
  assert.ok(cues.some(c=>c.type==='cloth'));
  assert.ok(!cues.some(c=>c.type==='step'));
 } finally {f.dispose();}
});
test('chair break and egg hatch use distinct action sounds at the visible event',()=>{
 for(const [id,index,type,time] of [['goldilocks',2,'crack',8],['ugly-duckling',0,'crack',3.4]]){
  const f=sceneFixture(id,index),sound=createSoundscape();
  try{sound.scene(f.chapter,f.timeline.data?.motionSounds||[]);assert.ok(sound.inspect().cues?.some(c=>c.type===type&&c.time===time));}finally{f.dispose();}
 }
});

test('all classic and original action markers stay within their choreography',async()=>{
 const {books}=await import('../public/books.js');
 const legal=new Set(['step','knock','drop','water','sparkle','chime','wind','crumble','flutter','bird','drum','music','thud','tap','stone','crack','snap','creak','paper','cloth','rustle','scrape','snip','splash','pour','rain','bubble','sip','crunch','clock','bell','jingle']);
 let pages=0;
 for(const b of books.slice(1))for(const c of b.chapters.filter(c=>c.kind==='story')){
  const f=sceneFixture(b.id,c.storyIndex),sound=createSoundscape();
  try{
   sound.scene(c,f.timeline.data?.motionSounds||[]);
   for(const cue of sound.inspect().cues){assert.ok(legal.has(cue.type),`${c.id}: ${cue.type}`);assert.ok(cue.time>=0&&cue.time<=f.timeline.duration(),`${c.id}: ${cue.time} out of bounds`);}
   pages++;
  }finally{f.dispose();}
 }
 assert.equal(pages,180);
});

test('bridge crossing uses footfalls on its curved deck path',()=>{
 const f=sceneFixture('bridge-that-listened',3);
 try{assert.ok(f.timeline.data?.motionSounds?.some(c=>c.type==='step'&&c.time>4&&c.time<7),'crossing must keep its own footfalls');}finally{f.dispose();}
});
