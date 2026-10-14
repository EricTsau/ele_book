export const STORAGE_KEY = 'little-leaf:pigs:v1';
export function restoreProgress(raw, count) {
  try {
    const value = JSON.parse(raw);
    return { page: Number.isInteger(value?.page) && value.page >= 0 && value.page < count ? value.page : 0,
      favorite: value?.favorite === true, started: value?.started === true, completed: value?.completed === true };
  } catch { return {page: 0, favorite: false, started: false, completed: false}; }
}
export function nextPage(page, direction, count) { return Math.max(0, Math.min(count - 1, page + direction)); }
export function saveProgress(storage, state) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
export const LIBRARY_KEY = 'little-leaf:library:v2';
export function restoreLibrary(raw, books, legacyRaw=null) {
 let value;try {value=JSON.parse(raw);}catch{}
 const result={books:{}};
 for(const book of books){const saved=value?.books?.[book.id];result.books[book.id]=restoreProgress(saved?JSON.stringify(saved):book.id==='three-little-pigs'?legacyRaw:null,book.chapters.length);}
 return result;
}
export function saveLibrary(storage, state){try{storage.setItem(LIBRARY_KEY,JSON.stringify(state));return true;}catch{return false;}}
