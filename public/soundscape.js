// Original procedural audio: no downloaded music, recordings, or sample packs.
// Browser audio is unlocked only by opening a book / pressing its sound control.
import {actionSounds} from './action-sounds.js';
function score(chapter,motionSounds){
 const cues=[...actionSounds(chapter),...motionSounds];
 // Keep ambience sparse and separate from physical action markers.
 for(const time of [.6,4.4,8.2,12])cues.push({time,type:'music'});
 if(['forest','garden','meadow','savanna'].includes(chapter.setting))for(const time of [1,9.8])cues.push({time,type:'bird'});
 if(chapter.setting==='lake')for(const time of [1,9.8])cues.push({time,type:'water'});
 // Several actors may contact the ground together. One soft contact avoids a
 // loud pile-up while preserving each distinct action and its authored time.
 const previous=new Map();
 return cues.sort((a,b)=>a.time-b.time).filter(c=>{
  const keep=c.time-(previous.get(c.type)??-Infinity)>.14;
  if(keep)previous.set(c.type,c.time);return keep;
 });
}
export function createSoundscape(){
 let ctx=null,master=null,bedGain=null,fxGain=null,analyser=null,noise=null;
 let enabled=true,available=true,current=null,cues=[],last=-1,active=false,ducked=false,played=[],events=[];
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
 function tone(freq,duration,volume=.07,delay=0,type='sine',endFreq=freq){
  if(!ctx)return;const at=ctx.currentTime+delay,osc=track(ctx.createOscillator()),gain=ctx.createGain();osc.cleanup=[gain];osc.type=type;osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(endFreq,at+duration);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(gain);gain.connect(fxGain);osc.start(at);osc.stop(at+duration+.02);
 }
 function hiss(duration,volume,frequency=900,delay=0,resonance=0){
  const at=ctx.currentTime+delay,source=track(ctx.createBufferSource()),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.cleanup=[filter,gain];source.buffer=noise;source.loop=true;filter.type=resonance?'bandpass':'lowpass';filter.Q.value=resonance||.7;filter.frequency.value=frequency;gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(volume,at+.035);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);source.connect(filter);filter.connect(gain);gain.connect(fxGain);source.start(at);source.stop(at+duration+.03);
 }
 function effect(type,time=null){
  if(!enabled||!ctx||ctx.state!=='running')return;
  played.push(type);if(played.length>40)played.shift();
  events.push({type,time});if(events.length>80)events.shift();
  if(type==='music'){const base=({lake:261.63,cloud:293.66,palace:329.63,snow:246.94}[current?.setting]||261.63);[1,1.25,1.5,1.125].forEach((r,i)=>tone(base*r,1.25,.025,i*.3));}
  if(type==='step'){hiss(.09,.09,480);tone(105,.085,.05);}
  if(type==='knock'){tone(330,.14,.11,0,'triangle');tone(175,.08,.08);}
  if(type==='drop'||type==='water'){tone(1100,.16,.055,0,'sine',350);tone(680,.3,.035,.07,'sine',260);}
  if(type==='sparkle'||type==='chime'){[523.25,659.25,783.99].forEach((f,i)=>tone(f,.65,.045,i*.12));}
  if(type==='wind'||type==='turn')hiss(type==='turn'?.38:1.2,type==='turn'?.075:.045,1700);
  if(type==='crumble'){hiss(.7,.14,600);tone(70,.6,.1);}
  if(type==='flutter')hiss(.18,.055,1200);
  if(type==='bird'){tone(1450,.13,.022);tone(1880,.15,.02,.18);}
  if(type==='drum'){tone(115,.23,.09);hiss(.07,.04,700);}
  if(type==='thud'){tone(110,.17,.09,0,'sine',45);hiss(.09,.055,500);}
  if(type==='tap'){tone(620,.07,.065,0,'triangle');hiss(.05,.045,1800);}
  if(type==='stone'){tone(1800,.12,.045);tone(2700,.07,.022,.025);hiss(.06,.06,2300);}
  if(type==='crack'||type==='snap'){hiss(.07,.12,2400);hiss(.13,.065,1000,.075);tone(180,.12,.055,0,'triangle',65);}
  if(type==='creak'){tone(340,.28,.035,0,'sawtooth',140);tone(160,.4,.022,.2,'triangle',290);hiss(.45,.02,750);}
  if(type==='paper'||type==='cloth'||type==='rustle'){
   const bright=type==='paper'?3300:type==='cloth'?850:1700;
   for(const delay of [0,.13,.29])hiss(.14,.05,bright,delay,.8);
  }
  if(type==='scrape'){hiss(.22,.06,1400,0,1.4);hiss(.16,.035,1900,.24,1.2);}
  if(type==='snip'){hiss(.055,.08,3800);tone(2300,.045,.025);hiss(.045,.045,2400,.095);}
  if(type==='splash'){hiss(.48,.1,2900);for(const [i,f]of [900,1500,700].entries())tone(f,.18,.045,i*.09,'sine',f*.35);}
  if(type==='pour'||type==='rain'||type==='bubble'){
   const rain=type==='rain';hiss(rain?.85:.55,rain?.055:.035,rain?2800:1000);
   for(let i=0;i<5;i++)tone(420+(i%3)*210,.13,.026,i*.11,'sine',230+(i%2)*70);
  }
  if(type==='sip'){hiss(.22,.035,1600);tone(450,.14,.025,.1,'sine',650);}
  if(type==='crunch'){for(const delay of [0,.075,.16])hiss(.06,.065,2000,delay);}
  if(type==='clock'){tone(1600,.045,.05);tone(1100,.045,.04,.19);}
  if(type==='bell'){for(const [f,v]of [[523,.06],[1047,.025],[1568,.012]])tone(f,1.3,v);}
  if(type==='jingle'){for(const [i,f]of [1700,2250,2950].entries())tone(f,.32,.03,i*.075);}

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
 function scene(chapter,motionSounds=[]){stop();current=chapter;cues=score(chapter,motionSounds);last=-1;played=[];events=[];}
 function tick(time,playing,speaking=false){
  ducked=Boolean(speaking);
  if(!enabled||!ctx||!current){last=time;return;}
  if(!playing){stop();last=time;return;}
  startBed();bedGain.gain.setTargetAtTime(speaking?.04:.14,ctx.currentTime,.12);fxGain.gain.setTargetAtTime(speaking?.32:.7,ctx.currentTime,.06);
  // Seeking never bursts all skipped effects; replay resets the event cursor.
  if(time<last)last=time-.02;
  for(const cue of cues)if(cue.time>last&&cue.time<=time&&time-cue.time<.35)effect(cue.type,cue.time);
  last=time;
 }
 return {unlock,scene,tick,stop,turn(){effect('turn');},setEnabled(value){enabled=value;if(!value)stop();else unlock();},inspect(){let energy=0;if(analyser){const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);energy=Math.sqrt(a.reduce((sum,v)=>sum+v*v,0)/a.length);}return {enabled,available,active,activeNodes:nodes.size,context:ctx?.state||'uninitialized',ducked,energy,played:[...played],events:events.map(e=>({...e})),cues:cues.map(c=>({...c}))};}};
}
