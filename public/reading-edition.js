// Original scene and audio identities never depend on their displayed page.
// The plot keeps its original event sequence; reflection follows the ending.
export function splitNarration(text){
 const [opening,...closing]=text.split(/\n\s*\n/);
 if(closing.length)return [opening,closing.join(' ')];
 // A single-paragraph source still needs two distinct parts. Keep quoted
 // speech intact and split at the nearest complete sentence to the midpoint.
 const ends=[];let depth=0;
 for(let i=0;i<text.length-1;i++){
  if('「『“'.includes(text[i]))depth++;
  else if('」』”'.includes(text[i]))depth=Math.max(0,depth-1);
  if(depth===0&&(/[。！？]/.test(text[i])||('」』”'.includes(text[i])&&/[。！？]/.test(text[i-1]||''))))ends.push(i+1);
 }
 if(!ends.length)throw new Error('Narration needs two paragraphs or complete sentences');
 const middle=ends.reduce((best,n)=>Math.abs(n-text.length/2)<Math.abs(best-text.length/2)?n:best);
 return [text.slice(0,middle),text.slice(middle)];
}
export function expandEdition(book,plan){
 const narration=splitNarration;
 const original=book.chapters.map((c,i)=>({...c,id:`${book.id}:story:${i}`,kind:'story',storyId:book.id,storyIndex:i,audioKey:`scene-${i}`,narration:narration(c.text)}));
 if(!plan)return {...book,chapters:original};
 const cast=Object.fromEntries(original.flatMap(c=>(c.characters||[]).map(a=>[a.name,a])));
 if(book.id==='three-little-pigs')Object.assign(cast,{
  '小豬大哥':{name:'小豬大哥',type:'pig',color:'#c99249'},
  '小豬二哥':{name:'小豬二哥',type:'pig',color:'#739b9a'},
  '小豬弟弟':{name:'小豬弟弟',type:'pig',color:'#b65e44'},
 });
 const makePage=(page,kind)=>{
  const actors=page.cast.map(name=>{if(!cast[name])throw new Error(`${book.id}: unknown cast ${name}`);return {...cast[name]};});
  return {...page,id:`${book.id}:${page.id}`,kind,storyId:book.id,storyIndex:-1,audioKey:page.id,
   label:kind==='reflection'?'想一想，試一試':'把故事說清楚',characters:actors,setting:page.inside?'cottage':'meadow',
   action:'learning',props:[],cues:page.lines.map((_,i)=>2+i*6),narration:narration(page.text),
   learningScene:{kind:page.animation,item:page.item||'book',inside:!!page.inside},
   reflection:kind==='reflection'?{question:page.question,action:page.actionForChild}:undefined,
   prompt:kind==='reflection'?page.question:page.prompt||'看看角色先做了什麼，又發生了什麼。'};
 };
 const chapters=[];
 chapters.push(...original);
 chapters.push(makePage({...plan.reflection,id:'reflection'},'reflection'));
 return {...book,review:{reason:plan.reason,originalPages:original.length,addedPages:chapters.length-original.length},chapters};
}

export function chapterAudioFile(chapter,index,type='line'){
 return `${chapter.audioKey}-${type}-${index}.mp3`;
}
export const STORY_PLAYBACK_RATE=.8;
