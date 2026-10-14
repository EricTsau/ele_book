import * as THREE from 'three';
import {makeActor} from './fairytale3d.js';
import {arrangeSpread} from './stage-layout.js';
import {addInterior} from './interiors.js';

export const LEARNING_MODES=['plan','ask','practice','help','share','rest','listen','repair','notice','comfort'];
export const LEARNING_ITEMS=['blocks','basket','leaf','book','seed','clock','bread','lantern','ball','letter','cloth','bridge','cup','path'];

// Small tangible objects make a decision visible: handing, checking, joining,
// waiting and taking turns are actions, rather than text over a generic dance.
export function learningItem(kind,parent,H){
 const {THREE,box,ball,mesh}=H,g=new THREE.Group();g.userData.prop=`learning-${kind}`;parent.add(g);
 if(kind==='blocks'){
  for(let i=0;i<3;i++)box(.23,.2,.26,['#b98468','#8ca895','#d9bd79'][i],g,(i-1)*.25,.1,0);
 }else if(kind==='basket'){
  box(.58,.28,.36,'#be9c6e',g,0,.14,0);const handle=mesh(new THREE.TorusGeometry(.22,.025,6,16,Math.PI),'#a98b62',g,0,.3,0);handle.rotation.z=0;
 }else if(kind==='leaf'){
  const leaf=ball(.32,.035,.18,'#9caf7a',g,0,.04,0);leaf.rotation.y=.28;box(.48,.012,.012,'#6f8c58',g,0,.075,0);
 }else if(kind==='book'){
  box(.6,.06,.42,'#839e99',g,0,.03,0);for(const side of [-1,1]){const page=box(.275,.035,.37,'#eee4cc',g,side*.145,.071,0);page.rotation.z=-side*.08;}
 }else if(kind==='seed'){
  mesh(new THREE.CylinderGeometry(.23,.17,.3,16),'#b98b6d',g,0,.15,0);mesh(new THREE.CylinderGeometry(.205,.205,.015,16),'#74624d',g,0,.303,0);box(.02,.24,.02,'#78915f',g,0,.43,0);for(const side of [-1,1]){const leaf=ball(.13,.025,.065,'#91aa70',g,side*.1,.45,0);leaf.rotation.z=side*.35;}
 }else if(kind==='clock'){
  const face=mesh(new THREE.CylinderGeometry(.31,.31,.07,24),'#e6d4a8',g,0,.34,0);face.rotation.x=Math.PI/2;box(.025,.21,.025,'#6c7d65',g,0,.41,.055);box(.17,.024,.024,'#6c7d65',g,.075,.34,.06);
 }else if(kind==='bread'){
  ball(.31,.16,.2,'#c89759',g,0,.16,0);for(const x of [-.12,0,.12])box(.025,.014,.24,'#edd3a0',g,x,.296,0);
 }else if(kind==='lantern'){
  box(.4,.045,.34,'#aa885e',g,0,.035,0);box(.4,.045,.34,'#aa885e',g,0,.61,0);for(const x of [-.18,.18])for(const z of [-.14,.14])box(.03,.57,.03,'#aa885e',g,x,.325,z);ball(.11,.18,.09,'#edca73',g,0,.28,0);
 }else if(kind==='ball')ball(.24,.24,.24,'#c2ac81',g,0,.24,0);
 else if(kind==='letter'){
  box(.52,.025,.35,'#eee5ce',g,0,.025,0);for(const side of [-1,1]){const seam=box(.29,.006,.012,'#b6a789',g,side*.12,.04,.01);seam.rotation.y=-side*.5;}box(.07,.008,.07,'#c08c73',g,.17,.045,-.09);
 }else if(kind==='cloth'){
  box(.63,.025,.42,'#b1a7bc',g,0,.025,0);for(const x of [-.22,.22])box(.015,.005,.38,'#e2d5cb',g,x,.04,0);
 }else if(kind==='bridge'){
  for(let i=0;i<5;i++)box(.19,.05,.46,'#bd9e72',g,(i-2)*.2,.12,0);for(const z of [-.25,.25])box(1.05,.05,.04,'#947b5b',g,0,.08,z);
 }else if(kind==='cup'){
  mesh(new THREE.CylinderGeometry(.19,.14,.3,16),'#a0b6ac',g,0,.15,0);const handle=mesh(new THREE.TorusGeometry(.11,.027,6,12),'#a0b6ac',g,.2,.17,0);handle.rotation.y=Math.PI/2;
 }else if(kind==='path'){
  for(let i=0;i<3;i++)box(.22,.02,.28,'#bcaa7c',g,(i-1)*.27,.02,0);
 }
 return g;
}

