import { buildFairytaleScene } from './fairytale3d.js';
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
const C={paper:'#f7efd9',ink:'#314c3c',green:'#6e8b5d',pink:'#efb2a0',snout:'#da9289',wood:'#b58654',brick:'#bb6a4c'};
const materials=new Map();
function mat(color){if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.88}));return materials.get(color);}
function mesh(geometry,color,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,color,parent,x=0,y=0,z=0){return mesh(new THREE.BoxGeometry(w,h,d),color,parent,x,y,z);}
function ball(w,h,d,color,parent,x=0,y=0,z=0){const m=mesh(new THREE.SphereGeometry(1,16,12),color,parent,x,y,z);m.scale.set(w,h,d);return m;}
function cone(r,h,color,parent,x=0,y=0,z=0){return mesh(new THREE.ConeGeometry(r,h,5),color,parent,x,y,z);}
function paper(shape,color,parent,depth=.035){return mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false}),color,parent);}
function leafTree(parent,x,z,h,tint){const root=new THREE.Group();root.position.set(x,0,z);parent.add(root);box(.1,h*.64,.1,'#866d48',root,0,h*.32,0);const shape=new THREE.Shape();shape.moveTo(-h*.31,h*.18);shape.lineTo(0,h);shape.lineTo(h*.31,h*.18);shape.closePath();paper(shape,tint,root);const back=paper(shape,tint,root);back.rotation.y=Math.PI/2;box(.5,.025,.37,'#d9dcc0',root,0,.015,0);return root;}
function pig(parent,x,z,index,name){
 const root=new THREE.Group();root.position.set(x,0,z);root.userData.character=name;parent.add(root);
 const palette=['#c99249','#739b9a','#b65e44'];
 const body=ball(.3,.34,.25,palette[index],root,0,.49,0);
 const head=ball(.36,.33,.31,C.pink,root,0,.98,.035);
 const ears=[];for(const side of [-1,1]){const ear=cone(.115,.29,C.pink,root,side*.25,1.27,.015);ear.rotation.z=-side*.24;ears.push(ear);ball(.035,.048,.016,'#303b31',root,side*.135,1.035,.319);ball(.064,.032,.012,'#df8d86',root,side*.26,.917,.268);}
 ball(.18,.12,.09,C.snout,root,0,.909,.348);for(const side of [-1,1])ball(.022,.035,.013,'#945b53',root,side*.063,.91,.43);
 const mouth=ball(.068,.024,.017,'#945b53',root,0,.783,.26);
 const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.28,.64,0);root.add(arm);ball(.075,.2,.077,C.pink,arm,side*.015,-.13,0);arm.rotation.z=side*.27;arms.push(arm);}
 const legs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.14,.26,0);root.add(leg);box(.12,.22,.12,C.pink,leg,0,-.08,0);ball(.09,.058,.14,'#574f3d',leg,0,-.19,.04);legs.push(leg);box(.04,.45,.025,'#f3deb6',root,side*.13,.53,.227);}
 const tail=new THREE.Mesh(new THREE.TorusGeometry(.07,.025,6,12,Math.PI*1.7),mat(C.pink));tail.position.set(.3,.42,-.1);root.add(tail);
 const tab=box(.67,.022,.45,'#ddd8bc',root,0,.012,0);tab.castShadow=false;
 return {root,body,head,mouth,baseMouth:mouth.scale.y,arms,legs,ears,name};
}
function wolf(parent){
 const root=new THREE.Group();root.position.set(-1.8,0,1.25);root.rotation.y=.6;root.userData.character='大野狼';parent.add(root);
 ball(.3,.46,.27,'#62786f',root,0,.59,0);ball(.31,.31,.32,'#788c7c',root,0,1.12,0);
 for(const s of [-1,1]){const ear=cone(.12,.38,'#5c7368',root,s*.22,1.46,0);ear.rotation.z=-s*.2;ball(.035,.045,.023,'#293c32',root,s*.12,1.18,.27);box(.13,.32,.14,'#52665c',root,s*.14,.17,0);ball(.1,.065,.17,'#405649',root,s*.14,.047,.06);}
 ball(.19,.11,.27,'#b9c0a6',root,0,1.025,.3);ball(.085,.065,.062,'#2d4235',root,0,1.077,.543);
 const mouth=box(.13,.025,.08,'#324336',root,0,.955,.43);
 const arms=[];for(const s of [-1,1]){const arm=new THREE.Group();arm.position.set(s*.3,.85,0);root.add(arm);ball(.08,.25,.08,'#788c7c',arm,0,-.18,0);arm.rotation.z=s*.2;arms.push(arm);}
 const tail=cone(.17,.85,'#63796a',root,-.15,.42,-.4);tail.rotation.x=-1;return {root,arms,mouth,baseMouth:mouth.scale.y,name:'大野狼'};
}
function house(parent,kind){
 const root=new THREE.Group();root.position.set(.55,0,-.83);parent.add(root);
 const w=1.95,h=1.45,d=1.5;const color=kind==='brick'?C.brick:kind==='wood'?C.wood:'#d9b865';
 box(w,h,d,color,root,0,h/2,0);
 // Two roof panels and a filled triangular gable give the house real volume.
 const slope=Math.atan2(.75,1.17),length=Math.hypot(.75,1.17);
 for(const side of [-1,1]){const roof=box(length,.12,1.85,kind==='straw'?'#c29c4a':kind==='wood'?'#806648':'#854736',root,side*.57,1.79,0);roof.rotation.z=-side*slope;}
 const gable=new THREE.Shape();gable.moveTo(-.97,1.45);gable.lineTo(0,2.07);gable.lineTo(.97,1.45);gable.closePath();const g=paper(gable,color,root,.05);g.position.z=.755;
 if(kind==='brick'){
  for(let r=0;r<5;r++){box(w,.023,.014,'#e7ba8f',root,0,.16+r*.27,.758);for(let j=0;j<5;j++)box(.017,.25,.014,'#e7ba8f',root,-.83+j*.4+(r%2)*.16,.285+r*.27,.763);}
  box(.28,.72,.31,'#a65b44',root,.53,1.99,-.3);
 }else if(kind==='wood'){
  for(let r=0;r<6;r++)box(w,.025,.025,'#8b6746',root,0,.1+r*.25,.755);
 }else{
  for(let j=0;j<13;j++){box(.02,1.42,.014,'#b29448',root,-.9+j*.15,.73,.757);}
 }
 box(.48,.91,.075,'#685036',root,.13,.455,.81);box(.027,.76,.015,'#987448',root,.0,.44,.852);ball(.028,.028,.028,'#e2b963',root,.28,.5,.872);
 for(const x of [-.62,.64]){box(.36,.44,.065,'#765b3b',root,x,.99,.803);box(.28,.35,.015,'#f2d995',root,x,.99,.841);box(.024,.35,.015,'#826947',root,x,.99,.855);box(.28,.023,.015,'#826947',root,x,.99,.855);}
 box(2.3,.028,1.9,'#d8d4b2',root,0,.018,0);
 const supports=[];for(const x of [-.72,.72]){const tab=box(.26,.45,.035,'#ede2c5',root,x,.18,-.93);tab.rotation.x=-.65;supports.push(tab);}
 return root;
}
function wrapText(ctx,text,maxWidth){let lines=[],line='';for(const char of text){if(ctx.measureText(line+char).width>maxWidth){lines.push(line);line=char;}else line+=char;}if(line)lines.push(line);return lines;}
function pageTexture(c,i){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1200;const ctx=canvas.getContext('2d');
 ctx.fillStyle=C.paper;ctx.fillRect(0,0,1024,1200);
 ctx.strokeStyle='#d2c8a7';ctx.lineWidth=2;ctx.strokeRect(55,55,914,1090);
 ctx.fillStyle='#858d70';ctx.font='18px Georgia';ctx.fillText('LITTLE LEAF • POP-UP CLASSICS',100,125);
 ctx.fillStyle='#a38251';ctx.font='italic 27px Georgia';ctx.fillText(`Chapter ${String(i+1).padStart(2,'0')}`,100,225);
 ctx.fillStyle=C.ink;ctx.font='bold 48px "Noto Serif CJK TC",serif';let y=310;
 for(const line of wrapText(ctx,c.title,824)){ctx.fillText(line,100,y);y+=72;}
 y+=38;ctx.font='28px "Noto Sans CJK TC",sans-serif';
 for(const p of c.text.split('\n\n')){for(const line of wrapText(ctx,p,805)){ctx.fillText(line,100,y);y+=54;}y+=24;}
 ctx.fillStyle='#a47a49';ctx.font='22px Georgia';ctx.fillText('❧',100,1085);ctx.font='20px Georgia';ctx.fillText(String(i*2+1).padStart(2,'0'),866,1085);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
export function createStoryWorld(canvas,chapters,{onActor,getSpeechState}={}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,80);
 scene.add(new THREE.HemisphereLight('#fff5df','#718264',1.6));
 const light=new THREE.DirectionalLight('#fff1cf',2);light.position.set(-4,9,5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-9,right:9,top:8,bottom:-8,near:.1,far:30});light.shadow.normalBias=.035;light.shadow.bias=-.0001;scene.add(light);
 const fill=new THREE.DirectionalLight('#c4d9e4',.7);fill.position.set(7,4,-4);scene.add(fill);
 const book=new THREE.Group();scene.add(book);
 box(11.45,.18,6.65,'#284b3b',book,0,-.25,0);box(.18,.2,6.65,'#183c2e',book,0,-.23,0);
 for(let i=0;i<5;i++){const width=5.44-i*.011;for(const side of [-1,1])box(width,.027,6.21-i*.008,i%2?'#d9d0b4':'#ede5cc',book,side*2.73,-.12+i*.029,0);}
 for(const side of [-1,1])box(5.43,.045,6.16,C.paper,book,side*2.73,.04,0);
 box(.032,.07,6.16,'#c8bc99',book,0,.032,0);
 const bookmark=box(.22,.012,1.25,'#b65e44',book,.28,-.21,3.47);bookmark.rotation.y=-.11;
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.24}));floor.rotation.x=-Math.PI/2;floor.position.y=-.36;floor.receiveShadow=true;scene.add(floor);
 const textures=chapters.map(pageTexture);
 const printed=new THREE.Mesh(new THREE.PlaneGeometry(5.36,6.09),new THREE.MeshBasicMaterial({map:textures[0],toneMapped:false}));printed.rotation.x=-Math.PI/2;printed.position.set(-2.73,.067,0);printed.receiveShadow=true;book.add(printed);
 const scenes=chapters.map((c,i)=>{
  if(c.characters)return buildFairytaleScene(book,c,{THREE,box,ball,cone,mesh,mat,leafTree,house});
  const root=new THREE.Group();root.position.set(2.72,.09,0);root.visible=false;book.add(root);
  const popup=new THREE.Group();root.add(popup);
  // Paper meadow, path, folds, and crossed tree panels remain true 3D geometry.
  const meadow=mesh(new THREE.CircleGeometry(2.48,48),'#bbc599',popup,0,.021,0);meadow.rotation.x=-Math.PI/2;meadow.scale.y=1.12;meadow.receiveShadow=true;meadow.castShadow=false;
  const path=box(.7,.012,3.6,'#ded1a5',popup,.05,.035,.2);path.rotation.y=-.18;
  const trees=[leafTree(popup,-1.88,-1.6,2.45,'#607e59'),leafTree(popup,1.9,-1.95,2.82,'#779168'),leafTree(popup,2.0,.53,1.5,'#91a474'),leafTree(popup,-2.15,.1,1.6,'#829963')];
  for(let j=0;j<11;j++){const angle=j*2.39996,r=1.65+(j%3)*.24;const flower=ball(.06,.035,.06,j%2?'#ebc578':'#d79580',popup,Math.cos(angle)*r,.055,Math.sin(angle)*r);flower.castShadow=false;}
  const cottage=c.house!=='none'?house(popup,c.house):null;
  const pigs=[];
  for(let j=0;j<c.actors;j++){
   const index=c.actors===1?(c.house==='brick'?2:c.house==='wood'?1:0):j;
   const name=['小豬大哥','小豬二哥','小豬弟弟'][index];
   const p=pig(popup,c.wolf?-.7+j*.83:-1.12+j*1.02,c.wolf?1.55:1.22,index,name);p.root.scale.setScalar(c.wolf?.73:.9);pigs.push(p);
  }
  const villain=c.wolf?wolf(popup):null;if(villain)villain.root.scale.setScalar(.85);
  const wind=new THREE.Group();wind.position.set(-1.55,.9,1.5);popup.add(wind);
  const windMaterial=new THREE.MeshStandardMaterial({color:'#f7f2d5',transparent:true,opacity:0,roughness:.7});
  for(let j=0;j<3;j++){const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,j*.12,0),new THREE.Vector3(.6,.13+j*.12,-.22),new THREE.Vector3(1.2,j*.12,-.1));wind.add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,.017,5,false),windMaterial));}
  return {root,popup,pigs,wolf:villain,house:cottage,trees,wind,windMaterial};
 });
 const pageGeometry=new THREE.PlaneGeometry(5.42,6.15,40,10);pageGeometry.rotateX(-Math.PI/2);pageGeometry.translate(2.71,.11,0);
 const pageBase=Float32Array.from(pageGeometry.attributes.position.array);
 const pageMaterial=new THREE.MeshStandardMaterial({color:C.paper,side:THREE.DoubleSide,roughness:1});
 const turningPage=new THREE.Mesh(pageGeometry,pageMaterial);turningPage.castShadow=true;turningPage.receiveShadow=true;turningPage.visible=false;book.add(turningPage);
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.43;controls.maxPolarAngle=1.18;controls.minAzimuthAngle=-.7;controls.maxAzimuthAngle=.7;controls.target.set(0,.3,0);controls.rotateSpeed=.55;
 let active=0,running=false,raf=0;
 function resetView(){const mobile=canvas.clientWidth<650;camera.position.set(-.1,mobile?12.4:7.4,mobile?15.5:9.8);controls.target.set(0,.65,0);controls.update();}
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();resetView();}
 const observer=new ResizeObserver(resize);observer.observe(canvas);
 function frame(){if(!running)return;controls.update();const speech=getSpeechState?.();for(const actor of [...scenes[active].pigs,scenes[active].wolf].filter(Boolean)){actor.mouth.scale.y=actor.baseMouth*(speech?.playing&&actor.name===speech.name?1+1.8*Math.abs(Math.sin(speech.time*19)):1);}renderer.render(scene,camera);raf=requestAnimationFrame(frame);}
 function start(){resize();if(!running){running=true;frame();}}
 function stop(){running=false;cancelAnimationFrame(raf);}
 function show(index){active=index;scenes.forEach((s,i)=>{s.root.visible=i===index;});printed.material.map=textures[index];printed.material.needsUpdate=true;}
 function fold(value){const positions=pageGeometry.attributes.position;for(let n=0;n<positions.count;n++){const x=pageBase[n*3],z=pageBase[n*3+2],u=x/5.42,angle=value*Math.PI;const curl=.33*Math.sin(value*Math.PI)*Math.sin(u*Math.PI);positions.setXYZ(n,x*Math.cos(angle)-curl*Math.sin(angle),.11+x*Math.sin(angle)+curl*Math.cos(angle),z);}positions.needsUpdate=true;pageGeometry.computeVertexNormals();}
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
 canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;down=null;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const targets=[...scenes[active].pigs.map(p=>p.root),scenes[active].wolf?.root].filter(Boolean);const hits=ray.intersectObjects(targets,true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.character)obj=obj.parent;if(obj)onActor?.(obj.userData.character);}});
 function inspect(){let meshes=0;scene.traverse(o=>{if(o.isMesh)meshes++;});return{webgl:renderer.getContext()!==null,meshes,bookDepth:.4,camera:camera.position.toArray(),active,running,turning:turningPage.visible,houseScale:scenes[active].house?.scale.y??null,houseTilt:scenes[active].house?.rotation.z??null,drawCalls:renderer.info.render.calls};}
 function cancelTurn(){turningPage.visible=false;scenes.forEach(s=>{s.root.scale.y=1;});}
 return {scenes,show,start,stop,resize,resetView,inspect,beginTurn(){turningPage.visible=true;},fold,endTurn:cancelTurn,cancelTurn,setSpeaker(name){const actor=[...scenes[active].pigs,scenes[active].wolf].filter(Boolean).find(a=>a.name===name);if(actor){const pos=new THREE.Vector3();actor.root.getWorldPosition(pos);pos.y+=1.65;pos.project(camera);return{x:(pos.x+1)/2,y:(1-pos.y)/2};}},dispose(){stop();observer.disconnect();controls.dispose();const disposed=new Set();scene.traverse(o=>{if(o.isMesh&&!disposed.has(o.geometry)){o.geometry.dispose();disposed.add(o.geometry);}if(o.isMesh&&!Array.from(materials.values()).includes(o.material))o.material.dispose();});textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();}};
}
