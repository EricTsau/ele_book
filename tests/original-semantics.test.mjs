import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {originals} from '../public/originals.js';
import {sceneFixture,H} from './scene-fixture.mjs';
const near=(actual,expected,label,tolerance=.025)=>assert.ok(Math.abs(actual-expected)<tolerance,`${label}: ${actual} != ${expected}`);
const shown=o=>o&&o.visible&&o.scale.x>.01&&o.scale.y>.01&&o.scale.z>.01;
const fixture=(id,index,check)=>{const f=sceneFixture(id,index);try{check(f);}finally{f.dispose();}};
const details=f=>f.scene.effects.original;

test('lantern: damage, unsuccessful patches, transparent repair, steps, shelter and final new panel',()=>{
 fixture('lantern-with-many-windows',0,f=>{f.seek(1);assert.ok(details(f).patches.every(shown));f.seek(3);assert.ok(details(f).patches.every(v=>!shown(v)));});
 fixture('lantern-with-many-windows',1,f=>{f.seek(10);assert.ok(details(f).patches.every(shown));assert.ok(details(f).patches.every(v=>v.material.color.r<.4));});
 fixture('lantern-with-many-windows',2,f=>{f.seek(2);assert.ok(details(f).patches.every(v=>!shown(v)));f.seek(10);assert.ok(details(f).patches.every(shown));assert.ok(new Set(details(f).patches.map(v=>v.material.color.getHex())).size===3);});
 fixture('lantern-with-many-windows',3,f=>{const s=f.seek(9.2);near(s.pigs[2].root.position.y,.14,'mouse stands on the second step');});
 fixture('lantern-with-many-windows',4,f=>{f.seek(7);assert.ok(details(f).lantern.position.z>0&&details(f).lantern.position.y>.2,'lamp stays visible in front of the porch wall');});
 fixture('lantern-with-many-windows',5,f=>{f.seek(5);assert.ok(!shown(details(f).extraPatch));f.seek(8);assert.ok(shown(details(f).extraPatch));});
});

test('rain post office: blank letter, drawn route, attached flying letter, address, reply and independent writing',()=>{
 fixture('rain-post-office',0,f=>{f.seek(2);assert.ok(!shown(details(f).letterInk));f.seek(5);assert.ok(shown(details(f).heldLetters[0]));assert.ok(!shown(f.scene.effects.letter));});
 fixture('rain-post-office',1,f=>{f.seek(6);assert.ok(!shown(details(f).letterInk));f.seek(10);assert.ok(shown(details(f).letterInk));});
 fixture('rain-post-office',2,f=>{for(const t of [4,7,10]){const s=f.seek(t),held=details(f).heldLetters[1];assert.equal(held.parent,s.pigs[1].root);assert.ok(shown(held));near(held.position.z,.48,'letter stays at bird beak');}f.seek(12);assert.ok(shown(details(f).heldLetters[0]));assert.ok(!shown(details(f).heldLetters[1]));});
 fixture('rain-post-office',3,f=>{f.seek(6);assert.ok(!shown(details(f).letterInk));f.seek(9);assert.ok(shown(details(f).letterInk));assert.ok(shown(details(f).heldLetters[0]));});
 fixture('rain-post-office',4,f=>{f.seek(2);assert.ok(shown(details(f).heldLetters[1]));f.seek(6);assert.ok(shown(details(f).heldLetters[0]));assert.ok(!shown(details(f).heldLetters[1]));});
 fixture('rain-post-office',5,f=>{f.seek(8);assert.ok(shown(details(f).heldNotes[1]));f.seek(12);assert.ok(shown(details(f).heldLetters[1]));});
});

test('bridge: inspect a model, slide back, revise its slope, test, yield and keep the path open',()=>{
 fixture('bridge-that-listened',0,f=>{f.seek(3);assert.ok(details(f).bridge.scale.x<.7);assert.ok(shown(details(f).river),'bridge spans actual water');});
 fixture('bridge-that-listened',1,f=>{const high=f.seek(6.3).pigs[1].root.position.y;const low=f.seek(8).pigs[1].root.position.y;assert.ok(high>.3&&low<.05);});
 fixture('bridge-that-listened',2,f=>{f.seek(12);assert.ok(details(f).bridge.scale.y<.8);assert.ok(details(f).planInk.scale.y<.6);});
 fixture('bridge-that-listened',3,f=>{assert.ok(f.seek(5.3).pigs[1].root.position.y>.3);assert.ok(f.seek(14).pigs[1].root.position.x>1.6);});
 fixture('bridge-that-listened',4,f=>{const s=f.seek(7.8);assert.ok(s.pigs[1].root.position.z<-.95);assert.ok(s.pigs[0].root.position.z>-.6);for(const t of [6.1,7.8,9]){f.seek(t);assert.ok(s.pigs[0].root.position.distanceTo(s.pigs[1].root.position)>.5,'opposing walkers have passing space');}f.seek(15.2);assert.ok(s.pigs[2].root.position.x>1.7);near(s.pigs[2].root.position.y,0,'last walker leaves deck');});
 fixture('bridge-that-listened',5,f=>{f.seek(5);assert.ok(shown(details(f).bridgeSign));assert.ok(f.seek(14).pigs[1].root.position.x>1.7);});
});

