import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFixture,H} from './scene-fixture.mjs';
import {books} from '../public/books.js';
import {interiorSpec,updateInteriorVisibility} from '../public/interiors.js';

const required=[['red-riding-hood',2],['goldilocks',1],['goldilocks',3],['hansel-and-gretel',3],['cinderella',2],['thumbelina',2],['town-and-country-mice',2],['emperors-new-clothes',1],['princess-and-pea',3],['rain-post-office',5],['seed-library-notebook',0],['clock-with-a-breath',2],['cloud-tailor-pockets',5],['bakery-under-the-stars',1]];
test('indoor story actions happen on a room floor with cutaway walls, not in front of an exterior house',()=>{
 for(const [id,index] of required){
  const f=sceneFixture(id,index),s=f.seek(8);
  assert.ok(s.interior,`${id}/${index}: missing interior`);
  assert.ok(s.interior.floor.isMesh);
  assert.ok(s.interior.walls.length>=2);
  const floor=new H.THREE.Box3().setFromObject(s.interior.floor);
  for(const a of s.pigs.filter(a=>!s.interior.spec.mixed||a.type==='wolf')){const p=a.root.getWorldPosition(new H.THREE.Vector3());assert.ok(p.x>=floor.min.x&&p.x<=floor.max.x&&p.z>=floor.min.z&&p.z<=floor.max.z,`${id}/${index}: ${a.name} outside room`);}
  for(const p of s.props.children.filter(p=>['cottage','candy-house','castle'].includes(p.userData.prop)))assert.equal(p.visible,false,`${id}: exterior must not obscure indoor action`);
  assert.ok(s.trees.every(t=>!t.visible),`${id}: trees must not grow through the room`);
  f.dispose();
 }
});
test('outdoor journeys, races, flight and palace gardens remain outdoors',()=>{
 for(const [id,index] of [['tortoise-and-hare',4],['cinderella',1],['cinderella',5],['thumbelina',4],['emperors-new-clothes',4],['paper-boat-map',3]]){
  const f=sceneFixture(id,index);assert.equal(f.scene.interior,undefined);f.dispose();
 }
});

test('the animation spans both pages with unstretched actors and faint, visible walls',()=>{
 const f=sceneFixture('goldilocks',1),s=f.seek(8),floor=new H.THREE.Box3().setFromObject(s.interior.floor);
 assert.equal(s.root.position.x,0,'the stage must be centered on the spread');
 assert.ok(floor.min.x< -4.8&&floor.max.x>4.8,'the room must cover both pages');
 assert.equal(s.popup.scale.x,s.popup.scale.y,'characters must not stretch horizontally');
 assert.equal(s.popup.scale.y,s.popup.scale.z);
 for(const wall of s.interior.walls){assert.equal(wall.visible,true);wall.traverse(m=>{if(m.isMesh){assert.equal(m.material.transparent,true);assert.ok(m.material.opacity>0&&m.material.opacity<=.4);assert.equal(m.material.depthWrite,false);}});}
 assert.equal(s.pigs[0].head.material.opacity,1,'character materials must remain opaque');
 assert.equal(s.interior.floor.material.opacity,1,'only walls are translucent');
 f.dispose();
});

test('walls in front of character faces remain faint from either supported side view',()=>{
 const camera=new H.THREE.PerspectiveCamera(),ray=new H.THREE.Raycaster();
 for(const book of books)for(const [index,c]of book.chapters.entries()){
  if(!interiorSpec(c))continue;
  const f=sceneFixture(book.id,c.storyIndex);
  for(const t of [3,8,13]){
   const s=f.seek(t),room=s.interior;
   for(const position of [[-5,7,9],[7,7,9]]){
    camera.position.set(...position);camera.updateMatrixWorld();updateInteriorVisibility(s,camera);
    const surfaces=[];room.walls.filter(w=>w.visible).forEach(w=>w.traverse(m=>{if(m.isMesh)surfaces.push(m);}));
    for(const actor of s.pigs.filter(a=>a.root.visible)){
     const target=(actor.head||actor.root).getWorldPosition(new H.THREE.Vector3());
     const distance=camera.position.distanceTo(target);ray.set(camera.position,target.clone().sub(camera.position).normalize());
     assert.ok(!ray.intersectObjects(surfaces,false).some(hit=>hit.distance<distance-.08&&hit.object.material.opacity>.2),`${book.id}/${index} at ${t}: wall hides ${actor.name}`);
    }
   }
  }
  f.dispose();
 }
});

test('mixed scenes cross the room boundary only when the story enters or leaves',()=>{
 const inside=(s,a)=>a.root.position.z<s.interior.spec.front;
 const f=sceneFixture('bremen-musicians',3);
 f.seek(8);assert.ok(f.scene.pigs.every(a=>!inside(f.scene,a)));
 assert.ok(f.scene.effects.classic.thieves.every(a=>a.position.z<f.scene.interior.spec.front));
 f.seek(15);assert.ok(f.scene.pigs.every(a=>inside(f.scene,a)),'the musicians must enter after the thieves leave');f.dispose();
 const clock=sceneFixture('clock-with-a-breath',4);clock.seek(5);assert.ok(clock.scene.pigs.every(a=>inside(clock.scene,a)));clock.seek(13);assert.ok(clock.scene.pigs.every(a=>!inside(clock.scene,a)),'the children must leave the room to inspect the garden');clock.dispose();
 const escape=sceneFixture('hansel-and-gretel',4);escape.seek(5);assert.ok(inside(escape.scene,escape.scene.pigs[0]));escape.seek(13);assert.ok(escape.scene.pigs.slice(0,2).every(a=>!inside(escape.scene,a)));escape.dispose();
 const midnight=sceneFixture('cinderella',3);midnight.seek(5);assert.ok(inside(midnight.scene,midnight.scene.pigs[0]));midnight.seek(10);assert.ok(!inside(midnight.scene,midnight.scene.pigs[0]));midnight.dispose();
 const rescue=sceneFixture('red-riding-hood',4);rescue.seek(.5);assert.equal(rescue.scene.interior.storageDoor.rotation.y,0);rescue.seek(1.9);assert.ok(rescue.scene.interior.storageDoor.rotation.y< -1.5);assert.ok(rescue.scene.pigs[1].root.position.z<0,'grandmother leaves after the door opens');rescue.seek(6);assert.ok(rescue.scene.pigs[1].root.position.z>.5);rescue.dispose();
});
