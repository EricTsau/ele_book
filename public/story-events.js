import {classicEvent} from './classic-motion.js';
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
 return legacyEvent(tl,s,c,M)||originalEvent(tl,s,c,M)||classicEvent(tl,s,c,M);
}