test('shadow: explicitly magical absence, searching, visible drawing, separate plans, real ball and reunion',()=>{
 fixture('shadow-takes-a-day-off',0,f=>assert.ok(f.scene.pigs.every(a=>a.name!=='影影')));
 fixture('shadow-takes-a-day-off',1,f=>{f.seek(5.5);assert.ok(f.scene.pigs[0].root.rotation.y>5);});
 fixture('shadow-takes-a-day-off',2,f=>{assert.ok(f.scene.pigs[1].root.scale.z<.2);f.seek(2);assert.ok(!shown(details(f).artInk));f.seek(11);assert.ok(shown(details(f).artInk));});
 fixture('shadow-takes-a-day-off',3,f=>assert.ok(details(f).choiceCards.every(shown)));
 fixture('shadow-takes-a-day-off',4,f=>{const ball=details(f).leafBall;f.seek(5);const start=ball.position.x;f.seek(6);assert.notEqual(ball.position.x,start);assert.ok(shown(ball));f.seek(11);assert.ok(shown(details(f).artInk));});
 fixture('shadow-takes-a-day-off',5,f=>{const s=f.seek(13);assert.ok(Math.abs(s.pigs[0].root.position.z-s.pigs[1].root.position.z)<.1);assert.ok(s.pigs[0].root.position.distanceTo(s.pigs[1].root.position)>.8);});
});

test('seed library: seed packet, actual wet soil, failure record, drainage, harvest, return',()=>{
 fixture('seed-library-notebook',0,f=>{f.seek(10);assert.ok(shown(details(f).seedHands[0]));assert.equal(details(f).seedHands[0].parent,f.scene.pigs[0].root);});
 fixture('seed-library-notebook',1,f=>{f.seek(6);assert.ok(shown(details(f).wetSoil));assert.ok(!shown(details(f).seedling));assert.ok(!details(f).pot.children.some(m=>m.geometry?.type==='SphereGeometry'));});
 fixture('seed-library-notebook',2,f=>{f.seek(10);assert.ok(shown(details(f).heldNotes[0]));assert.ok(shown(details(f).wetSoil));});
 fixture('seed-library-notebook',3,f=>{assert.ok(shown(details(f).secondPot));f.seek(4.5);assert.ok(shown(details(f).drainDrops));f.seek(12);near(details(f).seedling.position.x,0,'plant remains inside its pot');near(details(f).pot.position.x,.65,'pot moves toward light');assert.ok(details(f).pot.position.distanceTo(details(f).secondPot.position)>.8,'comparison pots stay separate');near(details(f).seedling.rotation.z,0,'plant straightens');});
 fixture('seed-library-notebook',4,f=>{f.seek(2);assert.ok(shown(details(f).flower));assert.ok(!f.scene.props.children.find(p=>p.userData.prop==='flower')?.visible,'generic giant flower stays hidden');assert.ok(!shown(details(f).seedPacket));f.seek(12);assert.ok(shown(details(f).seedHands[0]));assert.ok(details(f).flower.scale.x<.2);});
 fixture('seed-library-notebook',5,f=>{f.seek(2);assert.ok(shown(details(f).seedHands[0]));f.seek(6);assert.ok(!shown(details(f).seedHands[0]));assert.ok(shown(details(f).seedPacket));});
});

test('clock: hurried schedule, actual stop while sun moves, rest, blank slots, changed plan and returned table clock',()=>{
 fixture('clock-with-a-breath',0,f=>{const before=f.seek(2).effects.hand.rotation.z;assert.notEqual(f.seek(10).effects.hand.rotation.z,before);});
 fixture('clock-with-a-breath',1,f=>{const hand=f.seek(5).effects.hand.rotation.z;const sun=f.scene.props.children.find(p=>p.userData.prop==='sun');const x=sun.position.x;f.seek(9);near(f.scene.effects.hand.rotation.z,hand,'dial remains stopped');assert.notEqual(sun.position.x,x);near(details(f).clockButton.scale.y,.045,'button returns to original size');});
 fixture('clock-with-a-breath',2,f=>{const s=f.seek(10);assert.ok(s.pigs.every(a=>a.root.position.y>=0));});
 fixture('clock-with-a-breath',3,f=>{f.seek(8);assert.equal(details(f).scheduleTasks.filter(shown).length,2);});
 fixture('clock-with-a-breath',4,f=>{const boundary=f.scene.interior.spec.front;assert.ok(f.seek(6).pigs[0].root.position.z<boundary,'wait for rain indoors');assert.ok(f.seek(12).pigs[0].root.position.z>boundary,'walk out to the garden');});
 fixture('clock-with-a-breath',5,f=>{f.seek(7);near(details(f).clock.position.x,.45,'small clock returned across desk');assert.ok(details(f).clock.children.every(m=>m.position.y<1.1),'no tower geometry');});
});

