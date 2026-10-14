// A chapter's setting is authored explicitly: a cottage prop alone does not
// mean its action is indoors. Coordinates retain the existing actor timelines.
const rooms={
 'red-riding-hood':{0:'cottage',2:'bedroom',3:'bedroom',4:'cottage',5:'cottage'},
 'jack-and-beanstalk':{3:'castle'},
 'goldilocks':{0:'kitchen',1:'kitchen',2:'cottage',3:'bedroom',4:'bedroom',5:'kitchen'},
 'hansel-and-gretel':{2:'candy',3:'candy',4:'candy',5:'kitchen'},
 'puss-in-boots':{0:'mill',2:'palace'},
 'cinderella':{0:'cottage',2:'palace',3:'palace',4:'cottage'},
 'thumbelina':{2:'burrow',3:'burrow'},
 'town-and-country-mice':{0:'burrow',2:'dining',3:'dining',4:'burrow',5:'burrow'},
 'bremen-musicians':{2:'cottage',3:'cottage',4:'cottage',5:'cottage'},
 'sweet-porridge':{2:'kitchen',3:'kitchen',4:'kitchen',5:'kitchen'},
 'star-money':{5:'cottage'},
 'emperors-new-clothes':{0:'palace',1:'workshop',2:'workshop',3:'palace'},
 'princess-and-pea':{0:'palace',1:'palace',2:'bedroom',3:'bedroom',4:'bedroom',5:'palace'},
 'lantern-with-many-windows':{1:'workshop',2:'workshop'},
 'rain-post-office':{0:'post-office',5:'post-office'},
 'seed-library-notebook':{0:'library',1:'cottage',2:'library',3:'cottage',4:'library',5:'library'},
 'clock-with-a-breath':{0:'workshop',1:'workshop',2:'cottage',3:'workshop',4:'cottage',5:'workshop'},
 'cloud-tailor-pockets':{0:'workshop',2:'workshop',5:'workshop'},
 'bakery-under-the-stars':{0:'bakery',1:'bakery',2:'bakery',3:'bakery',4:'bakery'},
};
export function interiorSpec(c){
 const kind=rooms[c.storyId]?.[c.storyIndex];if(!kind)return null;
 const id=c.storyId,i=c.storyIndex;
 const spec={kind,left:-3.55,right:3.55,back:-2.05,front:1.95,height:2.05,mixed:false};
 if(id==='red-riding-hood'&&(i===2||i===3))Object.assign(spec,{front:1.1,mixed:true});
 if(id==='jack-and-beanstalk'&&i===3)Object.assign(spec,{front:1.1,mixed:true});
 if(id==='goldilocks'&&(i===0||i===5))Object.assign(spec,{front:i===0?1.65:1.2,mixed:true});
 if(id==='hansel-and-gretel'&&(i===2||i===4))Object.assign(spec,{front:1.25,mixed:true});
 if(id==='cinderella'&&i===3)Object.assign(spec,{front:1.05,mixed:true});
 if(id==='bremen-musicians'&&(i===2||i===3))Object.assign(spec,{front:.05,mixed:true});
 if(id==='sweet-porridge'&&i>=3)Object.assign(spec,{front:1.35,mixed:true});
 if(id==='clock-with-a-breath'&&i>=4)Object.assign(spec,{front:1.2,mixed:true});
 if(id==='bakery-under-the-stars'&&i===0)Object.assign(spec,{right:.65,mixed:true});
 return spec;
}

