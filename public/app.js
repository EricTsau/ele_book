import {speechBeats,speechTime} from './speech-sync.js';
import {speechCues} from './speech-cues.js';
import {animateLearningScene} from './learning-scenes.js';
import {chapterAudioFile,STORY_PLAYBACK_RATE} from './reading-edition.js';
import {createSoundscape} from './soundscape.js';
import {choreographPigs} from './story-motion.js';
import { books, findBook } from './books.js';
import { coverArt } from './covers.js';
import { animateFairytale } from './fairytale3d.js';
import { createStoryWorld } from './book3d.js';
import { sceneArt } from './art.js';
import { STORAGE_KEY, LIBRARY_KEY, restoreLibrary, nextPage, saveLibrary } from './state.js';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let raw=null,legacy=null;
try{raw=localStorage.getItem(LIBRARY_KEY);legacy=localStorage.getItem(STORAGE_KEY);}catch{}
let libraryState=restoreLibrary(raw,books,legacy);
let currentBook=books[0],chapters=currentBook.chapters,state=libraryState.books[currentBook.id];
let current=state.page,filter='all',playing=false,auto=false,voice=true,turning=false;
let gesture = null, interacting = false, currentSpeaker = '';
let activeLine = -1, transition = null, autoTimer = null, toastTimer = null, lastFocus = null;
let timelines = [];
const reader = $('reader');
const narration = $('story-audio');
const soundscape=createSoundscape();window.__storySound=soundscape;let sound=true;
let audioEpoch = 0, narrativePhase = null, speechSession = null, interruptedSpeech = null;
const gsap = window.gsap;
window.__timelines = {};
$('cover-art').innerHTML = sceneArt({ house:'brick', actors:3 }, 'cover');
let world=null,loadedBook=null;
function prepareBook(book){
 if(loadedBook===book.id)return;
 timelines.forEach(t=>t.kill());timelines=[];window.__timelines={};
 world?.dispose();world=null;
 const oldCanvas=$('story-canvas');oldCanvas.replaceWith(oldCanvas.cloneNode(false));
 $('webgl-error').hidden=true;
 currentBook=book;chapters=book.chapters;state=libraryState.books[book.id];current=state.page;

try{world=createStoryWorld($('story-canvas'),chapters,{onActor:interact,getSpeechState:()=>({name:currentSpeaker,time:voice?narration.currentTime:timelines[current]?.time()||0,playing:!reduced.matches&&(voice?!narration.paused&&!narration.ended:playing)})});window.__storybook3d=world;}
catch(error){$('webgl-error').hidden=false;console.error('3D renderer unavailable:',error);}
$('chapter-dots').innerHTML = chapters.map((c,i) => `<button aria-label="第 ${i+1} 章：${c.title}" data-page="${i}" aria-current="false"></button>`).join('');
// Finite, synchronously registered GSAP timelines now animate actual Three.js objects.
chapters.forEach((c,i) => {
 const s=world?.scenes[i];
 const tl=gsap.timeline({paused:true});
 if(s&&c.learningScene){animateLearningScene(tl,s,c);}else if(s&&c.characters){animateFairytale(tl,s,c);}else if(s){
  for(const [j,tree] of s.trees.entries()){
   tl.from(tree.rotation,{x:-Math.PI/2,duration:.8,ease:'back.out(1.1)'},j*.09);
   tl.to(tree.rotation,{z:.02,duration:2,repeat:7,yoyo:true,ease:'sine.inOut'},0);
  }
  if(s.house)tl.from(s.house.rotation,{x:-Math.PI/2,duration:1,ease:'back.out(1.05)'},.12);
  for(const [j,p] of s.pigs.entries()){
   tl.from(p.root.scale,{y:.01,duration:.75,ease:'back.out(1.6)'},.3+j*.14);
  }
  choreographPigs(tl,s,c,c.storyIndex??i);
  if(s.wolf){
   tl.from(s.wolf.root.scale,{y:.01,duration:1,ease:'back.out(1)'},.5);
   tl.to(s.wolf.root.rotation,{z:-.18,duration:.8},6.7);
   tl.to(s.wolf.root.rotation,{z:.2,duration:.3},7.5);
   tl.to(s.windMaterial,{opacity:.85,duration:.4},7.6);
   tl.to(s.wind.position,{x:-.9,duration:1.8},7.6);
   tl.to(s.windMaterial,{opacity:0,duration:.5},9);
   if(c.collapse){
    tl.to(s.house.rotation,{z:.06,duration:.09,repeat:7,yoyo:true},7.8);
    tl.to(s.house.rotation,{z:.55,x:-.4,duration:1,ease:'power2.in'},8.6);
    tl.to(s.house.scale,{y:.15,duration:1,ease:'power2.in'},8.6);
    for(const [j,p] of s.pigs.entries()){
     const run=c.storyIndex===5?10.4:9.3;
     tl.to(p.root.position,{x:2.1-j*.35,z:1.8-j*.5,duration:1.4,delay:j*.15,ease:'power2.in'},run);
     tl.set(p.root,{visible:false},run+1.5);
     for(const [k,leg] of p.legs.entries())tl.to(leg.rotation,{x:k?-.7:.7,duration:.1,repeat:13,yoyo:true},run);
    }
   }else{
    tl.to(s.wolf.root.rotation,{y:-1.2,duration:.5},11);
    tl.to(s.wolf.root.position,{x:-2.3,z:-.6,duration:1.8},11.2);
    tl.set(s.wolf.root,{visible:false},13.1);
   }
  }
 }else{tl.to({value:0},{value:1,duration:16});}
 tl.eventCallback('onUpdate',()=>{if(reader.open&&current===i&&!interacting&&!voice){updateDialogue(tl.time());soundscape.tick(tl.time(),playing,voice&&!narration.paused&&!narration.ended);}});
 tl.timeScale(STORY_PLAYBACK_RATE);
 tl.eventCallback('onComplete',()=>{if(reader.open&&current===i&&!voice)finishPage();});
 timelines.push(tl);window.__timelines[`${currentBook.id==='three-little-pigs'?'pigs':currentBook.id}-${i}`]=tl;
});
loadedBook=book.id;
}
function persist(){try{saveLibrary(localStorage,libraryState);}catch{}}
function notify(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2400);}
function updateLibrary(){
 const favorites=books.filter(book=>libraryState.books[book.id].favorite).length;
 $('favorite-count').textContent=String(favorites);$('tab-count').textContent=String(favorites).padStart(2,'0');$('all-count').textContent=String(books.length);
 const query=$('search').value.trim().toLowerCase();
 const collection=$('collection-filter').value;
 const visible=books.filter(book=>(`${book.title} ${book.english} ${book.subtitle} ${book.collection==='original'?'原創故事':'經典童話 改寫'}`).toLowerCase().includes(query)&&(collection==='all'||(book.collection||'classic')===collection)&&(filter==='all'||libraryState.books[book.id].favorite));
 $('book-grid').innerHTML=visible.map(book=>{
  const saved=libraryState.books[book.id],first=book.id==='three-little-pigs',n=book.chapters.length;
  const status=saved.completed?'已讀完 · 再讀一次':saved.started?`讀到第 ${saved.page+1} / ${n} 章`:'等你翻開';
  return `<article class="book-card ${first?'featured-book':''}" ${first?'id="book-card"':''} data-book="${book.id}"><button class="thumbnail" ${first?'id="card-cover"':''} data-action="read" data-id="${book.id}" aria-label="閱讀${book.title}"><span class="mini-tag">${book.collection==='original'?'原創故事':'經典改寫'} · ${n} 個場景</span>${coverArt(book)}<span class="thumb-title" style="background:${book.color}">${book.title}<small>${book.english}</small></span></button><div class="card-content"><div class="card-top"><span class="availability"><i></i> 3D 立體有聲繪本</span><button class="favorite-button" ${first?'id="favorite"':''} data-action="favorite" data-id="${book.id}" aria-label="${saved.favorite?'取消收藏':'收藏'}${book.title}" aria-pressed="${saved.favorite}">${saved.favorite?'♥':'♡'}</button></div><h3>${book.title}</h3><p>${book.subtitle}</p><div class="book-meta"><span>${book.age}</span><span>${n} 個故事場景</span><span>台灣女聲</span></div><div class="card-bottom"><button class="text-button" ${first?'id="card-read"':''} data-action="read" data-id="${book.id}">${saved.started?'繼續閱讀':'開始閱讀'} <span>→</span></button><span ${first?'id="reading-status"':''}>${status}</span></div><div class="saved-progress" aria-hidden="true"><i style="width:${saved.completed?100:saved.started?(saved.page+1)/n*100:0}%"></i></div></div></article>`;
 }).join('');
 $('empty-state').hidden=visible.length>0;
 $('empty-title').textContent=query?'找不到這個故事':'還沒有收藏的故事';
 $('empty-copy').textContent=query?'試試故事名稱或「童話」，讓冒險重新開始。':'點一下書本旁的愛心，把喜歡的故事留在這裡。';
 for(const [id,value]of[['all-filter','all'],['favorite-filter','favorite']]){$(id).classList.toggle('active',filter===value);$(id).setAttribute('aria-pressed',String(filter===value));}
}
function setFilter(value){filter=value;updateLibrary();}
function cancelAuto(){clearTimeout(autoTimer);autoTimer=null;}
function scheduleAuto(){
 cancelAuto();if(!auto||!reader.open||reduced.matches||current>=chapters.length-1||speechSession||interruptedSpeech||interacting)return;
 const advance=()=>{if(voice&&!narration.paused&&!narration.ended&&!narration.error){autoTimer=setTimeout(advance,200);return;}goTo(current+1);};
 autoTimer=setTimeout(advance,3000);
}
function stopSpeech(){speechSession=null;interruptedSpeech=null;narrativePhase=null;audioEpoch++;narration.pause();narration.currentTime=0;}
function stopGesture(){gesture?.kill();gesture=null;interacting=false;}
function speak(text,who){
 if(!voice) return;
 stopSpeech();
 const index=chapters[current].lines.findIndex(line=>line[1]===text && line[0]===who);
 if(index<0)return;
 const epoch=audioEpoch;
 narration.dataset.role='line';
 narration.src=`${currentBook.audioBase}/${chapterAudioFile(chapters[current],index)}`;
 $('voice-status').textContent='';
 narration.play().catch(()=>{
  if(epoch===audioEpoch && voice && reader.open) $('voice-status').textContent='配音暫時無法播放，請重新開啟語音重試；仍可繼續閱讀字幕。';
 });
}
function showLine(line){
 showSpokenText(line[0],line[1]);speak(line[1],line[0]);
}
function showSpokenText(who,text){
 currentSpeaker=who;$('dialogue').replaceChildren();
 const speaker=document.createElement('strong');speaker.textContent=who;
 const content=document.createElement('span');content.textContent=text;
 $('dialogue').append(speaker,content);$('scene-bubble').textContent=who==='故事旁白'?'':text;
}
function playSpeechBeat(offset=0){
 const session=speechSession;if(!session||!reader.open)return;
 const beat=session.beats[session.index],epoch=++audioEpoch;
 narrativePhase=beat.kind==='sentence'?(beat.paragraph===0?'opening':'closing'):null;
 if(!reduced.matches)showSpokenText(beat.speaker,beat.text);
 narration.dataset.role=narrativePhase||'line';narration.dataset.beat=String(session.index);
 narration.src=`${currentBook.audioBase}/${chapterAudioFile(chapters[current],beat.index,beat.kind)}`;
 $('voice-status').textContent='';
 // Resuming a character interaction restores the exact spoken position.
 if(offset>0)narration.addEventListener('loadedmetadata',()=>{if(epoch===audioEpoch)narration.currentTime=Math.min(offset,narration.duration);},{once:true});
 narration.play().catch(()=>{
  if(epoch!==audioEpoch||!reader.open||!playing)return;
  $('voice-status').textContent='這句配音暫時無法播放，會保留字幕並接續演出。';
  advanceSpeech();
 });
 syncPlayback();
}
function startSpeech(time=0){
 const tl=timelines[current],beats=speechBeats(chapters[current],speechCues[chapters[current].id],tl.duration());
 const index=time>0?Math.max(0,beats.findLastIndex(b=>b.start<=time)):0;
 speechSession={beats,index};tl.pause();playSpeechBeat();
}
function syncSpeechFrame(){
 if(!reader.open||!playing||!speechSession||interacting||narration.paused)return;
 const beat=speechSession.beats[speechSession.index];
 if(!reduced.matches)timelines[current].pause(speechTime(beat,narration.currentTime,narration.duration),true);
 soundscape.tick(timelines[current].time(),true,!narration.paused&&!narration.ended);
}
// The audio clock owns voiced animation, including buffering and media seeks.
gsap.ticker.add(syncSpeechFrame);
function advanceSpeech(){
 if(!speechSession||!reader.open||!playing)return;
 const session=speechSession,beat=session.beats[session.index];
 if(!reduced.matches)timelines[current].pause(beat.end,true);
 if(++session.index<session.beats.length)playSpeechBeat();
 else{speechSession=null;narrativePhase=null;finishPage();}
}
function finishPage(){
 playing=false;if(current===chapters.length-1){state.completed=true;persist();updateLibrary();}
 syncPlayback();scheduleAuto();
}
function updateDialogue(time){
 const c=chapters[current],lines=c.lines;
 const cues=speechCues[c.id]?.lines||c.cues||lines.map((_,i)=>i*7);
 const idx=cues.findLastIndex(cue=>time>=cue);
 if(idx>=0&&idx!==activeLine){activeLine=idx;showSpokenText(...lines[idx]);}
}
narration.addEventListener('ended',advanceSpeech);
narration.addEventListener('error',advanceSpeech);
function syncPlayback(){
 soundscape.tick(timelines[current]?.time()||0,playing&&reader.open,voice&&!narration.paused&&!narration.ended);
 $('play-pause').textContent=playing?'Ⅱ':'▶';
 $('play-pause').setAttribute('aria-label',playing?'暫停動畫':'播放動畫');
 $('play-pause').disabled=reduced.matches;
 $('scene-status').textContent=reduced.matches?'靜態閱讀':playing?(narrativePhase?'聽故事旁白':'故事演出中'):timelines[current].progress()===1?(chapters[current].kind==='reflection'?'留一點時間，一起聊聊':'本頁演出結束'):'已暫停';
 $('auto-toggle').setAttribute('aria-pressed',String(auto));$('auto-toggle').textContent=`自動翻頁：${auto?'開':'關'}`;
 $('auto-toggle').disabled=reduced.matches;
}
function renderPage(){
 const c=chapters[current];soundscape.scene(c);
 $('story-copy').innerHTML=`<span class="chapter-number">Chapter ${String(current+1).padStart(2,'0')}</span><h3>${c.title}</h3>${c.text.split('\n\n').map(p=>`<p>${p}</p>`).join('')}${current===chapters.length-1?'<span class="end-message">— 故事說完了，想像還在繼續。 —</span>':''}`;
 $('chapter-tag').textContent=`${String(current+1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')}`;$('chapter-name').textContent=c.label;
 world?.show(current);
 $('chapter-dots').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-current',String(i===current)));
 $('previous').disabled=current===0;
 $('next').setAttribute('aria-label',current===chapters.length-1?'讀完回書架':'下一頁');$('next').innerHTML=current===chapters.length-1?'<span>讀完回書架</span> ✓':'<span>下一頁</span> →';
 $('interaction-hint').textContent=c.prompt;
 $('reflection-panel').hidden=c.kind!=='reflection';
 $('reflection-question').textContent=c.reflection?.question||'';
 $('reflection-action').textContent=c.reflection?.action||'';
 const names=[...new Set(c.lines.map(line=>line[0]))];
 $('actor-controls').innerHTML=names.map((name,i)=>`<button data-character="${i}">${name} <span aria-hidden="true">♬</span></button>`).join('');
 activeLine=-1;currentSpeaker=null;$('dialogue').textContent=c.title;$('scene-bubble').textContent='';const tl=timelines[current];
 tl.pause(0);
 if(reduced.matches){tl.progress(1,true).pause();$('dialogue').innerHTML=c.narration.map(p=>`<span>${p}</span>`).join('')+c.lines.map(l=>`<span><strong>${l[0]}</strong>${l[1]}</span>`).join('');playing=voice;if(voice)startSpeech();}
 else{playing=true;if(voice)startSpeech();else{updateDialogue(0);tl.play(0);}}
 state.page=current;state.pageId=c.id;state.started=true;persist();syncPlayback();updateLibrary();
}
function openReader(bookId='three-little-pigs'){
 const book=findBook(bookId);if(!book)return;
 soundscape.unlock();if(!soundscape.inspect().available){$('sound-toggle').disabled=true;$('sound-toggle').textContent='環境音未支援';}
 lastFocus=document.activeElement;reader.showModal();document.body.style.overflow='hidden';prepareBook(book);
 current=state.page;$('reader-title').textContent=book.title;
 $('reader-series').textContent=book.collection==='original'?'小葉原創故事':'小葉經典童話';
 const source=$('story-provenance');source.replaceChildren();
 if(book.provenance){source.append(`${book.provenance.author} · ${book.provenance.note}`);if(book.provenance.sourceUrl){const link=document.createElement('a');link.href=book.provenance.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent=' 原作來源 ↗';source.append(link);}}
document.querySelector('.chapter-label>span:last-child').textContent=book.english;
 $('story-canvas').setAttribute('aria-label',`${book.title}立體書：拖曳旋轉視角，點選立體角色聽對話`);
 world?.start();renderPage();$('close-reader').focus();
}
function closeReader(){
 soundscape.stop();
 cancelAuto();stopGesture();transition?.kill();transition=null;turning=false;$('open-book').setAttribute('aria-busy','false');world?.cancelTurn();world?.stop();
 timelines.forEach(t=>t.pause());stopSpeech();playing=false;reader.close();document.body.style.overflow='';updateLibrary();if(lastFocus?.isConnected)lastFocus.focus();else document.querySelector(`[data-action="read"][data-id="${currentBook.id}"]`)?.focus();
}
function goTo(target){
 if(turning||!reader.open||target<0||target>=chapters.length||target===current)return;
 cancelAuto();stopGesture();stopSpeech();soundscape.stop();timelines[current].pause();playing=false;
 if(reduced.matches||!world){current=target;renderPage();return;}
 turning=true;syncPlayback();soundscape.turn();$('open-book').setAttribute('aria-busy','true');
 const old=world.scenes[current];const forward=target>current;const progress={value:forward?0:1};
 transition=gsap.timeline({onComplete:()=>{world.endTurn();$('open-book').setAttribute('aria-busy','false');turning=false;transition=null;current=target;renderPage();}});
 transition.to(old.root.scale,{y:.025,duration:.25,ease:'power2.in'});
 transition.call(()=>{world.beginTurn();world.fold(progress.value);});
 transition.to(progress,{value:.5,duration:.38,ease:'power2.in',onUpdate:()=>world.fold(progress.value)});
 transition.call(()=>{world.show(target);world.scenes[target].root.scale.y=.025;});
 transition.to(progress,{value:forward?1:0,duration:.38,ease:'power2.out',onUpdate:()=>world.fold(progress.value)});
}
function togglePlayback(){
 if(turning||reduced.matches)return;
 cancelAuto();const wasPlaying=playing;stopGesture();const tl=timelines[current];
 if(wasPlaying){tl.pause();narration.pause();playing=false;}
 else{playing=true;
  if(interruptedSpeech){const saved=interruptedSpeech;interruptedSpeech=null;speechSession=saved.session;playSpeechBeat(saved.time);}
  else if(speechSession){
   if(narration.ended||narration.error)advanceSpeech();
   else{const epoch=audioEpoch,session=speechSession,index=session.index;narration.play().catch(()=>{if(epoch===audioEpoch&&speechSession===session&&session.index===index)advanceSpeech();});}
  }
  else if(tl.progress()===1){renderPage();return;}
  else if(voice)startSpeech(tl.time());
  else tl.play();
 }
 syncPlayback();
}
function replay(){if(turning)return;cancelAuto();stopGesture();stopSpeech();activeLine=-1;renderPage();}
function interact(name){
 const resumeSpeech=speechSession?{session:speechSession,time:narration.currentTime}:interruptedSpeech;
 if(turning)return;cancelAuto();stopGesture();timelines[current].pause();playing=false;stopSpeech();
 const line=chapters[current].lines.find(l=>l[0]===name);if(line)showLine(line);
 if(!reduced.matches){
  interacting=true;playing=true;
  const actor=[...(world?.scenes[current].pigs||[]),world?.scenes[current].wolf].find(a=>a?.name===name);
  const poses=(actor?.arms||[]).map(arm=>({arm,z:arm.rotation.z}));
  const restore=()=>{poses.forEach(({arm,z})=>{arm.rotation.z=z;});interacting=false;gesture=null;playing=false;};
  gesture=gsap.timeline({onComplete:()=>{restore();syncPlayback();},onInterrupt:restore});
  poses.forEach(({arm,z},i)=>gesture.fromTo(arm.rotation,{z},{z:z+(i?-.35:.35),duration:.3,repeat:3,yoyo:true},0));
  if(!poses.length)gesture.to({value:0},{value:1,duration:1.2});
 }
 interruptedSpeech=resumeSpeech;syncPlayback();
}
for(const id of ['hero-read','cover-read'])$(id).addEventListener('click',()=>openReader());
$('book-grid').addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;const bookId=button.dataset.id;if(button.dataset.action==='read')openReader(bookId);else{const saved=libraryState.books[bookId];saved.favorite=!saved.favorite;persist();updateLibrary();notify(saved.favorite?'已放進你的收藏書架':'已取消收藏');document.querySelector(`[data-action="favorite"][data-id="${bookId}"]`)?.focus();}});
$('close-reader').addEventListener('click',closeReader);
reader.addEventListener('cancel',event=>{event.preventDefault();closeReader();});
$('previous').addEventListener('click',()=>goTo(nextPage(current,-1,chapters.length)));
$('next').addEventListener('click',()=>{if(turning)return;if(current===chapters.length-1){state.completed=true;persist();closeReader();notify('故事讀完了，下一次再一起冒險！');}else goTo(current+1);});
$('replay').addEventListener('click',replay);$('play-pause').addEventListener('click',togglePlayback);
$('auto-toggle').addEventListener('click',()=>{auto=!auto;cancelAuto();syncPlayback();if(auto&&timelines[current].progress()===1)scheduleAuto();});
$('sound-toggle').addEventListener('click',()=>{sound=!sound;soundscape.setEnabled(sound);$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-toggle').textContent=`環境音：${sound?'開':'關'}`;syncPlayback();});
$('voice-toggle').addEventListener('click',()=>{
 if(interacting){stopGesture();timelines[current].pause();playing=false;}
 voice=!voice;$('voice-toggle').setAttribute('aria-pressed',String(voice));$('voice-toggle').innerHTML=`♫ <span>台灣女聲：${voice?'開':'關'}</span>`;
 stopSpeech();
 if(voice&&(playing||reduced.matches)){playing=true;startSpeech(reduced.matches?0:timelines[current].time());}
 else if(!voice&&reduced.matches)playing=false;
 else if(!voice&&playing)timelines[current].play();
 $('voice-status').textContent='';syncPlayback();
});
$('chapter-dots').addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(button)goTo(Number(button.dataset.page));});
$('actor-controls').addEventListener('click',event=>{const button=event.target.closest('[data-character]');if(button){const names=[...new Set(chapters[current].lines.map(l=>l[0]))];interact(names[Number(button.dataset.character)]);}});
$('reset-camera').addEventListener('click',()=>world?.resetView());
$('all-filter').addEventListener('click',()=>setFilter('all'));
$('favorite-filter').addEventListener('click',()=>setFilter('favorite'));
$('nav-favorite').addEventListener('click',()=>{setFilter('favorite');$('library').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});
$('search').addEventListener('input',updateLibrary);
$('collection-filter').addEventListener('change',updateLibrary);
$('reset-filter').addEventListener('click',()=>{$('search').value='';$('collection-filter').value='all';setFilter('all');});
document.addEventListener('keydown',event=>{if(!reader.open)return;if(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName))return;if(event.key==='ArrowRight'){event.preventDefault();goTo(nextPage(current,1,chapters.length));}if(event.key==='ArrowLeft'){event.preventDefault();goTo(nextPage(current,-1,chapters.length));}if(event.code==='KeyK'){event.preventDefault();togglePlayback();}});
let touchX=null,touchY=null;
$('open-book').addEventListener('touchstart',event=>{if(event.target.closest('button,canvas'))return;touchX=event.changedTouches[0].clientX;touchY=event.changedTouches[0].clientY;},{passive:true});
$('open-book').addEventListener('touchend',event=>{if(touchX===null)return;const dx=event.changedTouches[0].clientX-touchX,dy=event.changedTouches[0].clientY-touchY;touchX=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)goTo(nextPage(current,dx<0?1:-1,chapters.length));},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&reader.open){cancelAuto();stopGesture();stopSpeech();timelines[current].pause();playing=false;world?.stop();syncPlayback();}else if(reader.open){world?.start();}});
reduced.addEventListener('change',()=>{if(reader.open){cancelAuto();stopGesture();stopSpeech();renderPage();}});
updateLibrary();
