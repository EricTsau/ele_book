import {storyEvent} from './story-events.js';
// Finite story blocking: actors travel, face their partners, and affect the set.
// All motion is scheduled on the owning GSAP timeline so seek, replay, and pause agree.
function walk(tl,a,x,z,at=2,duration=3,{run=false,face=0}={}){
 if(!a)return;
 const stride=run?.12:.23,cycles=Math.max(2,Math.floor(duration/stride));
 tl.to(a.root.rotation,{y:Math.atan2(x-a.root.position.x,z-a.root.position.z),duration:.22},at);
 tl.to(a.root.position,{x,z,duration,ease:'sine.inOut'},at);
 for(const [i,leg]of a.legs.entries())tl.fromTo(leg.rotation,{x:i%2?-.38:.38},{x:i%2?.38:-.38,duration:stride,repeat:cycles-1,yoyo:true,ease:'sine.inOut',immediateRender:false},at);
 for(const [i,arm]of a.arms.entries())tl.fromTo(arm.rotation,{x:i%2?.3:-.3},{x:i%2?-.3:.3,duration:stride,repeat:cycles-1,yoyo:true,ease:'sine.inOut',immediateRender:false},at);
 tl.to(a.root.position,{y:run?.12:.055,duration:stride,repeat:cycles-1,yoyo:true,ease:'sine.inOut'},at);
 tl.to(a.root.position,{y:0,duration:.12},at+duration);
 for(const part of [...a.legs,...a.arms])tl.to(part.rotation,{x:0,duration:.15},at+duration);
 tl.to(a.root.rotation,{y:face,duration:.25},at+duration);
}
function reach(tl,a,at=5,{bend=.25,repeat=1}={}){
 if(!a)return;
 tl.to(a.root.rotation,{x:bend,duration:.4,repeat:repeat*2-1,yoyo:true,ease:'sine.inOut'},at);
 for(const arm of a.arms)tl.to(arm.rotation,{x:-1.15,duration:.4,repeat:repeat*2-1,yoyo:true},at);
}
function hop(tl,a,at=8,height=.24){if(a)tl.to(a.root.position,{y:height,duration:.28,repeat:3,yoyo:true,ease:'power1.out'},at);}
function look(tl,a,at=7,direction=.45){if(a)tl.to(a.root.rotation,{y:direction,duration:.5,repeat:1,yoyo:true},at);}
function moveObject(tl,p,x,z,at,duration=2){if(p)tl.to(p.position,{x,z,duration,ease:'sine.inOut'},at);}
export function choreographStory(tl,s,c){
 const actors=s.pigs,first=actors[0],second=actors[1];
 const find=type=>actors.find(a=>a.type===type), prop=kind=>s.props.children.find(p=>p.userData.prop===kind);
 const e=s.effects,a=c.action;
 if(storyEvent(tl,s,c,{walk,reach,hop,look}))return;
 // Conversation itself has blocking: approach, listen, answer, then make room.
 function converse(){
  walk(tl,first,second?-.58:.2,.68,1.5,2.4,{face:second?.45:0});
  if(second){walk(tl,second,.62,.8,4.7,2.1,{face:-.45});reach(tl,second,7.2,{bend:.12});}
  look(tl,first,9,-.3);walk(tl,first,-.9,1.1,11,2.2);
  for(let i=2;i<actors.length;i++)walk(tl,actors[i],1.5-(i-2)*.4,.8,8,2.5,{face:-.4});
 }
 if(['walk','steady','escape'].includes(a)){
  for(const [i,actor]of actors.entries()){
   walk(tl,actor,-1.6+i*.65,.45,1.4+i*.2,a==='escape'?1.6:3,{run:a==='escape'});
   walk(tl,actor,1.3-i*.6,-.25,6+i*.2,a==='escape'?1.8:4,{run:a==='escape'});
   look(tl,actor,12,-.5);
  }
 }else if(a==='race'||a==='finish'){
  const rabbit=find('rabbit'),turtle=find('turtle');
  walk(tl,rabbit,1.7,.1,a==='race'?1.5:7,a==='race'?1.5:3,{run:true});
  walk(tl,turtle,.1,a==='finish'?-1.55:.2,2,9);hop(tl,a==='finish'?turtle:rabbit,12);
 }else if(a==='sleep'){
  const sleeper=find('rabbit')||find('lion')||first;
  walk(tl,sleeper,-.8,.3,1.5,2);
  tl.to(sleeper.root.rotation,{z:-1.18,duration:.8},3.8);tl.to(sleeper.root.position,{y:.15,duration:.8},3.8);
  const turtle=find('turtle');if(turtle)walk(tl,turtle,1.4,-.3,5,7);
  if(c.title.includes('醒')){tl.to(sleeper.root.rotation,{z:0,duration:.6},10);walk(tl,sleeper,.4,1,11,2.6);}
 }else if(a==='hatch'){
  if(e.egg){tl.to(e.egg.rotation,{z:.15,duration:.12,repeat:7,yoyo:true},1.5);tl.to(e.egg.scale,{y:.08,x:1.3,duration:.7},3);}
  hop(tl,first,3.6);walk(tl,first,.6,.2,5,3);if(second)walk(tl,second,-.6,.2,6,3,{face:.5});
 }else if(a==='grow'){
  walk(tl,first,-.6,.2,1.5,2);reach(tl,first,3.8,{repeat:2});
  if(e.plant)tl.fromTo(e.plant.scale,{y:.04},{y:1,duration:4,immediateRender:false,ease:'power2.out'},4);
  walk(tl,first,-1.15,1.1,9,2);hop(tl,first,12);
 }else if(a==='climb'){
  const climber=find('boy')||first;walk(tl,climber,.15,-.65,1.3,2.4);
  tl.to(climber.root.position,{y:2.4,duration:6,ease:'sine.inOut'},4);
  for(const [i,arm]of climber.arms.entries())tl.to(arm.rotation,{x:-1.7,z:i?.45:-.45,duration:.4,repeat:13,yoyo:true},4);
  if(second)look(tl,second,5,-.5);
 }else if(a==='descend'){
  tl.fromTo(first.root.position,{y:2.2,z:-.5},{y:0,z:-.5,duration:5,immediateRender:false},1);
  walk(tl,first,-.65,1.1,6.2,3);if(second)walk(tl,second,.65,1.1,7,3);hop(tl,first,11);
 }else if(a==='fly'){
  const bird=find('swallow')||find('swan')||find('dove')||find('crow')||first;
  tl.to(bird.root.rotation,{y:-.6,duration:.4},2);
  tl.to(bird.root.position,{x:-1,y:1.5,z:-.2,duration:3,ease:'sine.inOut'},2);
  tl.to(bird.root.position,{x:1.25,y:1.1,z:-.5,duration:4,ease:'sine.inOut'},5);
  tl.to(bird.root.position,{x:.7,y:0,z:.5,duration:3,ease:'sine.inOut'},10);
  for(const [i,wing]of bird.arms.entries())tl.to(wing.rotation,{z:i?-.85:.85,duration:.28,repeat:37,yoyo:true},2);
  const tiny=find('tiny-girl');if(tiny){tl.to(tiny.root.position,{x:-1,y:1.75,z:-.2,duration:3},2);tl.to(tiny.root.position,{x:1.25,y:1.35,z:-.5,duration:4},5);tl.to(tiny.root.position,{x:.2,y:0,z:.6,duration:3},10);}
 }else if(a==='chair-break'){
  walk(tl,first,.05,-.05,1.5,3);reach(tl,first,5);
  if(e.chair){tl.to(e.chair.rotation,{z:.65,duration:.7},7);tl.to(e.chair.scale,{y:.45,duration:.7},7);}
  walk(tl,first,-1,1.2,8,1.4,{run:true});look(tl,first,11,-.7);
 }else if(a==='transform'){
  const giant=find('giant'),mouse=find('mouse');walk(tl,first,-1,.3,1.5,2.4,{face:.65});
  if(giant)tl.to(giant.root.scale,{x:.01,y:.01,z:.01,duration:1.2},7);
  if(mouse){tl.fromTo(mouse.root.scale,{x:.01,y:.01,z:.01},{x:.64,y:.64,z:.64,duration:1.2,immediateRender:false},7.8);walk(tl,mouse,1.35,.1,9.2,2);}
  walk(tl,first,.4,.2,11,2.3);
 }else if(a==='magic'){
  walk(tl,first,-.9,.4,1.5,2.5);if(second){walk(tl,second,.9,.25,2,2.5,{face:-.6});reach(tl,second,5,{bend:.12,repeat:2});}
  if(e.magic)tl.fromTo(e.magic.scale,{x:.04,y:.04,z:.04},{x:1,y:1,z:1,duration:2,immediateRender:false,ease:'back.out(1.3)'},5);
  tl.to(s.extras.position,{y:.7,duration:1.1,repeat:5,yoyo:true},5);walk(tl,first,-.3,-.05,9,2.5);hop(tl,first,12);
 }else if(a==='clock'){
  if(e.hand)tl.to(e.hand.rotation,{z:-Math.PI*2,duration:5},1);
  look(tl,first,5,1);walk(tl,first,-1.8,1.8,7,2.2,{run:true});walk(tl,first,-1.4,-.2,10,2,{run:true});
 }else if(a==='trapped'||a==='rescue-net'){
  if(a==='trapped'){walk(tl,first,-.45,1.2,1.5,2);tl.to(first.root.rotation,{z:.16,duration:.18,repeat:9,yoyo:true},4);if(second)walk(tl,second,.25,1.05,7,2.6);}
  else{const helper=find('mouse')||second;walk(tl,helper,.12,1.3,1.5,2.5);reach(tl,helper,4,{repeat:4});if(e.net)tl.to(e.net.scale,{y:.025,duration:3},7);walk(tl,first,-1,.2,10,2);walk(tl,helper,.3,.3,11,2);}
 }else if(a==='rescue'){
  walk(tl,first,-.3,.35,1.5,2.8);reach(tl,first,4.7,{repeat:2});
  if(e.cage)tl.to(e.cage.rotation,{z:-1.3,duration:1.2},7);
  for(const [i,actor]of actors.entries())walk(tl,actor,-1.5+i*.9,1.3,9+i*.2,2.5,{run:true});
 }else if(['build','pour','share','turn','row','shine','sway'].includes(a)){
  if(a==='row'){
   for(const [i,actor]of actors.entries())walk(tl,actor,-.3+i*.6,-.1,1.5,2.4);
   for(const [i,actor]of actors.entries()){tl.to(actor.root.position,{x:.5+i*.5,z:-.3,duration:5},4.2);for(const arm of actor.arms)tl.to(arm.rotation,{x:-1,duration:.5,repeat:9,yoyo:true},4.2);}
   if(e.boat){moveObject(tl,e.boat,.8,-1,4.2,5);tl.to(e.boat.rotation,{z:.06,duration:.6,repeat:7,yoyo:true},4.2);}
  }else{
   walk(tl,first,-.45,.1,1.5,2.4,{face:.45});if(second)walk(tl,second,.6,.15,2,2.7,{face:-.45});
   reach(tl,first,4.3,{repeat:a==='build'||a==='pour'?4:2});if(second)reach(tl,second,6.3,{repeat:2});
   if(a==='pour'&&e.water)tl.to(e.water.position,{y:prop('jar')?.78:.83,duration:4},5);
   if(a==='build'){const target=prop('bridge')||prop('lantern')||prop('books')||prop('loom')||prop('cottage');if(target)tl.fromTo(target.scale,{y:.15},{y:1,duration:4,immediateRender:false},4);}
   if(a==='turn'&&e.hand)tl.to(e.hand.rotation,{z:-Math.PI*2,duration:5},4);
   if(a==='shine'&&e.glow){tl.to(e.glow.rotation,{y:Math.PI*.5,duration:5},5);tl.to(e.glow.position,{y:e.glow.position.y+.35,duration:2,repeat:1,yoyo:true},5);}
   if(a==='sway'&&e.sway)tl.to(e.sway.position,{x:1.2,duration:2,repeat:3,yoyo:true},3);
   if(a==='share'){const gift=prop('basket')||prop('books')||prop('coins')||prop('mailbox')||prop('grain');if(gift){tl.to(gift.position,{x:-.4,y:.6,z:.6,duration:1},4.5);tl.to(gift.position,{x:.6,y:.6,z:.6,duration:2},6);tl.to(gift.position,{y:0,duration:1},8);}}
   walk(tl,first,-1.1,1.1,10.5,2);if(second)walk(tl,second,.9,1,11,2);hop(tl,first,13.2,.12);
  }
 }else if(a==='dance'){
  for(const [i,actor]of actors.entries()){
   walk(tl,actor,i%2?-.65:.65,.5,1.5,3);tl.to(actor.root.rotation,{y:Math.PI*2,duration:3,ease:'sine.inOut'},5);
   walk(tl,actor,i%2?.65:-.65,1.15,8.5,3);hop(tl,actor,12);
  }
 }else if(a==='celebrate'||a==='reveal'){
  for(const [i,actor]of actors.entries()){walk(tl,actor,(i-(actors.length-1)/2)*.68,.55,1.5+i*.25,3);reach(tl,actor,5+i*.25,{bend:.1});hop(tl,actor,8+i*.2);walk(tl,actor,(i-(actors.length-1)/2)*.9,1.15,11+i*.1,2);}
 }else converse();
 // Named narrative beats refine shared verbs for distinctive story outcomes.
 if(c.storyId==='thirsty-crow'&&a==='pour'){
  const stones=prop('stones');if(stones){tl.to(stones.position,{x:.4,y:.85,z:-.65,duration:2},4);tl.to(stones.position,{x:0,y:.1,duration:1},6.5);}
 }
 if(c.storyId==='north-wind-and-sun'){
  if(prop('wind'))tl.to(prop('wind').position,{x:1.35,duration:1.4,repeat:3,yoyo:true},4);
  if(prop('sun'))tl.to(prop('sun').scale,{x:1.12,y:1.12,duration:3,repeat:1,yoyo:true},4);
 }
 if(c.storyId==='fox-and-grapes'&&a!=='walk'&&a!=='celebrate'){walk(tl,first,0,.15,2,2);hop(tl,first,5,.6);hop(tl,first,8,.85);}
}