export function buildLearningScene(book,c,H){
 const {THREE,box,ball,mesh}=H;
 if(!LEARNING_MODES.includes(c.learningScene.kind)||!LEARNING_ITEMS.includes(c.learningScene.item))throw new Error(`Unknown learning scene ${c.id}`);
 const root=new THREE.Group();root.position.y=.09;root.visible=false;book.add(root);
 const popup=new THREE.Group();root.add(popup);const props=new THREE.Group();popup.add(props);
 const meadow=mesh(new THREE.CircleGeometry(2.5,48),'#bcc7a4',popup,0,.02,0);meadow.rotation.x=-Math.PI/2;meadow.scale.y=1.1;meadow.castShadow=false;
 const pigs=c.characters.map((ch,i)=>{const actor=ch.type==='pig'?H.pig(popup,0,0,['小豬大哥','小豬二哥','小豬弟弟'].indexOf(ch.name),ch.name):makeActor(popup,ch,0,0,H);actor.root.position.set(i?1.35:-1.35,0,.65);return actor;});
 const effects={},extras=new THREE.Group();popup.add(extras);
 const s={root,popup,props,pigs,wolf:null,house:null,trees:[],effects,extras};
 const D=effects.learning={kind:c.learningScene.kind,handA:.52*pigs[0].root.scale.x,handB:.52*(pigs[1]?.root.scale.x||pigs[0].root.scale.x)};
 const item=learningItem(c.learningScene.item,props,H);item.position.set(0,.04,.3);D.item=item;
 const item2=learningItem(c.learningScene.item,props,H);item2.position.set(.6,.04,-.15);item2.visible=false;D.item2=item2;
 if(['help','share','rest'].includes(D.kind)){const size=Math.min(.85,...pigs.map(a=>a.root.scale.x*.85));item.scale.setScalar(size);item2.scale.setScalar(size);}
 const group=name=>{const g=new THREE.Group();g.userData.prop=name;props.add(g);return g;};
 if(D.kind==='plan'){
  const board=group('route-plan');board.position.set(0,.03,.35);box(1.8,.035,1.15,'#eee1bd',board,0,0,0);
  for(let i=0;i<3;i++){box(.3,.01,.3,['#b7c7a2','#bcaacf','#cfa88b'][i],board,-.6+i*.6,.027,0);if(i<2)box(.22,.012,.025,'#a79168',board,-.3+i*.6,.03,0);}
  D.token=ball(.095,.07,.095,'#e1b96b',board,-.6,.11,0);item.position.set(0,.04,-.7);
 }else if(D.kind==='ask'){
  D.boundary=box(4,.02,.04,'#b29b71',props,0,.035,.4);pigs[0].root.position.set(-.9,0,1.2);if(pigs[1])pigs[1].root.position.set(.9,0,-.3);item.position.set(.7,.04,-.8);
 }else if(D.kind==='practice'){
  D.steps=[];for(let i=0;i<3;i++){const step=mesh(new THREE.CylinderGeometry(.32,.32,.025,24),'#c2ae81',props,-1.2+i*1.2,.035,.6);D.steps.push(step);}
  pigs[0].root.position.set(-1.8,0,.65);if(pigs[1])pigs[1].root.position.set(.5,0,-.55);item.position.set(1.6,.04,-.35);
 }else if(D.kind==='help'){
  item.position.set(.3,.04,.75);pigs[0].root.position.set(-1.4,0,.75);if(pigs[1]){pigs[1].root.position.set(.9,-.14,.75);pigs[1].head.rotation.z=.18;}
 }else if(D.kind==='share'){
  item.position.set(-1.05,D.handA,1);item2.position.set(-1.65,.04,.65);item2.visible=true;
 }else if(D.kind==='rest'){
  const bench=group('rest-bench');bench.position.set(0,0,.6);const seat=.18*pigs[0].root.scale.x;box(1.8,.07,.55,'#b69b76',bench,0,seat,0);for(const x of [-.7,.7])box(.08,seat,.32,'#987d5c',bench,x,seat/2,0);box(1.8,.25,.05,'#b69b76',bench,0,seat+.27,-.25);D.bench=bench;item.position.set(-1.05,D.handA,.8);if(pigs[1])pigs[1].root.position.set(1.45,0,.65);
 }else if(D.kind==='listen'){
  item.position.set(0,.04,.7);D.signal=ball(.07,.07,.07,'#daba6e',props,-1.35,1.7,.65);
 }else if(D.kind==='repair'){
  item.visible=false;D.left=group('repair-left');D.right=group('repair-right');D.left.position.set(-.42,0,.65);D.right.position.set(.42,0,.65);
  for(const half of [D.left,D.right]){box(.52,.055,.46,'#be9e75',half,0,.07,0);box(.42,.015,.28,'#d5bf92',half,0,.11,0);}
  D.patch=box(.24,.025,.34,'#9aac87',props,0,.15,.65);D.patch.scale.setScalar(.001);item2.visible=true;item2.scale.setScalar(.65);item2.position.set(0,.04,-.75);
 }else if(D.kind==='notice'){
  item.position.set(-.55,.04,.5);item2.position.set(.65,.04,.5);item2.visible=true;item2.scale.setScalar(.72);
  const glass=group('magnifier');const rim=mesh(new THREE.TorusGeometry(.19,.023,8,24),'#9c835d',glass);rim.rotation.x=-.45;box(.035,.26,.035,'#9c835d',glass,0,-.3,0);glass.position.set(-.6,.8,.75);D.glass=glass;
 }else if(D.kind==='comfort'){
  pigs[0].root.position.set(-1.5,0,.6);pigs[0].head.rotation.z=.18;if(pigs[1])pigs[1].root.position.set(1.3,0,.6);item.position.set(0,.04,-.75);
 }
 if(c.storyId==='lantern-with-many-windows'&&D.kind==='notice'){
  D.lowView=true;item.position.set(0,.04,.4);item2.visible=false;D.glass.visible=false;
  const light=mesh(new THREE.CircleGeometry(.75,24),'#ddc789',props,0,.039,1.05);light.rotation.x=-Math.PI/2;light.scale.y=.6;light.material=light.material.clone();light.material.transparent=true;light.material.opacity=.3;light.material.depthWrite=false;light.castShadow=false;
 }
 if(c.id.endsWith('bridge-look-at-knot'))for(const [j,cloth]of [item,item2].entries()){
  for(const angle of [-.55,.55]){const rope=box(.52,.025,.035,'#94764e',cloth,0,.07,0);rope.rotation.y=angle;}
  const knot=mesh(new THREE.TorusGeometry(j?.12:.075,.02,6,16),'#ac8956',cloth,0,.1,0);knot.rotation.x=Math.PI/2;
 }
 // A picture cue at the rear supplies a stable visual endpoint for discussion.
 D.endpoint=mesh(new THREE.TorusGeometry(.38,.025,6,24),'#c7b47f',props,0,.04,-1.1);D.endpoint.rotation.x=-Math.PI/2;D.endpoint.scale.setScalar(.001);
 return arrangeSpread(addInterior(s,c,H));
}

