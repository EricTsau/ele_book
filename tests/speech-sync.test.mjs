import test from 'node:test';
import assert from 'node:assert/strict';
import {books} from '../public/books.js';
import {speechCues} from '../public/speech-cues.js';
import {splitSpeechSentences,narrationSentences,speechBeats,speechTime} from '../public/speech-sync.js';

test('sentence clips preserve every spoken word and quoted sentence',()=>{
 assert.deepEqual(splitSpeechSentences('他說：「快跑！小心。」大家出發。'),['他說：「快跑！小心。」','大家出發。']);
 for(const b of books)for(const c of b.chapters)assert.equal(narrationSentences(c).map(s=>s.text).join(''),c.narration.join('').replace(/\s/g,''));
});
test('every original page has authored speech beats, ordered without dropping audio',()=>{
 for(const b of books)for(const c of b.chapters){
  assert.ok(speechCues[c.id],c.id);
  const beats=speechBeats(c,speechCues[c.id],20);
  assert.equal(beats.length,narrationSentences(c).length+c.lines.length,c.id);
  assert.equal(beats[0].start,0,c.id);assert.ok(beats[0].end>0,`${c.id}: opening must animate`);
  for(const beat of beats){assert.ok(beat.start>=0&&beat.end>=beat.start&&beat.end<=20,c.id);assert.ok(beat.text);}
  assert.deepEqual(beats.filter(b=>b.kind==='sentence').map(b=>b.index),narrationSentences(c).map((_,i)=>i),c.id);
  assert.deepEqual(beats.filter(b=>b.kind==='line').map(b=>b.index),c.lines.map((_,i)=>i),c.id);
 }
});
test('animation is bounded by the active spoken beat and follows its media clock',()=>{
 const beat={start:7.6,end:9.3};
 assert.equal(speechTime(beat,0,4),7.6);
 assert.equal(speechTime(beat,2,4),8.45);
 assert.equal(speechTime(beat,4,4),9.3);
 assert.equal(speechTime(beat,8,4),9.3);
 assert.equal(speechTime(beat,0,NaN),7.6);
});
