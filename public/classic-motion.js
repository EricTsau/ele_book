// Plot-specific sets and finite timelines for the ten public-domain additions.
// All coordinates are in the popup's space. Detached gifts never remain parented
// to a moving actor, and every magic/outcome transition has a measurable object.
const IDS=new Set(['north-wind-and-sun','thirsty-crow','fox-and-grapes','town-and-country-mice','ant-and-dove','bremen-musicians','sweet-porridge','star-money','emperors-new-clothes','princess-and-pea']);
export function addClassicDetails(s,c,H){
 if(!IDS.has(c.storyId))return s;
 const {THREE,box,ball,mesh}=H,e=s.effects,A=s.pigs,i=c.storyIndex,id=c.storyId;
 const P=k=>s.props.children.find(p=>p.userData.prop===k);
 const hide=k=>{const p=P(k);if(p)p.visible=false;return p;};
 const group=(name,parent=s.props)=>{const g=new THREE.Group();g.userData.prop=name;parent.add(g);return g;};
 const D=e.classic={id,index:i,actors:A,anchors:{}};
 const set=(actor,x,y,z,face=0)=>{if(actor){actor.root.position.set(x,y,z);actor.root.rotation.set(0,face,0);}};
 const bread=(name,x,y,z)=>{const g=group(name);g.position.set(x,y,z);ball(.17,.08,.12,'#caa472',g);return g;};
 const cloth=(name,color,x,y,z)=>{const g=group(name);g.position.set(x,y,z);box(.38,.32,.045,color,g,0,.12,0);return g;};
 const table=(x=0,z=.35)=>{const g=group('classic-table');g.position.set(x,0,z);box(1.8,.08,.9,'#a98b65',g,0,.8,0);for(const X of [-.7,.7])for(const Z of [-.3,.3])box(.07,.8,.07,'#987a54',g,X,.4,Z);return g;};
 if(id==='north-wind-and-sun'){
  if(e.coat)e.coat.visible=false;
  D.coat=group('traveller-coat');box(.51,.65,.33,'#875e43',D.coat,0,.51,0);D.coat.position.set(-1,0,1.2);
  set(A[0],-1,0,1.2);if(i===5){D.coat.position.set(-.9,.65,-.21);D.coat.rotation.x=Math.PI/2;D.coat.scale.z=.18;}
  const rock=group('resting-rock');rock.position.set(-.9,0,.3);ball(.6,.32,.4,'#b2b1a4',rock,0,.28,0);D.rock=rock;
  D.sun=P('sun');D.wind=P('wind');if(D.sun&&i===3)D.sun.scale.setScalar(.7);
 }
 if(id==='thirsty-crow'){
  A[0].root.rotation.order='YXZ'; // Pitch toward the beak even while standing side-on.
  if(e.carriedStone)e.carriedStone.visible=false;
  D.jar=P('jar');D.jar.position.set(0,0,.55);D.water=e.water;D.water.position.y=i===4?.61:i===5?.87:.28;
  // Replace scatter inside the jar prop with a reachable, explicit stone pile.
  D.jar.children.filter(p=>p.geometry?.type==='SphereGeometry').forEach(p=>p.visible=false);hide('stones');
  D.stones=Array.from({length:3},(_,j)=>{const g=group(`loose-stone-${j}`);g.position.set(.88+j*.13,.08,1.06);ball(.07,.045,.065,'#bbb9a7',g);return g;});
  D.beakAnchor=new THREE.Object3D();D.beakAnchor.position.set(0,.596,.419);A[0].root.add(D.beakAnchor);
  D.anchors.drop={x:0,y:1.03,z:.55};D.anchors.jarFloor=.13;D.anchors.waterStart=D.water.position.y;
  set(A[0],-.9,0,1.35);D.perch=group('jar-perch');D.perch.position.set(.419,0,.55);ball(.3,.19,.21,'#c6c2ae',D.perch,0,.16,0);
 }
 if(id==='fox-and-grapes'){
  D.grapes=P('grapes');D.grapes.position.set(0,0,.3);D.fruit=[];
  for(const p of D.grapes.children){if(p.geometry?.type==='SphereGeometry'){if(p.position.y<2){p.position.y+=1.2;D.fruit.push(p);}else p.position.y=3.04;}else if(p.geometry?.type==='BoxGeometry'){if(p.position.y<1.5){p.scale.y*=1.5;p.position.y=1.5;}else p.position.y=3;}}
  D.mouth=A[0].mouth;D.anchors.jumpHeight=.55;D.anchors.grapeBottom=2.04;set(A[0],-1.1,0,1.25);
 }
 if(id==='town-and-country-mice'){
  hide('grain');hide('basket');hide('chair');D.table=table();D.food=[bread('bread-crumb',-.4,.9,.35),bread('country-grain',.35,.9,.35)];
  if(i===2||i===3){D.food[1].clear();const wedge=new THREE.Shape();wedge.moveTo(-.17,0);wedge.lineTo(.17,0);wedge.lineTo(-.17,.18);wedge.closePath();mesh(new THREE.ExtrudeGeometry(wedge,{depth:.18,bevelEnabled:false}),'#e2c16f',D.food[1],0,0,-.09);}
  else D.food.forEach(food=>{food.clear();for(let j=0;j<4;j++)ball(.045,.024,.028,'#d8c38d',food,(j%2)*.075-.04,.025,Math.floor(j/2)*.07-.03);});
  const mice=A.filter(a=>a.type==='mouse');mice.forEach(a=>a.root.scale.setScalar(.45));D.mice=mice;
  if(i===2||i===3){mice.forEach((a,j)=>set(a,-.4+j*.8,.85,.55));D.hole=group('mouse-door');D.hole.position.set(-1.45,0,1.05);box(1.15,.75,.04,'#777665',D.hole,0,.38,0);box(.78,.58,.045,'#3f4c40',D.hole,0,.3,.03);D.anchors.hole={x:-1.45,z:1.17};const cat=A.find(a=>a.type==='cat');set(cat,1.5,0,1.2,-Math.PI/2);}
  else{D.table.scale.set(.8,.27,.8);D.food.forEach(o=>o.position.y=.28);mice.forEach((a,j)=>set(a,-.6+j*1.2,0,1.1));}
 }
 if(id==='ant-and-dove'){
  D.ant=A.find(a=>a.type==='ant');D.ant.root.scale.setScalar(.3);D.bird=A.find(a=>a.type==='dove');D.hunter=A.find(a=>a.type==='ranger');
  set(D.ant,-1.15,0,1.35);set(D.bird,.95,1.3,.3,-.4);set(D.hunter,1.15,0,1.35,-.5);
  if(D.bird){const perch=group('dove-branch');box(.1,1.45,.1,'#9b8563',perch,1.35,.72,.2);box(.6,.08,.14,'#9b8563',perch,1.08,1.25,.3);ball(.35,.17,.18,'#9db283',perch,1.45,1.48,.2);}
  D.leaf=P('lily');if(D.leaf){D.leaf.children[0].position.set(0,.082,0);D.leaf.position.set(-.6,0,.45);}
  if(i===1){set(D.ant,-.55,.04,.5);D.leaf.position.set(.75,1.35,.3);}
  if(i===2){D.leaf.position.set(-.6,0,.45);set(D.ant,-.6,.09,.45);}
  hide('net');
  if(D.hunter){const net=group('bird-catching-net',D.hunter.arms[1]);net.position.set(.03,-.08,.12);box(.035,.65,.035,'#a68c67',net,0,.2,0);mesh(new THREE.TorusGeometry(.26,.022,6,24),'#b4a17c',net,0,.76,0);for(const off of [-.12,0,.12]){box(.43,.012,.015,'#c4b58d',net,0,.76+off,0);box(.012,.43,.015,'#c4b58d',net,off,.76,0);}D.huntingNet=net;}
  D.anchors.shoreZ=1.45;D.anchors.leafHeight=.09;
 }
 if(id==='bremen-musicians'){
  hide('cottage');D.room=group('musicians-room');box(2.5,.05,1.15,'#c6b89a',D.room,0,.035,-.5);box(2.5,1.65,.04,'#d3c4ab',D.room,0,.85,-1.05);box(.9,.73,.045,'#736c61',D.room,.25,1.0,-1.01);for(const x of [-.23,.73])box(.05,.81,.06,'#a7875e',D.room,x,1,-.97);
  D.thieves=[];if(i===2||i===3||i===4)for(let j=0;j<(i===4?1:2);j++){const g=group(`thief-${j}`);g.position.set(-.35+j*.8,0,-.5);box(.28,.52,.19,'#756b72',g,0,.45,0);ball(.17,.19,.17,'#bda58c',g,0,.86,0);D.thieves.push(g);}
  if(i===3){D.stackY=[0,1.2,2.15,3.11];A.forEach((a,j)=>{a.root.scale.setScalar(j===3?.6:.67);set(a,-1.35+j*.85,0,1.35);});}
  if(i===4)A.forEach((a,j)=>set(a,-1.15+j*.76,0,.9));
  if(i<2)D.room.visible=false;
  D.drum=P('drum');
 }
 if(id==='sweet-porridge'){
  D.pot=P('pot');D.pot.position.set(0,0,.35);D.water=e.water;D.water.position.y=i===4?.73:.29;D.water.scale.x=D.water.scale.z=i===4?1:.6;
  D.spill=e.spill;D.spill.position.set(0,.045,.35);D.spill.scale.setScalar(i===4?1:i===5?1.25:.001);D.anchors.rim=.72;
  if(i===5){hide('books');const reminder=group('spell-card');reminder.position.set(.8,.45,.5);box(.45,.5,.025,'#eee3bf',reminder,0,.25,0);for(const y of [.17,.33])box(.32,.027,.03,'#837c65',reminder,0,y,.018);D.cleanSurface=D.spill.children[0];D.cleanSurface.material=D.cleanSurface.material.clone();D.cleanSurface.material.transparent=true;for(const actor of A){const rag=group('cleaning-cloth',actor.arms[0]);box(.23,.035,.19,'#b6c8c0',rag,0,-.28,.04);}}
  D.bowls=[];const old=P('porridge');if(old)old.visible=false;
  for(let j=0;j<2;j++){const g=group(`serving-bowl-${j}`);g.position.set(-.9+j*1.8,.04,1.15);mesh(new THREE.CylinderGeometry(.23,.16,.12,20),'#bda180',g,0,.1,0);const filling=mesh(new THREE.CylinderGeometry(.2,.2,.012,20),'#e4d5b1',g,0,.12,0);filling.scale.setScalar(i===5?1:.001);D.bowls.push(filling);}
  A.forEach((a,j)=>set(a,-.75+j*1.5,0,1.15));
 }
 if(id==='star-money'){
  hide('basket');hide('coins');if(e.fallingCoins)e.fallingCoins.visible=false;
  D.bread=bread('gift-bread',-.55,.69,1.35);D.hat=group('gift-hat');D.hat.position.set(-.55,1.28,1.25);mesh(new THREE.CylinderGeometry(.26,.3,.08,20),'#86a2bd',D.hat);D.shawl=cloth('gift-shawl','#8ea7bb',-.55,.67,1.3);
  D.bread.visible=i<=1||i===5;D.hat.visible=i===2;D.shawl.visible=i===2||i===3;A.forEach((a,j)=>set(a,-.55+j*1.15,0,1.2));
  D.newCoat=group('star-coat',A[0].root);box(.48,.5,.34,'#d4e1ed',D.newCoat,0,.48,0);D.newCoat.scale.setScalar(i===5?1:.001);
  D.coins=[];if(i===4)for(let j=0;j<9;j++){const g=group(`silver-star-${j}`);g.position.set(Math.sin(j*2.3)*1.15,2.2+(j%3)*.22,.55+Math.cos(j*2.3)*.45);const coin=mesh(new THREE.CylinderGeometry(.075,.075,.02,16),'#d2dce1',g);coin.rotation.x=Math.PI/2;D.coins.push(g);}
  D.purse=group('safe-purse');D.purse.position.set(-.2,.07,1.15);ball(.22,.18,.16,'#a08973',D.purse);D.purse.visible=i>=4;
 }
 if(id==='emperors-new-clothes'){
  D.king=A.find(a=>a.type==='king');D.weaver=A.find(a=>a.name==='騙子');D.minister=A.find(a=>a.name==='大臣');D.child=A.find(a=>a.name==='小孩');D.loom=P('loom');if(D.loom)D.loom.position.set(-.8,0,.05);
  if(D.minister)D.minister.root.children.filter(o=>o.position.y>1.15&&['CylinderGeometry','ConeGeometry'].includes(o.geometry?.type)).forEach(o=>o.visible=false);
  set(D.weaver,-.8,0,.85,i===0?1.2:Math.PI);set(D.king,.6,0,1.25,-.65);set(D.minister,.9,0,1.45,-.65);set(D.child,-1,0,1.5,.65);
  if(i>=3&&D.king){const shorts=group('royal-underclothes',D.king.root);box(.39,.22,.3,'#f2e9d6',shorts,0,.24,0);}
 }
 if(id==='princess-and-pea'){
  hide('mattresses');hide('beans');D.bed=group('pea-bed');D.bed.position.set(0,0,.5);box(1.8,.2,1.08,'#a78b6b',D.bed,0,.12,0);
  D.pea=ball(.05,.05,.05,'#84975b',D.bed,0,.265,0);D.layers=[];for(let j=0;j<40;j++){const layer=box(1.65,.021,1.0,j<20?(j%2?'#c7adbb':'#aebfac'):(j%2?'#e4d5b6':'#e8decf'),D.bed,0,.28+j*.0215,0);D.layers.push(layer);}
  D.pillow=box(.43,.09,.72,'#f3e9d8',D.bed,-.5,1.16,0);D.anchors.bedTop=1.14;D.princess=A.find(a=>a.name==='公主');D.queen=A.find(a=>a.name==='王后');
  if(i===0||i===1||i===5)D.bed.visible=false;
  if(i===3){set(D.princess,.55,1.44,.5);D.princess.root.rotation.z=Math.PI/2;}
  if(i===4)set(A.find(a=>a.type==='prince'),1.65,0,1.65,-.4);
  if(i===2){D.layers.forEach(l=>l.scale.setScalar(.001));D.pillow.scale.setScalar(.001);}
  if(i===5){D.display=group('pea-display');D.display.position.set(0,0,.5);box(.6,.62,.5,'#b69b75',D.display,0,.31,0);ball(.06,.06,.06,'#8b9e69',D.display,0,.69,0);}
 }
 return s;
}

