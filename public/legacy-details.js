// Concrete state carried by each page: props are rebuilt for every chapter.
// Set the chapter's starting state here so opening a later page is coherent.
export function addLegacyDetails(s,c,H){
 const {THREE,box,ball,mesh}=H,e=s.effects,id=c.storyId,i=c.storyIndex;
 const prop=k=>s.props.children.find(p=>p.userData.prop===k);
 const add=k=>{const p=new THREE.Group();p.userData.prop=k;s.props.add(p);return p;};
 const actor=t=>s.pigs.find(a=>a.type===t);
 if(!['red-riding-hood','tortoise-and-hare','ugly-duckling','jack-and-beanstalk','goldilocks','hansel-and-gretel','puss-in-boots','cinderella','thumbelina','lion-and-mouse'].includes(id))return s;
 if(id==='red-riding-hood'&&i===2){const wolf=actor('wolf');const cap=mesh(new THREE.ConeGeometry(.29,.27,16),'#e5d9c9',wolf.root,0,1.3,0);cap.rotation.z=.2;}
 if(id==='red-riding-hood'&&i===1&&prop('basket')){const basket=prop('basket');s.pigs[0].root.add(basket);basket.position.set(.34,.4,.08);}
 if(prop('bed')){e.bed=prop('bed');e.bed.position.set(.4,0,.55);}
 if(prop('cage')){
  const cage=prop('cage');cage.clear();cage.position.set(.45,0,.2);e.cage=cage;
  box(1.15,.06,1.03,'#b89760',cage,0,.03,0);
  for(const x of [-.55,.55])for(let z=-.5;z<.51;z+=.25)box(.04,1.45,.04,'#b99e6c',cage,x,.73,z);
  for(let x=-.5;x<=.51;x+=.25)box(.04,1.45,.04,'#b99e6c',cage,x,.73,-.5);
  box(1.2,.05,1.1,'#c6ad7d',cage,0,1.47,0);
  const door=new THREE.Group();door.position.set(-.55,0,.52);cage.add(door);e.cageDoor=door;
  for(let x=0;x<1.11;x+=.22)box(.04,1.4,.04,'#b99e6c',door,x,.73,0);
  for(const y of [.1,1.38])box(1.1,.04,.04,'#b99e6c',door,.55,y,0);
  if(id==='jack-and-beanstalk'){actor('duck').root.position.set(.45,.06,.2);if(i===3)actor('giant').root.position.set(-1.45,0,-.2);}
  if(id==='hansel-and-gretel'&&i>=3)s.pigs[0].root.position.set(.45,.04,.2);
 }
 if(prop('key')){const key=prop('key');key.position.set(-.8,.85,.4);mesh(new THREE.TorusGeometry(.09,.025,6,16),'#d5b857',key,0,.13,0);box(.035,.25,.035,'#d5b857',key,0,-.03,0);box(.11,.035,.035,'#d5b857',key,.04,-.13,0);e.key=key;if(id==='hansel-and-gretel'){key.position.set(-.8,.85,-.1);if(e.chair)e.chair.position.set(-.8,0,.15);}}
 if(prop('bell')){const bell=prop('bell');bell.position.set(-1.25,.1,1.3);mesh(new THREE.ConeGeometry(.13,.2,12),'#d9ba67',bell,0,.72,0);box(.03,.9,.03,'#8c7551',bell,0,.45,0);e.bell=bell;}
 if(prop('bag')){const bag=prop('bag');bag.position.set(-1.1,0,.7);ball(.35,.38,.25,'#ac916b',bag,0,.35,0);mesh(new THREE.TorusGeometry(.19,.035,6,16),'#765c41',bag,0,.7,0).rotation.x=Math.PI/2;e.bag=bag;}
 if(id==='tortoise-and-hare'&&prop('finish'))box(2.5,.018,.11,'#f5edd7',prop('finish'),0,.04,0);
 if(id==='jack-and-beanstalk'&&i===2){const castle=prop('castle');castle.position.set(-.15,1.62,-1.1);castle.scale.setScalar(.65);const cloud=add('cloud-landing');for(let n=0;n<5;n++)ball(.46,.09,.38,'#ececdc',cloud,-.4+n*.4,1.68,-.45);}
 if(id==='jack-and-beanstalk'&&i===4&&prop('pond')){prop('pond').position.x=-1.1;prop('pond').scale.setScalar(.65);}
 if(id==='jack-and-beanstalk'&&prop('beans')){const beans=prop('beans');beans.clear();for(let j=0;j<3;j++)ball(.085,.035,.055,'#98955b',beans,-.32+j*.32,.07,0);}
 if(id==='hansel-and-gretel'&&prop('stones'))prop('stones').children.forEach(stone=>stone.scale.multiplyScalar(1.5));
 if(id==='goldilocks'&&i===2&&e.chair){for(const [x,k]of [[-1.25,1.2],[1.25,1.05]]){const chair=e.chair.clone();chair.position.set(x,0,-.8);chair.scale.setScalar(k);s.props.add(chair);}}
 if(id==='goldilocks'){
  if(i===0&&prop('cottage'))prop('cottage').visible=false;
  if(i===5&&e.chair){e.chair.position.set(-1.45,0,.25);e.chair.scale.setScalar(.8);}
  if(prop('porridge')){e.bowls=prop('porridge').children.filter(x=>x.geometry?.type==='CylinderGeometry');if(i===3)e.bowls[2].visible=false;}
  if(e.chair){e.chairSeat=e.chair.children[0];e.chairBack=e.chair.children[1];e.chairLegs=e.chair.children.slice(2);if(i===3||i===4){e.chairSeat.rotation.z=.38;e.chairBack.rotation.z=.3;e.chairLegs.forEach((leg,j)=>{leg.rotation.z=j%2?.5:-.5;});}if(i===3){e.chair.position.set(-1.5,0,.3);e.chair.scale.setScalar(.72);}}
  if(i===0){s.pigs[0].root.position.x=-1.05;s.pigs[1].root.position.x=1.05;s.pigs[2].root.position.x=0;}
 }
 if(id==='ugly-duckling'&&i===0){s.pigs[0].root.position.set(-.4,0,.85);s.pigs[0].root.visible=false;}
 if(id==='ugly-duckling'&&i===3){const nest=add('winter-shelter');nest.position.set(-.85,0,1.2);mesh(new THREE.TorusGeometry(.43,.08,6,24),'#b7a178',nest,0,.09,0).rotation.x=Math.PI/2;for(let j=0;j<4;j++)ball(.05,.035,.04,'#b99f65',nest,.5+j*.08,.06,.3);}
 if(id==='puss-in-boots'){e.wornBoots=s.pigs[0].root.children.filter(m=>m.geometry?.type==='BoxGeometry'&&m.geometry.parameters.width===.14&&m.geometry.parameters.height===.23);if(i===0)e.wornBoots.forEach(m=>m.visible=false);if(i===1&&prop('boots'))prop('boots').visible=false;}
 if(id==='puss-in-boots'&&i===3){actor('mouse').root.visible=false;actor('mouse').root.position.copy(actor('giant').root.position);}
 if(id==='cinderella'){const dress=s.pigs[0].root.children.find(m=>m.geometry?.type==='ConeGeometry'&&m.geometry.parameters.height===.58);if(dress){e.dressMaterial=dress.material;if([0,1,4].includes(i))dress.material.color.set('#9b9890');}}
 if(id==='cinderella'&&i===0){const broom=new THREE.Group();s.pigs[0].root.add(broom);box(.025,.8,.025,'#95744b',broom,.34,.4,.14);box(.22,.2,.08,'#bba36a',broom,.34,.08,.14);}
 if(id==='cinderella'&&i===1){const pumpkin=add('pumpkin');pumpkin.position.set(0,0,-.6);ball(.45,.38,.45,'#d3a65f',pumpkin,0,.38,0);box(.05,.15,.05,'#719453',pumpkin,0,.82,0);e.pumpkin=pumpkin;}
 if(id==='cinderella'&&prop('shoe')){const shoe=prop('shoe');shoe.children.slice(2).forEach(x=>shoe.remove(x));}
 if(id==='cinderella'&&i===3){prop('shoe').visible=false;}
 if(id==='jack-and-beanstalk'&&i===5){const crop=add('vegetable-crop');for(let j=0;j<3;j++){box(.025,.55,.025,'#789654',crop,-.4+j*.4,.3,.6);ball(.17,.025,.08,'#9fb77a',crop,-.4+j*.4,.45,.6);}crop.scale.y=.02;e.crop=crop;}
 if(id==='thumbelina'&&i===0)s.pigs[0].root.position.set(.25,1.95,-.85);
 if(id==='thumbelina'&&i===1){s.pigs[0].root.position.set(0,.1,.2);s.pigs[1].root.position.set(-1.45,0,.8);}
 if(id==='thumbelina'&&i===3)s.pigs[1].root.position.set(.2,.1,-.1);
 if(id==='lion-and-mouse'&&i>=3&&i<=4){actor('lion').root.position.set(-.45,0,1.2);actor('mouse').root.position.set(1.5,0,1.5);if(i===3)e.net.position.y=2.4;}
 return s;
}
