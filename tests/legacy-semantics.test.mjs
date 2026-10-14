import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFixture} from './scene-fixture.mjs';
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<.015,`${message}: ${a} != ${b}`);
const actor=(s,type)=>s.pigs.find(a=>a.type===type).root;
const prop=(s,kind)=>s.props.children.find(a=>a.userData.prop===kind);
function fixture(id,index,check){const f=sceneFixture(id,index);try{check(f);}finally{f.dispose();}}
test('tortoise actually crosses the marked finish before the hare',()=>fixture('tortoise-and-hare',4,f=>{
 let s=f.seek(8);assert.ok(actor(s,'turtle').position.z<prop(s,'finish').position.z);assert.ok(actor(s,'rabbit').position.z>prop(s,'finish').position.z);
 s=f.seek(12);assert.ok(actor(s,'rabbit').position.z<prop(s,'finish').position.z);
 f.seek(1);assert.ok(actor(f.scene,'turtle').position.z>prop(f.scene,'finish').position.z);
}));
test('duckling emerges after the shell opens and swims inside the pond',()=>{
 fixture('ugly-duckling',0,f=>{assert.equal(f.seek(2).pigs[0].root.visible,false);assert.equal(f.seek(5).pigs[0].root.visible,true);assert.ok(f.scene.effects.egg.scale.y<.1);});
 fixture('ugly-duckling',1,f=>{assert.ok(f.seek(13.5).pigs[0].root.position.z<0);});
});
test('Jack climbs along the stalk and descends from the same position without jumping to ground',()=>{
 fixture('jack-and-beanstalk',2,f=>{const s=f.seek(8);near(s.pigs[0].root.position.x,s.effects.plant.position.x,'stalk x');assert.ok(s.pigs[0].root.position.y>1);assert.ok(f.seek(13).pigs[0].root.position.y>1.7);});
 fixture('jack-and-beanstalk',4,f=>{const high=f.seek(1).pigs[0].root.position.y;const middle=f.seek(4).pigs[0].root.position.y;assert.ok(high>middle&&middle>0);near(f.seek(7).pigs[0].root.position.y,0,'ground');});
});
test('cage rescue opens a hinged door before the prisoner leaves, without rotating the cage',()=>{
 for(const [id,index,kind] of [['hansel-and-gretel',4,'boy'],['jack-and-beanstalk',3,'duck']])fixture(id,index,f=>{
  let s=f.seek(3);near(actor(s,kind).position.x,s.effects.cage.position.x,'prisoner inside cage');near(s.effects.cageDoor.rotation.y,0,'closed door');
  s=f.seek(9.4);assert.ok(s.effects.cageDoor.rotation.y<-1);near(s.effects.cage.rotation.z,0,'upright cage');assert.ok(actor(s,kind).position.z>s.effects.cage.position.z+.52);
 });
});
test('Goldilocks eats only the small bowl and the empty bowl and broken chair persist on later pages',()=>{
 fixture('goldilocks',1,f=>{assert.equal(f.seek(11).effects.bowls[2].visible,true);assert.equal(f.seek(13.5).effects.bowls[2].visible,false);assert.ok(f.scene.effects.bowls.slice(0,2).every(b=>b.visible));});
 fixture('goldilocks',2,f=>{near(f.seek(5).effects.chairSeat.rotation.z,0,'chair intact');assert.ok(f.seek(9).effects.chairSeat.rotation.z>.3);});
 fixture('goldilocks',3,f=>{const s=f.seek(5);assert.equal(s.effects.bowls[2].visible,false);assert.ok(s.effects.chairSeat.rotation.z>.3);near(s.pigs[0].root.position.z,s.effects.bed.position.z,'on mattress');assert.ok(s.pigs[0].root.position.y>.6);});
 fixture('goldilocks',4,f=>assert.ok(f.seek(13).effects.chairSeat.rotation.z>.3));
 fixture('goldilocks',5,f=>near(f.seek(13).effects.chairSeat.rotation.z,0,'repaired chair'));
});
test('Puss transformation uses one identity at a time and releases the mouse from the bag',()=>{
 fixture('puss-in-boots',3,f=>{assert.equal(actor(f.seek(6),'mouse').visible,false);const s=f.seek(9);assert.equal(actor(s,'mouse').visible,true);assert.equal(actor(s,'giant').visible,false);});
 fixture('puss-in-boots',4,f=>{assert.equal(actor(f.seek(7),'mouse').visible,false);assert.equal(actor(f.seek(11),'mouse').visible,true);});
});
test('Cinderella drops one shoe only at departure and clock reaches midnight',()=>fixture('cinderella',3,f=>{
 const s=f.seek(3);assert.equal(prop(s,'shoe').visible,false);assert.equal(prop(s,'shoe').children.length,2);
 f.seek(8);assert.equal(prop(s,'shoe').visible,true);near(s.effects.hand.rotation.z,0,'midnight hand');
}));
test('Thumbelina travels on her leaf and stays on the swallow until landing',()=>{
 fixture('thumbelina',1,f=>{const s=f.seek(9);near(s.pigs[0].root.position.x,prop(s,'lily').position.x,'leaf x');near(s.pigs[0].root.position.z,prop(s,'lily').position.z+.2,'leaf center z');});
 fixture('thumbelina',4,f=>{for(const t of [5,8,11,12.8]){const s=f.seek(t);near(s.pigs[0].root.position.x,s.pigs[1].root.position.x,'rider x');near(s.pigs[0].root.position.y-s.pigs[1].root.position.y,.4,'rider height');}near(f.seek(14).pigs[0].root.position.y,0,'dismount');});
});
test('lion begins rescue enclosed in the net, which falls after mouse gnaws it',()=>fixture('lion-and-mouse',4,f=>{
 let s=f.seek(3);near(actor(s,'lion').position.x,s.effects.net.position.x,'lion under net');assert.equal(s.effects.net.scale.y,1);
 s=f.seek(9.9);assert.ok(s.effects.net.scale.y<.04);assert.ok(f.seek(14).pigs[0].root.position.x<-.9);
}));
test('Red Riding Hood keeps a safe distance while disguised wolf actually lies on the bed',()=>fixture('red-riding-hood',2,f=>{
 const s=f.seek(6);const wolf=actor(s,'wolf');near(wolf.position.z,s.effects.bed.position.z,'wolf on bed');near(wolf.rotation.z,Math.PI/2,'wolf lying down');assert.ok(s.pigs[0].root.position.distanceTo(wolf.position)>1.5);
}));
test('all sixty legacy pages finish and seek back with finite world coordinates',()=>{
 for(const id of ['red-riding-hood','tortoise-and-hare','ugly-duckling','jack-and-beanstalk','goldilocks','hansel-and-gretel','puss-in-boots','cinderella','thumbelina','lion-and-mouse'])for(let i=0;i<6;i++)fixture(id,i,f=>{
  for(const t of [1,6,10,14,4,14]){const s=f.seek(t);s.root.traverse(o=>assert.ok([...o.position.toArray(),...o.scale.toArray(),...o.rotation.toArray().slice(0,3)].every(Number.isFinite),`${id} chapter ${i+1} at ${t}s`));}
 });
});
