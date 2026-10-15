import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFixture} from './scene-fixture.mjs';
import {legacySpeechCues} from '../public/speech-cues-legacy.js';
function fixture(id,index,fn){const f=sceneFixture(id,index);try{fn(f,legacySpeechCues[`${id}:story:${index}`]);}finally{f.dispose();}}
test('rabbit wakes during the opening sentence before looking toward the finish',()=>fixture('tortoise-and-hare',4,(f,cues)=>{
 const s=f.seek(1),hare=s.pigs.find(a=>a.type==='rabbit').root;
 assert.ok(Math.abs(hare.rotation.z)<.02,'opening narration says the rabbit wakes');
 assert.ok(cues.narration[1]<=1.5,'looking follows waking without unrelated action');
 const before=f.seek(4).pigs.find(a=>a.type==='rabbit').root.position.z;
 const after=f.seek(6).pigs.find(a=>a.type==='rabbit').root.position.z;
 assert.ok(after<before,'rabbit runs during its running sentence');
}));
test('Goldilocks approaches the bed before the lying down sentence',()=>fixture('goldilocks',3,(f,cues)=>{
 assert.ok(Math.abs(f.seek(1).pigs[0].root.rotation.z)<.05,'not already lying in first sentence');
 assert.ok(cues.narration[1]>=2,'lying starts after approaching');
 assert.ok(Math.abs(f.seek(4).pigs[0].root.rotation.z-Math.PI/2)<.02);
}));
test('Goldilocks repairs the damaged chair before knocking again',()=>fixture('goldilocks',5,(f,cues)=>{
 assert.ok(f.seek(.2).effects.chairSeat.rotation.z>.3,'the chair still needs repair');
 assert.ok(Math.abs(f.seek(cues.narration[1]).effects.chairSeat.rotation.z)<.02,'repair completed before the return-and-knock sentence');
 f.seek(.2);assert.ok(f.scene.effects.chairSeat.rotation.z>.3,'replay restores damage');
}));
test('midnight clock agrees with the opening chime narration',()=>fixture('cinderella',3,f=>{
 assert.ok(f.chapter.text.startsWith('噹！'));
 assert.ok(Math.abs(f.seek(.5).effects.hand.rotation.z)<.02,'midnight is already reached at the opening chime');
}));
