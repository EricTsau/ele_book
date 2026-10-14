import {addInterior,animateInterior} from './interiors.js';
import {arrangeSpread} from './stage-layout.js';
import {addClassicDetails} from './classic-motion.js';
import {addLegacyDetails} from './legacy-details.js';
import {addOriginalDetails} from './original-details.js';
import {addStoryDetails} from './story-events.js';
import { buildStoryProp } from './story-props.js';
import { choreographStory } from './story-motion.js';
// Shared papercraft vocabulary; each book combines its own cast, props and choreography.
export function buildFairytaleScene(book,c,H){
 const {THREE,box,ball,cone,mesh,mat,leafTree,house}=H;
 const root=new THREE.Group();root.position.set(2.72,.09,0);root.visible=false;book.add(root);
 const popup=new THREE.Group();root.add(popup);
 const effects={};const props=new THREE.Group();popup.add(props);
 const colors={lake:'#aecbbb',snow:'#e5e9df',candy:'#d5c3b4',palace:'#d2c9d6',cloud:'#dbe0d0',flowers:'#c5c9a0',savanna:'#c9be85',cottage:'#c2bd98',garden:'#b8c699',forest:'#b5c398',meadow:'#bdca97'};
 const ground=mesh(new THREE.CircleGeometry(2.5,48),colors[c.setting]||colors.forest,popup,0,.02,0);ground.rotation.x=-Math.PI/2;ground.scale.y=1.1;ground.castShadow=false;
 const trees=[];
 for(const [x,z,h] of [[-2,-1.5,2],[2,-1.7,2.3],[-2.2,.4,1.25],[2.12,.7,1.2]]){
  if(c.setting==='savanna'){
   const tree=new THREE.Group();tree.position.set(x,0,z);popup.add(tree);box(.1,h*.7,.1,'#8e7551',tree,0,h*.35,0);ball(h*.42,.2,h*.28,'#8f995f',tree,0,h*.72,0);trees.push(tree);
  }else trees.push(leafTree(popup,x,z,c.setting==='palace'?h*.65:h,c.setting==='snow'?'#b9cbb4':c.setting==='candy'?'#b3ae91':'#879b69'));
 }
 const actors=c.characters.map((ch,i)=>makeActor(popup,c.storyId==='emperors-new-clothes'&&c.storyIndex>=3&&ch.type==='king'?{...ch,color:'#eee4cc'}:ch,(i-(c.characters.length-1)/2)*1.03,1.45,H));
 let cottage=null;
 const littleFlower=(x,z,color='#d6a0a0',parent=popup)=>{for(let n=0;n<5;n++){const angle=n*Math.PI*2/5;ball(.064,.021,.064,color,parent,x+Math.cos(angle)*.05,.065,z+Math.sin(angle)*.05);}ball(.037,.03,.037,'#e3c55d',parent,x,.075,z);};
 for(let i=0;i<8;i++)littleFlower(Math.sin(i*2.4)*2.14,Math.cos(i*2.4)*2.12,c.setting==='savanna'?'#dac581':'#d7a69a');
 for(const kind of [...new Set(c.props)]){
  const prop=new THREE.Group();props.add(prop);prop.userData.prop=kind;
  if(buildStoryProp(kind,prop,effects,H))continue;
  if(kind==='cottage'||kind==='candy-house'){
   cottage=house(prop,kind==='cottage'?'wood':'straw');cottage.position.set(.2,0,-.85);cottage.scale.setScalar(.92);
   if(kind==='candy-house'){
    cottage.children.filter(m=>m.isMesh&&m.geometry.type==='BoxGeometry').slice(0,3).forEach(m=>m.material=mat('#d9a18e'));
    for(let n=0;n<7;n++)ball(.085,.075,.085,n%2?'#e8c56b':'#bd809b',prop,-.75+n*.27,1.42,-.09);
    for(const x of [-1.3,1.5]){box(.05,.8,.05,'#f1e5cb',prop,x,.4,.0);ball(.22,.22,.06,x<0?'#c78696':'#b2c584',prop,x,.97,0);}
   }
  }else if(kind==='castle'){
   prop.position.z=-1.05;box(2.3,1.25,1,'#c7bba3',prop,0,.63,0);box(.46,.82,.03,'#827363',prop,0,.42,.52);
   for(const x of [-1.25,1.25]){mesh(new THREE.CylinderGeometry(.32,.37,1.85,10),'#c7bca9',prop,x,.94,0);cone(.47,.69,c.setting==='palace'?'#9b849f':'#769185',prop,x,2.14,0);box(.04,.44,.04,'#94764f',prop,x,2.65,0);box(.29,.2,.025,'#b97d72',prop,x+.15,2.77,0);}
   for(let x=-.94;x<1;x+=.38)box(.2,.26,.2,'#c7bba3',prop,x,1.36,.43);
   for(const x of [-.63,.63])box(.22,.34,.03,'#7d9296',prop,x,.89,.516);
  }else if(kind==='pond'){
   const pond=mesh(new THREE.CircleGeometry(1.5,48),'#86b7bd',prop,0,.048,-.55);pond.rotation.x=-Math.PI/2;pond.scale.y=1.15;pond.castShadow=false;
   for(let n=0;n<3;n++){const ripple=mesh(new THREE.TorusGeometry(.5+n*.3,.012,4,32),'#c2d9cf',prop,.2,.06,-.5);ripple.rotation.x=-Math.PI/2;ripple.scale.y=.65;ripple.castShadow=false;}
  }else if(kind==='beanstalk'){
   const stalk=new THREE.Group();stalk.position.set(.25,0,-.85);prop.add(stalk);effects.plant=stalk;
   const points=Array.from({length:28},(_,j)=>new THREE.Vector3(Math.sin(j*.43)*.22,j*.135,Math.cos(j*.43)*.2));
   mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.1,7,false),'#729456',stalk);
   for(let n=0;n<8;n++){const leaf=ball(.46,.055,.18,n%2?'#9bad6d':'#7e9b5b',stalk,(n%2?1:-1)*.3,.4+n*.39,0);leaf.rotation.z=n%2?.3:-.3;}
  }else if(kind==='coach'){
   prop.position.set(0,0,-.6);effects.magic=prop;
   for(let n=0;n<8;n++){const a=n*Math.PI/4;ball(.38,.66,.38,'#d3a65f',prop,Math.cos(a)*.4,.94,Math.sin(a)*.4);}
   box(.48,.6,.1,'#a7bcca',prop,0,.98,.74);for(const s of [-1,1])box(.032,.63,.1,'#edd19c',prop,s*.26,.99,.76);
   for(const x of [-.9,.9])for(const z of [-.57,.57]){const wheel=mesh(new THREE.TorusGeometry(.29,.047,6,20),'#866d50',prop,x,.34,z);wheel.rotation.y=Math.PI/2;}
   cone(.21,.2,'#d8bf6c',prop,0,1.68,0);box(.08,.26,.08,'#8d9b67',prop,0,1.87,0);
  }else if(kind==='flower'){
   prop.position.set(.25,0,-.85);effects.plant=prop;box(.07,1.8,.07,'#7e9a63',prop,0,.9,0);
   for(let n=0;n<7;n++){const a=n*Math.PI*2/7;const p=ball(.36,.11,.2,n%2?'#d49ea4':'#e0b0ac',prop,Math.cos(a)*.45,1.83,Math.sin(a)*.45);p.rotation.y=-a;}
   ball(.28,.14,.28,'#e0c76f',prop,0,1.88,0);for(const side of [-1,1]){const leaf=ball(.4,.045,.17,'#8ca36a',prop,side*.27,.75,0);leaf.rotation.z=side*.3;}
  }else if(kind==='net'){
   const net=new THREE.Group();net.position.set(-.45,0,1.2);prop.add(net);effects.net=net;
   for(let a=-1;a<=1.01;a+=.25){const points=[];for(let b=-.75;b<=.76;b+=.125)points.push(new THREE.Vector3(a,.2+Math.sqrt(Math.max(0,1-a*a))*.93,b));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.023,5,false),'#a38d5d',net);}
   for(let z=-.75;z<=.76;z+=.25){const points=[];for(let x=-1;x<=1.01;x+=.125)points.push(new THREE.Vector3(x,.2+Math.sqrt(Math.max(0,1-x*x))*.93,z));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,.023,5,false),'#a38d5d',net);}
  }else if(kind==='porridge'){
   prop.position.z=-.6;box(2.5,.1,1.15,'#b08e64',prop,0,.72,0);for(const x of [-1,1])for(const z of [-.4,.4])box(.09,.7,.09,'#957550',prop,x,.35,z);
   for(let n=0;n<3;n++){const r=.28-n*.055;const bowl=mesh(new THREE.SphereGeometry(r,16,8,0,Math.PI*2,0,Math.PI/2),'#c89873',prop,-.75+n*.75,.86,0);bowl.rotation.x=Math.PI;mesh(new THREE.CylinderGeometry(r*.94,r*.94,.02,16),'#e3d4a3',prop,-.75+n*.75,.861,0);}
  }else if(kind==='chair'){
   effects.chair=prop;prop.position.set(.1,0,-.35);box(.63,.08,.57,'#a58151',prop,0,.5,0);box(.63,.65,.07,'#b69261',prop,0,.88,-.25);for(const x of [-.23,.23])for(const z of [-.21,.21])box(.065,.5,.065,'#937246',prop,x,.25,z);
  }else if(kind==='bed'){
   prop.position.set(.4,0,-.65);box(1.55,.23,1,'#b6987b',prop,0,.31,0);box(1.48,.17,.95,'#d6ab9f',prop,0,.5,0);box(.4,.09,.74,'#f0e8d3',prop,-.5,.63,0);box(.08,.85,1.02,'#ad9271',prop,-.82,.43,0);
  }else if(kind==='cage'){
   prop.position.set(-.1,0,-.5);box(1.15,.06,1.03,'#b89760',prop,0,.03,0);for(const x of [-.55,.55])for(let z=-.5;z<.51;z+=.25)box(.04,1.45,.04,'#b99e6c',prop,x,.73,z);for(let x=-.5;x<=.51;x+=.25)for(const z of [-.5,.5])box(.04,1.45,.04,'#b99e6c',prop,x,.73,z);box(1.2,.05,1.1,'#c6ad7d',prop,0,1.47,0);effects.cage=prop;
  }else if(kind==='finish'){
   prop.position.set(.0,0,-1.62);for(const x of [-1.25,1.25])box(.045,1.75,.045,'#977c53',prop,x,.88,0);for(let n=0;n<10;n++)box(.25,.27,.022,n%2?'#f2e9d0':'#6c8561',prop,-1.125+n*.25,1.52,0);
  }else if(kind==='clock'){
   prop.position.set(1.7,1.2,-.35);const dial=mesh(new THREE.CylinderGeometry(.35,.35,.08,24),'#e6d9b7',prop);dial.rotation.x=Math.PI/2;
   const hand=new THREE.Group();hand.position.z=.055;prop.add(hand);box(.022,.25,.02,'#6b6b58',hand,0,.09,0);effects.hand=hand;
  }else if(kind==='egg'){
   prop.position.set(-.4,0,.85);ball(.42,.55,.38,'#f0e8cd',prop,0,.5,0);effects.egg=prop;
  }else if(kind==='basket'){
   prop.position.set(-1.35,0,.25);box(.51,.32,.35,'#ba9360',prop,0,.18,0);const handle=mesh(new THREE.TorusGeometry(.21,.022,5,16,Math.PI),'#98794f',prop,0,.34,0);handle.scale.y=1.3;
  }else if(kind==='shoe'||kind==='boots'){
   prop.position.set(-1.5,0,-.1);for(const x of [-.18,.18]){box(.16,.26,.19,kind==='shoe'?'#b4d2cf':'#8e6345',prop,x,.13,0);ball(.12,.07,.21,kind==='shoe'?'#c0dad4':'#976849',prop,x,.065,.12);}
  }else if(kind==='beans'){
   for(let n=0;n<5;n++){const b=ball(.085,.035,.055,'#98955b',prop,-.7+n*.32,.07,-.4);b.rotation.y=n*.7;}
  }else if(kind==='lily'){
   const leaf=mesh(new THREE.CircleGeometry(.75,24),'#80a577',prop,0,.082,.2);leaf.rotation.x=-Math.PI/2;
  }else if(kind==='nest'){
   const nest=mesh(new THREE.TorusGeometry(.47,.12,8,24),'#b39a70',prop,.2,.14,-.1);nest.rotation.x=-Math.PI/2;
  }else if(kind==='reeds'){
   for(let n=0;n<7;n++){box(.025,.55+n*.055,.025,'#9eab7e',prop,-1.7+n*.17,.3,-1.1);ball(.035,.12,.035,'#b39669',prop,-1.7+n*.17,.7+n*.055,-1.1);}
  }else if(kind==='stones'){
   for(let n=0;n<8;n++)ball(.06,.03,.055,'#eae3cc',prop,Math.sin(n)*.2-.8,.058,-1.8+n*.4);
  }else if(kind==='flowers'){
   for(let n=0;n<9;n++)littleFlower(-1.5+n*.36,-.8+Math.sin(n)*.3,'#d69fa7',prop);
  }
 }
 if(c.setting==='cloud')for(let n=0;n<4;n++){const cloud=new THREE.Group();cloud.position.set(-1.7+n*1.1,1.9+(n%2)*.4,-2.2);popup.add(cloud);for(let j=0;j<3;j++)ball(.25,.14,.13,'#ececdc',cloud,j*.22,Math.sin(j)*.05,0);}
 const extras=new THREE.Group();popup.add(extras);for(let n=0;n<6;n++){const spark=ball(.035,.06,.035,'#e6c577',extras,Math.sin(n*2.1)*1.8,.7+(n%3)*.6,Math.cos(n)*1.3);spark.rotation.z=n;}
 return arrangeSpread(addInterior(addClassicDetails(addOriginalDetails(addLegacyDetails(addStoryDetails({root,popup,pigs:actors,wolf:null,house:cottage,trees,effects,props,extras},c,H),c,H),c,H),c,H),c,H));
}
function makeActor(parent,ch,x,z,H){
 const {THREE,box,ball,cone,mesh,mat}=H;const root=new THREE.Group();root.position.set(x,0,z);root.userData.character=ch.name;parent.add(root);
 const arms=[],legs=[];let mouth;let head;const color=ch.color||'#be9369',type=ch.type;
 const humans=['girl','boy','grandma','grandpa','ranger','king','prince','fairy','witch','giant','tiny-girl'];
 function eyes(y,front,spacing=.115){for(const s of [-1,1])ball(.026,.033,.018,'#303d32',root,s*spacing,y,front);}
 function limbs(tint,bodyY=.61){for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.25,bodyY,0);root.add(arm);ball(.066,.17,.07,tint,arm,side*.018,-.12,0);arm.rotation.z=side*.22;arms.push(arm);const leg=new THREE.Group();leg.position.set(side*.115,.22,0);root.add(leg);box(.1,.2,.1,tint,leg,0,-.065,0);ball(.079,.045,.11,'#66583f',leg,0,-.17,.035);legs.push(leg);}}
 if(humans.includes(type)){
  const skin=type==='giant'?'#bba18a':'#e9c3a4';
  if(['girl','fairy','witch','tiny-girl','grandma'].includes(type))cone(.3,.58,color,root,0,.46,0);else box(.42,.5,.3,color,root,0,.49,0);
  ball(.27,.29,.245,['grandma','grandpa'].includes(type)?'#c7c9b8':ch.name==='金髮女孩'?'#d3b768':'#776248',root,0,.99,-.055);
  head=ball(.23,.25,.23,skin,root,0,.965,.043);eyes(1.004,.259,.088);
  mouth=ball(.048,.017,.011,'#a97461',root,0,.859,.254);limbs(skin);
  if(ch.name==='小紅帽'){const hood=mesh(new THREE.TorusGeometry(.259,.085,8,24,Math.PI*1.6),'#b94e43',root,0,.975,-.01);hood.rotation.z=-Math.PI*.3;const cape=cone(.32,.6,'#b94e43',root,0,.53,-.13);cape.scale.z=.5;}
  if(ch.name==='金髮女孩')for(const side of [-1,1])ball(.09,.28,.09,'#d5b96b',root,side*.23,.82,-.015);
  if(type==='grandma'){for(const side of [-1,1]){const glass=mesh(new THREE.TorusGeometry(.055,.009,5,14),'#796e5a',root,side*.088,1.007,.278);}ball(.12,.13,.12,'#cccabb',root,0,1.23,-.16);}
  if(type==='king'||type==='prince'){mesh(new THREE.CylinderGeometry(.245,.24,.09,12),'#dabb65',root,0,1.205,0);for(let n=0;n<5;n++)cone(.049,.18,'#dabb65',root,Math.sin(n*Math.PI*2/5)*.2,1.325,Math.cos(n*Math.PI*2/5)*.2);}
  if(type==='witch'){cone(.31,.66,'#77687f',root,0,1.47,-.035);mesh(new THREE.CylinderGeometry(.37,.37,.035,16),'#77687f',root,0,1.16,-.035);}
  if(type==='ranger'){mesh(new THREE.CylinderGeometry(.32,.32,.035,16),'#73875a',root,0,1.2,0);cone(.24,.23,'#73875a',root,0,1.315,0);}
  if(type==='fairy'){for(const s of [-1,1]){const wing=ball(.26,.39,.035,'#d5c8d7',root,s*.32,.66,-.2);wing.rotation.z=-s*.4;}box(.025,.47,.025,'#c4ad66',root,.36,.79,.05);ball(.075,.09,.06,'#e6d392',root,.36,1.07,.05);}
 }else if(['duck','swan','swallow','crow','dove','rooster'].includes(type)){
  const tint=ch.color||({swallow:'#5d747d',crow:'#52636a',dove:'#e7e7d9',swan:'#eee9d9',rooster:'#bd9367'}[type]||'#dfc77d');
  ball(.3,.25,.4,tint,root,0,.35,0);
  if(type==='swan'){ball(.083,.32,.095,tint,root,0,.68,.21);head=ball(.15,.17,.17,tint,root,0,.99,.25);eyes(1.01,.398,.06);mouth=cone(.063,.21,'#c58a4e',root,0,.94,.48);mouth.rotation.x=Math.PI/2;}
  else{head=ball(.22,.23,.22,tint,root,0,.64,.19);eyes(.694,.382,.089);mouth=box(.19,.065,.2,type==='swallow'?'#b79769':'#d29b4f',root,0,.596,.419);}
  if(type==='rooster'){for(let n=0;n<3;n++)ball(.07,.12,.07,'#b86d5e',root,-.08+n*.08,.9,.18);cone(.1,.3,'#75927d',root,0,.46,-.42);}
  for(const s of [-1,1]){const wing=new THREE.Group();wing.position.set(s*.23,.43,-.03);root.add(wing);const w=ball(type==='swallow'?.35:.12,.07,.28,tint,wing,s*.12,0,0);w.rotation.z=s*.3;arms.push(wing);const foot=new THREE.Group();foot.position.set(s*.13,.07,.09);root.add(foot);box(.16,.03,.2,'#bf9458',foot);legs.push(foot);}
 }else if(type==='ant'){
  for(let n=0;n<3;n++)ball(.14,.15,.18,'#937359',root,0,.29+n*.12,-.21+n*.19);
  head=ball(.17,.17,.17,'#937359',root,0,.65,.23);eyes(.69,.375,.07);mouth=box(.05,.013,.015,'#4f463d',root,0,.595,.388);
  for(const side of [-1,1])for(let n=0;n<3;n++){const leg=new THREE.Group();leg.position.set(side*.1,.31,-.25+n*.2);root.add(leg);const limb=box(.3,.025,.025,'#796149',leg,side*.13,-.08,0);limb.rotation.z=-side*.45;legs.push(leg);if(n===2)arms.push(leg);}
  for(const side of [-1,1]){const antenna=box(.015,.25,.015,'#796149',root,side*.09,.88,.22);antenna.rotation.z=-side*.4;}
 }else if(type==='turtle'){
  ball(.37,.26,.47,'#759267',root,0,.33,0);const shell=ball(.36,.245,.45,'#7d8755',root,0,.39,-.015);for(let j=0;j<3;j++){const stripe=mesh(new THREE.TorusGeometry(.28-j*.06,.012,4,18),'#a0aa77',root,0,.5+j*.04,-.02);stripe.rotation.x=-Math.PI/2;stripe.scale.y=1.3;}
  head=ball(.19,.18,.22,'#a4b48a',root,0,.29,.47);eyes(.335,.663,.082);mouth=box(.07,.014,.035,'#667353',root,0,.231,.678);limbs('#a1ae7d',.23);
 }else{
  const tint=ch.color||({rabbit:'#ece7d8',bear:'#ab8058',cat:'#c59465',lion:'#cba361',mouse:'#a79c88',fox:'#c58b59',dog:'#a8896c',donkey:'#a8a28f',frog:'#90ae75',wolf:'#7c8d7e'}[type]||color);
  ball(.29,.36,.25,tint,root,0,.47,0);
  if(type==='lion')ball(.43,.44,.21,'#a87743',root,0,1,-.025);
  head=ball(.285,.28,.25,tint,root,0,.97,.03);eyes(1.02,.255);
  if(type==='rabbit'||type==='donkey'){for(const side of [-1,1]){const ear=ball(.085,.34,.069,tint,root,side*.13,1.42,-.02);ear.rotation.z=-side*.12;ball(.042,.25,.073,'#d8b6ac',root,side*.13,1.43,-.012);}ball(.065,.045,.04,'#c79a8d',root,0,.943,.292);}
  else if(['cat','wolf','fox','dog'].includes(type)){for(const s of [-1,1]){const ear=cone(.112,.27,tint,root,s*.21,1.247,0);ear.rotation.z=-s*.18;}ball(.13,.072,['wolf','fox','dog'].includes(type)?.21:.085,['wolf','fox','dog'].includes(type)?'#bcc2a6':'#e1c49b',root,0,.923,['wolf','fox','dog'].includes(type)?.3:.253);ball(.043,.032,.024,'#5a5547',root,0,.96,['wolf','fox','dog'].includes(type)?.502:.325);}
  else if(type==='frog'){for(const s of [-1,1]){ball(.13,.15,.13,tint,root,s*.18,1.19,.06);ball(.057,.07,.032,'#eee9cb',root,s*.18,1.2,.167);ball(.027,.039,.017,'#3d5040',root,s*.18,1.2,.196);}}
  else{for(const side of [-1,1])ball(type==='mouse'?.16:.11,type==='mouse'?.17:.12,.065,tint,root,side*.24,1.21,0);ball(.125,.076,.076,type==='lion'?'#e0bf86':'#d1b38e',root,0,.922,.265);ball(.04,.03,.025,'#5b5041',root,0,.949,.33);}
  if(type==='fox'){const tail=cone(.18,.85,'#c58b59',root,.36,.42,-.18);tail.rotation.z=-.9;ball(.13,.15,.12,'#ece1c9',root,.66,.64,-.18);}
  if(type==='dog')for(const side of [-1,1])ball(.075,.21,.09,tint,root,side*.25,1.03,-.02);
  mouth=ball(.055,.018,.015,'#685647',root,0,.84,.27);limbs(tint);
  if(type==='cat'){for(const side of [-1,1]){box(.14,.23,.16,'#785638',root,side*.12,.125,.005);for(const dy of [-.04,.035]){const whisker=box(.19,.012,.015,'#7e6b50',root,side*.22,.93+dy,.263);whisker.rotation.z=side*dy*2;}}const tail=mesh(new THREE.TorusGeometry(.18,.037,6,18,Math.PI*1.5),tint,root,.25,.39,-.19);tail.rotation.y=.6;}
 }
 const size=ch.size||(type==='giant'?1.42:type==='mouse'?.64:type==='tiny-girl'?.62:type==='turtle'?.95:type==='swallow'?.85:1);
 root.scale.setScalar(size);
 const tab=box(.54,.019,.44,'#e4d9b9',root,0,.008,0);tab.castShadow=false;
 return {root,mouth,head,arms,legs,baseMouth:mouth.scale.y,name:ch.name,type};
}
export function animateFairytale(tl,s,c){
 for(const [j,tree] of s.trees.entries()){tl.from(tree.rotation,{x:-Math.PI/2,duration:.8,ease:'back.out(1.1)'},j*.07);tl.to(tree.rotation,{z:.02,duration:2,repeat:7,yoyo:true,ease:'sine.inOut'},0);}
 tl.from(s.props.rotation,{x:-Math.PI/2,duration:1.1,ease:'back.out(1)'},.1);
 for(const [j,a] of s.pigs.entries())tl.from(a.root.scale,{y:.01,duration:.75,ease:'back.out(1.4)'},.3+j*.13);
 tl.to(s.extras.rotation,{y:.22,duration:16,ease:'sine.inOut'},0);
 choreographStory(tl,s,c);
 animateInterior(tl,s);
}
