import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {classics} from '../public/classics.js';
import {sceneFixture} from './scene-fixture.mjs';
const near=(a,b,eps=.015)=>assert.ok(Math.abs(a-b)<=eps,`${a} differs from ${b}`);
const world=o=>o.getWorldPosition(new Vector3());
function withScene(id,index,fn){const f=sceneFixture(id,index);try{fn(f,f.scene.effects.classic);}finally{f.dispose();}}

test('all sixty classic chapters have complete finite custom blocking, two timed dialogue cues, and rewindable scene state',()=>{
 for(const b of classics)for(let i=0;i<6;i++)withScene(b.id,i,(f,d)=>{
  assert.equal(d.id,b.id);assert.equal(d.index,i);assert.equal(f.chapter.cues.length,2);
  assert.ok(f.chapter.cues[1]>f.chapter.cues[0]);assert.ok(f.chapter.cues[1]<=12);
  assert.ok(f.timeline.duration()<=16.01,`${b.id}/${i} exceeds scene duration`);
  f.seek(15);const positions=f.scene.pigs.map(a=>a.root.position.toArray());f.seek(0);f.seek(15);
  f.scene.pigs.forEach((a,j)=>a.root.position.toArray().forEach((v,k)=>near(v,positions[j][k],1e-5)));
  assert.ok((f.chapter.text.match(/\p{Script=Han}/gu)||[]).length>=100);
 });
});
test('sun warms the traveller before the coat is removed, and the removed coat stays on the rock',()=>{
 withScene('north-wind-and-sun',3,(f,d)=>{f.seek(12);near(d.coat.position.x,f.scene.pigs[0].root.position.x);near(d.coat.rotation.x,0);});
 withScene('north-wind-and-sun',4,(f,d)=>{f.seek(8.5);const coat=world(d.coat).clone();f.seek(14);near(world(d.coat).distanceTo(coat),0);assert.ok(world(d.coat).distanceTo(world(f.scene.pigs[0].root))>.7);near(d.coat.rotation.x,Math.PI/2);});
});
test('crow drops stones through the actual jar aperture before the water rises',()=>{
 withScene('thirsty-crow',3,(f,d)=>{
  f.seek(3.41);const stone=world(d.stones[0]),jar=world(d.jar);near(stone.x,jar.x);near(stone.z,jar.z);assert.ok(stone.distanceTo(world(d.beakAnchor))<.04);assert.ok(stone.y>jar.y+.95);near(d.water.position.y,.28);
  f.seek(4.65);assert.ok(d.stones[0].position.y<.2);near(d.water.position.y,.39);
  f.seek(13);near(d.water.position.y,.61);d.stones.forEach(o=>{near(o.position.x,d.jar.position.x);near(o.position.z,d.jar.position.z);});
 });
 withScene('thirsty-crow',4,(f,d)=>{f.seek(13.7);near(d.water.position.y,.865);near(world(d.beakAnchor).y,world(d.water).y,.035);});
 withScene('thirsty-crow',5,(f,d)=>{f.seek(5.4);assert.ok(d.water.position.y>.85);near(world(d.beakAnchor).y,world(d.water).y,.035);});
});
test('crow cannot drink during the low-water attempt and its unsuccessful push does not move the heavy jar',()=>{
 withScene('thirsty-crow',1,(f,d)=>{f.seek(5);assert.ok(world(d.beakAnchor).y-world(d.water).y>.25);});
 withScene('thirsty-crow',2,(f,d)=>{f.seek(2);const start=d.jar.position.clone();f.seek(13);near(d.jar.position.distanceTo(start),0);assert.ok(d.stones.every(o=>o.position.y<.1));});
});
test('fox never reaches the grapes, even at the highest jump',()=>{
 for(const chapter of [1,2])withScene('fox-and-grapes',chapter,(f,d)=>{
  for(const at of [5.9,9.9]){f.seek(at);const mouthBox=new Box3().setFromObject(d.mouth);const grapesBox=new Box3();d.fruit.forEach(o=>grapesBox.union(new Box3().setFromObject(o)));assert.ok(grapesBox.min.y-mouthBox.max.y>.3,`fox reaches fruit in chapter ${chapter}`);}
 });
});
test('city mice start on the table then reach a floor-level hiding place, while the cat stays outside',()=>{
 withScene('town-and-country-mice',2,(f,d)=>{f.seek(3);d.mice.forEach(m=>near(m.root.position.y,.85));});
 withScene('town-and-country-mice',3,(f,d)=>{f.seek(7);d.mice.forEach(m=>{near(m.root.position.y,0);assert.ok(m.root.position.x<-1.1);});const cat=f.scene.pigs.find(a=>a.type==='cat');assert.ok(cat.root.position.x>=.29);});
});
test('ant is smaller than the dove, climbs aboard only after the leaf lands, then travels with the leaf',()=>{
 withScene('ant-and-dove',1,(f,d)=>{f.seek(5.7);near(d.leaf.position.y,0);f.seek(7);near(d.ant.root.position.x,d.leaf.position.x);near(d.ant.root.position.z,d.leaf.position.z);assert.ok(d.ant.root.scale.x<d.bird.root.scale.x);});
 withScene('ant-and-dove',2,(f,d)=>{for(const at of [2,4,6.9]){f.seek(at);near(d.ant.root.position.x,d.leaf.position.x);near(d.ant.root.position.z,d.leaf.position.z);near(d.ant.root.position.y,.09);}f.seek(12);assert.ok(d.ant.root.position.z>=d.anchors.shoreZ);});
});
test('ant reaches the hunter before the reaction, and the dove escapes rather than landing beside the hunter',()=>{
 withScene('ant-and-dove',4,(f,d)=>{f.seek(4.6);assert.ok(d.ant.root.position.distanceTo(d.hunter.root.position)<.25);f.seek(13.5);assert.ok(d.bird.root.position.y>1.8);assert.ok(d.bird.root.position.x< -1.3);});
});
test('Bremen animals make a stable ordered stack, drive the thieves away, and land separately',()=>{
 withScene('bremen-musicians',3,(f,d)=>{f.seek(8);d.actors.forEach((a,j)=>{near(a.root.position.x,.1);near(a.root.position.y,d.stackY[j]);if(j){const below=new Box3().setFromObject(d.actors[j-1].root),above=new Box3().setFromObject(a.root);assert.ok(above.min.y>=below.max.y,`stack bodies overlap at ${j}`);}});f.seek(11.5);d.thieves.forEach(t=>assert.ok(t.position.x>2.6));f.seek(15);d.actors.forEach(a=>near(a.root.position.y,0));assert.equal(new Set(d.actors.map(a=>a.root.position.x)).size,4);});
 withScene('bremen-musicians',4,(f,d)=>{f.seek(5.7);assert.ok(d.thieves[0].position.z>.5);f.seek(12);assert.ok(d.thieves[0].position.x>2.6);});
});
test('ordinary sweet-porridge sharing never floods; the forgotten spell floods; stop leaves existing porridge in place',()=>{
 withScene('sweet-porridge',2,(f,d)=>{f.seek(14);assert.ok(d.spill.scale.x<.01);assert.ok(d.water.position.y<d.anchors.rim);});
 withScene('sweet-porridge',3,(f,d)=>{f.seek(10);near(d.spill.scale.x,1);assert.ok(d.water.position.y>d.anchors.rim);});
 withScene('sweet-porridge',4,(f,d)=>{f.seek(5.2);const stopped=d.spill.scale.clone();f.seek(14);near(d.spill.scale.distanceTo(stopped),0);assert.ok(d.spill.scale.x>=1);});
 withScene('sweet-porridge',5,(f,d)=>{f.seek(1.5);near(d.cleanSurface.material.opacity,1);f.seek(8);near(d.cleanSurface.material.opacity,0);});
});
test('star-money gifts arrive at recipients; the child keeps her dress; silver coins are collected',()=>{
 withScene('star-money',1,(f,d)=>{f.seek(7);near(d.bread.position.x,.55);assert.ok(f.scene.pigs[0].root.children.some(o=>o.geometry?.type==='ConeGeometry'));});
 withScene('star-money',2,(f,d)=>{f.seek(9);near(d.hat.position.x,.6);near(d.shawl.position.x,.6);});
 withScene('star-money',4,(f,d)=>{f.seek(2);assert.ok(d.coins.every(o=>o.position.y>=2.2));f.seek(7.5);assert.ok(d.coins.every(o=>o.position.y<.1));f.seek(14);d.coins.forEach(o=>{near(o.position.x,d.purse.position.x);near(o.position.z,d.purse.position.z);});near(d.newCoat.scale.x,1);});
});
test('emperor loom remains empty; fitting and the public procession use different routes, and the child addresses the emperor',()=>{
 withScene('emperors-new-clothes',1,(f,d)=>{f.seek(8);assert.equal(d.loom.children.length,4);assert.ok(d.minister.root.position.x>.3);});
 withScene('emperors-new-clothes',3,(f,d)=>{f.seek(10.2);near(d.king.root.rotation.y,Math.PI*2);near(d.king.root.position.x,0);});
 withScene('emperors-new-clothes',4,(f,d)=>{f.seek(7.6);assert.ok(d.child.arms.some(arm=>arm.rotation.x<-.4));f.seek(14);assert.ok(d.king.root.position.x>1.1);assert.ok(d.minister.root.position.x<d.king.root.position.x);});
});
test('pea bed has forty layers over exactly one pea; princess lies on the bed; reveal removes every layer and pillow',()=>{
 withScene('princess-and-pea',0,(f,d)=>{for(const t of [7,8,9,13]){f.seek(t);assert.ok(f.scene.pigs[0].root.position.distanceTo(d.queen.root.position)>.65);}});
 withScene('princess-and-pea',2,(f,d)=>{assert.equal(d.layers.length,40);f.seek(14);d.layers.forEach(o=>near(o.scale.y,1));assert.ok(d.pea.position.y<d.layers[0].position.y);});
 withScene('princess-and-pea',3,(f,d)=>{for(const at of [2,7,14]){f.seek(at);near(d.princess.root.rotation.z,Math.PI/2);assert.ok(d.princess.root.position.y>d.anchors.bedTop);near(d.princess.root.position.z,d.bed.position.z);}});
 withScene('princess-and-pea',4,(f,d)=>{f.seek(14);d.layers.forEach(o=>assert.ok(o.position.x>1.6));assert.ok(d.pillow.position.x>1.4);near(d.pea.position.x,0);near(d.pea.position.z,0);const prince=f.scene.pigs.find(a=>a.type==='prince');assert.ok(prince.root.position.distanceTo(d.queen.root.position)>.7);});
});
