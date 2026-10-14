import test from 'node:test';
import assert from 'node:assert/strict';
import {Group} from 'three';
import {gsap} from 'gsap';
import {walk} from '../public/story-motion.js';
test('return walk faces its actual previous waypoint, not its initial spawn',()=>{
 const a={root:new Group(),arms:[new Group()],legs:[new Group()]};
 const tl=gsap.timeline({paused:true});
 walk(tl,a,1,0,0,1);walk(tl,a,0,0,2,1);
 tl.seek(2.4,true);assert.ok(Math.abs(a.root.rotation.y+Math.PI/2)<.01);
 tl.kill();
});
test('walking on a raised surface keeps the actor above that surface',()=>{
 const a={root:new Group(),arms:[new Group()],legs:[new Group()]};a.root.position.y=.6;
 const tl=gsap.timeline({paused:true});walk(tl,a,1,0,0,1);tl.seek(1.3,true);
 assert.ok(Math.abs(a.root.position.y-.6)<.001);tl.kill();
});
