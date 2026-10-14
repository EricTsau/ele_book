// Finite, seekable scene blocking for the ten original classic retellings.
// Story indexes are zero-based; actor scales are never reset to an assumed size.
export function legacyEvent(tl,s,c,M){
 const {walk,reach,hop,look}=M,A=s.pigs,e=s.effects||{},i=c.storyIndex,id=c.storyId;
 const a=A[0],b=A[1],d=A[2];
 const find=t=>A.find(x=>x.type===t),p=k=>s.props.children.find(x=>x.userData.prop===k);
 const go=(x,X,Z,at=1.5,duration=2.5,opts={})=>{if(x)walk(tl,x,X,Z,at,duration,opts);};
 const bend=(x,at=5,repeat=1,amount=.3)=>{if(x)reach(tl,x,at,{repeat,bend:amount});};
 const turn=(x,at=5,y=.5)=>{if(x)look(tl,x,at,y);};
 const wave=(x,at=5)=>{if(x)for(const [j,arm]of x.arms.entries())tl.to(arm.rotation,{z:j?-.7:.7,duration:.3,repeat:5,yoyo:true},at);};
 const flap=(x,at=4,duration=5)=>{if(x)for(const [j,arm]of x.arms.entries())tl.to(arm.rotation,{z:j?-.8:.8,duration:.25,repeat:Math.floor(duration/.25)-1,yoyo:true},at);};
 const object=(o,v,at=5,duration=2)=>{if(o)tl.to(o.position,{...v,duration,ease:'sine.inOut'},at);};
 const rest=(x,at=4)=>{if(x){tl.to(x.root.rotation,{z:-1.35,y:0,duration:.8},at);tl.to(x.root.position,{y:.3,duration:.8},at);}};
 const upright=(x,at=7)=>{if(x){tl.to(x.root.rotation,{z:0,x:0,duration:.6},at);tl.to(x.root.position,{y:0,duration:.6},at);}};
 const bedRest=(x,at=4)=>{tl.to(x.root.position,{x:1,y:.62,z:.55,duration:1.2},at);tl.to(x.root.rotation,{x:0,y:0,z:Math.PI/2,duration:1.2},at);};
 const openCage=(at=6)=>{if(e.cageDoor)tl.to(e.cageDoor.rotation,{y:-Math.PI*.65,duration:1},at);};
 const breakChair=(at=7)=>{if(e.chairSeat)tl.to(e.chairSeat.rotation,{z:.38,duration:.5},at);if(e.chairBack)tl.to(e.chairBack.rotation,{z:.3,duration:.5},at);e.chairLegs?.forEach((leg,j)=>tl.to(leg.rotation,{z:j%2?.5:-.5,duration:.5},at));};
 const give=(o,giver,receiver,at=4)=>{bend(giver,at);object(o,{x:-.45,y:.28,z:1},at+.5,.8);object(o,{x:.6,y:.28,z:1},at+1.5,2);bend(receiver,at+3.5);object(o,{y:.08},at+4.3,.7);};
 const meet=(left=a,right=b)=>{go(left,-.65,.75,1.5,2.5,{face:.5});go(right,.65,.75,2,2.5,{face:-.5});};
 const together=()=>A.forEach((x,j)=>{go(x,-1.4+j*.7,1.3,9+j*.15,3);turn(x,13,-.2);});
 if(id==='red-riding-hood'){
  if(i===0){bend(a,1.4);object(p('basket'),{x:-.7,y:.3,z:1},2,1);go(a,1.25,.9,3.5,4);object(p('basket'),{x:1.25,y:.3,z:1.15},3.5,4);turn(a,8,-.5);go(a,.4,1.5,10,3);object(p('basket'),{x:.4,y:.3,z:1.75},10,3);}
  if(i===1){go(a,-.6,1.3);go(b,.7,.8,3,2,{face:-.6});wave(b,5);turn(a,6,-.65);go(a,-1.45,1.5,8,2);go(b,.9,.4,10,2);}
  if(i===2){go(a,-1.1,1.45,1.5,2.5);bedRest(b,0);turn(a,6,.6);bend(a,7,1,.12);go(a,-1.5,1.5,10,2);}
  if(i===3){go(a,-1.5,1.5,1.3,1.7,{run:true});wave(a,3.5);go(b,-.15,1,4.5,3,{face:.5});go(a,-1,1.7,8,2);go(b,.6,.55,9,3);turn(b,12,-.6);}
  if(i===4){tl.set(b.root.position,{x:.2,z:-.2},0);go(b,.4,.8,2,3);go(d,1.3,.9,2.5,3);go(a,-.15,.95,5,2.5,{face:.5});bend(b,8,1,.12);wave(d,9);together();}
  if(i===5){meet();give(p('basket'),a,b,4.5);bend(a,10,2,.18);bend(b,11,2,.18);}
  return true;
 }
 if(id==='tortoise-and-hare'){
  const hare=find('rabbit'),turtle=find('turtle');
  if(i===0){go(hare,-.55,.8);hop(tl,hare,4,.4);go(turtle,.65,.8,3,3);turn(turtle,6,-.55);go(hare,-1.3,1.15,9,2);go(turtle,-.55,1.15,9,3);}
  if(i===1){go(hare,-.75,-.65,1.5,1.6,{run:true});go(turtle,.45,.4,2,10);turn(hare,5,2.8);wave(hare,7);}
  if(i===2){go(hare,-1,.2,1.4,2);rest(hare,4);go(turtle,.45,.05,3,9);turn(turtle,12,-.45);}
  if(i===3){tl.set(hare.root.position,{x:-1.35,z:.2},0);rest(hare,0);go(turtle,.6,.1,1.5,4);bend(turtle,6,1,.12);go(turtle,.6,-1.1,7,6);}
  if(i===4){tl.set(hare.root.position,{x:-1,z:.25},0);tl.set(turtle.root.position,{x:.2,z:-1.1},0);rest(hare,0);go(turtle,.2,-1.93,1.5,6.5);upright(hare,7.2);turn(hare,8,3.14);go(hare,-.7,-1.9,9,2.5,{run:true});hop(tl,turtle,11.7,.14);bend(hare,12.7,1,.3);}
  if(i===5){meet(hare,turtle);bend(hare,5,1,.45);bend(turtle,7,1,.12);go(hare,1.15,1.15,9,4);go(turtle,.45,1.15,9,4);}
  return true;
 }
 if(id==='ugly-duckling'){
  if(i===0){if(e.egg){tl.to(e.egg.rotation,{z:.2,duration:.18,repeat:7,yoyo:true},1.5);tl.to(e.egg.scale,{y:.08,duration:.8},3.4);}tl.set(a.root,{visible:true},4.2);hop(tl,a,4.3,.2);go(a,-.4,.1,6,2);go(b,.35,.05,7,2);wave(b,10);}
  if(i===1){go(a,-.7,-.1);bend(a,4,2,.4);go(b,.15,-.15,5,3,{face:-.5});bend(b,8.3,1,.12);go(a,-.25,-.4,11,2);}
  if(i===2){go(a,-.8,1);if(b){tl.to(b.root.position,{x:1.25,y:1.25,z:.5,duration:3},2);flap(b,2,7);tl.to(b.root.position,{x:.4,y:0,z:.9,duration:3},7);}turn(a,6,.7);wave(a,11);}
  if(i===3){go(a,-.85,1.2,1.5,3);tl.to(a.root.rotation,{z:.06,duration:.16,repeat:13,yoyo:true},5);bend(a,8,2,.5);rest(a,11);}
  if(i===4){go(a,-.35,-.15,1.5,3);bend(a,5,2,.5);wave(a,8);go(b,.65,-.05,8.5,3,{face:-.5});wave(b,12);}
  if(i===5){go(a,-.35,-.15,1.5,3);go(b,.4,-.1,3,2);bend(a,6,1,.12);wave(b,7);flap(a,10,3);tl.to(a.root.position,{x:-.8,y:.65,z:-.35,duration:2},10);tl.to(a.root.position,{x:-.35,y:0,z:-.15,duration:1.3},12.5);}
  return true;
 }
 if(id==='jack-and-beanstalk'){
  if(i===0){meet();bend(a,4,1,.5);object(p('beans'),{x:-.45,y:.65,z:.85},4,.8);bend(b,6,1,.12);object(p('beans'),{x:-.3,y:0,z:.9},8,1.5);bend(a,9,2,.5);go(a,-.9,1.3,12,2);}
  if(i===1){if(e.plant)tl.set(e.plant.scale,{y:.04},0);go(a,-.65,1);bend(a,4,2,.45);if(e.plant)tl.to(e.plant.scale,{y:1,duration:5},4);go(a,-1.4,1.3,9,2);turn(b,10,-.7);wave(a,12);}
  if(i===2){if(e.cage){e.cage.position.set(1.05,1.75,-.25);b.root.position.set(1.05,1.81,-.25);}go(a,.25,-.57,1.5,2,{face:Math.PI});tl.to(a.root.position,{y:1.8,duration:6,ease:'none'},4);for(const [j,arm]of a.arms.entries())tl.to(arm.rotation,{x:-1.5,z:j?.3:-.3,duration:.4,repeat:13,yoyo:true},4);turn(a,11,.8);wave(b,11);}
  if(i===3){const giant=find('giant'),bird=find('duck');rest(giant,0);go(a,-.8,.8,1.5,2);bend(a,3.7,1,.3);object(e.key,{x:-.2,y:.8,z:.75},4.2,1.5);openCage(6);go(bird,.45,1.4,7.1,2,{height:0});object(e.key,{y:.05},7,.8);if(e.bell)tl.to(e.bell.rotation,{z:.15,duration:.15,repeat:5,yoyo:true},9);upright(giant,9.5);go(a,-1.55,1.6,10,2,{run:true});go(bird,-.65,1.55,10.5,2,{run:true});}
  if(i===4){tl.set(a.root.position,{x:.25,y:2.2,z:-.57},0);tl.to(a.root.position,{y:0,duration:5,ease:'none'},1.5);if(b){tl.set(b.root.position,{x:.85,y:2.2,z:-.55},0);flap(b,1.5,6);tl.to(b.root.position,{x:-1,y:0,z:-.5,duration:5},1.5);}go(a,-.85,1.25,7,2);if(e.plant)tl.to(e.plant.scale,{y:.04,duration:3},10);wave(a,11);}
  if(i===5){meet();bend(a,4,4,.6);bend(b,6,4,.55);object(p('beans'),{x:-.1,y:.05,z:1.05},5,2);if(e.crop)tl.to(e.crop.scale,{y:1,duration:4},9);go(a,-1.1,1.5,11,2);go(b,.95,1.5,11.3,2);wave(a,13);}
  return true;
 }
 if(id==='goldilocks'){
  if(i===0){A.forEach((x,j)=>{bend(x,1.5+j*.5,1,.25);go(x,j===0?-1.2:j===1?.6:-.3,2.2,4+j*.4,4);turn(x,10,-.4);});}
  if(i===1){go(a,-.75,.15,1.5,2,{face:Math.PI});bend(a,4,1,.55);go(a,0,.15,5.5,2,{face:Math.PI});bend(a,8,1,.55);go(a,.75,.15,9.5,1.6,{face:Math.PI});bend(a,11.5,2,.55);if(e.bowls?.[2])tl.set(e.bowls[2],{visible:false},12.5);}
  if(i===2){go(a,-1.25,-.35,1,1);bend(a,2.1,1,.2);go(a,1.25,-.35,2.8,1.5);bend(a,4.4,1,.2);go(a,.1,-.1,5.2,1);tl.to(a.root.position,{y:.25,duration:.6},6.3);a.legs.forEach(leg=>tl.to(leg.rotation,{x:-1.3,duration:.6},6.3));a.legs.forEach(leg=>tl.to(leg.rotation,{x:0,duration:.3},8.5));tl.to(a.root.rotation,{z:.13,duration:.2,repeat:3,yoyo:true},7);breakChair(8);tl.to(a.root.position,{y:0,x:.5,z:.5,duration:.6},8.5);tl.to(a.root.rotation,{z:0,duration:.3},8.5);go(a,-1.1,1.45,10,2);turn(a,12,.6);}
  if(i===3){bedRest(a,0);go(b,-.5,1.25,5,3);go(d,1.4,1.2,6,3);wave(d,10);tl.to(a.root.rotation,{z:0,duration:.6},11);tl.to(a.root.position,{x:.6,y:0,z:1.35,duration:1},11);turn(a,12,.55);}
  if(i===4){meet();go(d,1.25,1.25,3,2);bend(a,5,2,.45);turn(b,6,-.5);turn(a,10,-.4);bend(a,11,1,.2);}
  if(i===5){go(a,-1.3,1.4,1.5,2);wave(a,4);go(b,.35,1.25,4.5,2);wave(b,7);go(a,-.65,.95,8,2);go(d,1.4,1.1,8.5,2);bend(a,11,2,.35);bend(d,12,2,.3);}
  return true;
 }
 if(id==='hansel-and-gretel'){
  if(i===0){go(a,-.5,1.2,1.5,3);go(b,.25,1.2,2,3);turn(a,5,-.9);turn(b,7,.9);go(a,-.9,1.45,10,2);go(b,-.15,1.45,10,2);}
  if(i===1){go(a,-.8,.2);bend(a,4,2,.6);go(b,-.2,.35,5,2);bend(b,8,2,.55);go(a,-1.15,1.25,10,3);go(b,-.5,1.5,10.5,3);}
  if(i===2){go(a,-.85,1.35);go(b,-.15,1.35,2,2.5);turn(a,5,.6);wave(d,6);go(d,.8,.7,7,2.5,{face:-.6});go(a,-.65,.9,10,2);go(b,.05,1.05,10.5,2);}
  if(i===3){go(b,-.6,1.35,2,2);bend(b,5,4,.6);go(d,1.55,.1,5,3);turn(a,9,-.7);turn(b,11,.7);}
  if(i===4){const sister=b;go(sister,-.8,.9,1.5,3,{face:Math.PI});bend(sister,4.6,1,.3);object(e.key,{x:-.15,y:.8,z:.75},5,1.2);openCage(6.5);go(a,.45,1.45,7.6,1.7,{height:0});object(e.key,{y:.05},8,.8);go(sister,-1.35,1.6,10,2.2,{run:true});go(a,-.55,1.6,10.3,2.2,{run:true});wave(sister,13);}
  if(i===5){meet();give(p('basket'),a,b,4);bend(a,10,2,.28);bend(b,11,2,.28);wave(a,13);}
  return true;
 }
 if(id==='puss-in-boots'){
  if(i===0){go(a,-.55,1.05);go(b,.65,1.1,2,2.5);bend(b,5,1,.5);object(p('boots'),{x:-.5,y:.05,z:1.35},6,2);bend(a,8,2,.55);e.wornBoots?.forEach(boot=>tl.set(boot,{visible:true},9));if(p('boots'))tl.set(p('boots'),{visible:false},9);hop(tl,a,11,.3);}
  if(i===1){bend(a,1.5,1,.4);object(p('basket'),{x:-.6,y:.28,z:1.2},2.2,.8);go(a,1.1,1,3.5,4);object(p('basket'),{x:1.1,y:.28,z:1.25},3.5,4);go(b,.4,1.45,4,4);give(p('basket'),a,b,9);}
  if(i===2){meet();give(p('basket'),a,b,4.5);bend(a,10,1,.45);wave(b,11);}
  if(i===3){const giant=find('giant'),mouse=find('mouse');go(a,-1.55,.8);wave(giant,4);if(mouse&&giant){tl.to(giant.root.scale,{x:.001,y:.001,z:.001,duration:1.2},7);tl.set(giant.root,{visible:false},8.2);tl.set(mouse.root,{visible:true},8.2);go(mouse,.9,1.25,9.5,2);}turn(a,11,.7);}
  if(i===4){go(a,-.45,1.1);go(b,.5,1.2,2,2.5);bend(a,5,1,.3);object(e.bag,{x:.5,y:.05,z:1.2},5,1);if(e.bag)tl.to(e.bag.scale,{x:1.25,y:1.5,z:1.25,duration:1},5);tl.set(b.root,{visible:false},6);turn(a,7,.5);object(e.bag,{x:-1.35,y:.1,z:.4},9,1);tl.set(b.root,{visible:true},9.4);go(b,1.6,1.35,10.5,2);wave(a,12);}
  if(i===5){go(a,-.8,1);go(b,.3,.95,2,2.5);bend(b,5,4,.55);go(a,.85,1.5,5,3);wave(a,9);go(a,-.45,1.35,11,2);bend(b,12,1,.12);}
  return true;
 }
 if(id==='cinderella'){
  if(i===0){go(a,-.65,1.15);bend(a,4,4,.6);go(a,.6,.95,8,2);bend(a,10,2,.35);turn(a,13,-.55);}
  if(i===1){if(e.magic)tl.set(e.magic.scale,{x:.04,y:.04,z:.04},0);meet();wave(b,5);if(e.dressMaterial)tl.to(e.dressMaterial.color,{r:.2384,g:.3864,b:.521,duration:2},5);if(e.pumpkin)tl.to(e.pumpkin.scale,{x:.01,y:.01,z:.01,duration:1},5);if(e.magic)tl.to(e.magic.scale,{x:1,y:1,z:1,duration:2},5);go(a,-.35,1.4,9,2);wave(a,12);}
  if(i===2){meet();A.forEach((x,j)=>{go(x,j?-.6:.6,1.25,5,3);tl.to(x.root.rotation,{y:Math.PI*2,duration:2.5},8.5);go(x,j?.6:-.6,.85,11.3,2.5);});}
  if(i===3){if(e.hand){tl.set(e.hand.rotation,{z:Math.PI/3},0);tl.to(e.hand.rotation,{z:0,duration:4},1.5);}turn(a,5,.8);wave(a,6);go(a,-1.55,1.55,7,2,{run:true});if(e.dressMaterial)tl.to(e.dressMaterial.color,{r:.328,g:.314,b:.279,duration:1.5},8);if(p('shoe')){tl.set(p('shoe').position,{x:-.6,y:.04,z:1.15},7.5);tl.set(p('shoe'),{visible:true},7.5);}go(b,-.4,1.05,9.5,2);bend(b,12,1,.65);}
  if(i===4){go(b,.65,1.1);bend(b,4,1,.4);go(a,-.4,1.1,4.5,3);object(p('shoe'),{x:-.25,y:.06,z:1.25},7,2);bend(a,9,2,.6);turn(b,11,-.6);wave(a,12);}
  if(i===5){meet();bend(a,4,3,.5);bend(b,6,3,.5);go(a,-1.1,1.5,10,2);go(b,.95,1.5,10.3,2);wave(a,12.5);wave(b,12.8);}
  return true;
 }
 if(id==='thumbelina'){
  if(i===0){const flower=p('flower');if(flower){tl.set(flower.scale,{y:.2},0);tl.set(a.root.position,{x:.25,y:.4,z:-.85},0);tl.to(flower.scale,{y:1,duration:4},1.5);tl.to(a.root.position,{y:1.95,duration:4},1.5);}wave(a,6);tl.to(a.root.position,{x:.65,y:0,z:.6,duration:3},8);go(a,.65,1.2,11.5,2,{height:0});}
  if(i===1){const leaf=p('lily');wave(a,3);turn(b,4,-.8);object(leaf,{x:.8,z:1.05},6,5);tl.to(a.root.position,{x:.8,y:.1,z:1.25,duration:5,ease:'sine.inOut'},6);tl.to(a.root.position,{x:1.3,y:0,z:1.5,duration:2},12);}
  if(i===2){meet();give(p('beans'),b,a,4);bend(a,10,3,.55);bend(b,11,2,.35);}
  if(i===3){rest(b,0);go(a,-.15,.25,2,3);bend(a,5,4,.45);upright(b,9);flap(b,10,2);turn(a,12,.4);wave(a,13);}
  if(i===4){const bird=b;go(a,-.3,1,1.5,2);go(bird,.2,1,1.5,2);if(bird){a.legs.forEach(leg=>tl.to(leg.rotation,{x:-1.2,duration:.6},3.8));a.legs.forEach(leg=>tl.to(leg.rotation,{x:0,duration:.6},13.1));tl.to(a.root.position,{x:.2,y:.4,z:.85,duration:.6},3.8);tl.to(bird.root.position,{x:-1,y:1.1,z:.55,duration:2.6},4.4);tl.to(a.root.position,{x:-1,y:1.5,z:.4,duration:2.6},4.4);tl.to(bird.root.position,{x:1,y:1.35,z:.5,duration:3},7);tl.to(a.root.position,{x:1,y:1.75,z:.35,duration:3},7);flap(bird,4,8);tl.to(bird.root.position,{x:.55,y:0,z:1.1,duration:2.5},10.5);tl.to(a.root.position,{x:.55,y:.4,z:.95,duration:2.5},10.5);tl.to(a.root.position,{x:-.1,y:0,z:1.3,duration:.8},13.1);}}
  if(i===5){go(a,-.8,1.1);bend(a,4,2,.4);go(a,.2,1.3,6,3);wave(b,7);wave(a,10);if(b){tl.to(b.root.position,{x:1.15,y:.9,z:.6,duration:3},11);flap(b,11,3);}}
  return true;
 }
 if(id==='lion-and-mouse'){
  const lion=find('lion'),mouse=find('mouse');
  if(i===0){tl.set(lion.root.position,{x:-.85,z:.85},0);rest(lion,0);go(mouse,.25,1.1,2,3);hop(tl,mouse,5,.15);upright(lion,6.5);wave(lion,7.5);go(mouse,.95,1.5,8,1.5,{run:true});turn(lion,11,.65);}
  if(i===1){go(lion,-.6,1);go(mouse,-.05,1.3,2,2.5);if(lion.arms[1])tl.to(lion.arms[1].rotation,{z:-1.1,duration:.6},4);bend(mouse,5,3,.45);bend(lion,8,1,.3);if(lion.arms[1])tl.to(lion.arms[1].rotation,{z:-.22,duration:.6},9);go(lion,-1.15,.8,10,2);wave(mouse,12);}
  if(i===2){go(lion,-1.1,.85);go(mouse,.1,1.2,2,3);wave(mouse,6);go(mouse,1.6,1.4,8,3);rest(lion,10);}
  if(i===3){if(e.net)tl.to(e.net.position,{y:0,duration:1.3},2);tl.to(lion.root.rotation,{z:.13,duration:.18,repeat:9,yoyo:true},4.5);wave(lion,7);go(mouse,.35,1.35,8,3);bend(mouse,12,1,.5);}
  if(i===4){go(mouse,.45,1.35,1.5,2.5);bend(mouse,4,6,.6);if(e.net)tl.to(e.net.scale,{y:.025,duration:3},7);go(lion,-1.1,.65,10,2.5);go(mouse,.4,1.15,11,2.5);wave(lion,13);}
  if(i===5){go(lion,-.4,1.05);go(mouse,.05,1.35,3,3);bend(lion,6,2,.65);wave(mouse,8);go(lion,.75,1.15,10,3);go(mouse,.05,1.4,10,3);}
  return true;
 }
 return false;
}
