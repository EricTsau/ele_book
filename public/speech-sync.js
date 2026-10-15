// Keep quoted speech intact while separating narrated actions into audio beats.
export function splitSpeechSentences(text){
 const result=[];let start=0,depth=0;
 for(let i=0;i<text.length;i++){
  if('「『“'.includes(text[i]))depth++;
  else if('」』”'.includes(text[i]))depth=Math.max(0,depth-1);
  if(depth===0&&(/[。！？]/.test(text[i])||('」』”'.includes(text[i])&&/[。！？]/.test(text[i-1]||'')))){
   const sentence=text.slice(start,i+1).trim();if(sentence)result.push(sentence);start=i+1;
  }
 }
 const rest=text.slice(start).trim();if(rest)result.push(rest);return result;
}
export function narrationSentences(chapter){return chapter.narration.flatMap((p,paragraph)=>splitSpeechSentences(p).map(text=>({text,paragraph})));}
export function speechBeats(chapter,anchors,duration){
 const sentences=narrationSentences(chapter);
 const fallback={narration:sentences.map((_,i)=>i*duration/(sentences.length+1)),lines:chapter.lines.map((_,i)=>(i+.5)*duration/chapter.lines.length)};
 const cue=anchors||fallback;
 if(cue.narration.length!==sentences.length||cue.lines.length!==chapter.lines.length)throw new Error(`Speech cues do not match ${chapter.id}`);
 const beats=[...sentences.map((s,index)=>({...s,index,kind:'sentence',speaker:'故事旁白',start:cue.narration[index]})),...chapter.lines.map(([speaker,text],index)=>({speaker,text,index,kind:'line',start:cue.lines[index]}))].sort((a,b)=>a.start-b.start);
 // Shared setup anchors still unfold the book immediately while the opening is spoken.
 const openingCount=beats.findIndex(b=>b.start>0);
 if(openingCount>1){const span=Math.min(.8,beats[openingCount].start);for(let i=1;i<openingCount;i++)beats[i].start=span*i/openingCount;}
 return beats.map((beat,i)=>({...beat,start:Math.min(duration,beat.start),end:Math.min(duration,beats[i+1]?.start??duration)}));
}
export function speechTime(beat,currentTime,duration){
 const fraction=Number.isFinite(duration)&&duration>0?Math.max(0,Math.min(1,currentTime/duration)):0;
 return beat.start+(beat.end-beat.start)*fraction;
}
