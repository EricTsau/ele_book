// Original procedural audio: no downloaded music, recordings, or sample packs.
// Browser audio is unlocked only by opening a book / pressing its sound control.
function score(chapter){
 const action=chapter.action||'walk',props=chapter.props||[],cues=[];
 const add=(type,times)=>times.forEach(time=>cues.push({time,type}));
 if(chapter.storyId==='thirsty-crow'&&action==='pour')add('drop',[4.35,8.35,12.35]);
 else if(chapter.wolf)add('wind',[7.6,8.5]);
 else if(chapter.house&&chapter.actors===1&&!chapter.wolf)add('knock',[4,5.4,6.5,7.6,8.7,9.8]);
 else if(['build','chair-break'].includes(action))add('knock',action==='chair-break'?[7]:[4.7,5.7,6.7,7.7,8.7]);
 else if(['pour','row'].includes(action)||props.includes('boat'))add('drop',[4.5,6.5,8.5,10.5]);
 else if(['magic','transform','shine','grow','reveal'].includes(action))add('sparkle',[5,7.5,11]);
 else if(action==='fly')add('flutter',[2.5,4,6,8]);
 else if(action==='sway')add('wind',[3,6,9]);
 else if(['dance','celebrate'].includes(action))add('chime',[5,8,11]);
 else add('step',[2,2.55,3.1,5.5,6.05,6.6,10.7,11.25]);
 if(props.includes('drum'))add('drum',[4,4.7,5.4,6.1,8.5,9.2]);
 if(chapter.collapse)add('crumble',[8.7]);
 add('music',[.6,4.4,8.2,12]);
 const watery=['lake','snow'].includes(chapter.setting)||props.includes('pond');
 add(watery?'water':'bird',[1,9.8]);
 return cues.sort((a,b)=>a.time-b.time);
}
export function createSoundscape(){
 let ctx=null,master=null,bedGain=null,fxGain=null,analyser=null,noise=null;
 let enabled=true,available=true,current=null,cues=[],last=-1,active=false,ducked=false,played=[];
 const nodes=new Set(),bedNodes=new Set();
 function unlock(){
  if(!enabled)return;
  try{
   if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){available=false;return;}ctx=new Audio();master=ctx.createGain();master.gain.value=.34;bedGain=ctx.createGain();bedGain.gain.value=.14;fxGain=ctx.createGain();fxGain.gain.value=.7;analyser=ctx.createAnalyser();analyser.fftSize=256;bedGain.connect(master);fxGain.connect(master);master.connect(analyser);analyser.connect(ctx.destination);
    noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const data=noise.getChannelData(0);let seed=314159;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=((seed/2147483647)*2-1);}
   }
   if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  }catch{available=false;}
 }
 function disconnect(node){node.disconnect();for(const n of node.cleanup||[])n.disconnect();}
 function track(node,bed=false){nodes.add(node);if(bed)bedNodes.add(node);node.onended=()=>{nodes.delete(node);bedNodes.delete(node);disconnect(node);};return node;}
 function clear(which=nodes){for(const node of [...which]){try{node.stop();}catch{}disconnect(node);nodes.delete(node);bedNodes.delete(node);}which.clear();}
 function tone(freq,duration,volume=.07,delay=0,type='sine'){
  if(!ctx)return;const at=ctx.currentTime+delay,osc=track(ctx.createOscillator()),gain=ctx.createGain();osc.cleanup=[gain];osc.type=type;osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(gain);gain.connect(fxGain);osc.start(at);osc.stop(at+duration+.02);
 }
 function hiss(duration,volume,frequency=900){
  const at=ctx.currentTime,source=track(ctx.createBufferSource()),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.cleanup=[filter,gain];source.buffer=noise;source.loop=true;filter.type='lowpass';filter.frequency.value=frequency;gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(volume,at+.035);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);source.connect(filter);filter.connect(gain);gain.connect(fxGain);source.start();source.stop(at+duration+.03);
 }
 function effect(type){
  if(!enabled||!ctx||ctx.state!=='running')return;
  played.push(type);if(played.length>40)played.shift();
  if(type==='music'){const base=({lake:261.63,cloud:293.66,palace:329.63,snow:246.94}[current?.setting]||261.63);[1,1.25,1.5,1.125].forEach((r,i)=>tone(base*r,1.25,.025,i*.3));}
  if(type==='step'){hiss(.09,.09,480);tone(105,.085,.05);}
  if(type==='knock'){tone(330,.14,.11,0,'triangle');tone(175,.08,.08);}
  if(type==='drop'||type==='water'){tone(950,.16,.055);tone(640,.3,.035,.07);}
  if(type==='sparkle'||type==='chime'){[523.25,659.25,783.99].forEach((f,i)=>tone(f,.65,.045,i*.12));}
  if(type==='wind'||type==='turn')hiss(type==='turn'?.38:1.2,type==='turn'?.075:.045,1700);
  if(type==='crumble'){hiss(.7,.14,600);tone(70,.6,.1);}
  if(type==='flutter')hiss(.18,.055,1200);
  if(type==='bird'){tone(1450,.13,.022);tone(1880,.15,.02,.18);}
  if(type==='drum'){tone(115,.23,.09);hiss(.07,.04,700);}
 }
 function startBed(){
  if(!enabled||!ctx||!current||bedNodes.size)return;
  active=true;
  const bases={lake:174.61,cloud:196,palace:220,snow:164.81,candy:207.65,forest:196,garden:174.61,meadow:196,cottage:174.61,savanna:146.83};
  const base=bases[current.setting]||196;
  [1,1.5,2].forEach((ratio,i)=>{const osc=track(ctx.createOscillator(),true),g=ctx.createGain();osc.cleanup=[g];osc.type='sine';osc.frequency.value=base*ratio;g.gain.value=[.12,.065,.035][i];osc.connect(g);g.connect(bedGain);osc.start();});
  const source=track(ctx.createBufferSource(),true),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.cleanup=[filter,gain];source.buffer=noise;source.loop=true;filter.type='lowpass';filter.frequency.value=current.setting==='lake'?600:380;gain.gain.value=.024;source.connect(filter);filter.connect(gain);gain.connect(bedGain);source.start();
 }
 function stop(){clear();active=false;}
 function scene(chapter){stop();current=chapter;cues=score(chapter);last=-1;played=[];}
 function tick(time,playing,speaking=false){
  ducked=Boolean(speaking);
  if(!enabled||!ctx||!current)return;
  if(!playing){stop();last=time;return;}
  startBed();bedGain.gain.setTargetAtTime(speaking?.04:.14,ctx.currentTime,.12);fxGain.gain.setTargetAtTime(speaking?.32:.7,ctx.currentTime,.06);
  // Seeking never bursts all skipped effects; replay resets the event cursor.
  if(time<last)last=time-.02;
  for(const cue of cues)if(cue.time>last&&cue.time<=time&&time-cue.time<.35)effect(cue.type);
  last=time;
 }
 return {unlock,scene,tick,stop,turn(){effect('turn');},setEnabled(value){enabled=value;if(!value)stop();else unlock();},inspect(){let energy=0;if(analyser){const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);energy=Math.sqrt(a.reduce((sum,v)=>sum+v*v,0)/a.length);}return {enabled,available,active,activeNodes:nodes.size,context:ctx?.state||'uninitialized',ducked,energy,played:[...played]};}};
}