test('paper boat: no mast, blocked route, failed pushing, observed map, actual eddy, retrieval and dry display',()=>{
 fixture('paper-boat-map',0,f=>{assert.ok(shown(details(f).channel));assert.ok(f.scene.effects.boat.children.every(m=>m.position.y<.5),'folded hull has no mast');f.seek(10);assert.ok(shown(details(f).boatLeaf));near(f.scene.effects.boat.position.x,.95,'boat stops at leaf');});
 fixture('paper-boat-map',1,f=>{f.seek(11.5);assert.ok(!shown(f.scene.effects.boat));assert.ok(shown(details(f).boatHands[0]));});
 fixture('paper-boat-map',2,f=>{assert.ok(shown(details(f).channel),'water remains visible while drawing its route');f.seek(5);assert.ok(!shown(f.scene.effects.boat));assert.ok(!shown(details(f).mapRoute));f.seek(12);assert.ok(shown(details(f).mapRoute));});
 fixture('paper-boat-map',3,f=>{const positions=[7.1,7.5,7.9,8.3].map(t=>{f.seek(t);return f.scene.effects.boat.position.clone();});assert.ok(Math.max(...positions.map(p=>p.x))-Math.min(...positions.map(p=>p.x))>.4);assert.ok(Math.max(...positions.map(p=>p.z))-Math.min(...positions.map(p=>p.z))>.3);assert.ok(f.seek(13).effects.boat.position.x>1);});
 fixture('paper-boat-map',4,f=>{f.seek(8);assert.ok(details(f).boatLeaf.position.x>1.6);f.seek(13);assert.ok(shown(details(f).boatHands[0]));assert.ok(!shown(f.scene.effects.boat));});
 fixture('paper-boat-map',5,f=>{f.seek(5);assert.ok(shown(details(f).boatHands[0]));f.seek(9);assert.ok(!shown(details(f).boatHands[0]));assert.ok(shown(f.scene.effects.boat));assert.ok(f.scene.effects.boat.position.y>.5);});
});

test('cloud tailor: attach five pockets, heavy sag, remove three, gentle rain, dry shade, stored cloth',()=>{
 fixture('cloud-tailor-pockets',0,f=>{f.seek(2);assert.equal(details(f).pockets.filter(shown).length,0);f.seek(10);assert.equal(details(f).pockets.filter(shown).length,5);});
 fixture('cloud-tailor-pockets',1,f=>{f.seek(8);assert.ok(details(f).cloud.position.y<.85);assert.ok(details(f).pockets.every(v=>v.scale.y>1.2));});
 fixture('cloud-tailor-pockets',2,f=>{f.seek(11);assert.equal(details(f).pockets.filter(shown).length,2);assert.ok(details(f).cloud.position.y>1.2);});
 fixture('cloud-tailor-pockets',3,f=>{f.seek(8);assert.equal(details(f).pockets.filter(shown).length,2);assert.ok(shown(f.scene.effects.rain));f.seek(12);assert.ok(!shown(f.scene.effects.rain));});
 fixture('cloud-tailor-pockets',4,f=>{f.seek(10);assert.ok(shown(details(f).cloudShade));assert.ok(!shown(f.scene.effects.rain));});
 fixture('cloud-tailor-pockets',5,f=>{f.seek(8);assert.ok(details(f).cloth.position.y<.3);assert.equal(details(f).pockets.filter(shown).length,2);});
});

