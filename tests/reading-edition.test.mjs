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
 assert.ok(new Set(books.map(b=>b.chapters.length)).size>=3,'page counts follow story needs');
});

test('old bookmarks follow their original scene after insertion and new bookmarks use stable ids',()=>{
 const book=books.find(b=>b.id==='red-riding-hood');
 const oldIndex=4,newIndex=book.chapters.findIndex(c=>c.kind==='story'&&c.storyIndex===oldIndex);
 assert.ok(newIndex>oldIndex,'red riding hood has missing connective scenes');
 const old=restoreLibrary(JSON.stringify({books:{[book.id]:{page:oldIndex,started:true,favorite:true,completed:true}}}),books);
 assert.equal(old.books[book.id].page,newIndex);
 assert.equal(old.books[book.id].favorite,true);
 assert.equal(old.books[book.id].completed,false,'new reflection has not been read');
 const pageId=book.chapters.at(-1).id;
 const newer=restoreLibrary(JSON.stringify({version:3,books:{[book.id]:{page:0,pageId,started:true,completed:true}}}),books);
 assert.equal(newer.books[book.id].page,book.chapters.length-1);
 assert.equal(newer.books[book.id].completed,true);
});
