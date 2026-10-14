import test from 'node:test';
import assert from 'node:assert/strict';
import { books } from '../public/books.js';
import { restoreLibrary } from '../public/state.js';
test('eleven complete books have unique IDs, full chapters, and valid casts',()=>{
 assert.equal(books.length,11);assert.equal(new Set(books.map(b=>b.id)).size,11);
 for(const book of books){assert.ok(book.chapters.length>=6);for(const c of book.chapters){assert.ok(c.text.length>70,`${book.title}: short story`);assert.ok(c.lines.length>=2);for(const [speaker,line] of c.lines){assert.ok(line.length>5);if(c.characters)assert.ok(c.characters.some(actor=>actor.name===speaker));}}}
});
test('each book has independent progress and legacy pig bookmarks migrate',()=>{
 const state=restoreLibrary('{"books":{"red-riding-hood":{"page":3,"favorite":true},"ugly-duckling":{"page":999}}}',books,'{"page":4,"started":true}');
 assert.equal(state.books['three-little-pigs'].page,4);
 assert.equal(state.books['red-riding-hood'].page,3);
 assert.equal(state.books['red-riding-hood'].favorite,true);
 assert.equal(state.books['ugly-duckling'].page,0);
});