test('night bakery: closed shop, tired kneading, written orders, dough-before-bread, last pickup and carried night delivery',()=>{
 fixture('bakery-under-the-stars',0,f=>{f.seek(4);assert.ok(!shown(f.scene.effects.bread));assert.ok(shown(details(f).closedBar));});
 fixture('bakery-under-the-stars',1,f=>{f.seek(8);assert.ok(shown(details(f).dough));assert.ok(!shown(f.scene.effects.bread));assert.ok(f.scene.pigs[0].root.rotation.x>.3);near(f.scene.pigs[0].root.position.y,0,'tired baker stays above floor');});
 fixture('bakery-under-the-stars',2,f=>{f.seek(6);assert.ok(shown(details(f).heldNotes[0]));assert.ok(!shown(f.scene.effects.bread));});
 fixture('bakery-under-the-stars',3,f=>{f.seek(6);assert.ok(shown(details(f).dough));assert.ok(!shown(f.scene.effects.bread));f.seek(9);assert.ok(!shown(details(f).dough));assert.ok(shown(f.scene.effects.bread));f.seek(13);assert.ok(shown(details(f).breadHands[1]));assert.ok(!shown(f.scene.effects.bread));});
 fixture('bakery-under-the-stars',4,f=>{f.seek(9);assert.ok(shown(details(f).breadHands[1]));f.seek(14);assert.ok(shown(details(f).closedBar));});
 fixture('bakery-under-the-stars',5,f=>{for(const t of [9,11,13]){const s=f.seek(t);assert.equal(details(f).breadHands[1].parent,s.pigs[1].root);assert.ok(shown(details(f).breadHands[1]));assert.ok(!shown(s.effects.bread));}});
});

test('orchestra: excessive drumming, heavy stones put down, quiet instruments, written score, page reset, small encore',()=>{
 fixture('orchestra-of-small-sounds',0,f=>{f.seek(9);assert.ok(f.scene.pigs[1].root.rotation.x>.2);assert.ok(details(f).musicStones.every(v=>v.parent===f.scene.pigs[1].arms[0]||v.parent===f.scene.pigs[1].arms[1]));});
 fixture('orchestra-of-small-sounds',1,f=>{f.seek(5);assert.ok(details(f).heavyStones.position.y>.4);f.seek(7.2);near(details(f).heavyStones.position.y,.09,'heavy stones returned to floor');});
 fixture('orchestra-of-small-sounds',2,f=>{f.seek(8);assert.ok(details(f).musicStones.every(v=>shown(v)&&v.scale.x<.1),'small stones stay small');});
 fixture('orchestra-of-small-sounds',3,f=>{f.seek(3);assert.ok(!shown(details(f).scoreInk));f.seek(8);assert.ok(shown(details(f).scoreInk));});
 fixture('orchestra-of-small-sounds',4,f=>{f.seek(8.4);assert.ok(details(f).score.rotation.x<-.7);f.seek(10);near(details(f).score.rotation.x,0,'single score page is restored before resuming');});
 fixture('orchestra-of-small-sounds',5,f=>{f.seek(14);assert.ok(f.scene.effects.drum.position.x<-1);assert.ok(details(f).musicStones.every(v=>v.scale.x<.1));});
});

test('all 60 original pages have finite transforms and deterministic seek/replay, including geometry state',()=>{
 const capture=s=>{const values=[];s.root.traverse(o=>{values.push(o.visible,...o.position.toArray(),...o.scale.toArray(),...o.rotation.toArray().slice(0,3));if(o.material?.color)values.push(...o.material.color.toArray());});return values.map(n=>typeof n==='number'?Number(n.toFixed(5)):n);};
 for(const book of originals)for(let i=0;i<6;i++)fixture(book.id,i,f=>{
  for(const time of [0,4,7,10,14]){f.seek(time);const before=capture(f.scene);assert.ok(before.every(n=>typeof n!=='number'||Number.isFinite(n)));f.seek(16);f.seek(0);f.seek(time);const after=capture(f.scene),different=before.findIndex((n,j)=>n!==after[j]);assert.equal(different,-1,`${book.id}/${i+1} @${time}s: value ${different}, before ${before[different]}, after ${after[different]}`);}
 });
});

test('all 120 original dialogue files still match their speakers/text; chapter cues follow named scene events',()=>{
 const legalSounds=new Set(['drop','wind','knock','flutter','chime','crumble','sparkle','step','drum']);
 for(const book of originals){const manifest=JSON.parse(fs.readFileSync(new URL(`../public/audio/${book.id}/manifest.json`,import.meta.url),'utf8'));
  for(const [index,chapter]of book.chapters.entries()){
   assert.ok((chapter.text.match(/[\u4e00-\u9fff]/g)||[]).length>=100);
   assert.equal(chapter.cues.length,2);assert.ok(chapter.cues[0]>=0&&chapter.cues[0]<chapter.cues[1]&&chapter.cues[1]<=14);
   assert.ok(chapter.soundCues.length>0);assert.ok(chapter.soundCues.every(c=>legalSounds.has(c.type)&&c.time>=0&&c.time<=15));
   for(const [n,[speaker,text]]of chapter.lines.entries()){const line=manifest.lines.find(l=>l.file===`scene-${index}-line-${n}.mp3`);assert.equal(line.speaker,speaker);assert.equal(line.text,text);}
  }
 }
});