export function choreographPigs(tl,s,c,index){
 if(index===0){for(const [i,p]of s.pigs.entries()){walk(tl,p,-1.5+i*.7,.2,1.3+i*.3,3);walk(tl,p,1.4-i*.8,.8,6+i*.2,4);hop(tl,p,12+i*.2);}}
 else if(index>=1&&index<=3){
  const pig=s.pigs[0];walk(tl,pig,-1.35,.65,1.2,1.7);reach(tl,pig,3,{repeat:1});
  for(const [n,piece]of s.supplies.entries()){
   const at=3.2+n*2.2;
   tl.to(piece.position,{x:-.7,y:.68,z:.6,duration:.5},at);
   tl.to(piece.position,{x:.3,y:.3+n*.23,z:.2,duration:1},at+.5);
   tl.to(piece.scale,{x:.01,y:.01,z:.01,duration:.3},at+1.5);
  }
  walk(tl,pig,-.25,.6,3.6,1.7,{face:.4});reach(tl,pig,5.4,{repeat:4});
  if(s.house)tl.fromTo(s.house.scale,{y:.08},{y:1,duration:7.7,immediateRender:false,ease:'none'},3.2);
  walk(tl,pig,-1.1,1.1,11.3,1.8);hop(tl,pig,13.3);
 }else if(c.wolf){
  tl.fromTo(s.wolf.root.position,{x:-2.4,z:1.8},{x:-1.65,z:.85,duration:2.6,immediateRender:false},1.1);
  for(const arm of s.wolf.arms)tl.to(arm.rotation,{x:-.75,duration:.3,repeat:5,yoyo:true},4);
  for(const [i,p]of s.pigs.entries())walk(tl,p,-.15+i*.47,.65,1.3+i*.15,2.7,{face:-.4});
 }else{
  for(const [i,p]of s.pigs.entries()){walk(tl,p,(i-1)*.65,.7,1.4+i*.25,3);reach(tl,p,5+i*.3,{bend:.12,repeat:2});walk(tl,p,(i-1)*.85,1.2,10+i*.1,2);hop(tl,p,13+i*.1);}
 }
}
