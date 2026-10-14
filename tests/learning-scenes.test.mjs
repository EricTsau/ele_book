import test from 'node:test';
import assert from 'node:assert/strict';
import {gsap} from 'gsap';
import {sceneGeometry as H} from '../public/book3d.js';
import {buildLearningScene,animateLearningScene,LEARNING_MODES,LEARNING_ITEMS} from '../public/learning-scenes.js';
import {books} from '../public/books.js';
import {sceneFixture} from './scene-fixture.mjs';
const fixture=(kind,item='book')=>{
 const c={id:`test-${kind}`,storyId:'test',storyIndex:-1,characters:[{name:'孩子',type:'girl'},{name:'朋友',type:'boy'}],learningScene:{kind,item,inside:false}};
 const s=buildLearningScene(new H.THREE.Group(),c,H),tl=gsap.timeline({paused:true});animateLearningScene(tl,s,c);
 return {s,tl,seek:t=>{tl.seek(t,true);s.root.updateMatrixWorld(true);return s.effects.learning;}};
};
test('permission happens before crossing and a learner takes steps with a pause',()=>{
 const ask=fixture('ask');ask.seek(6);assert.ok(ask.s.pigs[0].root.position.z>.4);ask.seek(14);assert.ok(ask.s.pigs[0].root.position.z<.4);ask.tl.kill();
 const practice=fixture('practice');practice.seek(4.1);const x=practice.s.pigs[0].root.position.x;practice.seek(6.9);assert.equal(practice.s.pigs[0].root.position.x,x);practice.seek(16);assert.ok(practice.s.pigs[0].root.position.x>x+2);practice.tl.kill();
});
test('help, sharing and repair change physical objects after their preparation',()=>{
 const help=fixture('help');assert.equal(help.seek(4).item.position.y,.04);assert.ok(help.seek(9.5).item.position.y>.5);assert.ok(help.seek(16).item.position.z<0);help.tl.kill();
 const share=fixture('share');assert.ok(share.seek(2).item.position.x<0);assert.ok(share.seek(12).item.position.x>0);share.tl.kill();
 const repair=fixture('repair');assert.ok(repair.seek(6).right.position.x>.4);assert.ok(repair.seek(14).right.position.x<.3);assert.equal(repair.seek(14).patch.scale.x,1);repair.tl.kill();
});
test('every learning motif has a finite replayable animation and every tangible item has geometry',()=>{
 for(const mode of LEARNING_MODES){const f=fixture(mode);assert.equal(f.tl.duration(),20);f.seek(4);const initial=f.s.pigs.map(a=>a.root.position.toArray());f.seek(19);f.seek(4);assert.deepEqual(f.s.pigs.map(a=>a.root.position.toArray()),initial,mode);f.tl.kill();}
 for(const item of LEARNING_ITEMS){const f=fixture('notice',item);let meshes=0;f.s.effects.learning.item.traverse(o=>{if(o.isMesh)meshes++;});assert.ok(meshes>0,item);f.tl.kill();}
});

test('carrying actors reach the object edges instead of leaving it floating',()=>{
 const c=books.find(b=>b.id==='lion-and-mouse').chapters.at(-1);
 const s=buildLearningScene(new H.THREE.Group(),c,H),tl=gsap.timeline({paused:true});animateLearningScene(tl,s,c);
 tl.seek(10,true);s.root.updateMatrixWorld(true);
 for(const [index,armIndex,side]of [[0,1,-1],[1,0,1]]){
  const hand=s.pigs[index].arms[armIndex].localToWorld(new H.THREE.Vector3(0,-.29,0));
  const grip=s.effects.learning.item.localToWorld(new H.THREE.Vector3(side*.23,.18,0));
  assert.ok(hand.distanceTo(grip)<.06,`${s.pigs[index].name}: hand misses carry grip`);
 }
 tl.kill();
});

test('new Bremen indoor scenes do not inherit the outside window confrontation',()=>{
 for(const c of books.find(b=>b.id==='bremen-musicians').chapters.filter(c=>c.learningScene?.inside)){
  const s=buildLearningScene(new H.THREE.Group(),c,H);
  assert.ok(s.interior);assert.equal(s.interior.frontWindow,undefined);
 }
 for(const index of [2,3]){const f=sceneFixture('bremen-musicians',index);assert.ok(f.scene.interior.frontWindow);f.dispose();}
});
