// Concrete props for the original stories. Built once, before the timeline;
// carried copies stay parented to hands/beaks, so replay never reparents objects.
export function addOriginalDetails(s,c,H){
 const ids=['lantern-with-many-windows','rain-post-office','bridge-that-listened','shadow-takes-a-day-off','seed-library-notebook','clock-with-a-breath','paper-boat-map','cloud-tailor-pockets','bakery-under-the-stars','orchestra-of-small-sounds'];
 if(!ids.includes(c.storyId))return s;
 const {THREE,box,ball,mesh}=H,e=s.effects,o=e.original={},i=c.storyIndex;
 const get=k=>s.props.children.find(p=>p.userData.prop===k);
 const group=(name,parent=s.props,x=0,y=0,z=0)=>{const g=new THREE.Group();g.userData.prop=name;g.position.set(x,y,z);parent.add(g);return g;};
 const replace=k=>{let g=get(k);if(!g)return group(k);g.traverse(p=>{if(p.geometry)p.geometry.dispose();});g.clear();g.position.set(0,0,0);g.rotation.set(0,0,0);g.scale.set(1,1,1);return g;};
 const cylinder=(r,h,color,parent,x=0,y=0,z=0)=>mesh(new THREE.CylinderGeometry(r,r,h,24),color,parent,x,y,z);
 const paper=(name,parent,x=0,y=.65,z=.4,w=.62,h=.4)=>{const g=group(name,parent,x,y,z);box(w,h,.025,'#f4e8cc',g);return g;};
 const ink=(sheet,style='writing')=>{const lines=group('ink',sheet);if(style==='route'){
  for(let n=0;n<4;n++)box(.11,.015,.008,'#698f9e',lines,-.2+n*.12,Math.sin(n)*.1,.019);
  for(let n=0;n<3;n++)ball(.045,.065,.007,'#799c73',lines,-.12+n*.12,.1,.022);
 }else if(style==='flower'){
  box(.012,.16,.008,'#80a273',lines,0,-.025,.021);for(let n=0;n<5;n++)ball(.043,.04,.008,'#c697b3',lines,Math.sin(n*1.26)*.045,.075+Math.cos(n*1.26)*.045,.024);
 }else for(let n=0;n<3;n++)box(.4-n*.045,.014,.008,'#7b8277',lines,0,.105-n*.085,.02);
 return lines;};
 const hidden=g=>{g.userData.restScale=g.scale.clone();g.scale.setScalar(.001);return g;};
 const table=(name='worktable',x=0,z=.1)=>{const g=group(name,s.props,x,0,z);box(1.35,.08,.75,'#b69c79',g,0,.59,0);for(const x of [-.52,.52])for(const z of [-.25,.25])box(.065,.55,.065,'#a58a69',g,x,.28,z);return g;};
 const held=(kind,make)=>s.pigs.map(a=>{const g=group(kind,a.root,0,a.type==='turtle'?.2:['duck','dove','crow'].includes(a.type)?.48:.58,a.type==='turtle'?.65:['duck','dove','crow'].includes(a.type)?.48:.29);make(g);hidden(g);return g;});
 o.notebook=paper('notebook',s.props,0,.67,.1,.67,.4);o.notebook.rotation.x=-Math.PI/2;o.notes=ink(o.notebook);o.notes.scale.setScalar(.001);hidden(o.notebook);
 o.heldNotes=held('held-notebook',g=>{box(.38,.28,.022,'#f4e8cc',g);ink(g);});
 o.pencils=s.pigs.map(a=>{const pencil=box(.015,.24,.015,'#a57c4d',a.arms[0]||a.root,0,-.22,.055);pencil.rotation.z=.35;return hidden(pencil);});
 // A notebook replaces the previous floating stack for measuring/writing scenes.
 if(get('books')){get('books').position.set(-1.1,0,-1.2);get('books').scale.setScalar(.62);}
 if(c.storyId==='lantern-with-many-windows'){
  const lamp=replace('lantern');lamp.position.set(0,0,.05);o.lantern=lamp;e.glow=lamp;
  for(const x of [-.34,.34])for(const z of [-.23,.23])box(.045,1,.045,'#927755',lamp,x,.7,z);
  box(.74,.055,.55,'#927755',lamp,0,.22,0);box(.74,.055,.55,'#927755',lamp,0,1.2,0);
  mesh(new THREE.ConeGeometry(.48,.16,4),'#b88957',lamp,0,1.3,0);mesh(new THREE.TorusGeometry(.13,.021,6,24,Math.PI),'#8d7454',lamp,0,1.4,0);
  // An open front exposes three real windows; colored panels fill the openings.
  box(.68,.92,.025,'#d4ad76',lamp,0,.71,-.23);
  o.patches=[];for(let n=0;n<3;n++){const panel=box(.205,.78,.025,['#efd399','#adc6d0','#d9b1bd'][n],lamp,-.224+n*.224,.71,.24);panel.material=panel.material.clone();o.patches.push(panel);}
  o.brokenBranch=box(.6,.045,.04,'#876d54',lamp,.1,1.08,.36);o.brokenBranch.rotation.z=.55;
  o.lampBulb=ball(.1,.16,.08,'#fff0af',lamp,0,.75,0);o.lampBulb.material=o.lampBulb.material.clone();
  o.extraPatch=box(.18,.2,.015,'#90a78c',lamp,.23,.92,.265);hidden(o.extraPatch);
  if(i!==0)hidden(o.brokenBranch);
  o.testSteps=group('test-steps');for(let n=0;n<3;n++)box(.45,.08+n*.06,.36,'#b5b39d',o.testSteps,-.55+n*.55,.04+n*.03,1);
  o.notebook.position.set(-1.2,.65,.2);
 }else if(c.storyId==='rain-post-office'){
  o.table=table();const letter=replace('letter');letter.position.set(0,.66,.43);box(.6,.39,.02,'#f4e8cc',letter);e.letter=letter;o.letterInk=ink(letter,i===4?'flower':i<3?'route':'writing');
  if(i===0)o.letterInk.scale.setScalar(.001);
  letter.rotation.x=-Math.PI/2;o.heldLetters=held('held-letter',g=>{box(.46,.29,.018,'#f4e8cc',g);if(i>0)ink(g,i===4?'flower':i<3?'route':'writing');});
  if(get('mailbox')){get('mailbox').position.set(-1.45,0,-.6);get('mailbox').scale.setScalar(.68);}
  o.notebook.position.set(.4,.64,.1);
 }else if(c.storyId==='bridge-that-listened'){
  o.plan=paper('bridge-plan',s.props,0,.06,.9,.82,.48);o.plan.rotation.x=-Math.PI/2;
  o.planInk=group('plan-ink',o.plan);for(let n=0;n<7;n++)box(.09,.018,.015,'#728e97',o.planInk,-.3+n*.1,Math.sin(n/6*Math.PI)*.14,.022);
  o.river=mesh(new THREE.PlaneGeometry(1.45,1.9),'#98bfc3',s.props,0,.042,-.95);o.river.rotation.x=-Math.PI/2;
  o.bridge=get('bridge');o.bridgeSign=paper('bridge-feedback-sign',s.props,1.55,1,-.75,.48,.32);ink(o.bridgeSign);
  box(.04,.85,.04,'#a68e6d',s.props,1.55,.425,-.75);hidden(o.bridgeSign);o.notebook.position.set(-.7,.65,.55);
 }else if(c.storyId==='shadow-takes-a-day-off'){
  const shadow=s.pigs.find(a=>a.name==='影影');if(shadow){shadow.root.scale.z=.16;shadow.root.traverse(m=>{if(m.isMesh){m.material=m.material.clone();m.material.color.set('#626379');m.material.roughness=1;}});}
  o.art=paper('leaf-sketch',s.props,.85,.9,-.7,.82,.66);o.artInk=group('leaf-drawings',o.art);for(let n=0;n<3;n++){const leaf=ball(.075,.19,.008,'#747f75',o.artInk,-.23+n*.23,0,.026);leaf.rotation.z=-.35+n*.35;}hidden(o.artInk);
  for(const side of [-1,1])box(.04,.85,.04,'#aa9270',o.art,side*.34,-.55,-.04);if(i<2)hidden(o.art);
  o.leafBall=group('leaf-ball',s.props,-.7,.12,.75);for(let n=0;n<4;n++){const leaf=ball(.11,.09,.1,'#89a274',o.leafBall,Math.sin(n*1.57)*.035,0,Math.cos(n*1.57)*.035);leaf.rotation.z=n*.7;}
  if(i!==4)hidden(o.leafBall);o.choiceCards=[paper('child-plan',s.props,-.65,.06,.4,.48,.36),paper('shadow-plan',s.props,.65,.06,.4,.48,.36)];o.choiceCards.forEach(g=>g.rotation.x=-Math.PI/2);if(i!==3)o.choiceCards.forEach(hidden);
  o.notebook.position.set(-1.4,.6,.05);
 }else if(c.storyId==='seed-library-notebook'){
  const planter=(g)=>{mesh(new THREE.CylinderGeometry(.33,.25,.45,24,1,true),'#b78263',g,0,.28,0);cylinder(.3,.025,'#6f6552',g,0,.43,0);box(.085,.045,.018,'#403f35',g,0,.1,.255);return g;};
  o.pot=planter(replace('pot'));o.pot.position.set(0,0,.15);e.pot=o.pot;
  o.secondPot=planter(group('second-planter',s.props,-.9,0,-.45));if(i!==3)hidden(o.secondPot);
  o.wetSoil=cylinder(.285,.014,'#879796',o.pot,0,.452,0);hidden(o.wetSoil);e.water=o.wetSoil;
  if(get('seedling'))get('seedling').visible=false;
  const sprout=group('seedling',o.pot,0,.43,0);box(.022,.42,.022,'#7f9b61',sprout,0,.21,0);ball(.14,.025,.06,'#9ab577',sprout,-.1,.26,0);ball(.14,.025,.06,'#9ab577',sprout,.1,.35,0);o.seedling=sprout;e.plant=sprout;
  if(i===3){o.secondSeedling=sprout.clone();o.secondSeedling.scale.setScalar(.7);o.secondPot.add(o.secondSeedling);}if(get('flower'))get('flower').visible=false;if(get('beans'))get('beans').visible=false;
  o.seedPacket=paper('seed-packet',s.props,-.5,.06,.6,.32,.32);for(let n=0;n<3;n++)ball(.025,.033,.01,'#92744d',o.seedPacket,-.07+n*.07,0,.022);
  o.seedHands=held('seed-packet-in-hand',g=>{box(.27,.25,.018,'#e5d2a4',g);ball(.035,.045,.01,'#92744d',g,0,0,.016);});
  if(i<3)hidden(sprout);if(i===4){o.flower=group('flower-head',sprout,0,.44,0);for(let n=0;n<5;n++)ball(.07,.065,.02,'#a68db5',o.flower,Math.sin(n*1.26)*.055,Math.cos(n*1.26)*.055,0);}
  o.drainDrops=group('drain-drops',s.props,0,.14,.42);for(let n=0;n<3;n++)ball(.018,.04,.018,'#8ebac5',o.drainDrops,n*.04,.05-n*.04,0);hidden(o.drainDrops);
  o.notebook.position.set(-.6,.62,.45);
 }else if(c.storyId==='clock-with-a-breath'){
  const clock=replace('clocktower');clock.position.set(.25,.24,.1);clock.scale.setScalar(.65);
  o.clockTable=group('clock-table');box(1.7,.07,.9,'#b69c79',o.clockTable,0,.36,.2);for(const x of [-.7,.7])for(const z of [-.12,.52])box(.045,.33,.045,'#a58a69',o.clockTable,x,.17,z);box(.8,.58,.24,'#b59f7b',clock,0,.52,0);const dial=cylinder(.245,.035,'#efe3c3',clock,0,.55,.145);dial.rotation.x=Math.PI/2;
  o.clockButton=ball(.065,.045,.06,'#839b84',clock,.3,.855,0);const hand=group('clock-hand',clock,0,.55,.175);box(.018,.19,.018,'#657161',hand,0,.07,0);e.hand=hand;o.clock=clock;
  o.schedule=paper('schedule-card',s.props,-.55,.41,.35,.75,.5);o.schedule.rotation.x=-Math.PI/2;o.scheduleTasks=[];for(let n=0;n<6;n++)o.scheduleTasks.push(box(.24,.035,.015,'#9f9c7c',o.schedule,-.18+(n%2)*.36,.14-Math.floor(n/2)*.14,.021));
  o.notebook.position.set(.7,.65,.4);if(i===0)hidden(o.clockButton);
  if(get('pond')){get('pond').position.set(1,0,-1);get('pond').scale.setScalar(.25);}
 }else if(c.storyId==='paper-boat-map'){
  if(get('pond'))get('pond').visible=false;
  if(i<5){const water=mesh(new THREE.PlaneGeometry(2.65,.9),'#94bac2',s.props,0,.048,-.35);water.rotation.x=-Math.PI/2;const pool=cylinder(.4,.012,'#94bac2',s.props,1.05,.05,.05);o.channel=water;o.shallowPool=pool;}
  const boat=replace('boat');boat.position.set(-.8,.055,-.2);e.boat=boat;
  const triangle=(points,color)=>{const shape=new THREE.Shape();shape.moveTo(...points[0]);for(const point of points.slice(1))shape.lineTo(...point);shape.closePath();return mesh(new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:false}),color,boat);};
  // Folded diamond hull and central paper fold, deliberately no mast or sail.
  const front=triangle([[-.47,.18],[.47,.18],[.25,0],[-.25,0]],'#e9dac0');front.position.z=.18;
  const back=front.clone();back.position.z=-.18;boat.add(back);const fold=triangle([[-.32,.12],[0,.42],[.32,.12]],'#f5ead6');fold.position.z=0;
  for(const side of [-1,1]){const f=box(.38,.012,.38,'#d9c9aa',boat,side*.15,.075,0);f.rotation.z=side*.36;}
  o.boatLeaf=group('blocking-leaf',s.props,.8,.08,-.2);const leaf=ball(.24,.02,.14,'#88a379',o.boatLeaf);leaf.rotation.y=.4;box(.28,.014,.015,'#6e8d60',o.boatLeaf,.05,.022,0);
  if(![0,1,4].includes(i))hidden(o.boatLeaf);
  o.map=paper('waterway-map',s.props,-.7,.06,.65,.76,.54);o.map.rotation.x=-Math.PI/2;o.mapRoute=ink(o.map,'route');
  o.boatHands=held('held-paper-boat',g=>{const mini=boat.clone();mini.position.set(0,0,0);mini.scale.setScalar(.65);g.add(mini);});
  o.notebook.position.set(1.05,.6,.45);
 }else if(c.storyId==='cloud-tailor-pockets'){
  o.cloud=e.pocketCloud;o.pockets=[];
  if(o.cloud){const old=o.cloud.children.at(-1);old.visible=false;for(let n=0;n<5;n++){const pocket=group('cloud-pocket',o.cloud,-.48+n*.24,-.14,.23);box(.2,.24,.045,'#b7a8ca',pocket);box(.18,.025,.065,'#8e82a8',pocket,0,.12,.01);o.pockets.push(pocket);}}
  o.cloudShade=group('cloud-shade',s.props,0,.035,.3);const shade=cylinder(.8,.008,'#8d9a88',o.cloudShade);shade.scale.z=.55;hidden(o.cloudShade);
  o.cloth=group('spare-cloth',s.props,-.9,.7,.2);for(let n=0;n<3;n++)box(.22,.018,.23,'#b7a8ca',o.cloth,n*.06,n*.025,0);
  const loom=get('loom');if(loom){loom.position.set(-1.05,0,-.65);loom.scale.setScalar(.5);for(let n=0;n<8;n++)box(.012,1.26,.012,'#d6b7c3',loom,-.65+n*.18,.97,0);}
  o.notebook.position.set(-.65,.65,.5);
 }else if(c.storyId==='bakery-under-the-stars'){
  o.table=table();if(get('clocktower'))get('clocktower').visible=false;if(get('mailbox'))get('mailbox').visible=false;if(get('grain')){get('grain').scale.setScalar(.35);get('grain').position.set(-1.2,.1,.3);}
  e.bread.position.set(.3,.72,.4);e.bread.scale.setScalar(.72);o.bread=e.bread;
  o.dough=group('dough',s.props,-.3,.71,.4);ball(.24,.1,.18,'#e4d3a7',o.dough);if(i!==1&&i!==3)hidden(o.dough);
  o.breadHands=held('bread-bag',g=>{box(.33,.38,.19,'#cfb48a',g,0,.08,0);ball(.13,.08,.08,'#bf945f',g,0,.3,0);});
  o.hoursSign=paper('hours-sign',s.props,1.15,1,-.1,.56,.5);o.hoursLines=ink(o.hoursSign);o.hoursSign.rotation.y=-.2;box(.04,.75,.04,'#a68e6d',s.props,1.15,.375,-.1);
  o.closedBar=box(.46,.045,.018,'#b97a68',o.hoursSign,0,0,.045);o.closedBar.rotation.z=-.45;
  if(i>=2&&i<=4)hidden(o.closedBar);
  const house=get('cottage');if(house){house.position.x=-1.2;house.position.z=-1;house.scale.setScalar(.65);}
  o.notebook.position.set(-.4,.65,.3);
 }else if(c.storyId==='orchestra-of-small-sounds'){
  const drum=get('drum');if(drum){drum.position.set(-.35,0,.15);drum.scale.setScalar(.65);e.drum=drum;}
  const mouse=s.pigs.find(a=>a.type==='mouse');o.musicStones=[];
  if(mouse)for(const [n,limb]of mouse.arms.entries()){const stone=ball(.075,.065,.055,'#b3afa2',limb,0,-.24,.035);stone.userData.restScale=stone.scale.clone();o.musicStones.push(stone);}
  o.heavyStones=group('large-stones',s.props,.4,.09,.7);for(const side of [-1,1])ball(.15,.12,.11,'#aaa798',o.heavyStones,side*.14,0,0);if(i!==1)hidden(o.heavyStones);
  o.score=paper('score-page',s.props,.8,.95,.05,.6,.42);o.scoreInk=group('score-notes',o.score);for(let n=0;n<7;n++){box(.46,.006,.009,'#879087',o.scoreInk,0,.14-n*.045,.02);if(n%2===0)ball(.022,.017,.008,'#6e796c',o.scoreInk,-.14+n*.045,.13-n*.02,.028);}
  box(.025,.9,.025,'#a08b6d',s.props,.8,.45,.05);if(i<3)hidden(o.score);o.notebook.position.set(-1.5,.5,.55);
 }
 return s;
}
