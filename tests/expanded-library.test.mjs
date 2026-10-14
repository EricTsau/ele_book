import {readFileSync,statSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {books} from '../public/books.js';
test('twenty additional stories have complete distinct chapters and provenance',()=>{
 const added=books.slice(11);assert.equal(added.length,20);
 assert.equal(added.filter(b=>b.collection==='classic').length,10);
 assert.equal(added.filter(b=>b.collection==='original').length,10);
 const texts=new Set();
 for(const b of added){
  assert.equal(b.chapters.filter(c=>c.kind==='story').length,6);assert.equal(b.chapters.at(-1).kind,'reflection');assert.ok(b.provenance.author);assert.ok(b.provenance.note);
  if(b.collection==='classic')assert.match(b.provenance.sourceUrl,/^https:\/\/www.gutenberg.org\/ebooks\/\d+$/);
  for(const c of b.chapters){assert.ok(c.text.length>=(c.kind==='story'?100:80),`${b.title}: ${c.title} too short`);assert.ok(!texts.has(c.text));texts.add(c.text);assert.equal(c.lines.length,2);for(const [who,line]of c.lines){assert.ok(c.characters.some(a=>a.name===who));assert.ok(line.length<=(c.kind==='story'?28:35),`${b.title}: dialogue too long`);}}
 }
});

test('bundled dialogue matches every story line and voice manifest',()=>{
 let clips=0;
 for(const b of books){const directory=new URL(`../public/${b.audioBase}/`,import.meta.url);const manifest=JSON.parse(readFileSync(new URL('manifest.json',directory)));const lines=new Map(manifest.lines.map(r=>[r.file,r]));
  b.chapters.forEach((c,i)=>c.lines.forEach(([speaker,text],j)=>{const file=`${c.audioKey}-line-${j}.mp3`;assert.deepEqual(lines.get(file),{file,speaker,text,voice:'zh-TW-HsiaoChenNeural'});assert.ok(statSync(new URL(file,directory)).size>1000);clips++;}));
 }
 assert.equal(clips,books.reduce((n,b)=>n+b.chapters.reduce((m,c)=>m+c.lines.length,0),0));
 for(const b of books){const directory=new URL(`../public/${b.audioBase}/`,import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',directory))),lines=new Map(manifest.lines.map(r=>[r.file,r]));for(const c of b.chapters)c.narration.forEach((text,i)=>{const file=`${c.audioKey}-narration-${i}.mp3`;assert.deepEqual(lines.get(file),{file,speaker:'故事旁白',text,voice:'zh-TW-HsiaoChenNeural'});assert.ok(statSync(new URL(file,directory)).size>1000);});}
});
