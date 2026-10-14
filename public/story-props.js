// Additional reusable paper models for classic and original stories.
export function buildStoryProp(kind,prop,effects,H){
 const {THREE,box,ball,cone,mesh}=H;
 if(!['tree','sun','stars','wind','jar','well','grapes','bridge','boat','lantern','mailbox','books','clocktower','pot','loom','mattresses','coins','drum','grain','mushroom','telescope'].includes(kind))return false;
 const cylinder=(r,h,color,parent,x=0,y=0,z=0)=>mesh(new THREE.CylinderGeometry(r,r,h,24),color,parent,x,y,z);
 const ring=(r,t,color,parent,x=0,y=0,z=0)=>mesh(new THREE.TorusGeometry(r,t,6,32),color,parent,x,y,z);
 prop.position.set(0,0,-.75);
 if(kind==='tree'){H.leafTree(prop,0,0,2.1,'#8ba474');
 }else if(kind==='sun'||kind==='stars'){
  prop.position.y=2.2;effects.glow=prop;
  if(kind==='sun'){ball(.48,.48,.12,'#e5be67',prop);for(let n=0;n<12;n++){const a=n*Math.PI/6;const ray=box(.07,.23,.04,'#e3c577',prop,Math.sin(a)*.72,Math.cos(a)*.72,0);ray.rotation.z=-a;}}
  else for(let n=0;n<9;n++){const star=new THREE.Group();star.position.set(Math.sin(n*2.4)*1.7,Math.cos(n*2.4)*.6,0);prop.add(star);for(let j=0;j<2;j++){const bar=box(.06,.22,.045,'#e8ca74',star);bar.rotation.z=j*Math.PI/2;} }
 }else if(kind==='wind'){
  prop.position.y=1.6;effects.sway=prop;
  for(let n=0;n<3;n++){const pts=Array.from({length:20},(_,i)=>new THREE.Vector3(-1.3+i*.12,Math.sin(i*.25)*.17+n*.23,0));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.025,5,false),'#c4d8cf',prop);}
 }else if(kind==='jar'||kind==='well'){
  const r=kind==='well'?.62:.4,h=kind==='well'?.65:.95;
  mesh(new THREE.CylinderGeometry(r,r*.85,h,24,1,true),kind==='well'?'#b2b2a2':'#c48e6c',prop,0,h/2,0);
  const lip=ring(r,.045,'#d6b28a',prop,0,h,0);lip.rotation.x=Math.PI/2;
  const water=cylinder(r*.94,.02,'#8abcc1',prop,0,.28,0);effects.water=water;
  for(let i=0;i<5;i++)ball(.065,.04,.07,'#c6c2b0',prop,.65+Math.sin(i)*.15,.04,-.4+i*.2);
 }else if(kind==='grapes'){
  for(const x of [-1.1,1.1])box(.09,2,.09,'#9f835c',prop,x,1,0);box(2.5,.1,.1,'#8ca16b',prop,0,2,0);
  for(let i=0;i<4;i++)for(let j=0;j<3-i*.5;j++)ball(.14,.15,.14,'#9a7eaa',prop,-.24+j*.25+i*.055,1.68-i*.23,.03);
  ball(.4,.04,.15,'#8da86c',prop,.3,2.04,0);
 }else if(kind==='bridge'){
  for(let i=0;i<12;i++){const x=-1.45+i*.26,y=.22+Math.sin(i/11*Math.PI)*.38;box(.23,.07,1.1,'#b49a72',prop,x,y,0);for(const z of [-.52,.52])box(.035,.45,.035,'#a38761',prop,x,y+.24,z);}
  for(const z of [-.52,.52]){const pts=Array.from({length:12},(_,i)=>new THREE.Vector3(-1.45+i*.26,.68+Math.sin(i/11*Math.PI)*.38,z));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.035,5,false),'#a38761',prop);}
 }else if(kind==='boat'){
  effects.boat=prop;
  const hull=new THREE.Shape();hull.moveTo(-.78,.37);hull.lineTo(-.42,.06);hull.lineTo(.42,.06);hull.lineTo(.78,.37);hull.lineTo(0,.2);hull.closePath();
  mesh(new THREE.ExtrudeGeometry(hull,{depth:.46,bevelEnabled:false}),'#e5d6b5',prop,0,0,-.23);box(.024,1.05,.024,'#bfae87',prop,0,.7,0);
  const shape=new THREE.Shape();shape.moveTo(.05,.55);shape.lineTo(.05,1.5);shape.lineTo(.77,.55);shape.closePath();mesh(new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false}),'#f1e4c8',prop);
 }else if(kind==='lantern'){
  effects.glow=prop;const light=box(.65,.85,.55,'#e6c981',prop,0,.75,0);light.material=light.material.clone();for(const x of [-.34,.34])for(const z of [-.29,.29])box(.055,.96,.055,'#927755',prop,x,.75,z);
  box(.78,.07,.67,'#927755',prop,0,.27,0);cone(.58,.32,'#a47757',prop,0,1.35,0);ring(.18,.024,'#947c56',prop,0,1.6,0);
 }else if(kind==='mailbox'){
  box(.15,1,.15,'#9a805f',prop,0,.5,0);box(1,.62,.55,'#9aafa0',prop,0,1.16,0);box(.72,.06,.025,'#506759',prop,0,1.25,.29);box(.05,.47,.045,'#957a55',prop,.59,1.48,0);box(.25,.17,.03,'#bc7d66',prop,.71,1.65,0);
  box(.34,.23,.035,'#f1e4c6',prop,.04,.17,.5);
 }else if(kind==='books'){
  for(let i=0;i<5;i++){const b=new THREE.Group();b.position.set((i%2)*.12,.1+i*.16,0);b.rotation.y=(i%2?1:-1)*.09;prop.add(b);box(1.15,.13,.7,['#8ea28e','#be9983','#c3b57f'][i%3],b);box(1.04,.085,.66,'#efe7d0',b,.03,0,.015);}
 }else if(kind==='clocktower'){
  box(.94,1.8,.6,'#ac9c7c',prop,0,.9,0);cone(.76,.5,'#7f9783',prop,0,2.05,0);
  const dial=cylinder(.32,.04,'#efdfb6',prop,0,1.45,.33);dial.rotation.x=Math.PI/2;
  const hand=new THREE.Group();hand.position.set(0,1.45,.365);prop.add(hand);box(.025,.26,.025,'#655f4b',hand,0,.1,0);effects.hand=hand;
 }else if(kind==='pot'){
  effects.pot=prop;const bowl=mesh(new THREE.SphereGeometry(.6,24,12,0,Math.PI*2,0,Math.PI/2),'#967a61',prop,0,.72,0);bowl.rotation.x=Math.PI;const soup=cylinder(.57,.025,'#e3d19e',prop,0,.72,0);effects.water=soup;
  for(const s of [-1,1]){const handle=ring(.16,.045,'#967a61',prop,s*.63,.57,0);handle.rotation.y=Math.PI/2;}
 }else if(kind==='loom'){
  for(const x of [-.85,.85])box(.09,1.7,.1,'#a08862',prop,x,.85,0);for(const y of [.3,1.65])box(1.8,.09,.1,'#a08862',prop,0,y,0);
  // Empty loom for the emperor; yarn appears only in original weaving stories.
  effects.loom=prop;
 }else if(kind==='mattresses'){
  box(1.65,.2,1.08,'#aa8b66',prop,0,.12,0);for(let i=0;i<7;i++)box(1.55,.15,.98,['#b8c4a4','#c8a3a7','#d9c68e'][i%3],prop,0,.32+i*.16,0);ball(.045,.045,.045,'#8ba060',prop,.72,.25,.51);box(.44,.1,.68,'#eee3c9',prop,-.47,1.4,0);
 }else if(kind==='coins'){
  for(let i=0;i<9;i++){const coin=cylinder(.1,.025,'#ddbc69',prop,Math.sin(i*2.2)*.65,.08+(i%2)*.04,Math.cos(i*2.2)*.4);coin.rotation.z=i*.13;}effects.glow=prop;
 }else if(kind==='drum'){
  cylinder(.48,.6,'#bf9273',prop,0,.4,0);cylinder(.49,.04,'#ede0be',prop,0,.72,0);for(const x of [-.2,.2]){const stick=box(.025,.6,.025,'#8b7253',prop,x,1,0);stick.rotation.z=x>0?-.55:.55;}effects.drum=prop;
 }else if(kind==='grain'){
  for(let i=0;i<7;i++){const x=-.7+i*.22;box(.022,.8,.022,'#a4a36a',prop,x,.4,0);for(let j=0;j<4;j++)ball(.075,.11,.045,'#d9c27b',prop,x+(j%2?.055:-.055),.6+j*.09,0);}
 }else if(kind==='mushroom'){
  for(let i=0;i<3;i++){cylinder(.11,.45,'#e3d6b6',prop,(i-1)*.55,.225,0);const cap=mesh(new THREE.SphereGeometry(.33,20,12,0,Math.PI*2,0,Math.PI/2),'#b78878',prop,(i-1)*.55,.43,0);}
 }else if(kind==='telescope'){
  for(const x of [-.4,.4]){const leg=box(.04,1,.04,'#987e5c',prop,x*.5,.5,0);leg.rotation.z=-x*.6;}
  const scope=cylinder(.13,1.1,'#b8a776',prop,0,1.05,0);scope.rotation.z=Math.PI*.35;
 }else return false;
 return true;
}
