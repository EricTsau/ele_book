import {originalEvent} from './original-motion.js';
import {legacyEvent} from './legacy-motion.js';
// Book-specific props and blocking, kept separate from reusable walk/gesture verbs.
export function addStoryDetails(s,c,H){
 const {THREE,box,ball,mesh}=H,e=s.effects,actor=s.pigs[0];
 const add=(name)=>{const g=new THREE.Group();g.userData.prop=name;s.props.add(g);return g;};
 if(c.storyId==='thirsty-crow'){
  const stone=new THREE.Group();stone.position.set(0,.58,.46);actor.root.add(stone);ball(.075,.06,.065,'#bcb9a6',stone);stone.scale.setScalar(.001);e.carriedStone=stone;
 }
 if(c.storyId==='north-wind-and-sun'){
  const coat=box(.5,.62,.075,'#a77a57',actor.root,0,.52,-.18);e.coat=coat;
 }
 if(c.storyId==='rain-post-office'){
  const letter=add('letter');letter.position.set(-.35,.05,.5);box(.31,.2,.025,'#f0e4c8',letter,0,.1,0);const seal=ball(.035,.035,.018,'#bd826e',letter,0,.11,.025);e.letter=letter;
 }
 if(c.storyId==='cloud-tailor-pockets'){
  const cloud=add('pocket-cloud');cloud.position.set(0,1.7,-.7);for(let i=0;i<4;i++)ball(.35,.25,.19,'#e8e5dd',cloud,-.5+i*.32,Math.sin(i)*.12,0);box(.39,.27,.07,'#b5a7c8',cloud,0,-.16,.18);e.pocketCloud=cloud;
  const rain=add('rain');rain.position.set(0,1.4,-.7);for(let i=0;i<13;i++)ball(.018,.06,.018,'#9cbac4',rain,Math.sin(i*2.2)*.62,-(i%4)*.24,.13);e.rain=rain;
 }
 if(c.storyId==='seed-library-notebook'&&c.storyIndex===3){
  const plant=add('seedling');plant.position.set(0,.65,-.75);box(.03,.4,.03,'#89a366',plant,0,.2,0);ball(.16,.03,.07,'#9aad6e',plant,-.1,.28,0);ball(.16,.03,.07,'#9aad6e',plant,.1,.36,0);e.plant=plant;
 }
 if(c.storyId==='bakery-under-the-stars'){
  const bread=add('bread');bread.position.set(-.55,.1,.45);for(let i=0;i<3;i++)ball(.17,.09,.11,'#d2af76',bread,(i-1)*.28,0,0);e.bread=bread;
 }
 if(c.storyId==='sweet-porridge'){
  const spill=add('porridge-spill');spill.position.set(0,.04,-.65);ball(1.5,.045,1.15,'#e6d5a5',spill);spill.scale.setScalar(.001);e.spill=spill;
 }
 if(c.storyId==='star-money'&&c.storyIndex===4){
  const falling=add('falling-coins');for(let i=0;i<12;i++){const coin=mesh(new THREE.CylinderGeometry(.055,.055,.018,12),'#d9be76',falling,Math.sin(i*2.4)*1.4,2+(i%4)*.25,Math.cos(i*2.4)*.6);coin.rotation.x=Math.PI/2;}e.fallingCoins=falling;
 }
 return s;
}
export function storyEvent(tl,s,c,M){
 const {walk,reach,hop,look}=M,actors=s.pigs,e=s.effects,first=actors[0],find=t=>actors.find(a=>a.type===t),prop=k=>s.props.children.find(p=>p.userData.prop===k);
 const id=c.storyId,i=c.storyIndex;
 if(legacyEvent(tl,s,c,M)||originalEvent(tl,s,c,M))return true;
 if(id==='thirsty-crow'&&c.action==='pour'){
  for(let n=0;n<3;n++){
   const at=1.5+n*4;
   walk(tl,first,.85,.35,at,.8);reach(tl,first,at+.85,{bend:.6});
   tl.to(e.carriedStone.scale,{x:1,y:1,z:1,duration:.1},at+1.2);
   walk(tl,first,0,-.1,at+1.65,.8);reach(tl,first,at+2.5,{bend:.6});
   tl.to(e.carriedStone.scale,{x:.001,y:.001,z:.001,duration:.1},at+2.85);
   tl.to(e.water.position,{y:.43+n*.17,duration:.5},at+2.85);
  }
  reach(tl,first,14,{bend:.65});return true;
 }
 if(id==='north-wind-and-sun'&&[1,2,3,4].includes(i)){
  walk(tl,first,.85,.35,1.5,3);const coat=e.coat;
  if(i<=2){for(const arm of first.arms)tl.to(arm.rotation,{x:-.8,z:0,duration:.5},4.5);tl.to(first.root.rotation,{z:-.18,duration:.35,repeat:11,yoyo:true},5);if(e.sway)tl.to(e.sway.position,{x:1.3,duration:1.4,repeat:5,yoyo:true},2);walk(tl,first,-.55,1.2,10,3);}
  else{walk(tl,first,-.75,.65,5,2.6);reach(tl,first,8,{bend:.12});tl.to(coat.position,{x:.45,y:.16,z:.3,duration:1.4},9);tl.to(coat.rotation,{z:1.2,duration:1.4},9);look(tl,first,11,.45);}
  return true;
 }
 if(id==='thirsty-crow'&&[1,2,5].includes(i)){
  walk(tl,first,0,-.05,1.5,2.5);reach(tl,first,4.2,{bend:.6,repeat:i===5?3:1});
  if(i===2){walk(tl,first,.85,.45,6.5,2);reach(tl,first,9,{bend:.55});tl.to(e.carriedStone.scale,{x:1,y:1,z:1,duration:.1},9.5);look(tl,first,11,-.7);}
  else {walk(tl,first,-.7,.5,8,2.5);look(tl,first,11,.5);}
  return true;
 }
 if(id==='fox-and-grapes'){
  walk(tl,first,0,.15,1.5,2.5);
  if(i===1||i===2){hop(tl,first,4.5,i===1?.55:.85);walk(tl,first,-.5,.4,6.5,1.3);hop(tl,first,8.5,.7);reach(tl,first,11,{bend:.4});}
  else if(i===3){reach(tl,first,4.5,{bend:.4});look(tl,first,7,-.8);walk(tl,first,-1.3,1.2,9,3);}
  else{look(tl,first,5,.5);walk(tl,first,1.4,1.2,8,4);}
  return true;
 }
 if(id==='town-and-country-mice'&&i===3){
  actors.filter(a=>a.type==='mouse').forEach((a,j)=>{walk(tl,a,-1.55+j*.5,1.5,2+j*.2,1.5,{run:true});walk(tl,a,-1.8+j*.5,-.35,5+j*.2,2,{run:true});});
  const cat=find('cat');walk(tl,cat,.1,.7,3.5,2,{run:true});look(tl,cat,7,-.8);walk(tl,cat,1.4,.5,10,3);return true;
 }
 if(id==='ant-and-dove'&&i===0){
  walk(tl,first,-.3,-.3,1.5,2.5);tl.to(first.root.position,{x:.6,z:-.15,duration:4},4);tl.to(first.root.rotation,{z:.35,duration:.3,repeat:11,yoyo:true},4);if(actors[1])look(tl,actors[1],8,-.7);return true;
 }
 if(id==='emperors-new-clothes'){
  const king=find('king'),weaver=actors.find(a=>a.name==='騙子'),minister=actors.find(a=>a.name==='大臣'),child=actors.find(a=>a.name==='小孩');
  if(i===0||i===1||i===2){walk(tl,weaver||first,-.7,.1,1.5,2.5);reach(tl,weaver||first,4,{repeat:5});walk(tl,king||minister,.6,.5,5,2.8,{face:-.6});look(tl,king||minister,8,-.6);reach(tl,king||minister,10,{bend:.1});}
  else{walk(tl,king,-1.1,.8,1.5,3);walk(tl,king,.9,.8,5.5,3.5);if(child){walk(tl,child,-.6,1.35,4,2.5);reach(tl,child,7,{bend:.08});}look(tl,king,9,-.7);reach(tl,king,11,{bend:.25});}
  return true;
 }
 if(id==='bremen-musicians'&&i===3){
  actors.forEach((a,j)=>{walk(tl,a,.1,0,1.4+j*.7,2);tl.to(a.root.position,{x:.1,y:j*.72,z:0,duration:1,ease:'power1.out'},4.6+j*.55);tl.to(a.root.rotation,{x:-.15,duration:.22,repeat:7,yoyo:true},8+j*.1);});
  actors.forEach((a,j)=>{tl.to(a.root.position,{x:(j-1.5)*.9,y:0,z:1.1,duration:1.7},12+j*.1);});return true;
 }
 if(id==='ant-and-dove'&&[1,2,4].includes(i)){
  const ant=find('ant'),bird=find('dove');
  if(i<3){const leaf=prop('lily');if(leaf){tl.fromTo(leaf.position,{x:1.2,z:-.9},{x:-.4,z:.7,duration:4,immediateRender:false},1.5);if(ant)tl.to(ant.root.position,{x:-.4,z:.8,y:.1,duration:2},4);tl.to(leaf.position,{x:.8,z:1.1,duration:4},7);if(ant)tl.to(ant.root.position,{x:.8,z:1.2,y:.1,duration:4},7);}
   if(bird){tl.to(bird.root.position,{x:.6,z:-.2,y:.8,duration:3},2);tl.to(bird.root.position,{y:0,duration:2},10);for(const [j,arm]of bird.arms.entries())tl.to(arm.rotation,{z:j?-.7:.7,duration:.3,repeat:19,yoyo:true},2);}}
  else{const hunter=find('ranger');walk(tl,ant,hunter?hunter.root.position.x:.9,.5,1.5,3);reach(tl,ant,4.7);hop(tl,hunter,6,.3);if(bird){tl.to(bird.root.position,{x:-1.4,y:1.7,z:-.8,duration:4},6);for(const [j,wing]of bird.arms.entries())tl.to(wing.rotation,{z:j?-.9:.9,duration:.25,repeat:23,yoyo:true},6);}}
  return true;
 }
 if(id==='sweet-porridge'&&i>=1&&i<=4){
  walk(tl,first,-.65,.05,1.5,2.5);reach(tl,first,4,{repeat:2});
  if(i===1||i===2)tl.to(e.water.position,{y:.8,duration:4},5);
  if(i===2||i===3){tl.to(e.spill.scale,{x:1,y:1,z:1,duration:6,ease:'none'},4);walk(tl,first,-1.3,1.7,8,2,{run:true});}
  if(i===4){tl.set(e.spill.scale,{x:1,y:1,z:1},1);reach(tl,first,6,{bend:.08});tl.to(e.spill.scale,{x:.6,y:.9,z:.6,duration:4},7);walk(tl,first,.8,.4,11,2);}
  return true;
 }
 if(id==='star-money'&&i===4){
  walk(tl,first,0,.4,1.5,3);for(const arm of first.arms)tl.to(arm.rotation,{x:-1.2,z:0,duration:.6},5);
  e.fallingCoins.children.forEach((coin,j)=>tl.to(coin.position,{y:.08,duration:2+(j%3)*.3,ease:'power1.in'},5+j*.24));reach(tl,first,11,{repeat:2});hop(tl,first,13);return true;
 }
 if(id==='princess-and-pea'&&i===2){
  walk(tl,first,-.8,.2,1.4,2.5);reach(tl,first,4,{repeat:5});const bed=prop('mattresses');if(bed)bed.children.slice(1,8).forEach((p,j)=>tl.from(p.position,{y:3.3,duration:.55,ease:'bounce.out',immediateRender:false},3.5+j*.85));return true;
 }
 if(id==='princess-and-pea'&&i===4){
  actors.forEach((a,j)=>walk(tl,a,(j-1)*.9,.4,1.5+j*.2,2.5));const bed=prop('mattresses');if(bed)bed.children.slice(1,8).reverse().forEach((p,j)=>tl.to(p.position,{x:1.7,y:.12+j*.11,duration:.6},4+j*.8));reach(tl,actors[1],5,{repeat:5});return true;
 }
 return false;
}
