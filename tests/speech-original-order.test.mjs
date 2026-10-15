import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFixture} from './scene-fixture.mjs';
import {speechCuesOriginals} from '../public/speech-cues-originals.js';
const shown=o=>o.visible&&Math.min(o.scale.x,o.scale.y,o.scale.z)>.01;
const use=(id,i,run)=>{const f=sceneFixture(id,i);try{run(f,speechCuesOriginals[`${id}:story:${i}`]);}finally{f.dispose();}};
test('boat: duck has arrived before the launch sentence',()=>use('paper-boat-map',0,(f,c)=>{
 const s=f.seek(c.narration[3]);assert.ok(Math.abs(s.pigs[1].root.position.x-.95)<.03);assert.ok(Math.abs(s.pigs[1].root.position.z-.7)<.03);
}));
test('bridge model: turtle test finishes before construction and final recording',()=>use('bridge-that-listened',3,(f,c)=>{
 const s=f.seek(8.3);assert.ok(s.pigs[1].root.position.x>1.6,'turtle has crossed before construction');
 f.seek(13);assert.ok(shown(s.effects.original.heldNotes[0]),'builder records changes after construction');
}));
test('bridge platform: donkey yields while the child passes',()=>use('bridge-that-listened',4,(f,c)=>{
 const s=f.seek(c.narration[3]+2.8);assert.ok(s.pigs[1].root.position.z<-.95,'donkey stands aside');assert.ok(s.pigs[0].root.position.z>-.6,'child passes');
 for(const t of [6.1,7.8,9]){f.seek(t);assert.ok(s.pigs[0].root.position.distanceTo(s.pigs[1].root.position)>.5);}
}));
test('seed borrowing: packet is collected before the notebook sentence',()=>use('seed-library-notebook',0,(f,c)=>{
 const s=f.seek(5);assert.ok(shown(s.effects.original.seedHands[0]),'seeds already collected');assert.ok(!shown(s.effects.original.heldNotes[0]),'booklet has not opened early');
 f.seek(7);assert.ok(shown(s.effects.original.heldNotes[0]),'now writes in booklet');
}));
test('cloud tailoring: grandmother checks cloth before pockets appear',()=>use('cloud-tailor-pockets',0,(f,c)=>{
 f.seek(5);assert.equal(f.scene.effects.original.pockets.filter(shown).length,0,'no premature sewing');
 f.seek(10);assert.equal(f.scene.effects.original.pockets.filter(shown).length,5);
}));
test('cloud alteration: removal and resized fit finish within their sentence',()=>use('cloud-tailor-pockets',2,(f,c)=>{
 f.seek(c.narration[1]);assert.equal(f.scene.effects.original.pockets.filter(shown).length,2);assert.ok(Math.abs(f.scene.effects.pocketCloud.scale.x-.9)<.02,'resize must finish before next sentence');
}));
test('shadow drawing begins with its sentence rather than during ball practice',()=>use('shadow-takes-a-day-off',4,(f,c)=>{
 f.seek(c.narration[2]-.1);assert.ok(!shown(f.scene.effects.original.artInk),'no earlier drawing');assert.ok(!shown(f.scene.effects.original.pencils[1]));
 f.seek(c.narration[2]+.5);assert.ok(shown(f.scene.effects.original.artInk));assert.ok(shown(f.scene.effects.original.pencils[1]));
}));