export function animateLearningScene(tl,s,c){
 const D=s.effects.learning,A=s.pigs,a=A[0],b=A[1];
 const move=(o,p,at,duration=2)=>tl.to(o.position,{...p,duration,ease:'sine.inOut'},at);
 const face=(actor,y,at)=>actor&&tl.to(actor.root.rotation,{y,duration:.5},at);
 const signal=(actor,at)=>actor?.arms.forEach((arm,j)=>tl.to(arm.rotation,{z:j?-.65:.65,duration:.55,repeat:1,yoyo:true},at));
 const walk=(actor,x,z,at,duration=2)=>{if(!actor)return;move(actor.root,{x,z},at,duration);for(const [j,leg]of actor.legs.entries())tl.to(leg.rotation,{x:j?-.32:.32,duration:duration/8,repeat:7,yoyo:true},at);};
 // The narrator reads the setting before these deliberate actions begin.
 for(const actor of A)tl.from(actor.root.scale,{y:.01,duration:.8,ease:'back.out(1.1)'},0);
 if(D.kind==='plan'){
  face(a,.6,1.5);face(b,-.6,1.5);signal(a,3);move(D.token,{x:0},4,2);signal(b||a,8);move(D.token,{x:.6},10,2);walk(a,-.7,1.1,13);walk(b,.7,1.1,13);face(a,0,16);face(b,0,16);
 }else if(D.kind==='ask'){
  face(a,Math.PI*.6,1.5);signal(a,3);signal(b||a,7);walk(a,-.4,-.2,10,3);face(a,.7,13);face(b,-.7,13);signal(a,15);
 }else if(D.kind==='practice'){
  face(a,.7,1.5);walk(a,-1.2,.65,2,2);signal(b||a,5);walk(a,0,.65,7,2.5);walk(a,1.2,.65,12,2.5);face(a,0,15);signal(a,16);
 }else if(D.kind==='help'){
  face(a,.7,1.5);walk(a,-.35,.75,2,2.5);signal(a,5);if(b){tl.to(b.root.position,{y:0,duration:1},6);tl.to(b.head.rotation,{z:0,duration:1},6);face(b,-.7,6);}
  const lift=Math.min(D.handA,D.handB);
  face(a,0,6.7);face(b,0,6.7);
  // Reach the basket edges and keep that pose while carrying together.
  for(const [actor,j,x] of [[a,1,-.35],[b,0,.9]])if(actor?.arms[j]){
   const arm=actor.arms[j],size=actor.root.scale.x;
   const target=new THREE.Vector3(.3+(j?-.23:.23)*D.item.scale.x,lift+.18*D.item.scale.x,.75);
   target.sub(new THREE.Vector3(x,0,.75)).divideScalar(size).sub(arm.position);
   const length=target.length(),pose=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0),target.normalize()));
   const original={x:arm.rotation.x,y:arm.rotation.y,z:arm.rotation.z};
   tl.to(arm.rotation,{x:pose.x,y:pose.y,z:pose.z,duration:1.2},8);
   tl.to(arm.scale,{y:Math.max(.6,Math.min(2,length/.29)),duration:1.2},8);
   tl.to(arm.rotation,{...original,duration:1},14);tl.to(arm.scale,{y:1,duration:1},14);
  }
  move(D.item,{y:lift},8,1.2);walk(a,-.7,-.35,10,3);walk(b,.55,-.35,10,3);move(D.item,{x:-.1,z:-.35},10,3);move(D.item,{y:.04},14,1);face(a,0,16);face(b,0,16);
 }else if(D.kind==='share'){
  face(a,.7,1.5);face(b,-.7,1.5);signal(a,3);move(D.item,{x:0,y:D.handA,z:.95},4,2);signal(b||a,8);move(D.item,{x:1.05,y:D.handB,z:1},9,2);move(D.item,{y:.04},13,1.5);signal(a,15);signal(b,15);
 }else if(D.kind==='rest'){
  move(D.item,{x:-1.35,y:.04,z:.15},2,2);walk(a,-.35,.6,4,2);tl.to(a.root.position,{y:.025,duration:1},6);tl.to(a.root.rotation,{x:-.12,duration:1},6);signal(b||a,8);a.legs.forEach(leg=>{tl.to(leg.rotation,{x:-Math.PI/2,duration:1},6);tl.to(leg.rotation,{x:0,duration:1},12);});tl.to(a.root.position,{y:0,duration:1},12);tl.to(a.root.rotation,{x:0,duration:1},12);walk(a,-.7,1.25,13,2);signal(a,16);
 }else if(D.kind==='listen'){
  face(a,.7,1.5);face(b,-.7,1.5);signal(a,3);move(D.signal,{x:1.35},6,1);signal(b||a,8);move(D.signal,{x:-1.35},11,1);signal(a,13);move(D.signal,{x:0,y:.15,z:-1.1},16,2);
 }else if(D.kind==='repair'){
  face(a,.6,1.5);face(b,-.6,1.5);signal(a,3);signal(b||a,6);move(D.left,{x:-.26},8,2);move(D.right,{x:.26},8,2);tl.to(D.patch.scale,{x:1,y:1,z:1,duration:2},11);signal(a,14);signal(b,15);
 }else if(D.kind==='notice'){
  face(a,.6,1.5);move(D.glass,{x:-.55,y:.6},3,2);signal(a,5);move(D.glass,{x:.65,y:.6},8,2);signal(b||a,11);move(D.glass,{x:0,y:.05,z:-.6},14,2);face(a,0,16);face(b,0,16);
 }else if(D.kind==='comfort'){
  face(b,-.7,1.5);walk(b,-.35,.65,2,3);signal(b||a,6);tl.to(a.head.rotation,{z:0,duration:1.5},7);face(a,.5,8);walk(a,-.65,1,10,3);walk(b,.45,1,10,3);face(a,0,14);face(b,0,14);signal(a,16);signal(b,16);
 }
 if(D.kind==='practice'&&['duck','swallow'].includes(a.type))for(const at of [4.3,9.8,15])a.arms.forEach((arm,j)=>tl.to(arm.rotation,{z:j?-.65:.65,duration:.25,repeat:3,yoyo:true},at));
 if(D.lowView){walk(a,-.55,.85,2,1.5);tl.to(a.root.scale,{y:a.root.scale.x*.78,duration:1},3.5);tl.to(a.head.rotation,{x:.18,duration:1},3.5);signal(b||a,7);tl.to(a.root.scale,{y:a.root.scale.x,duration:1},12);tl.to(a.head.rotation,{x:0,duration:1},12);}
 tl.to(D.endpoint.scale,{x:1,y:1,z:1,duration:1.2},17.5);
 tl.to({time:0},{time:1,duration:20},0);
}