export function classicEvent(tl,s,c,M){
 const D=s.effects.classic;if(!D||!IDS.has(c.storyId))return false;
 const A=s.pigs,a=A[0],b=A[1],i=c.storyIndex,id=c.storyId,e=s.effects;
 const prop=k=>s.props.children.find(p=>p.userData.prop===k);
 const go=(actor,x,z,at=1.4,duration=2.3,face=0,height=0)=>{if(actor)M.walk(tl,actor,x,z,at,duration,{face,height});};
 const move=(obj,vars,at,duration=1)=>{if(obj)tl.to(obj.position,{...vars,duration,ease:'sine.inOut'},at);};
 const face=(actor,y,at=4)=>{if(actor)tl.to(actor.root.rotation,{y,duration:.35},at);};
 const lean=(actor,at=4,repeat=1,bend=.22)=>{if(actor)M.reach(tl,actor,at,{repeat,bend});};
 const signal=(actor,at=4)=>{if(actor)for(const [j,arm]of actor.arms.entries())tl.to(arm.rotation,{x:-.9,z:j?-.4:.4,duration:.35,repeat:3,yoyo:true},at);};
 const flight=(bird,to,at,duration)=>{if(!bird)return;move(bird.root,to,at,duration);for(const [j,w]of bird.arms.entries())tl.to(w.rotation,{z:j?-.85:.85,duration:.25,repeat:Math.max(1,Math.round(duration/.25)-1),yoyo:true},at);};
 const toss=(obj,to,at,duration=1.5)=>move(obj,to,at,duration);
 const lookUp=(actor,at=4)=>{if(actor)tl.to(actor.head.rotation,{x:-.18,duration:.5,repeat:1,yoyo:true},at);};
 if(id==='north-wind-and-sun'){
  const coat=D.coat;
  if(i===0){go(a,.5,1.2,1.4,5);move(coat,{x:.5,z:1.2},1.4,5);signal(a,9);}
  if(i===1||i===2){go(a,-.15,1.2,1.4,3);move(coat,{x:-.15,z:1.2},1.4,3);for(const arm of a.arms)tl.to(arm.rotation,{x:-.8,z:0,duration:.5},4.8);tl.to(a.root.rotation,{z:-.13,duration:.3,repeat:9,yoyo:true},5);tl.to(coat.rotation,{z:-.13,duration:.3,repeat:9,yoyo:true},5);if(D.wind)tl.to(D.wind.position,{x:1.1,duration:1.2,repeat:5,yoyo:true},2);if(i===2){go(a,-1.45,.85,9,3);move(coat,{x:-1.45,z:.85},9,3);}}
  if(i===3){if(D.sun)tl.to(D.sun.scale,{x:1,y:1,z:1,duration:4},2);go(a,.65,1.25,4,5);move(coat,{x:.65,z:1.25},4,5);signal(a,10);/* Coat remains on: only the collar is loosened this chapter. */}
  if(i===4){go(a,-.7,.9,1.4,3);move(coat,{x:-.7,z:.9},1.4,3);lean(a,5,1,.1);move(coat,{x:-.9,y:.65,z:-.21},6.3,1.7);tl.to(coat.rotation,{x:Math.PI/2,duration:1.7},6.3);tl.to(coat.scale,{z:.18,duration:1.7},6.3);go(a,.65,1.35,10,3);}
  if(i===5){lean(a,1.4,1,.3);move(coat,{x:-1,y:.1,z:.94},2.3,.8);tl.to(coat.scale,{x:.45,y:.45,z:.45,duration:.8},2.3);go(a,.75,1.3,4,5);move(coat,{x:.75,y:.1,z:1.04},4,5);signal(a,10);if(D.wind)tl.to(D.wind.position,{x:.35,duration:2,repeat:3,yoyo:true},3);}
 }
 if(id==='thirsty-crow'){
  if(i===0){flight(a,{x:.75,y:1,z:1.3},1.4,4);face(a,Math.PI,5.5);face(a,-Math.PI/2,6);flight(a,{x:.419,y:.4,z:.55},6.3,3);lookUp(a,10);}
  if(i===1){go(a,.419,.55,1.5,2.5,-Math.PI/2,.4);lean(a,4.5,1,.18);go(a,.55,1.2,7,2,Math.PI/2,0);face(a,-.7,10);}
  if(i===2){go(a,-.55,.65,1.4,2.5,Math.PI/2);lean(a,4.4,2,.3);/* The heavy jar deliberately does not move. */go(a,.85,1.35,7,2.5,Math.PI);lean(a,10,1,.35);}
  if(i===3||i===4){const start=i===3?.28:.61,step=i===3?.11:.085;
   for(let j=0;j<3;j++){const t=1.4+j*3.6,stone=D.stones[j];go(a,.9,1.46,t,.65,Math.PI,0);move(stone,{x:.9,y:.62,z:1.04},t+.7,.45);face(a,-Math.PI/2,t+1.2);flight(a,{x:.419,y:.43,z:.55},t+1.2,.8);move(stone,{x:0,y:1.03,z:.55},t+1.2,.8);move(stone,{x:0,y:.14+j*.055,z:.55},t+2.12,.55);tl.to(D.water.position,{y:start+step*(j+1),duration:.55},t+2.65);}
   if(i===4){move(a.root,{y:.335},12.2,.6);lean(a,13.3,1,.13);}
  }
  if(i===5){go(a,.419,.55,1.4,3,-Math.PI/2,.35);lean(a,5,3,.16);flight(a,{x:1.1,y:.65,z:1.3},10,3);face(a,0,13.2);}
 }
 if(id==='fox-and-grapes'){
  if(i===0){go(a,0,.8,1.4,3,Math.PI);lookUp(a,5);signal(a,8);}
  if(i===1||i===2){go(a,0,.8,1.4,2.6,Math.PI);for(const at of [5,9]){if(i===2){go(a,-.6,1.1,at-1,.7,Math.PI);go(a,0,.8,at-.2,.6,Math.PI);}tl.to(a.root.position,{y:D.anchors.jumpHeight,duration:.4,repeat:1,yoyo:true,ease:'power1.out'},at+.5);}lean(a,12,1,.4);}
  if(i===3){go(a,-1.2,1.25,1.4,3);tl.to(a.root.position,{y:-.06,duration:1},4.6);lean(a,6,2,.25);face(a,Math.PI-.5,10);}
  if(i===4){go(a,.65,1.25,1.4,3);face(a,Math.PI-.5,6);face(a,.4,8);go(a,1.6,1.35,10,3,.5);}
  if(i===5){go(a,.65,1.15,1.4,3);face(a,Math.PI-.4,5);lean(a,7,1,.12);go(a,1.7,1.35,10,3,.5);}
 }
 if(id==='town-and-country-mice'){
  const [m,n]=D.mice;
  if(i===0){go(m,-.45,.95,1.5,2);go(n,.45,.95,2,2);lean(m,5,2,.3);toss(D.food[0],{x:.35,y:.28,z:.6},6);lean(n,8,2,.35);}
  if(i===1){go(n,1.1,1.25,2,5,.3);go(m,.3,1.25,2.5,5,.3);face(m,-.5,10);}
  if(i===2){lean(m,2,2,.45);lean(n,5,2,.45);signal(n,8);face(m,Math.PI/2,10);face(n,Math.PI/2,10);}
  if(i===3){const cat=A.find(x=>x.type==='cat');for(const [j,mouse]of D.mice.entries()){move(mouse.root,{x:-1.65+j*.42,y:0,z:1.18},2+j*.15,1.4);face(mouse,Math.PI/2,3.6);tl.to(mouse.root.scale,{x:.38,y:.38,z:.38,duration:.4},3.6);}go(cat,.3,1.25,4.5,3,-Math.PI/2);face(cat,.7,9);go(cat,1.7,1.2,10,3,.8);}
  if(i===4){face(m,.7,2);face(n,-.7,3);lean(m,5,1,.25);signal(n,7);go(m,-1.45,1.35,9,3,-.6);go(n,-.7,1.35,9.5,3,-.6);}
  if(i===5){go(m,0,1,1.5,3,Math.PI);lean(m,5,3,.4);face(m,0,10);signal(m,12);}
 }
 if(id==='ant-and-dove'){
  const ant=D.ant,bird=D.bird;
  if(i===0){go(ant,-.65,1.1,1.5,2,Math.PI);move(ant.root,{x:-.55,y:.035,z:.45},4,1);tl.to(ant.root.rotation,{z:.28,duration:.25,repeat:11,yoyo:true},5);move(ant.root,{x:.55,z:.45},5,6);}
  if(i===1){flight(bird,{x:.5,y:1.35,z:.45},1.4,2);move(D.leaf,{x:-.55,y:0,z:.5},3.6,2);move(ant.root,{x:-.55,y:.09,z:.5},6.1,.8);flight(bird,{x:1.05,y:1.1,z:.35},8,3);}
  if(i===2){for(const o of [D.leaf,ant.root])move(o,{x:.55,z:1.08},2,5);go(ant,.9,1.5,8,3,0,0);flight(bird,{x:.1,y:0,z:1.55},10,3);}
  if(i===3){go(D.hunter,.6,1.35,2,4,-.4);go(ant,.15,1.4,4,3,.7);face(ant,.8,8);signal(D.hunter,10);}
  if(i===4){go(ant,.98,1.35,1.5,3,.8);lean(ant,4.7,1,.3);tl.to(D.hunter.root.rotation,{z:.16,duration:.25,repeat:1,yoyo:true},5.4);face(D.hunter,-.7,6);flight(bird,{x:-1.4,y:2,z:.15},6,4);go(ant,.2,1.65,7,3,-.5);go(D.hunter,1.75,1.35,11,2,.8);}
  if(i===5){flight(bird,{x:.1,y:0,z:1.2},1.5,3);go(ant,-.15,1.55,2,3,.2);lean(bird,6,2,.35);signal(ant,9);}
 }
 if(id==='bremen-musicians'){
  if(i===0){go(a,-.45,1.2,1.5,3,.5);lean(b,4,2,.4);signal(a,6);go(a,.65,1.25,9,3,.3);go(b,-.1,1.3,9.4,3,.3);}
  if(i===1){A.forEach((x,j)=>{go(x,-1.3+j*.85,1.3,1.5+j*.1,2.5);signal(x,4.5+j*1.1);});A.forEach((x,j)=>go(x,-.95+j*.7,1.5,10+j*.1,3));}
  if(i===2){const rooster=A.find(x=>x.type==='rooster');flight(rooster,{x:1.3,y:1.15,z:.45},1.5,3);signal(rooster,5);A.filter(x=>x!==rooster).forEach((x,j)=>go(x,-1.3+j*.75,1.2,6+j*.2,3,Math.PI));lean(a,10,1,.2);}
  if(i===3){A.forEach((x,j)=>{go(x,.1,.65,1.4+j*.3,1.7);move(x.root,{x:.1,y:D.stackY[j],z:.65},4.2+j*.6,1);signal(x,8+j*.12);});D.thieves.forEach((o,j)=>move(o,{x:2.7+j*.3,z:-.3},9.3+j*.2,1.3));A.forEach((x,j)=>move(x.root,{x:-1.1+j*.75,y:0,z:-.42},12+j*.2,1.5));}
  if(i===4){A.forEach((x,j)=>tl.to(x.root.rotation,{z:-.45,duration:.6},1.5+j*.15));D.thieves.forEach(o=>move(o,{x:.3,z:.6},2.5,3));A.forEach((x,j)=>{tl.to(x.root.rotation,{z:0,duration:.35},6+j*.25);signal(x,6.6+j*.4);});D.thieves.forEach(o=>move(o,{x:2.8,z:1},9,1.5));}
  if(i===5){A.forEach((x,j)=>{go(x,-1.25+j*.8,1.1,1.5+j*.2,2.5);lean(x,4.8+j*.8,2,.35);signal(x,10+j*.4);});}
 }
 if(id==='sweet-porridge'){
  if(i===0){go(a,-.65,1.15,1.4,2);lean(b,4,1,.2);toss(D.pot,{x:-.25,z:.6},5,2);lean(a,8,1,.2);}
  if(i===1){signal(b,2);tl.to(D.water.scale,{x:1,z:1,duration:3},3);tl.to(D.water.position,{y:.7,duration:3},3);signal(a,7);/* Stop: water holds below the rim for the rest of the chapter. */}
  if(i===2){signal(a,2);tl.to(D.water.scale,{x:1,z:1,duration:2},3);tl.to(D.water.position,{y:.7,duration:2},3);D.bowls.forEach((o,j)=>tl.to(o.scale,{x:1,y:1,z:1,duration:.8},5+j));signal(a,7.5);lean(b,10,2,.3);}
  if(i===3){signal(a,2);tl.to(D.water.scale,{x:1,z:1,duration:3},3);tl.to(D.water.position,{y:.74,duration:3},3);tl.to(D.spill.scale,{x:1,y:1,z:1,duration:5,ease:'none'},5);go(a,-1.65,1.7,8,3);signal(a,12);}
  if(i===4){go(a,-.7,1.05,1.4,3);tl.to(D.spill.scale,{x:1.25,y:1,z:1.25,duration:3.5,ease:'none'},1.5);signal(a,5.5);/* The spell stops new porridge; existing spill stays until cleaned next chapter. */go(b,1.55,1.7,2,3);}
  if(i===5){lean(a,2,3,.45);lean(b,3,3,.45);tl.to(D.cleanSurface.material,{opacity:0,duration:5},2);signal(a,8);signal(b,10);}
 }
 if(id==='star-money'){
  if(i===0){go(a,-.55,1.2,1.5,2);face(a,.5,4);face(b,-.5,5);lean(b,7,1,.3);}
  if(i===1){signal(a,2);move(D.bread,{x:.55,y:.65,z:1.52},4,2);lean(b,6.4,2,.3);go(a,-1.35,1.35,10,3,-.4);}
  if(i===2){move(D.hat,{x:.6,y:1.3,z:1.2},3,2);move(D.shawl,{x:.6,y:.55,z:1.35},6,2);lean(b,9,1,.18);signal(a,11);}
  if(i===3){move(D.shawl,{x:.6,y:.62,z:1.35},3,2);lean(b,6,1,.2);go(a,-1.15,1.35,8,3);lookUp(a,12);}
  if(i===4){lookUp(a,2);D.coins.forEach((coin,j)=>move(coin,{y:.09},3+j*.35,1.6));tl.to(D.newCoat.scale,{x:1,y:1,z:1,duration:1.5},6.5);lean(a,9,2,.5);D.coins.forEach((coin,j)=>move(coin,{x:-.2,y:.14,z:1.15},10+j*.2,1));signal(a,13);}
  if(i===5){go(a,-.2,1.35,1.5,3);lean(a,5,2,.3);move(D.bread,{x:-.2,y:.65,z:1.5},5,.8);face(a,0,9);signal(a,11);}
 }
 if(id==='emperors-new-clothes'){
  const {king,weaver,minister,child}=D;
  if(i===0){signal(weaver,2);face(king,-.7,4);signal(king,6);go(weaver,-.8,.85,9,2,Math.PI);}
  if(i===1){lean(weaver,2,5,.08);go(minister,.5,1.15,3,3,-.7);face(minister,Math.PI,7);lean(minister,8,1,.28);signal(minister,10);}
  if(i===2){lean(weaver,2,5,.08);go(king,.2,1.1,3,3,-.7);face(king,Math.PI,7);signal(king,9);signal(minister,11);}
  if(i===3){go(king,0,1.25,1.5,2);go(weaver,-.65,1.2,3.7,2,.7);signal(weaver,6);tl.to(king.root.rotation,{y:Math.PI*2,duration:3},7);go(minister,.75,1.45,7,2,-.6);lean(minister,10,2,.35);}
  if(i===4){go(king,-.35,1.1,1.5,3,.5);go(minister,-1.05,1.1,2,3,.5);lean(minister,5.5,2,.35);signal(child,7);face(king,-.6,8.8);go(king,1.15,1.1,10,3,.5);go(minister,.45,1.1,10.3,3,.5);for(const arm of minister.arms){tl.set(arm.rotation,{x:-.85},10.3);tl.to(arm.rotation,{x:-.85,duration:3},10.3);}}
  if(i===5){signal(child,2);face(king,-.7,4);go(king,1.35,1.2,6,5,.7);go(minister,.6,1.2,6.5,5,.7);for(const arm of minister.arms){tl.set(arm.rotation,{x:-.85},6.5);tl.to(arm.rotation,{x:-.85,duration:5},6.5);}lean(minister,12,1,.3);}
 }
 if(id==='princess-and-pea'){
  const princess=D.princess,queen=D.queen;
  if(i===0){go(a,-.35,1.2,1.5,3);lean(a,5,1,.3);face(b,.7,6);go(b,.5,1.9,6.2,.7);go(b,-.85,1.9,7,2,-.5);go(a,.7,1.4,9,3,.5);}
  if(i===1){go(princess,-.7,1.3,1.5,3);tl.to(princess.root.rotation,{z:.04,duration:.14,repeat:9,yoyo:true},4.7);signal(A.find(x=>x.type==='prince'),6);lean(queen,9,1,.15);}
  if(i===2){go(queen,-1.2,.9,1.4,2,Math.PI/2);lean(queen,3.8,1,.5);D.layers.forEach((o,j)=>{tl.set(o.scale,{x:1,y:1,z:1},4.7+j*.17);tl.fromTo(o.position,{y:2.2},{y:.28+j*.0215,duration:.25,immediateRender:false},4.7+j*.17);});tl.to(D.pillow.scale,{x:1,y:1,z:1,duration:.4},12);}
  if(i===3){/* Remain on the bed; rocking is around the lying body's long axis. */tl.to(princess.root.rotation,{x:.14,duration:1.1,repeat:7,yoyo:true},2);signal(princess,11);}
  if(i===4){go(princess,-1.25,1.35,1.5,2.5);go(queen,.95,1.35,1.5,2.5);signal(princess,4);move(D.pillow,{x:1.5,y:.2,z:0},5,1);D.layers.slice().reverse().forEach((o,j)=>move(o,{x:1.65,y:.12+j*.015,z:0},6+j*.16,.3));lean(queen,12.6,1,.25);}
  if(i===5){go(princess,-.65,1.3,1.5,3);go(A.find(x=>x.type==='prince'),.65,1.3,2,3);lean(princess,6,1,.12);signal(A.find(x=>x.type==='prince'),9);}
 }
 return true;
}
