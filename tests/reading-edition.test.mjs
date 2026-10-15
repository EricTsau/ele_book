import test from 'node:test';
import assert from 'node:assert/strict';
import {books} from '../public/books.js';
import {restoreLibrary} from '../public/state.js';

test('narration covers the complete page exactly once without repeated single-paragraph text',()=>{
 for(const b of books)for(const c of b.chapters){
  assert.notEqual(c.narration[0],c.narration[1],c.id);
  assert.equal(c.narration.join('').replace(/\s/g,''),c.text.replace(/\s/g,''),c.id);
  assert.ok(c.narration.every(p=>p.length>10),c.id);
 }
});

test('every story concludes with its own animated reflection and practical action',()=>{
 for(const book of books){
  const last=book.chapters.at(-1);
  assert.equal(last.kind,'reflection',book.id);
  assert.ok(last.reflection.question.length>8,book.id);
  assert.ok(last.reflection.action.length>8,book.id);
  assert.ok(last.learningScene.kind,book.id);
  assert.ok(last.lines.length>=2);
  assert.ok(book.review.reason.length>15);
 }
 assert.ok(new Set(books.map(b=>b.chapters.at(-1).reflection.action)).size===books.length);
});

test('expanded editions retain original animation identities and audio paths',()=>{
 for(const book of books){
  const originals=book.chapters.filter(c=>c.kind==='story');
  assert.equal(originals.length,book.id==='three-little-pigs'?8:6);
  originals.forEach((c,i)=>{assert.equal(c.storyIndex,i);assert.equal(c.audioKey,`scene-${i}`);});
  assert.equal(new Set(book.chapters.map(c=>c.id)).size,book.chapters.length);
  assert.equal(new Set(book.chapters.map(c=>c.audioKey)).size,book.chapters.length);
  assert.ok(book.chapters.every(c=>c.narration?.length===2));
 }
 for(const b of books)assert.ok(b.chapters.slice(0,-1).every(c=>c.kind==='story'),'only original plot before reflection');
});

test('old bookmarks follow their original scene after insertion and new bookmarks use stable ids',()=>{
 const book=books.find(b=>b.id==='red-riding-hood');
 const oldIndex=4,newIndex=book.chapters.findIndex(c=>c.kind==='story'&&c.storyIndex===oldIndex);
 assert.equal(newIndex,oldIndex,'the original sequence is uninterrupted');
 const old=restoreLibrary(JSON.stringify({books:{[book.id]:{page:oldIndex,started:true,favorite:true,completed:true}}}),books);
 assert.equal(old.books[book.id].page,newIndex);
 assert.equal(old.books[book.id].favorite,true);
 assert.equal(old.books[book.id].completed,false,'new reflection has not been read');
 const pageId=book.chapters.at(-1).id;
 const newer=restoreLibrary(JSON.stringify({version:3,books:{[book.id]:{page:0,pageId,started:true,completed:true}}}),books);
 assert.equal(newer.books[book.id].page,book.chapters.length-1);
 assert.equal(newer.books[book.id].completed,true);
});

test('bookmarks on removed teaching inserts continue at the next original event',()=>{
 const b=books.find(b=>b.id==='red-riding-hood');
 const state=restoreLibrary(JSON.stringify({version:3,books:{[b.id]:{page:1,pageId:`${b.id}:bridge-route`,started:true,favorite:true}}}),books).books[b.id];
 assert.equal(b.chapters[state.page].id,`${b.id}:story:1`);
 assert.equal(state.favorite,true);
});