export function addInterior(s,c,H){
 const spec=interiorSpec(c);if(!spec)return s;
 const {THREE,box,ball}=H,{kind,left:L,right:R,back:B,front:F,height:h}=spec;
 const width=R-L,depth=F-B,cx=(L+R)/2,cz=(B+F)/2;
 // Remove the exterior stage, not the independently animated actors/props.
 s.popup.children.filter(o=>o.isMesh).forEach(o=>o.visible=false);
 s.trees.forEach(o=>o.visible=false);
 for(const p of s.props.children)if(['cottage','candy-house','castle','flowers'].includes(p.userData.prop))p.visible=false;
 if(s.effects.classic?.room)s.effects.classic.room.visible=false;
 const root=new THREE.Group();root.userData.prop='cutaway-room';s.props.add(root);
 const royal=['palace','castle','bedroom'].includes(kind);
 const wallColor=kind==='candy'?'#dfc1b1':kind==='burrow'?'#bba384':royal?'#dbd1d9':'#e4d7bc';
 const trim=royal?'#b5a278':kind==='candy'?'#bc8892':'#a38a65';
 const floor=box(width,.05,depth,royal?'#d3c7b0':'#cfb58f',root,cx,-.025,cz);
 for(let x=L+.38;x<R;x+=.38)box(.012,.003,depth,'#b9a17e',root,x,.002,cz);
 // A roofless miniature set with translucent walls. Even the front outline
 // remains visible, but none of the wall materials writes over figure depth.
 const walls=[];
 const wall=(side)=>{const g=new THREE.Group();g.userData.side=side;root.add(g);walls.push(g);return g;};
 const rear=wall('back'),leftWall=wall('left'),rightWall=wall('right'),front=wall('front');
 box(width,h,.035,wallColor,front,cx,h/2,F);
 const wx=cx+.38,wy=1.26,ww=.86,wh=.72;
 box(width,wy-wh/2,.065,wallColor,rear,cx,(wy-wh/2)/2,B);
 box(width,h-(wy+wh/2),.065,wallColor,rear,cx,(h+wy+wh/2)/2,B);
 box(wx-ww/2-L,wh,.065,wallColor,rear,(L+wx-ww/2)/2,wy,B);
 box(R-wx-ww/2,wh,.065,wallColor,rear,(R+wx+ww/2)/2,wy,B);
 const window=new THREE.Group();rear.add(window);window.position.set(wx,wy,B+.04);
 for(const x of [-ww/2,ww/2])box(.045,wh+.09,.07,trim,window,x,0,0);
 for(const y of [-wh/2,wh/2])box(ww+.09,.045,.07,trim,window,0,y,0);
 box(.025,wh,.03,trim,window);box(ww,.025,.03,trim,window);
 box(ww+.15,.045,.23,trim,window,0,-wh/2-.04,.06);
 const sky=box(ww,.01,wh,'#b4cfce',window,0,0,-.07);sky.rotation.x=Math.PI/2;sky.castShadow=false;
 for(const [x,g]of [[L,leftWall],[R,rightWall]]){
  // Leave the front half open as a passage; exits never cross solid walls.
  const length=Math.min(depth,1.15);
  box(.065,h,length,wallColor,g,x,h/2,B+length/2);
  box(.09,.08,length,trim,g,x,h+.01,B+length/2);
 }
 box(width,.08,.09,trim,rear,cx,h+.01,B);
 box(width,.07,.055,trim,rear,cx,.065,B+.045);
 box(width,.035,.055,trim,root,cx,.018,F);
 if(royal){
  for(const x of [L+.2,R-.2]){box(.13,h,.13,'#eae1cc',rear,x,h/2,B+.12);box(.23,.1,.22,trim,rear,x,h-.03,B+.12);}
  for(const side of [-1,1])box(.15,.84,.075,'#a48c9d',window,side*(ww/2+.13),.02,.02);
 }else if(kind==='candy'){
  for(let n=0;n<12;n++)ball(.055,.055,.04,n%2?'#d397a9':'#edce80',rear,L+.2+n*(width-.4)/11,h-.12,B+.06);
 }
 if(spec.mixed){
  if(F<1.95)box(7.1,.025,2.15-F,'#bfc7a2',root,0,-.017,(F+2.15)/2);
  if(R<3.55)box(3.55-R,.025,depth,'#d9caa7',root,(R+3.55)/2,-.017,cz);
 }
 // Furnishing at the rear establishes room purpose without occupying paths.
 if(['kitchen','bakery','candy'].includes(kind)){
  const oven=new THREE.Group();root.add(oven);oven.position.set(L+.52,0,B+.28);
  box(.72,.83,.43,'#b3a18b',oven,0,.415,0);box(.47,.36,.035,'#645d53',oven,0,.36,.235);
  for(const x of [-.16,.16])ball(.035,.035,.025,'#d5bc83',oven,x,.71,.24);
  box(.78,.05,.48,trim,oven,0,.86,0);
 }
 if(['library','post-office','workshop','mill'].includes(kind)){
  const shelf=new THREE.Group();root.add(shelf);shelf.position.set(L+.66,0,B+.17);
  for(const y of [.35,.72,1.09])box(.98,.055,.25,trim,shelf,0,y,0);
  for(const x of [-.48,.48])box(.045,1.24,.25,trim,shelf,x,.62,0);
  for(let row=0;row<3;row++)for(let n=0;n<4;n++){
   box(.17,.23,.08,kind==='library'?'#d5c196':['#afbbb0','#d7bb99','#b9a6b7'][row],shelf,-.33+n*.22,.49+row*.37,.035);
   if(kind==='library')ball(.023,.033,.015,'#7f9666',shelf,-.33+n*.22,.49+row*.37,.09);
  }
 }
 // Extra openings identify scenes that show both sides of a window.
 let frontWindow,storageDoor;
 if(c.storyId==='bremen-musicians'&&c.storyIndex<=3){
  frontWindow=new THREE.Group();root.add(frontWindow);frontWindow.position.set(.1,0,F);
  for(const x of [-.8,.8])box(.05,1.8,.06,trim,frontWindow,x,.9,0);
  box(1.65,.05,.06,trim,frontWindow,0,1.8,0);box(1.65,.045,.16,trim,frontWindow,0,.55,0);
 }
 if(c.storyId==='cinderella'&&c.storyIndex===3){
  for(let n=0;n<2;n++)box(1.55,.03,.23,'#ded1b3',root,-.65,.016-n*.009,F+.15+n*.24);
  s.pigs.forEach(a=>a.root.position.z=.7);
 }
 if(c.storyId==='hansel-and-gretel'&&c.storyIndex===4)s.pigs[1].root.position.z=.9;
 if(c.storyId==='sweet-porridge'&&c.storyIndex===4)s.pigs[0].root.position.z=1.7;
 if(c.storyId==='bakery-under-the-stars'&&c.storyIndex===0)s.pigs[1].root.position.set(1.2,0,.85);
 if(c.storyId==='red-riding-hood'&&c.storyIndex===4){
  const closet=new THREE.Group();root.add(closet);closet.position.set(.2,0,-.55);
  box(1.05,1.55,.055,'#bda98b',closet,0,.775,-.48);
  for(const x of [-.52,.52])box(.055,1.55,.95,'#bda98b',closet,x,.775,0);
  storageDoor=new THREE.Group();closet.add(storageDoor);storageDoor.position.set(-.5,0,.5);
  box(1,1.5,.06,'#a68d69',storageDoor,.5,.75,0);ball(.035,.035,.035,'#e2c882',storageDoor,.87,.72,.05);
 }
 if(c.storyId==='red-riding-hood'&&c.storyIndex===5){
  const table=new THREE.Group();root.add(table);table.position.set(0,0,-.6);
  box(1.4,.07,.7,'#b49b77',table,0,.64,0);
  for(const x of [-.55,.55])for(const z of [-.23,.23])box(.06,.6,.06,'#a38a65',table,x,.3,z);
  for(const x of [-.4,.4]){H.mesh(new THREE.CylinderGeometry(.1,.075,.15,16),'#e9dbc2',table,x,.75,.12);}
  ball(.22,.07,.12,'#c8a46d',table,0,.73,-.12);
 }
 if(c.storyId==='cinderella'&&c.storyIndex===0){
  H.mesh(new THREE.CylinderGeometry(.085,.06,.12,16),'#b78368',window,0,-wh/2+.04,.085);
  box(.015,.17,.015,'#829967',window,0,-wh/2+.18,.085);ball(.08,.05,.05,'#d2a0ad',window,0,-wh/2+.28,.085);
 }
 if(c.storyId==='clock-with-a-breath'&&c.storyIndex>=4){
  const pond=s.props.children.find(p=>p.userData.prop==='pond');if(pond){pond.position.set(1.45,0,2.05);pond.scale.setScalar(.15);}
  for(let j=0;j<3;j++){box(.015,.22,.015,'#7d9b68',root,-.32+j*.32,.11,2.15);ball(.09,.04,.07,'#d5a5a6',root,-.32+j*.32,.23,2.15);}
 }
 s.interior={root,floor,walls,window,frontWindow,storageDoor,spec};
 makeWallsTranslucent(s.interior);
 return s;
}

export function animateInterior(tl,s){
 if(s.interior?.storageDoor){
  tl.set(s.interior.storageDoor.rotation,{y:0},0);
  tl.to(s.interior.storageDoor.rotation,{y:-Math.PI*.55,duration:.85},.9);
 }
}

export function makeWallsTranslucent(room){
 for(const wall of room.walls)wall.traverse(m=>{
  if(!m.isMesh)return;
  m.material=m.material.clone();m.material.transparent=true;
  m.material.opacity=wall.userData.side==='front'?.08:.26;
  m.material.depthWrite=false;m.castShadow=false;
 });
}

export function updateInteriorVisibility(s,camera){
 const room=s.interior;if(!room)return;
 // Cache a vector on the room instead of allocating during every frame.
 const v=room.cameraLocal||(room.cameraLocal=camera.position.clone());
 camera.getWorldPosition(v);room.root.worldToLocal(v);
 for(const wall of room.walls){
  const side=wall.userData.side,b=room.spec;
  const near=side==='front'||(side==='back'?v.z<b.back:side==='left'?v.x<b.left:v.x>b.right);
  wall.visible=true;
  wall.traverse(m=>{if(m.isMesh)m.material.opacity=side==='front'?.08:near?.12:.26;});
 }
}
